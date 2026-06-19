import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { FAQAccordion } from '@/components/FAQAccordion';
import { CTASection } from '@/components/CTASection';
import { site } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Hỏi đáp',
    description: 'Các câu hỏi thường gặp về dịch vụ thu gom, vận chuyển và xử lý chất thải công nghiệp của Tân Vĩnh Đạt.',
};

export default function FAQPage() {
    return (
        <>
            <PageHero
                eyebrow="Hỏi đáp"
                title="Những câu hỏi thường gặp"
                description="Giải đáp chi tiết các thắc mắc phổ biến về dịch vụ, quy trình và giấy phép của Tân Vĩnh Đạt."
                breadcrumb={[
                    { href: '/', label: 'Trang chủ' },
                    { href: '/faq', label: 'Hỏi đáp' },
                ]}
            />

            <section className="section">
                <div className="container-x max-w-4xl">
                    <FAQAccordion items={site.faqs} />
                </div>
            </section>

            <section className="section bg-subtle-gradient">
                <div className="container-x max-w-3xl text-center">
                    <div className="eyebrow">Câu hỏi khác?</div>
                    <h2 className="section-title">Không tìm thấy câu trả lời bạn cần?</h2>
                    <p className="section-subtitle">
                        Đội ngũ tư vấn của Tân Vĩnh Đạt luôn sẵn sàng giải đáp mọi thắc mắc của bạn qua hotline hoặc email.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <a href={`tel:${site.hotline.replace(/\s/g, '')}`} className="btn-primary">
                            ☎ {site.hotline}
                        </a>
                        <a href={`mailto:${site.email}`} className="btn-outline">
                            ✉ {site.email}
                        </a>
                    </div>
                </div>
            </section>

            <CTASection />
        </>
    );
}
