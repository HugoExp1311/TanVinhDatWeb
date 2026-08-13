import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { FAQList } from '@/components/FAQList';
import { CareersList } from '@/components/CareersList';
import { CTASection } from '@/components/CTASection';
import { site } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Tuyển dụng & FAQ',
    description:
        'Cơ hội nghề nghiệp và các câu hỏi thường gặp về dịch vụ thu gom, vận chuyển và xử lý chất thải công nghiệp của Tân Vĩnh Đạt.',
};

export default function FAQPage() {
    return (
        <>
            <PageHero
                eyebrow="Tuyển dụng/FAQ"
                title="Tuyển dụng & Câu hỏi thường gặp"
                description="Gia nhập đội ngũ Tân Vĩnh Đạt hoặc giải đáp chi tiết các thắc mắc phổ biến về dịch vụ, quy trình và giấy phép."
                breadcrumb={[
                    { href: '/', label: 'Trang chủ' },
                    { href: '/faq', label: 'Tuyển dụng/FAQ' },
                ]}
            />

            {/* Section 1: Careers — benefits + open positions (reads from localStorage) */}
            <section className="section">
                <div className="container-x">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="eyebrow">Tại sao chọn Tân Vĩnh Đạt</div>
                        <h2 className="section-title">Môi trường làm việc chuyên nghiệp</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                        {[
                            { icon: '💰', title: 'Lương thưởng cạnh tranh', desc: 'Mức lương trên thị trường + thưởng KPI theo quý' },
                            { icon: '🏥', title: 'Bảo hiểm đầy đủ', desc: 'BHXH, BHYT, BHTN và bảo hiểm sức khỏe cao cấp' },
                            { icon: '📚', title: 'Đào tạo liên tục', desc: 'Chương trình đào tạo nội bộ và cấp chứng chỉ quốc tế' },
                            { icon: '🌱', title: 'Cơ hội thăng tiến', desc: 'Lộ trình nghề nghiệp rõ ràng, đánh giá minh bạch' },
                        ].map((b) => (
                            <div key={b.title} className="card p-6 text-center">
                                <div className="text-4xl mb-3">{b.icon}</div>
                                <h3 className="font-bold text-brand-primary-900">{b.title}</h3>
                                <p className="mt-2 text-sm text-slate-600">{b.desc}</p>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-brand-primary-900 mb-6">
                        Vị trí đang tuyển
                    </h2>
                    <CareersList />
                </div>
            </section>

            {/* Section 2: FAQ accordion (reads from localStorage) */}
            <section className="section bg-subtle-gradient">
                <div className="container-x max-w-4xl">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <div className="eyebrow">Hỏi đáp</div>
                        <h2 className="section-title">Câu hỏi thường gặp</h2>
                    </div>
                    <FAQList />
                </div>
            </section>

            {/* Section 3: Still have questions? */}
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
