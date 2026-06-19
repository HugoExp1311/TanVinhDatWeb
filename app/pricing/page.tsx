import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { site } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Bảng giá tham khảo',
    description: 'Bảng giá dịch vụ xử lý chất thải công nghiệp tham khảo từ Tân Vĩnh Đạt.',
};

export default function PricingPage() {
    return (
        <>
            <PageHero
                eyebrow="Bảng giá tham khảo"
                title="Bảng giá dịch vụ minh bạch"
                description="Giá dịch vụ được tính dựa trên mã chất thải, khối lượng và tần suất. Liên hệ để nhận báo giá chính xác cho dự án của bạn."
                breadcrumb={[
                    { href: '/', label: 'Trang chủ' },
                    { href: '/pricing', label: 'Bảng giá' },
                ]}
            />

            <section className="section">
                <div className="container-x space-y-8">
                    {site.pricing.map((cat) => (
                        <div key={cat.category} className="card overflow-hidden">
                            <div className="px-6 py-5 bg-gradient-to-r from-brand-primary-800 to-brand-primary-700 text-white flex items-center justify-between flex-wrap gap-2">
                                <h2 className="text-lg md:text-xl font-bold">{cat.category}</h2>
                                <div className="text-xs uppercase tracking-wider text-brand-secondary-200 font-semibold">
                                    Đơn vị: {cat.unit}
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50 text-left">
                                            <th className="px-6 py-3 text-xs uppercase tracking-wider text-slate-600 font-semibold">Phạm vi</th>
                                            <th className="px-6 py-3 text-xs uppercase tracking-wider text-slate-600 font-semibold">Đơn giá tham khảo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cat.tiers.map((tier, i) => (
                                            <tr key={i} className="border-t border-slate-100 hover:bg-brand-secondary-50/40 transition-colors">
                                                <td className="px-6 py-4 text-slate-700">{tier.range}</td>
                                                <td className="px-6 py-4 font-semibold text-brand-primary-900">{tier.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section bg-subtle-gradient">
                <div className="container-x max-w-3xl text-center">
                    <div className="eyebrow">Lưu ý</div>
                    <h2 className="section-title">Báo giá chính xác sau khảo sát</h2>
                    <p className="section-subtitle">
                        Bảng giá trên chỉ mang tính tham khảo. Chi phí thực tế phụ thuộc vào đặc thù chất thải, quy trình xử lý yêu cầu và điều kiện vận chuyển cụ thể. Vui lòng liên hệ để được tư vấn và nhận báo giá chi tiết.
                    </p>
                    <a href={`tel:${site.hotline.replace(/\s/g, '')}`} className="mt-6 inline-flex btn-primary">
                        Yêu cầu báo giá chi tiết
                    </a>
                </div>
            </section>

            <CTASection />
        </>
    );
}
