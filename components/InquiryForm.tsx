'use client';

import { FormEvent, useMemo, useState } from 'react';
import { site } from '@/lib/site';

type InquiryFormValues = {
    fullName: string;
    company: string;
    phone: string;
    email: string;
    location: string;
    service: string;
    wasteType: string;
    volumeFrequency: string;
    timeline: string;
    message: string;
    consent: boolean;
    website: string;
};

type InquiryFormErrors = Partial<Record<keyof InquiryFormValues, string>>;

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const initialValues: InquiryFormValues = {
    fullName: '',
    company: '',
    phone: '',
    email: '',
    location: '',
    service: '',
    wasteType: '',
    volumeFrequency: '',
    timeline: '',
    message: '',
    consent: false,
    website: '',
};

const timelineOptions = [
    'Cần tư vấn trong hôm nay',
    'Trong 1-3 ngày tới',
    'Trong tuần này',
    'Trong tháng này',
    'Chưa xác định',
];

const wasteTypeOptions = [
    'Chất thải rắn công nghiệp thông thường',
    'Chất thải nguy hại (CTNH)',
    'Nước thải công nghiệp',
    'Chất thải xây dựng',
    'Chất thải y tế không lây nhiễm',
    'Cần tư vấn phân loại',
];


function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildMailBody(values: InquiryFormValues) {
    return [
        'Xin chào Tân Vĩnh Đạt,',
        '',
        'Tôi muốn gửi yêu cầu tư vấn/báo giá dịch vụ với thông tin sau:',
        '',
        `Họ và tên: ${values.fullName}`,
        `Công ty: ${values.company}`,
        `Số điện thoại: ${values.phone}`,
        `Email: ${values.email || 'Chưa cung cấp'}`,
        `Địa điểm phát sinh chất thải: ${values.location}`,
        `Dịch vụ quan tâm: ${values.service}`,
        `Loại chất thải: ${values.wasteType || 'Cần tư vấn thêm'}`,
        `Khối lượng/Tần suất dự kiến: ${values.volumeFrequency || 'Chưa xác định'}`,
        `Thời gian cần hỗ trợ: ${values.timeline || 'Chưa xác định'}`,
        '',
        'Nội dung yêu cầu:',
        values.message || 'Chưa có nội dung bổ sung.',
        '',
        'Vui lòng liên hệ lại để tư vấn chi tiết.',
    ].join('\n');
}

