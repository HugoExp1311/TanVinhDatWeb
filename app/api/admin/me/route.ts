import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/server/adminSession';

export const runtime = 'nodejs';

function getGoogleSheetUrl() {
    const configuredUrl = process.env.GOOGLE_SHEET_URL?.trim();

    if (!configuredUrl) return null;

    try {
        const url = new URL(configuredUrl);

        if (url.protocol !== 'https:' || url.hostname !== 'docs.google.com' || !url.pathname.startsWith('/spreadsheets/')) {
            console.error('[admin-me] GOOGLE_SHEET_URL must be an HTTPS Google Sheets URL.');
            return null;
        }

        return url.toString();
    } catch {
        console.error('[admin-me] GOOGLE_SHEET_URL is not a valid URL.');
        return null;
    }
}

export async function GET() {
    const cookieStore = await cookies();
    const session = await verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
        authenticated: true,
        role: session.role,
        expiresAt: session.exp,
        googleSheetUrl: getGoogleSheetUrl(),
    });
}