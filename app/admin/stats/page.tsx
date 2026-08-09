import type { Metadata } from 'next';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminStats } from '@/components/admin/AdminStats';

export const metadata: Metadata = {
    title: 'Admin - Thống kê doanh nghiệp',
    description: 'Tổng quan dữ liệu dịch vụ, dự án, chứng nhận và định giá Tân Vĩnh Đạt.',
    robots: { index: false, follow: false },
};

export default function AdminStatsPage() {
    return (
        <AdminGuard>
            <AdminStats />
        </AdminGuard>
    );
}