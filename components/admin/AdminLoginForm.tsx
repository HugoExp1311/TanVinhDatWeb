'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_PANEL_PATH, ADMIN_SESSION_KEY, getAdminPassword } from '@/lib/adminAuth';

export function AdminLoginForm() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');

        if (password === getAdminPassword()) {
            window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
            router.replace(ADMIN_PANEL_PATH);
            return;
        }

        setError('Mật khẩu admin không đúng. Vui lòng thử lại.');
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
                />
                {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            </div>

            <button type="submit" className="btn-primary mt-6 w-full rounded-2xl">
                Đăng nhập
            </button>

            <p className="mt-5 text-xs leading-relaxed text-slate-500">
                Lưu ý: Phiên đăng nhập này dùng <code>sessionStorage</code> để tương thích static export. Đây là lớp bảo vệ nhẹ cho nội bộ,
                không thay thế xác thực server-side.
            </p>
        </form>
    );
}