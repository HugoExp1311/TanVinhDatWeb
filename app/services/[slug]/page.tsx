import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { ServiceIcon } from '@/components/ServiceIcon';
import { site } from '@/lib/site';

type Props = { params: { slug: string } };

export function generateStaticParams() {
    return site.services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
    const service = site.services.find((s) => s.slug === params.slug);
    if (!service) return { title: 'Không tìm thấy' };
    return {
        title: service.title,
        description: service.summary,
    };
}

export default function ServiceDetailPage({ params }: Props) {
    const service = site.services.find((s) => s.slug === params.slug);
    if (!service) notFound();

    return (
        <>
            <PageHero
                eyebrow="Dịch vụ"
                title={service.title}
                description={service.summary}
                breadcrumb={[
                    { href: '/', label: 'Trang chủ' },
                    { href: '/services', label: 'Dịch vụ' },
                    { href: `/services/${service.slug}`, label: service.short },
                ]}
            >
                <div className="flex gap-3">
                    <a href={`tel:${site.hotline.replace(/\s/g, '')}`} className="btn bg-white text-brand-primary-900 hover:bg-brand-accent">
                        ☎ Gọi tư vấn: {site.hotline}
                    </a>
                </div>
            </PageHero>

            <section className="section">
                <div className="container-x">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-brand-primary-900">
                                Phạm vi công việc
                            </h2>
                            <ul className="space-y-3">
                                {service.bullets.map((b) => (
                                    <li key={b} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 hover:bg-brand-secondary-50 transition-colors">
                                        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-brand-secondary-600 flex items-center justify-center text-white">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-slate-700 leading-relaxed pt-1">{b}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <aside className="space-y-4">
                            <div className="card p-6 sticky top-24">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-primary-800 to-brand-secondary-600 flex items-center justify-center text-white shadow-soft">
                                    <ServiceIcon name={service.icon} className="w-7 h-7" />
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-brand-primary-900">Cần tư vấn chi tiết?</h3>
                                <p className="mt-2 text-sm text-slate-600">Đội ngũ kỹ sư sẵn sàng hỗ trợ khảo sát miễn phí.</p>
                                <div className="mt-5 space-y-2 text-sm">
                                    <a href={`tel:${site.hotline.replace(/\s/g, '')}`} className="btn-primary w-full">
                                        ☎ {site.hotline}
                                    </a>
                                    <a href={`mailto:${site.email}`} className="btn-outline w-full">
                                        ✉ Gửi email
                                    </a>
                                </div>
                                <div className="mt-5 pt-5 border-t border-slate-100 text-xs text-slate-500">
                                    Hotline: <strong className="text-brand-primary-800">{site.hotline}</strong><br />
                                    Giờ làm việc: {site.workingHours}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <CTASection />
        </>
    );
}
