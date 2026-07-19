import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_PANEL_PATH } from '@/lib/adminAuth';
import { getClientIp } from '@/lib/server/clientIp';
import { verifyAdminPassword } from '@/lib/server/adminPassword';
import { consumeRateLimit, resetRateLimit } from '@/lib/server/rateLimit';
import { ADMIN_SESSION_COOKIE, createAdminSessionToken, getAdminSessionMaxAgeSeconds, getConfiguredAdminRole } from '@/lib/server/adminSession';

export const runtime = 'nodejs';


export async function POST(request: NextRequest) {
    const clientIp = getClientIp(request);

    try {
        const rateLimit = await consumeRateLimit('admin-login', clientIp, 10, 5 * 60 * 1000);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Quá nhiều lần đăng nhập. Vui lòng thử lại sau.' },
                { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
            );
        }
    } catch (error) {
        console.error('[admin-login] rate limiter unavailable', error instanceof Error ? error.message : 'Unknown rate limiter error');
        return NextResponse.json({ error: 'Dịch vụ đăng nhập tạm thời không khả dụng.' }, { status: 503 });
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

        await resetRateLimit('admin-login', clientIp);

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