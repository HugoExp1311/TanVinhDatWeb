import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { site } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Chứng nhận & Tiêu chuẩn',
    description: 'Các chứng nhận ISO và quy chuẩn quốc gia mà Tân Vĩnh Đạt đạt được trong lĩnh vực xử lý chất thải công nghiệp.',
};

export default function CertificationsPage() {
    return (
        <>
            <PageHero
                eyebrow="Chứng nhận & Tiêu chuẩn"
                title="Uy tín được khẳng định bằng tiêu chuẩn quốc tế"
                description="Tân Vĩnh Đạt duy trì và tái chứng nhận định kỳ các hệ thống quản lý theo tiêu chuẩn ISO và tuân thủ quy chuẩn Việt Nam."
                breadcrumb={[
                    { href: '/', label: 'Trang chủ' },
                    { href: '/certifications', label: 'Chứng nhận' },
                ]}
            />

            <section className="section">
                <div className="container-x">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {site.certifications.map((c) => (
                            <div key={c.name} className="card p-8 text-center group hover:bg-gradient-to-br hover:from-white hover:to-brand-secondary-50">
                                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-brand-primary-800 to-brand-secondary-600 flex items-center justify-center text-white text-2xl font-bold shadow-soft group-hover:shadow-glow transition-all">
                                    ★
                                </div>
                                <h3 className="mt-5 text-lg font-bold text-brand-primary-900">{c.name}</h3>
                                <div className="mt-1 text-sm font-semibold text-brand-secondary-700">{c.org}</div>
                                <p className="mt-3 text-sm text-slate-600">{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section bg-slate-50">
                <div className="container-x">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <div className="eyebrow">Tuân thủ pháp lý</div>
                        <h2 className="section-title">Văn bản pháp luật ngành chất thải</h2>
                        <p className="section-subtitle">
                            Tân Vĩnh Đạt vận hành theo khung pháp lý Việt Nam về bảo vệ môi trường, cập nhật đầy đủ khi quy định thay đổi.
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        {site.legalCompliance.map((item, index) => (
                            <div
                                key={item.name}
                                className={`flex flex-col gap-2 p-5 md:flex-row md:items-center md:gap-6 ${index !== site.legalCompliance.length - 1 ? 'border-b border-slate-100' : ''
                                    }`}
                            >
                                <div className="md:w-2/5">
                                    <p className="font-bold text-brand-primary-900">{item.name}</p>
                                    <p className="mt-1 text-xs font-semibold text-brand-secondary-700">{item.org}</p>
                                </div>
                                <p className="md:w-3/5 text-sm text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section bg-subtle-gradient">
                <div className="container-x">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="eyebrow">Cam kết chất lượng</div>
                        <h2 className="section-title">Quy trình tái chứng nhận định kỳ</h2>
                        <p className="section-subtitle">
                            Mỗi chứng nhận được đánh giá lại hàng năm bởi các tổ chức uy tín quốc tế, đảm bảo hệ thống quản lý của chúng tôi luôn đạt chuẩn cao nhất.
                        </p>
                        <div className="mt-10 grid sm:grid-cols-3 gap-4">
                            {[
                                { label: 'Năm thành lập', value: site.established },
                                { label: 'Lần tái chứng nhận', value: '14' },
                                { label: 'Khách hàng tin tưởng', value: '200+' },
                            ].map((s) => (
                                <div key={s.label} className="card p-6">
                                    <div className="text-3xl font-bold text-brand-primary-900">{s.value}</div>
                                    <div className="text-sm text-slate-500 mt-1 uppercase tracking-wider">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <CTASection />
        </>
    );
}
