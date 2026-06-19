import Link from 'next/link';

export function CTASection({
    title = 'Cần tư vấn giải pháp xử lý chất thải?',
    description = 'Đội ngũ kỹ sư của Tân Vĩnh Đạt sẵn sàng khảo sát miễn phí và đề xuất phương án tối ưu cho doanh nghiệp của bạn.',
    primaryHref = '/contact',
    primaryLabel = 'Liên hệ tư vấn',
    secondaryHref = '/services',
    secondaryLabel = 'Xem dịch vụ',
}: {
    title?: string;
    description?: string;
    primaryHref?: string;
    primaryLabel?: string;
    secondaryHref?: string;
    secondaryLabel?: string;
}) {
    return (
        <section className="section">
            <div className="container-x">
                <div className="relative overflow-hidden rounded-3xl bg-hero-gradient p-10 md:p-14 lg:p-20 text-white text-center shadow-glow">
                    <div className="absolute inset-0 bg-grid opacity-20" />
                    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-brand-secondary-500/30 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-brand-accent/15 blur-3xl" />
                    <div className="relative max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                            {title}
                        </h2>
                        <p className="mt-5 text-base md:text-lg text-white/85">{description}</p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Link href={primaryHref} className="btn bg-white text-brand-primary-900 hover:bg-brand-accent hover:text-brand-primary-950">
                                {primaryLabel}
                            </Link>
                            <Link href={secondaryHref} className="btn border-2 border-white/40 text-white hover:bg-white/10">
                                {secondaryLabel}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
