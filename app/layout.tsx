import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({
    subsets: ['vietnamese', 'latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://tanvinhdat.vn'),
    title: {
        default: 'Công ty TNHH Tân Vĩnh Đạt - Xử lý chất thải công nghiệp',
        template: '%s | Tân Vĩnh Đạt',
    },
    description:
        'Tân Vĩnh Đạt - 15 năm kinh nghiệm trong thu gom, vận chuyển và xử lý chất thải công nghiệp. Đối tác tin cậy của 200+ nhà máy và khu công nghiệp tại Việt Nam.',
    keywords: [
        'xử lý chất thải công nghiệp',
        'thu gom chất thải',
        'vận chuyển chất thải',
        'chất thải nguy hại',
        'ISO 14001',
        'Tân Vĩnh Đạt',
    ],
    authors: [{ name: 'Công ty TNHH Tân Vĩnh Đạt' }],
    openGraph: {
        type: 'website',
        locale: 'vi_VN',
        url: 'https://tanvinhdat.vn',
        siteName: 'Tân Vĩnh Đạt',
        title: 'Công ty TNHH Tân Vĩnh Đạt - Xử lý chất thải công nghiệp',
        description:
            'Giải pháp toàn diện cho thu gom, vận chuyển và xử lý chất thải công nghiệp. Tuân thủ Nghị định 08/2022/NĐ-CP.',
    },
    robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi" className={inter.variable}>
            <body className="min-h-screen flex flex-col font-sans">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
