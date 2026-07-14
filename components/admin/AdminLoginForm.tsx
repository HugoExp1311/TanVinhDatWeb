'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_LOGIN_API_PATH, ADMIN_PANEL_PATH } from '@/lib/adminAuth';

export function AdminLoginForm() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    function getSafeRedirectPath() {
        const nextPath = new URLSearchParams(window.location.search).get('next');

        if (nextPath?.startsWith('/admin/') && !['/admin/login', '/admin/login/'].includes(nextPath)) {
            return nextPath;
        }

        return ADMIN_PANEL_PATH;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');

        if (!password.trim()) {
            setError('Vui lòng nhập mật khẩu admin.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(ADMIN_LOGIN_API_PATH, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ password }),
            });

            const data = (await response.json().catch(() => null)) as { error?: string } | null;

            if (!response.ok) {
                setError(data?.error || 'Thông tin đăng nhập không hợp lệ.');
                return;
            }

            router.replace(getSafeRedirectPath());
            router.refresh();
        } catch {
            setError('Không thể kết nối tới máy chủ xác thực. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="card p-8 md:p-10 max-w-md w-full mx-auto">
            <div className="text-center">
                <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary-800 to-brand-secondary-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-glow">
                    TVĐ
                </div>
                <p className="eyebrow">Admin Panel</p>
                <h1 className="text-3xl font-extrabold text-brand-primary-900">Đăng nhập quản trị</h1>
                <p className="mt-3 text-sm text-slate-600">Khu vực nội bộ dành cho quản trị viên Tân Vĩnh Đạt.</p>
            </div>

            <div className="mt-8">
                <label htmlFor="adminPassword" className="block text-sm font-bold text-brand-primary-900">
                    Mật khẩu admin
                </label>
                <input
                    id="adminPassword"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="mt-2 w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-primary-700 focus:ring-4 focus:ring-brand-primary-100"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                />
                {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary mt-6 w-full rounded-2xl disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            <p className="mt-5 text-xs leading-relaxed text-slate-500">
                Phiên đăng nhập được xác thực trên server và lưu bằng cookie <code>HttpOnly</code>. Không nhập mật khẩu admin trên thiết bị không tin cậy.
            </p>
        </form>
    );
}