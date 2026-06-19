import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { site } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Tuyển dụng',
    description: 'Cơ hội nghề nghiệp tại Công ty TNHH Tân Vĩnh Đạt - Môi trường làm việc chuyên nghiệp, đãi ngộ cạnh tranh.',
};

export default function CareersPage() {
    return (
        <>
            <PageHero
                eyebrow="Tuyển dụng"
                title="Gia nhập đội ngũ Tân Vĩnh Đạt"
                description="Cùng chúng tôi kiến tạo tương lai xanh cho ngành công nghiệp Việt Nam."
                breadcrumb={[
                    { href: '/', label: 'Trang chủ' },
                    { href: '/careers', label: 'Tuyển dụng' },
                ]}
            />

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

                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-brand-primary-900 mb-6">Vị trí đang tuyển</h2>
                        <div className="space-y-3">
                            {site.jobs.map((job) => (
                                <div key={job.title} className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-brand-primary-900">{job.title}</h3>
                                        <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-600">
                                            <span>📍 {job.location}</span>
                                            <span>•</span>
                                            <span>{job.dept}</span>
                                            <span>•</span>
                                            <span>{job.type}</span>
                                        </div>
                                    </div>
                                    <a
                                        href={`mailto:${site.email}?subject=${encodeURIComponent('Ứng tuyển: ' + job.title)}`}
                                        className="btn-primary text-sm py-2 flex-shrink-0"
                                    >
                                        Ứng tuyển
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <CTASection
                title="Không tìm thấy vị trí phù hợp?"
                description="Gửi CV của bạn về email — chúng tôi sẽ liên hệ khi có vị trí phù hợp."
                primaryHref={`mailto:${site.email}`}
                primaryLabel={`✉ ${site.email}`}
            />
        </>
    );
}
