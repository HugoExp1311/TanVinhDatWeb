import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { site } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Quy trình xử lý',
    description: 'Quy trình 7 bước chuẩn hóa từ tiếp nhận yêu cầu đến báo cáo xử lý cuối cùng.',
};

export default function ProcessPage() {
    return (
        <>
            <PageHero
                eyebrow="Quy trình"
                title="7 bước chuẩn hóa — Minh bạch từ đầu đến cuối"
                description="Mỗi dự án của Tân Vĩnh Đạt đều tuân theo quy trình 7 bước được chuẩn hóa, đảm bảo chất lượng đồng nhất và khả năng truy vết 100%."
                breadcrumb={[
                    { href: '/', label: 'Trang chủ' },
                    { href: '/process', label: 'Quy trình' },
                ]}
            />

            <section className="section">
                <div className="container-x">
                    <div className="relative max-w-4xl mx-auto">
                        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-primary-300 via-brand-secondary-500 to-brand-primary-300 md:-translate-x-1/2" />
                        <ol className="space-y-12">
                            {site.process.map((step, i) => (
                                <li
                                    key={step.step}
                                    className={`relative flex items-start gap-6 md:gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary-800 to-brand-secondary-600 text-white flex items-center justify-center font-bold shadow-glow z-10">
                                        {step.step}
                                    </div>
                                    <div className={`flex-1 pl-16 md:pl-0 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                                        <div className="card p-6">
                                            <h3 className="text-lg font-bold text-brand-primary-900">{step.title}</h3>
                                            <p className="mt-2 text-slate-600 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:block flex-1" />
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>

            <CTASection
                title="Sẵn sàng bắt đầu với quy trình chuẩn của chúng tôi?"
            />
        </>
    );
}
