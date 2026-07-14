import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { InquiryForm } from '@/components/InquiryForm';
import { site } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Liên hệ',
    description: 'Thông tin liên hệ Công ty TNHH Tân Vĩnh Đạt - Hotline, email, địa chỉ văn phòng và nhà máy.',
};

export default function ContactPage() {
    return (
        <>
            <PageHero
                eyebrow="Liên hệ"
                title="Chúng tôi sẵn sàng lắng nghe bạn"
                description="Đội ngũ Tân Vĩnh Đạt phản hồi trong vòng 24 giờ làm việc. Hotline 24/7 cho các sự cố khẩn cấp."
                breadcrumb={[
                    { href: '/', label: 'Trang chủ' },
                    { href: '/contact', label: 'Liên hệ' },
                ]}
            />

            <section className="section">
                <div className="container-x">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {[
                            { icon: '📍', title: 'Văn phòng & Nhà máy', lines: [site.address], action: { label: 'Xem bản đồ →', href: '#map' } },
                            { icon: '☎', title: 'Hotline', lines: [site.hotline, site.phone], action: { label: 'Gọi ngay', href: `tel:${site.hotline.replace(/\s/g, '')}` } },
                            { icon: '✉', title: 'Email', lines: [site.email], action: { label: 'Gửi email', href: `mailto:${site.email}` } },
                        ].map((card) => (
                            <div key={card.title} className="card p-6 text-center group hover:bg-gradient-to-br hover:from-white hover:to-brand-secondary-50">
                                <div className="text-4xl mb-3">{card.icon}</div>
                                <h3 className="font-bold text-brand-primary-900">{card.title}</h3>
                                <div className="mt-3 space-y-1 text-sm text-slate-600">
                                    {card.lines.map((l) => (
                                        <div key={l}>{l}</div>
                                    ))}
                                </div>
                                <a
                                    href={card.action.href}
                                    className="mt-4 inline-block text-sm font-semibold text-brand-secondary-700 hover:text-brand-primary-900 transition-colors"
                                >
                                    {card.action.label}
                                </a>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:items-start">
                        <InquiryForm />

                        <div className="space-y-6">
                            <div className="card p-6 md:p-8">
                                <div className="eyebrow">Quy trình phản hồi</div>
                                <h2 className="text-2xl font-bold text-brand-primary-900">Tư vấn nhanh, đúng nhu cầu</h2>
                                <div className="mt-6 space-y-4">
                                    {[
                                        { step: '01', title: 'Tiếp nhận yêu cầu', desc: 'Ghi nhận thông tin liên hệ, địa điểm và loại chất thải cần xử lý.' },
                                        { step: '02', title: 'Kỹ thuật tư vấn', desc: 'Đề xuất phương án thu gom, vận chuyển, xử lý và hồ sơ chứng từ phù hợp.' },
                                        { step: '03', title: 'Báo giá chi tiết', desc: 'Gửi báo giá sau khi xác nhận khối lượng, tần suất và điều kiện vận chuyển.' },
                                    ].map((item) => (
                                        <div key={item.step} className="flex gap-4">
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-secondary-100 text-sm font-bold text-brand-secondary-700">
                                                {item.step}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-brand-primary-900">{item.title}</h3>
                                                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card bg-gradient-to-br from-brand-primary-900 to-brand-primary-800 p-6 text-white md:p-8">
                                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary-200">Khẩn cấp 24/7</div>
                                <h2 className="mt-3 text-2xl font-bold">Sự cố tràn đổ hoặc cần thu gom gấp?</h2>
                                <p className="mt-3 text-sm leading-relaxed text-white/75">
                                    Với yêu cầu khẩn cấp, vui lòng gọi hotline để đội phản ứng nhanh tiếp nhận và điều phối ngay.
                                </p>
                                <a href={`tel:${site.hotline.replace(/\s/g, '')}`} className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-brand-primary-900 transition hover:bg-brand-accent">
                                    ☎ Gọi {site.hotline}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 grid lg:grid-cols-2 gap-8">
                        <div className="card p-8">
                            <h2 className="text-2xl font-bold text-brand-primary-900">Giờ làm việc</h2>
                            <dl className="mt-6 space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-slate-100">
                                    <dt className="text-slate-600">Văn phòng</dt>
                                    <dd className="font-semibold text-brand-primary-900">Thứ 2 - Thứ 7: 7:30 - 17:30</dd>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-100">
                                    <dt className="text-slate-600">Hotline sự cố</dt>
                                    <dd className="font-semibold text-brand-secondary-700">24/7 (kể cả ngày lễ)</dd>
                                </div>
                                <div className="flex justify-between py-2">
                                    <dt className="text-slate-600">Nhà máy xử lý</dt>
                                    <dd className="font-semibold text-brand-primary-900">Vận hành liên tục</dd>
                                </div>
                            </dl>

                            <h2 className="mt-8 text-2xl font-bold text-brand-primary-900">Mạng xã hội</h2>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                {Object.entries(site.social).map(([key, url]) => (
                                    <a
                                        key={key}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-outline text-sm py-2.5 capitalize"
                                    >
                                        {key}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div id="map" className="card overflow-hidden h-[420px]">
                            <iframe
                                src={site.mapEmbed}
                                title="Bản đồ vị trí Tân Vĩnh Đạt"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <CTASection
                title="Cần tư vấn nhanh?"
                description={`Gọi ngay hotline ${site.hotline} hoặc gửi email về ${site.email}. Chúng tôi phản hồi trong 24 giờ làm việc.`}
                primaryHref={`tel:${site.hotline.replace(/\s/g, '')}`}
                primaryLabel={`☎ ${site.hotline}`}
                secondaryHref={`mailto:${site.email}`}
                secondaryLabel="Gửi email"
            />
        </>
    );
}
