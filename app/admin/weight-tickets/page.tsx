import type { Metadata } from 'next';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { WeightTicketExtractor } from '@/components/admin/WeightTicketExtractor';

export const metadata: Metadata = {
    title: 'Admin - Trích xuất phiếu cân',
    description: 'Công cụ admin trích xuất dữ liệu phiếu cân xe bằng n8n OCR.',
    robots: { index: false, follow: false },
};

export default function AdminWeightTicketsPage() {
    return (
        <AdminGuard>
            <WeightTicketExtractor />
        </AdminGuard>
    );
}