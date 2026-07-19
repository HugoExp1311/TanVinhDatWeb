import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, hasAdminRole, verifyAdminSessionToken } from '@/lib/server/adminSession';
import { acquireConcurrencySlot, consumeRateLimit } from '@/lib/server/rateLimit';

export const runtime = 'nodejs';

const VALID_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png']);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILE_COUNT = 10;
const MAX_REQUEST_SIZE = MAX_FILE_COUNT * MAX_FILE_SIZE + 1024 * 1024;
const N8N_TIMEOUT_MS = 60_000;
const MAX_CONCURRENT_OCR_REQUESTS = 2;

function getPrivateN8nWebhookUrl() {
    const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim();

    if (!webhookUrl) {
        throw new Error('N8N_WEBHOOK_URL_INVALID');
    }

    let parsed: URL;

    try {
        parsed = new URL(webhookUrl);
    } catch {
        throw new Error('N8N_WEBHOOK_URL_INVALID');
    }

    if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
        throw new Error('N8N_WEBHOOK_URL_INVALID');
    }

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        throw new Error('N8N_WEBHOOK_URL_INVALID');
    }

    return parsed;
}

function getFileName(file: File) {
    return file.name || 'uploaded-image';
}

function validateDriveUrl(value: FormDataEntryValue | null) {
    if (typeof value !== 'string' || value.trim() === '') return null;

    try {
        const parsed = new URL(value.trim());

        if (parsed.protocol !== 'https:' || parsed.hostname !== 'drive.google.com') {
            return 'URL Google Drive không hợp lệ.';
        }
    } catch {
        return 'URL Google Drive không hợp lệ.';
    }

    return null;
}

async function hasValidImageSignature(file: File) {
    const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
    const isJpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isPng = bytes.length >= 8
        && bytes[0] === 0x89
        && bytes[1] === 0x50
        && bytes[2] === 0x4e
        && bytes[3] === 0x47
        && bytes[4] === 0x0d
        && bytes[5] === 0x0a
        && bytes[6] === 0x1a
        && bytes[7] === 0x0a;

    return isJpeg || isPng;
}

async function validateFormData(formData: FormData) {
    const files = formData.getAll('file').filter((entry): entry is File => entry instanceof File && entry.size > 0);
    const driveUrl = formData.get('driveUrl');
    const hasFiles = files.length > 0;
    const hasDriveUrl = typeof driveUrl === 'string' && driveUrl.trim() !== '';
    const outputType = formData.get('outputType');

    if (outputType !== 'google_sheet' && outputType !== 'excel') {
        return 'Đầu ra không hợp lệ.';
    }

    if (!hasFiles && !hasDriveUrl) {
        return 'Vui lòng upload ảnh hoặc nhập link Google Drive.';
    }

    if (hasFiles && hasDriveUrl) {
        return 'Vui lòng chỉ chọn một trong hai: upload ảnh hoặc nhập link Google Drive.';
    }

    if (files.length > MAX_FILE_COUNT) {
        return `Chỉ được upload tối đa ${MAX_FILE_COUNT} ảnh mỗi lần.`;
    }

    for (const file of files) {
        if (!VALID_IMAGE_TYPES.has(file.type)) {
            return `File không hợp lệ: ${getFileName(file)}. Chỉ chấp nhận JPG, JPEG hoặc PNG.`;
        }

        if (file.size > MAX_FILE_SIZE) {
            return `File quá lớn: ${getFileName(file)}. Vui lòng chọn file nhỏ hơn 10MB.`;
        }

        if (!await hasValidImageSignature(file)) {
            return `Nội dung file không hợp lệ: ${getFileName(file)}.`;
        }
    }

    return validateDriveUrl(driveUrl);
}

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const session = await verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasAdminRole(session, ['owner', 'admin', 'operator'])) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const contentLength = Number.parseInt(request.headers.get('content-length') || '0', 10);

    if (!Number.isFinite(contentLength) || contentLength <= 0 || contentLength > MAX_REQUEST_SIZE) {
        return NextResponse.json({ error: 'Kích thước yêu cầu upload không hợp lệ.' }, { status: 413 });
    }

    try {
        const rateLimit = await consumeRateLimit('admin-ocr', `${session.sub}:${session.role}`, 20, 15 * 60 * 1000);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Quá nhiều yêu cầu OCR. Vui lòng thử lại sau.' },
                { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
            );
        }

        const formData = await request.formData();
        const validationError = await validateFormData(formData);

        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
        }

        let releaseSlot: (() => Promise<void>) | null = null;

        try {
            releaseSlot = await acquireConcurrencySlot('admin-ocr', MAX_CONCURRENT_OCR_REQUESTS, N8N_TIMEOUT_MS + 5_000);

            const headers = new Headers();
            const webhookSecret = process.env.N8N_WEBHOOK_SECRET?.trim();

            if (webhookSecret) {
                headers.set('Authorization', `Bearer ${webhookSecret}`);
            }

            const upstreamResponse = await fetch(getPrivateN8nWebhookUrl(), {
                method: 'POST',
                headers,
                body: formData,
                signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
            });

            if (!upstreamResponse.ok) {
                console.error('[admin-weight-tickets] n8n upstream failed', upstreamResponse.status);
                return NextResponse.json({ error: 'Dịch vụ OCR phía sau không xử lý được yêu cầu.' }, { status: 502 });
            }

            const responseBody = await upstreamResponse.arrayBuffer();
            const outputType = formData.get('outputType');
            const responseHeaders = new Headers();

            if (outputType === 'excel') {
                responseHeaders.set('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                responseHeaders.set('content-disposition', 'attachment; filename="weight-tickets.xlsx"');
            } else {
                const upstreamContentType = upstreamResponse.headers.get('content-type') || '';
                responseHeaders.set('content-type', upstreamContentType.includes('application/json')
                    ? 'application/json; charset=utf-8'
                    : 'text/plain; charset=utf-8');
            }

            return new Response(responseBody, {
                status: upstreamResponse.status,
                headers: responseHeaders,
            });
        } finally {
            if (releaseSlot) {
                try {
                    await releaseSlot();
                } catch {
                    console.error('[admin-weight-tickets] concurrency lease release failed');
                }
            }
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'UNKNOWN';

        if (message === 'CONCURRENCY_LIMIT_REACHED') {
            return NextResponse.json({ error: 'Hệ thống OCR đang bận. Vui lòng thử lại sau.' }, { status: 503 });
        }

        if (message === 'N8N_WEBHOOK_URL_INVALID') {
            console.error('[admin-weight-tickets] n8n webhook configuration invalid');
            return NextResponse.json({ error: 'Dịch vụ OCR chưa được cấu hình an toàn.' }, { status: 503 });
        }

        console.error('[admin-weight-tickets] request failed');
        return NextResponse.json({ error: 'Không thể xử lý phiếu cân.' }, { status: 500 });
    }
}
