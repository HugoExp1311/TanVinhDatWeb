import type { Metadata } from 'next';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = {
    title: 'Admin Login',
    description: 'Đăng nhập quản trị Tân Vĩnh Đạt.',
    robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
    return (
        <section className="section bg-grid bg-slate-50 min-h-[80vh] flex items-center">
            <div className="container-x">
                <AdminLoginForm />
            </div>
        </section>
    );
}