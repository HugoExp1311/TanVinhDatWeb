import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_PANEL_PATH } from '@/lib/adminAuth';
import { verifyAdminPassword } from '@/lib/server/adminPassword';
import { ADMIN_SESSION_COOKIE, createAdminSessionToken, getAdminSessionMaxAgeSeconds, getConfiguredAdminRole } from '@/lib/server/adminSession';

export const runtime = 'nodejs';

type LoginRateLimitEntry = {
    count: number;
    resetAt: number;
};

const LOGIN_WINDOW_MS = 5 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 10;
const loginAttempts = new Map<string, LoginRateLimitEntry>();

function getClientIp(request: NextRequest) {
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(key: string) {
    const now = Date.now();
    const existing = loginAttempts.get(key);

    if (!existing || existing.resetAt <= now) {
        loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
        return false;
    }

    existing.count += 1;

    return existing.count > MAX_LOGIN_ATTEMPTS;
}

export async function POST(request: NextRequest) {
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
        return NextResponse.json({ error: 'Quá nhiều lần đăng nhập. Vui lòng thử lại sau.' }, { status: 429 });
    }

    let password = '';

    try {
        const body = (await request.json()) as { password?: unknown };
        password = typeof body.password === 'string' ? body.password : '';
    } catch {
        return NextResponse.json({ error: 'Yêu cầu đăng nhập không hợp lệ.' }, { status: 400 });
    }

    try {
        const isValidPassword = await verifyAdminPassword(password);

        if (!isValidPassword) {
            return NextResponse.json({ error: 'Thông tin đăng nhập không hợp lệ.' }, { status: 401 });
        }

        loginAttempts.delete(clientIp);

        const role = getConfiguredAdminRole();
        const token = await createAdminSessionToken(role);
        const response = NextResponse.json({ success: true, role, redirectTo: ADMIN_PANEL_PATH });

        response.cookies.set(ADMIN_SESSION_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: getAdminSessionMaxAgeSeconds(),
        });

        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown auth configuration error';
        console.error('[admin-login]', message);

        return NextResponse.json({ error: 'Cấu hình đăng nhập admin chưa hợp lệ.' }, { status: 500 });
    }
}