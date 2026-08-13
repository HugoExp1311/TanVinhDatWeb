import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/server/adminSession';

export const runtime = 'nodejs';

export async function GET() {
    const cookieStore = await cookies();
    const session = await verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, role: session.role, expiresAt: session.exp });
}