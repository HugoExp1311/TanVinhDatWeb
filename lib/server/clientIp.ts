import type { NextRequest } from 'next/server';

function normalizeIp(value: string | null) {
    const candidate = value?.trim();

    if (!candidate || candidate.length > 64 || !/^[0-9a-fA-F:.]+$/.test(candidate)) {
        return null;
    }

    return candidate.toLowerCase();
}

export function getClientIp(request: NextRequest) {
    if (process.env.TRUST_PROXY !== 'true') {
        return 'untrusted-client';
    }

    const trustedHeader = process.env.TRUSTED_PROXY_HEADER?.trim().toLowerCase();

    if (trustedHeader === 'cf-connecting-ip') {
        return normalizeIp(request.headers.get('cf-connecting-ip')) || 'untrusted-client';
    }

    if (trustedHeader === 'x-real-ip') {
        return normalizeIp(request.headers.get('x-real-ip')) || 'untrusted-client';
    }

    if (trustedHeader === 'x-forwarded-for') {
        const forwardedFor = request.headers.get('x-forwarded-for');
        return normalizeIp(forwardedFor?.split(',')[0] ?? null) || 'untrusted-client';
    }

    return 'untrusted-client';
}