export function InquiryForm() {
    const [values, setValues] = useState<InquiryFormValues>(initialValues);
    const [errors, setErrors] = useState<InquiryFormErrors>({});
    const [status, setStatus] = useState<SubmitStatus>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const serviceOptions = useMemo(
        () => [...site.services.map((service) => service.title), 'Tư vấn hồ sơ môi trường', 'Ứng cứu sự cố môi trường'],
        [],
    );

    function updateField<K extends keyof InquiryFormValues>(field: K, value: InquiryFormValues[K]) {
        setValues((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
        if (status !== 'idle') {
            setStatus('idle');
            setStatusMessage('');
        }
    }

    function validateForm() {
        const nextErrors: InquiryFormErrors = {};

        if (!values.fullName.trim()) nextErrors.fullName = 'Vui lòng nhập họ và tên.';
        if (!values.company.trim()) nextErrors.company = 'Vui lòng nhập tên công ty.';
        if (!values.phone.trim()) nextErrors.phone = 'Vui lòng nhập số điện thoại.';
        if (!values.location.trim()) nextErrors.location = 'Vui lòng nhập địa điểm phát sinh chất thải.';
        if (!values.service) nextErrors.service = 'Vui lòng chọn dịch vụ quan tâm.';
        if (values.email.trim() && !validateEmail(values.email.trim())) {
            nextErrors.email = 'Email chưa đúng định dạng.';
        }
        if (!values.consent) {
            nextErrors.consent = 'Vui lòng xác nhận đồng ý để chúng tôi liên hệ tư vấn.';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validateForm()) {
            setStatus('error');
            setStatusMessage('Vui lòng kiểm tra lại các trường bắt buộc trước khi gửi.');
            return;
        }


        const payload = { ...values };

        setStatus('submitting');
        setStatusMessage('Đang gửi yêu cầu tư vấn...');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const responseData = (await response.json().catch(() => null)) as { error?: string } | null;

            if (response.status === 503 && responseData?.error === 'CONTACT_WEBHOOK_NOT_CONFIGURED') {
                const subject = encodeURIComponent(`Yêu cầu tư vấn dịch vụ từ ${values.company}`);
                const body = encodeURIComponent(buildMailBody(values));
                window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
                setStatus('success');
                setStatusMessage('Ứng dụng email đã được mở với nội dung yêu cầu. Vui lòng kiểm tra và bấm gửi email.');
                return;
            }

            if (!response.ok) {
                throw new Error(responseData?.error || `HTTP error! status: ${response.status}`);
            }

            setStatus('success');
            setStatusMessage('Yêu cầu đã được gửi thành công. Tân Vĩnh Đạt sẽ phản hồi trong 24 giờ làm việc.');
            setValues(initialValues);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setStatusMessage('Chưa thể gửi form tự động. Vui lòng gọi hotline hoặc thử lại sau.');
        }

    }

    const inputClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-secondary-500 focus:ring-4 focus:ring-brand-secondary-100';
    const labelClass = 'text-sm font-semibold text-brand-primary-900';
    const errorClass = 'mt-1 text-xs font-medium text-red-600';

    return (
        <div className="card overflow-hidden" id="request-quote">
            <div className="bg-gradient-to-r from-brand-primary-900 via-brand-primary-800 to-brand-secondary-700 p-6 text-white">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary-100">
                    <span className="h-2 w-2 rounded-full bg-brand-accent" />
                    Tư vấn & báo giá
                </div>
                <h2 className="mt-4 text-2xl font-bold md:text-3xl">Gửi yêu cầu tư vấn dịch vụ</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
                    Cung cấp thông tin sơ bộ về loại chất thải, địa điểm và tần suất để đội ngũ kỹ thuật đề xuất phương án phù hợp.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6 md:p-8" noValidate>
                <div className="grid gap-5 md:grid-cols-2">
                    <label className={labelClass}>
                        Họ và tên <span className="text-red-500">*</span>
                        <input
                            className={inputClass}
                            value={values.fullName}
                            onChange={(event) => updateField('fullName', event.target.value)}
                            placeholder="Nguyễn Văn A"
                            autoComplete="name"
                            aria-invalid={Boolean(errors.fullName)}
                        />
                        {errors.fullName && <span className={errorClass}>{errors.fullName}</span>}
                    </label>

                    <label className={labelClass}>
                        Công ty <span className="text-red-500">*</span>
                        <input
                            className={inputClass}
                            value={values.company}
                            onChange={(event) => updateField('company', event.target.value)}
                            placeholder="Công ty/nhà máy của bạn"
                            autoComplete="organization"
                            aria-invalid={Boolean(errors.company)}
                        />
                        {errors.company && <span className={errorClass}>{errors.company}</span>}
                    </label>

                    <label className={labelClass}>
                        Số điện thoại <span className="text-red-500">*</span>
                        <input
                            className={inputClass}
                            value={values.phone}
                            onChange={(event) => updateField('phone', event.target.value)}
                            placeholder="0898 522 939"
                            autoComplete="tel"
                            inputMode="tel"
                            aria-invalid={Boolean(errors.phone)}
                        />
                        {errors.phone && <span className={errorClass}>{errors.phone}</span>}
                    </label>

                    <label className={labelClass}>
                        Email
                        <input
                            className={inputClass}
                            type="email"
                            value={values.email}
                            onChange={(event) => updateField('email', event.target.value)}
                            placeholder="email@congty.com"
                            autoComplete="email"
                            aria-invalid={Boolean(errors.email)}
                        />
                        {errors.email && <span className={errorClass}>{errors.email}</span>}
                    </label>
                </div>

                <label className={labelClass}>
                    Địa điểm phát sinh chất thải <span className="text-red-500">*</span>
                    <input
                        className={inputClass}
                        value={values.location}
                        onChange={(event) => updateField('location', event.target.value)}
                        placeholder="KCN, quận/huyện, tỉnh/thành"
                        autoComplete="street-address"
                        aria-invalid={Boolean(errors.location)}
                    />
                    {errors.location && <span className={errorClass}>{errors.location}</span>}
                </label>

                <div className="grid gap-5 md:grid-cols-2">
                    <label className={labelClass}>
                        Dịch vụ quan tâm <span className="text-red-500">*</span>
                        <select
                            className={inputClass}
                            value={values.service}
                            onChange={(event) => updateField('service', event.target.value)}
                            aria-invalid={Boolean(errors.service)}
                        >
                            <option value="">Chọn dịch vụ</option>
                            {serviceOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        {errors.service && <span className={errorClass}>{errors.service}</span>}
                    </label>

                    <label className={labelClass}>
                        Loại chất thải
                        <select
                            className={inputClass}
                            value={values.wasteType}
                            onChange={(event) => updateField('wasteType', event.target.value)}
                        >
                            <option value="">Chọn loại chất thải</option>
                            {wasteTypeOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>

                    <label className={labelClass}>
                        Khối lượng / tần suất dự kiến
                        <input
                            className={inputClass}
                            value={values.volumeFrequency}
                            onChange={(event) => updateField('volumeFrequency', event.target.value)}
                            placeholder="VD: 2 tấn/tháng, thu gom hằng tuần"
                        />
                    </label>

                    <label className={labelClass}>
                        Thời gian cần hỗ trợ
                        <select
                            className={inputClass}
                            value={values.timeline}
                            onChange={(event) => updateField('timeline', event.target.value)}
                        >
                            <option value="">Chọn thời gian</option>
                            {timelineOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                </div>

                <label className={labelClass}>
                    Nội dung yêu cầu
                    <textarea
                        className={`${inputClass} min-h-32 resize-y`}
                        value={values.message}
                        onChange={(event) => updateField('message', event.target.value)}
                        placeholder="Mô tả thêm về loại chất thải, hiện trạng lưu chứa, yêu cầu chứng từ hoặc lịch thu gom mong muốn..."
                    />
                </label>

                <label className="hidden" aria-hidden="true">
                    Website
                    <input
                        tabIndex={-1}
                        value={values.website}
                        onChange={(event) => updateField('website', event.target.value)}
                        autoComplete="off"
                    />
                </label>

                <div>
                    <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                        <input
                            type="checkbox"
                            checked={values.consent}
                            onChange={(event) => updateField('consent', event.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-secondary-600 focus:ring-brand-secondary-500"
                            aria-invalid={Boolean(errors.consent)}
                        />
                        <span>
                            Tôi đồng ý để Tân Vĩnh Đạt liên hệ lại qua điện thoại/email nhằm tư vấn dịch vụ và báo giá theo thông tin đã cung cấp.
                        </span>
                    </label>
                    {errors.consent && <div className={errorClass}>{errors.consent}</div>}
                </div>

                {statusMessage && (
                    <div
                        className={`rounded-xl border px-4 py-3 text-sm font-medium ${status === 'success'
                            ? 'border-brand-secondary-200 bg-brand-secondary-50 text-brand-secondary-800'
                            : status === 'error'
                                ? 'border-red-200 bg-red-50 text-red-700'
                                : 'border-brand-primary-200 bg-brand-primary-50 text-brand-primary-800'
                            }`}
                        role="status"
                    >
                        {statusMessage}
                    </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
                        {status === 'submitting' ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}
                    </button>
                    <p className="text-xs text-slate-500">
                        Form được gửi an toàn qua máy chủ Tân Vĩnh Đạt; nếu chưa cấu hình tự động hóa, ứng dụng email sẽ được mở.
                    </p>
                </div>
            </form>
        </div>
    );
}