import { NextResponse, type NextRequest } from 'next/server';
import { getClientIp } from '@/lib/server/clientIp';
import { consumeRateLimit } from '@/lib/server/rateLimit';

export const runtime = 'nodejs';

const MAX_REQUEST_BYTES = 32 * 1024;
const UPSTREAM_TIMEOUT_MS = 10_000;
type ContactTextField =
    | 'fullName'
    | 'company'
    | 'phone'
    | 'email'
    | 'location'
    | 'service'
    | 'wasteType'
    | 'volumeFrequency'
    | 'timeline'
    | 'message';

const MAX_FIELD_LENGTHS: Record<ContactTextField, number> = {
    fullName: 120,
    company: 160,
    phone: 40,
    email: 254,
    location: 240,
    service: 160,
    wasteType: 160,
    volumeFrequency: 160,
    timeline: 120,
    message: 2_000,
};

type ContactPayload = Record<ContactTextField, string> & {
    consent: boolean;
    website?: string;
};

function validatePayload(value: unknown): { data: ContactPayload | null; error: string | null } {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return { data: null, error: 'Dữ liệu liên hệ không hợp lệ.' };
    }

    const input = value as Record<string, unknown>;
    const data = {} as ContactPayload;

    for (const [field, maxLength] of Object.entries(MAX_FIELD_LENGTHS)) {
        const fieldValue = input[field];

        if (typeof fieldValue !== 'string' || fieldValue.length > maxLength) {
            return { data: null, error: 'Dữ liệu liên hệ không hợp lệ.' };
        }

        data[field as ContactTextField] = fieldValue.trim();
    }

    data.consent = input.consent === true;
    data.website = typeof input.website === 'string' && input.website.length <= 200 ? input.website.trim() : '';

    if (!data.fullName || !data.company || !data.phone || !data.location || !data.service || !data.consent) {
        return { data: null, error: 'Vui lòng điền đầy đủ thông tin bắt buộc.' };
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return { data: null, error: 'Email chưa đúng định dạng.' };
    }

    return { data, error: null };
}

export async function POST(request: NextRequest) {
    const contentLength = Number.parseInt(request.headers.get('content-length') || '0', 10);

    if (!Number.isFinite(contentLength) || contentLength <= 0 || contentLength > MAX_REQUEST_BYTES) {
        return NextResponse.json({ error: 'Yêu cầu liên hệ không hợp lệ.' }, { status: 413 });
    }

    const clientIp = getClientIp(request);

    try {
        const rateLimit = await consumeRateLimit('contact', clientIp, 5, 15 * 60 * 1000);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.' },
                { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
            );
        }
    } catch (error) {
        console.error('[contact] rate limiter unavailable', error instanceof Error ? error.message : 'Unknown rate limiter error');
        return NextResponse.json({ error: 'Dịch vụ liên hệ tạm thời không khả dụng.' }, { status: 503 });
    }

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Yêu cầu liên hệ không hợp lệ.' }, { status: 400 });
    }

    const validation = validatePayload(body);

    if (validation.error || !validation.data) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (validation.data.website) {
        return NextResponse.json({ success: true });
    }

    const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();

    if (!webhookUrl) {
        return NextResponse.json({ error: 'CONTACT_WEBHOOK_NOT_CONFIGURED' }, { status: 503 });
    }

    try {
        let url: URL;

        try {
            url = new URL(webhookUrl);
        } catch {
            console.error('[contact] webhook configuration invalid');
            return NextResponse.json({ error: 'Dịch vụ liên hệ chưa được cấu hình an toàn.' }, { status: 503 });
        }

        if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
            console.error('[contact] webhook configuration invalid');
            return NextResponse.json({ error: 'Dịch vụ liên hệ chưa được cấu hình an toàn.' }, { status: 503 });
        }

        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
            console.error('[contact] webhook configuration invalid');
            return NextResponse.json({ error: 'Dịch vụ liên hệ chưa được cấu hình an toàn.' }, { status: 503 });
        }

        const headers = new Headers({ 'Content-Type': 'application/json' });
        const webhookSecret = process.env.CONTACT_WEBHOOK_SECRET?.trim();

        if (webhookSecret) headers.set('Authorization', `Bearer ${webhookSecret}`);

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                ...validation.data,
                website: undefined,
                source: 'tanvinhdat-contact-form',
                submittedAt: new Date().toISOString(),
            }),
            signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        });

        if (!response.ok) {
            console.error('[contact] upstream failed', response.status);
            return NextResponse.json({ error: 'Chưa thể gửi yêu cầu tư vấn.' }, { status: 502 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[contact] upstream request failed', error instanceof Error ? error.message : 'Unknown upstream error');
        return NextResponse.json({ error: 'Chưa thể gửi yêu cầu tư vấn.' }, { status: 502 });
    }
}
