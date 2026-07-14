import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, hasAdminRole, verifyAdminSessionToken } from '@/lib/server/adminSession';

export const runtime = 'nodejs';

const VALID_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png']);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILE_COUNT = 10;

function getPrivateN8nWebhookUrl() {
    const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim();

    if (!webhookUrl) {
        throw new Error('N8N_WEBHOOK_URL is not configured.');
    }

    return webhookUrl;
}

function getFileName(file: File) {
    return file.name || 'uploaded-image';
}

function validateDriveUrl(value: FormDataEntryValue | null) {
    if (typeof value !== 'string' || value.trim() === '') return null;

    try {
        const parsed = new URL(value.trim());

        if (parsed.hostname !== 'drive.google.com' && !parsed.hostname.endsWith('.drive.google.com')) {
            return 'URL Google Drive không hợp lệ.';
        }
    } catch {
        return 'URL Google Drive không hợp lệ.';
    }

    return null;
}

function validateFormData(formData: FormData) {
    const files = formData.getAll('file').filter((entry): entry is File => entry instanceof File && entry.size > 0);
    const driveUrl = formData.get('driveUrl');
    const hasFiles = files.length > 0;
    const hasDriveUrl = typeof driveUrl === 'string' && driveUrl.trim() !== '';
    const outputType = formData.get('outputType');

    if (outputType !== 'google_sheet' && outputType !== 'excel') {
        return { error: 'Đầu ra không hợp lệ.' };
    }

    if (!hasFiles && !hasDriveUrl) {
        return { error: 'Vui lòng upload ảnh hoặc nhập link Google Drive.' };
    }

    if (hasFiles && hasDriveUrl) {
        return { error: 'Vui lòng chỉ chọn một trong hai: upload ảnh hoặc nhập link Google Drive.' };
    }

    if (files.length > MAX_FILE_COUNT) {
        return { error: `Chỉ được upload tối đa ${MAX_FILE_COUNT} ảnh mỗi lần.` };
    }

    for (const file of files) {
        if (!VALID_IMAGE_TYPES.has(file.type)) {
            return { error: `File không hợp lệ: ${getFileName(file)}. Chỉ chấp nhận JPG, JPEG hoặc PNG.` };
        }

        if (file.size > MAX_FILE_SIZE) {
            return { error: `File quá lớn: ${getFileName(file)}. Vui lòng chọn file nhỏ hơn 10MB.` };
        }
    }

    const driveUrlError = validateDriveUrl(driveUrl);

    if (driveUrlError) {
        return { error: driveUrlError };
    }

    return { error: null };
}

export async function POST(request: NextRequest) {
    const session = await verifyAdminSessionToken(cookies().get(ADMIN_SESSION_COOKIE)?.value);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasAdminRole(session, ['owner', 'admin', 'operator'])) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const formData = await request.formData();
        const validation = validateFormData(formData);

        if (validation.error) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const headers = new Headers();
        const webhookSecret = process.env.N8N_WEBHOOK_SECRET?.trim();

        if (webhookSecret) {
            headers.set('Authorization', `Bearer ${webhookSecret}`);
        }

        const upstreamResponse = await fetch(getPrivateN8nWebhookUrl(), {
            method: 'POST',
            headers,
            body: formData,
        });

        const responseHeaders = new Headers();
        const contentType = upstreamResponse.headers.get('content-type');
        const contentDisposition = upstreamResponse.headers.get('content-disposition');

        if (contentType) responseHeaders.set('content-type', contentType);
        if (contentDisposition) responseHeaders.set('content-disposition', contentDisposition);

        if (!upstreamResponse.ok) {
            const errorText = await upstreamResponse.text();
            console.error('[admin-weight-tickets] n8n upstream failed', upstreamResponse.status, errorText);

            return NextResponse.json(
                {
                    error: 'n8n webhook request failed.',
                    status: upstreamResponse.status,
                },
                { status: upstreamResponse.status >= 400 && upstreamResponse.status < 600 ? upstreamResponse.status : 502 },
            );
        }

        return new Response(await upstreamResponse.arrayBuffer(), {
            status: upstreamResponse.status,
            headers: responseHeaders,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[admin-weight-tickets]', message);

        return NextResponse.json({ error: 'Không thể xử lý phiếu cân.', details: message }, { status: 500 });
    }
}