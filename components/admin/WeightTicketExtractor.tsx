'use client';

import { FormEvent, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_LOGIN_PATH, ADMIN_SESSION_KEY, getGoogleSheetUrl, getN8nWebhookUrl } from '@/lib/adminAuth';

type OutputType = 'google_sheet' | 'excel';

type ProcessedFileResult = {
    fileName: string;
    result: unknown;
};

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function WeightTicketExtractor() {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const driveUrlInputRef = useRef<HTMLInputElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    const webhookUrl = useMemo(() => getN8nWebhookUrl(), []);
    const googleSheetUrl = useMemo(() => getGoogleSheetUrl(), []);
    const [outputType, setOutputType] = useState<OutputType>('google_sheet');
    const [driveUrl, setDriveUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('Đang xử lý ảnh...');
    const [result, setResult] = useState<unknown>(null);
    const [isError, setIsError] = useState(false);

    function showResult(data: unknown, error = false) {
        setResult(data);
        setIsError(error);

        window.setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);
    }

    function validateForm() {
        const files = fileInputRef.current?.files;
        const selectedFiles = files ? Array.from(files) : [];
        const hasFile = selectedFiles.length > 0;
        const hasDriveUrl = driveUrl.trim() !== '';

        if (!hasFile && !hasDriveUrl) {
            window.alert('Vui lòng upload ảnh hoặc nhập link Google Drive.');
            return false;
        }

        if (hasFile && hasDriveUrl) {
            window.alert('Vui lòng chỉ chọn một trong hai: upload ảnh HOẶC nhập link Google Drive.');
            return false;
        }

        for (const file of selectedFiles) {
            if (!VALID_IMAGE_TYPES.includes(file.type)) {
                window.alert(`File không hợp lệ: ${file.name}. Vui lòng chọn JPG, JPEG hoặc PNG.`);
                return false;
            }

            if (file.size > MAX_FILE_SIZE) {
                window.alert(`File quá lớn: ${file.name}. Vui lòng chọn file nhỏ hơn 10MB.`);
                return false;
            }
        }

        if (hasDriveUrl && !driveUrl.trim().includes('drive.google.com')) {
            window.alert('URL không hợp lệ. Vui lòng nhập link Google Drive.');
            return false;
        }

        return true;
    }

    async function sendFormData(formData: FormData, selectedOutputType: OutputType) {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type') || '';

        if (selectedOutputType === 'excel') {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');

            downloadLink.href = url;
            downloadLink.download = `phieu-can-${Date.now()}.xlsx`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            window.URL.revokeObjectURL(url);

            return {
                success: true,
                message: 'Đã tải file Excel thành công.',
                timestamp: new Date().toLocaleString('vi-VN'),
            };
        }

        if (contentType.includes('application/json')) {
            return response.json();
        }

        const text = await response.text();
        return { message: text };
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validateForm()) return;

        setResult(null);
        setIsError(false);
        setLoading(true);

        try {
            const selectedFiles = fileInputRef.current?.files ? Array.from(fileInputRef.current.files) : [];
            const results: ProcessedFileResult[] = [];

            if (selectedFiles.length > 0) {
                for (let index = 0; index < selectedFiles.length; index += 1) {
                    const file = selectedFiles[index];
                    setLoadingText(`Đang xử lý ảnh ${index + 1}/${selectedFiles.length}: ${file.name}`);

                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('source_type', 'upload');
                    formData.append('source_name', file.name);
                    formData.append('outputType', outputType);

                    const responseData = await sendFormData(formData, outputType);
                    results.push({ fileName: file.name, result: responseData });
                }

                showResult({
                    success: true,
                    message: `Đã xử lý ${results.length} ảnh.`,
                    results,
                });
            } else {
                setLoadingText('Đang xử lý ảnh từ Google Drive...');

                const formData = new FormData();
                formData.append('driveUrl', driveUrl.trim());
                formData.append('source_type', 'google_drive');
                formData.append('outputType', outputType);

                const responseData = await sendFormData(formData, outputType);
                showResult(responseData);
            }

            formRef.current?.reset();
            setDriveUrl('');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error:', error);
            showResult(
                {
                    error: true,
                    message: 'Có lỗi xảy ra khi xử lý yêu cầu.',
                    details: message,
                    hint: 'Vui lòng kiểm tra:\n- URL webhook n8n có đúng không?\n- n8n workflow có đang chạy không?\n- Kết nối internet có ổn định không?',
                },
                true,
            );
        } finally {
            setLoadingText('Đang xử lý ảnh...');
            setLoading(false);
        }
    }

    function handleLogout() {
        window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
        router.replace(ADMIN_LOGIN_PATH);
    }

    return (
        <section className="section bg-slate-50 min-h-[80vh]">
            <div className="container-x">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="eyebrow">Admin Tool</p>
                        <h1 className="section-title">Trích xuất phiếu cân xe</h1>
                        <p className="mt-4 max-w-2xl text-slate-600">
                            Upload ảnh phiếu cân hoặc nhập Google Drive URL để gửi sang n8n OCR và ghi dữ liệu vào Google Sheets hoặc tải Excel.
                        </p>
                    </div>
                    <button type="button" onClick={handleLogout} className="btn-outline w-fit bg-white">
                        Đăng xuất
                    </button>
                </div>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <form ref={formRef} onSubmit={handleSubmit} className="card p-6 md:p-8">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="file" className="block text-sm font-bold text-brand-primary-900">
                                    📁 Upload ảnh từ máy
                                </label>
                                <p className="mt-1 text-sm text-slate-500">Chấp nhận nhiều ảnh: JPG, PNG, JPEG. Mỗi file tối đa 10MB.</p>
                                <input
                                    ref={fileInputRef}
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(event) => {
                                        if (event.currentTarget.files && event.currentTarget.files.length > 0) {
                                            setDriveUrl('');
                                        }
                                    }}
                                    className="mt-3 w-full cursor-pointer rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-brand-primary-700 focus:outline-none focus:ring-4 focus:ring-brand-primary-100"
                                />
                            </div>

                            <div className="flex items-center gap-4 text-sm font-semibold text-slate-400">
                                <div className="h-px flex-1 bg-slate-200" />
                                hoặc
                                <div className="h-px flex-1 bg-slate-200" />
                            </div>

                            <div>
                                <label htmlFor="driveUrl" className="block text-sm font-bold text-brand-primary-900">
                                    🔗 Nhập Google Drive URL public
                                </label>
                                <p className="mt-1 text-sm text-slate-500">Ví dụ: https://drive.google.com/file/d/...</p>
                                <input
                                    ref={driveUrlInputRef}
                                    id="driveUrl"
                                    name="driveUrl"
                                    type="url"
                                    value={driveUrl}
                                    onChange={(event) => {
                                        setDriveUrl(event.target.value);
                                        if (event.target.value.trim() && fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                    placeholder="https://drive.google.com/file/d/..."
                                    className="mt-3 w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-primary-700 focus:ring-4 focus:ring-brand-primary-100"
                                />
                            </div>

                            <div>
                                <label htmlFor="outputType" className="block text-sm font-bold text-brand-primary-900">
                                    📊 Đầu ra
                                </label>
                                <select
                                    id="outputType"
                                    name="outputType"
                                    value={outputType}
                                    onChange={(event) => setOutputType(event.target.value as OutputType)}
                                    className="mt-3 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-primary-700 focus:ring-4 focus:ring-brand-primary-100"
                                >
                                    <option value="google_sheet">Ghi vào Google Sheets</option>
                                    <option value="excel">Tải file Excel .xlsx</option>
                                </select>
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary w-full rounded-2xl disabled:cursor-not-allowed disabled:opacity-60">
                                {loading ? 'Đang xử lý...' : 'Trích xuất dữ liệu'}
                            </button>
                        </div>
                    </form>

                    <aside className="card p-6 h-fit">
                        <h2 className="text-xl font-bold text-brand-primary-900">Cấu hình hiện tại</h2>
                        <dl className="mt-5 space-y-4 text-sm">
                            <div>
                                <dt className="font-bold text-slate-700">Webhook n8n (Docker)</dt>
                                <dd className="mt-1 break-all rounded-xl bg-slate-50 p-3 font-mono text-xs text-slate-600">{webhookUrl}</dd>
                            </div>
                            <div>
                                <dt className="font-bold text-slate-700">Google Sheet URL</dt>
                                <dd className="mt-1 break-all rounded-xl bg-slate-50 p-3 font-mono text-xs text-slate-600">
                                    {googleSheetUrl ? (
                                        <a href={googleSheetUrl} target="_blank" rel="noopener noreferrer" className="text-brand-secondary-700 hover:text-brand-primary-900 hover:underline">
                                            {googleSheetUrl}
                                        </a>
                                    ) : (
                                        'Chưa cấu hình NEXT_PUBLIC_GOOGLE_SHEET_URL trong .env.local'
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </aside>
                </div>

                {loading && (
                    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-slate-950/75 px-4 text-center backdrop-blur-sm">
                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/25 border-t-white" />
                        <p className="text-lg font-bold text-white">{loadingText}</p>
                    </div>
                )}

                {result !== null && (
                    <div ref={resultRef} className="mt-10 card overflow-hidden">
                        <div className="border-b border-slate-100 px-6 py-4">
                            <h2 className="text-xl font-bold text-brand-primary-900">Kết quả</h2>
                        </div>
                        <pre
                            className={`max-h-[520px] overflow-auto whitespace-pre-wrap break-words p-6 text-sm leading-6 ${isError ? 'bg-red-50 text-red-700' : 'bg-slate-950 text-slate-100'
                                }`}
                        >
                            {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </section>
    );
}