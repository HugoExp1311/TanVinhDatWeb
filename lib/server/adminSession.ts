import type { AdminRole } from '@/lib/adminAuth';

export const ADMIN_SESSION_COOKIE = 'tvd_admin_session';

export type AdminSession = {
    version: 1;
    sub: 'admin';
    role: AdminRole;
    iat: number;
    exp: number;
};

const DEFAULT_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
const MIN_SESSION_SECRET_LENGTH = 32;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function getSessionSecret() {
    const secret = process.env.ADMIN_SESSION_SECRET?.trim();

    if (!secret || secret.length < MIN_SESSION_SECRET_LENGTH) {
        throw new Error(`ADMIN_SESSION_SECRET must be at least ${MIN_SESSION_SECRET_LENGTH} characters.`);
    }

    return secret;
}

export function getAdminSessionMaxAgeSeconds() {
    const rawValue = process.env.ADMIN_SESSION_MAX_AGE_SECONDS?.trim();
    const parsed = rawValue ? Number.parseInt(rawValue, 10) : DEFAULT_SESSION_MAX_AGE_SECONDS;

    if (!Number.isFinite(parsed) || parsed <= 0) {
        return DEFAULT_SESSION_MAX_AGE_SECONDS;
    }

    return parsed;
}

export function getConfiguredAdminRole(): AdminRole {
    const role = process.env.ADMIN_ROLE?.trim();

    if (role === 'owner' || role === 'admin' || role === 'operator') {
        return role;
    }

    return 'owner';
}

function bytesToBase64Url(bytes: Uint8Array) {
    let binary = '';

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(input: string) {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
}

function safeEqual(left: string, right: string) {
    if (left.length !== right.length) return false;

    let result = 0;

    for (let index = 0; index < left.length; index += 1) {
        result |= left.charCodeAt(index) ^ right.charCodeAt(index);
    }

    return result === 0;
}

async function signPayload(payload: string, secret: string) {
    const key = await crypto.subtle.importKey('raw', textEncoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(payload));

    return bytesToBase64Url(new Uint8Array(signature));
}

export async function createAdminSessionToken(role: AdminRole = getConfiguredAdminRole()) {
    const now = Math.floor(Date.now() / 1000);
    const maxAge = getAdminSessionMaxAgeSeconds();
    const payload: AdminSession = {
        version: 1,
        sub: 'admin',
        role,
        iat: now,
        exp: now + maxAge,
    };
    const encodedPayload = bytesToBase64Url(textEncoder.encode(JSON.stringify(payload)));
    const signature = await signPayload(encodedPayload, getSessionSecret());

    return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSessionToken(token?: string | null): Promise<AdminSession | null> {
    if (!token) return null;

    const [encodedPayload, providedSignature] = token.split('.');

    if (!encodedPayload || !providedSignature) return null;

    try {
        const expectedSignature = await signPayload(encodedPayload, getSessionSecret());

        if (!safeEqual(providedSignature, expectedSignature)) {
            return null;
        }

        const payload = JSON.parse(textDecoder.decode(base64UrlToBytes(encodedPayload))) as Partial<AdminSession>;
        const now = Math.floor(Date.now() / 1000);

        if (payload.version !== 1 || payload.sub !== 'admin' || typeof payload.exp !== 'number' || payload.exp <= now) {
            return null;
        }

        if (payload.role !== 'owner' && payload.role !== 'admin' && payload.role !== 'operator') {
            return null;
        }

        return payload as AdminSession;
    } catch {
        return null;
    }
}

export function hasAdminRole(session: AdminSession | null, allowedRoles: AdminRole[]) {
    return Boolean(session && allowedRoles.includes(session.role));
}