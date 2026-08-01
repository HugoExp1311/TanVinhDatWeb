import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WeightTicketExtractorDev } from './WeightTicketExtractorDev';

export const metadata: Metadata = {
    title: 'Dev - Trích xuất phiếu cân',
    description: 'Công cụ dev trích xuất dữ liệu phiếu cân xe bằng n8n OCR.',
    robots: { index: false, follow: false },
};

export default function DevWeightTicketsPage() {
    if (process.env.NODE_ENV === 'production') {
        notFound();
    }

    return <WeightTicketExtractorDev />;
}
