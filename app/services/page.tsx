import type { Metadata } from 'next';
import { ServiceCard } from '@/components/ServiceCard';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { site } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Dịch vụ',
    description: 'Dịch vụ thu gom, vận chuyển và xử lý chất thải công nghiệp toàn diện từ Tân Vĩnh Đạt.',
};

export default function ServicesIndexPage() {
    return (
        <>
            <PageHero
                eyebrow="Dịch vụ"
                title="Giải pháp trọn gói từ thu gom đến xử lý"
                description="Một đối tác duy nhất cho mọi nhu cầu về chất thải công nghiệp. Tuân thủ nghiêm ngặt quy chuẩn Việt Nam và quốc tế."
                breadcrumb={[
                    { href: '/', label: 'Trang chủ' },
                    { href: '/services', label: 'Dịch vụ' },
                ]}
            />

            <section className="section">
                <div className="container-x">
                    <div className="grid md:grid-cols-3 gap-6">
                        {site.services.map((s) => (
                            <ServiceCard key={s.slug} {...s} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="section bg-subtle-gradient">
                <div className="container-x">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="eyebrow">Năng lực</div>
                        <h2 className="section-title">Phạm vi dịch vụ rộng khắp</h2>
                        <p className="section-subtitle">
                            Tân Vĩnh Đạt phục vụ đa dạng ngành công nghiệp, từ sản xuất, chế biến đến năng lượng và hạ tầng.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            'Công nghiệp nặng', 'Dệt may & Da giày', 'Thực phẩm & Đồ uống',
                            'Hóa chất', 'Điện tử', 'Xi măng & Thép',
                            'Y tế', 'Khu công nghiệp',
                        ].map((industry) => (
                            <div key={industry} className="card p-5 text-center hover:bg-brand-secondary-50 transition-colors">
                                <div className="text-sm font-semibold text-brand-primary-900">{industry}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CTASection />
        </>
    );
}
