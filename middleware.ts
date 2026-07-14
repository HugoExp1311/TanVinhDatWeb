import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_LOGIN_PATH, ADMIN_PANEL_PATH } from '@/lib/adminAuth';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/server/adminSession';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const normalizedPathname = pathname.replace(/\/$/, '') || '/';
    const session = await verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

    if (normalizedPathname === ADMIN_LOGIN_PATH) {
        if (session) {
            return NextResponse.redirect(new URL(ADMIN_PANEL_PATH, request.url));
        }

        return NextResponse.next();
    }

    if (!session) {
        const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
        loginUrl.searchParams.set('next', normalizedPathname);

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};