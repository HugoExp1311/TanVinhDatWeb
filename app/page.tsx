import Link from 'next/link';
import Image from 'next/image';
import { ServiceCard } from '@/components/ServiceCard';
import { CTASection } from '@/components/CTASection';
import { site } from '@/lib/site';

export default function HomePage() {
    return (
        <>
            {/* HERO */}
            <section className="relative overflow-hidden bg-hero-gradient text-white">
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-secondary-500/20 blur-3xl animate-float" />
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-brand-accent/10 blur-3xl" />

                <div className="container-x relative py-20 md:py-32 lg:py-40">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider text-brand-secondary-200 mb-6">
                                <span className="w-2 h-2 rounded-full bg-brand-secondary-400 animate-pulse" />
                                ISO 9001 · 14001 · 45001 Certified
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-balance leading-[1.1]">
                                Giải pháp <span className="bg-gradient-to-r from-brand-secondary-300 to-brand-accent bg-clip-text text-transparent">toàn diện</span> cho chất thải công nghiệp
                            </h1>
                            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-xl text-balance">
                                {site.description}
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href="/contact" className="btn bg-white text-brand-primary-900 hover:bg-brand-accent hover:text-brand-primary-950">
                                    Nhận tư vấn miễn phí
                                </Link>
                                <Link href="/services" className="btn border-2 border-white/30 text-white hover:bg-white/10">
                                    Khám phá dịch vụ
                                </Link>
                            </div>

                            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
                                {site.stats.map((stat) => (
                                    <div key={stat.label} className="border-l-2 border-brand-secondary-500/60 pl-4">
                                        <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                                        <div className="text-xs text-white/70 mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative hidden lg:block">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary-500/20 to-brand-accent/10 rounded-3xl blur-2xl" />
                            <div className="relative rounded-3xl overflow-hidden shadow-glow border border-white/10">
                                <Image
                                    src="https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=1200&q=80"
                                    alt="Nhà máy xử lý chất thải công nghiệp"
                                    width={600}
                                    height={700}
                                    className="w-full h-[500px] object-cover"
                                    priority
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-950/80 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-5">
                                    <div className="text-xs uppercase tracking-wider text-brand-secondary-300 font-semibold mb-1">
                                        Đang vận hành
                                    </div>
                                    <div className="text-white font-bold">Nhà máy XLCT Bình Dương</div>
                                    <div className="text-white/70 text-sm mt-1">Công suất 200 tấn/ngày · Đạt chuẩn QCVN</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="section bg-subtle-gradient">
                <div className="container-x">
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="eyebrow">Dịch vụ của chúng tôi</div>
                        <h2 className="section-title">Ba trụ cột, một cam kết</h2>
                        <p className="section-subtitle">
                            Tân Vĩnh Đạt cung cấp giải pháp trọn gói từ thu gom tận nơi đến xử lý cuối cùng, đảm bảo tuân thủ nghiêm ngặt quy chuẩn môi trường Việt Nam.
                        </p>
                    </div>
                    <div className="mt-12 grid md:grid-cols-3 gap-6">
                        {site.services.map((s) => (
                            <ServiceCard key={s.slug} {...s} />
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY US */}
            <section className="section">
                <div className="container-x">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="eyebrow">Tại sao chọn Tân Vĩnh Đạt</div>
                            <h2 className="section-title">Đối tác chiến lược của hơn 200 doanh nghiệp</h2>
                            <p className="mt-5 text-slate-600 leading-relaxed">
                                Với 15 năm kinh nghiệm, chúng tôi tự hào mang đến dịch vụ xử lý chất thải công nghiệp đạt chuẩn quốc tế, giúp doanh nghiệp yên tâm sản xuất và phát triển bền vững.
                            </p>
                            <div className="mt-8 grid sm:grid-cols-2 gap-5">
                                {[
                                    { title: 'Giấy phép đầy đủ', desc: 'Được Bộ TNMT cấp phép xử lý CTNH' },
                                    { title: 'Công nghệ hiện đại', desc: 'Nhập khẩu đồng bộ từ châu Âu' },
                                    { title: 'Đội ngũ chuyên gia', desc: 'Kỹ sư có chứng chỉ hành nghề' },
                                    { title: 'Báo cáo minh bạch', desc: 'Quan trắc định kỳ, chứng từ điện tử' },
                                ].map((item) => (
                                    <div key={item.title} className="card p-5">
                                        <div className="w-10 h-10 rounded-lg bg-brand-secondary-100 flex items-center justify-center text-brand-secondary-700 mb-3">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-brand-primary-900">{item.title}</h3>
                                        <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="rounded-2xl overflow-hidden h-48 shadow-soft">
                                        <Image
                                            src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80"
                                            alt="Đội xe thu gom"
                                            width={300}
                                            height={200}
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden h-64 shadow-soft">
                                        <Image
                                            src="https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=600&q=80"
                                            alt="Nhà máy xử lý"
                                            width={300}
                                            height={260}
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-8">
                                    <div className="rounded-2xl overflow-hidden h-64 shadow-soft">
                                        <Image
                                            src="https://images.unsplash.com/photo-1610028658537-b7d8c3d54d3b?auto=format&fit=crop&w=600&q=80"
                                            alt="Quy trình xử lý"
                                            width={300}
                                            height={260}
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden h-48 shadow-soft">
                                        <Image
                                            src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80"
                                            alt="Bảo vệ môi trường"
                                            width={300}
                                            height={200}
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROJECTS PREVIEW */}
            <section className="section bg-slate-50">
                <div className="container-x">
                    <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
                        <div>
                            <div className="eyebrow">Dự án tiêu biểu</div>
                            <h2 className="section-title">Hành trình 15 năm đáng tin cậy</h2>
                        </div>
                        <Link href="/projects" className="btn-outline">
                            Xem tất cả dự án →
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {site.projects.slice(0, 3).map((project) => (
                            <article key={project.title} className="card overflow-hidden group">
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        unoptimized
                                    />
                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-brand-primary-800">
                                        {project.year}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-brand-primary-900 group-hover:text-brand-secondary-700 transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">{project.client}</p>
                                    <p className="text-sm text-slate-600 mt-3">{project.scope}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CERTIFICATIONS STRIP */}
            <section className="py-16 bg-white border-y border-slate-100">
                <div className="container-x">
                    <div className="text-center mb-10">
                        <div className="eyebrow">Chứng nhận & Tiêu chuẩn</div>
                        <h2 className="text-2xl md:text-3xl font-bold text-brand-primary-900">Đạt chuẩn quốc tế & quốc gia</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {site.certifications.map((c) => (
                            <div key={c.name} className="text-center p-4 rounded-xl border border-slate-100 hover:border-brand-secondary-200 hover:shadow-soft transition-all">
                                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-brand-primary-800 to-brand-secondary-600 flex items-center justify-center text-white text-xs font-bold mb-3">
                                    ★
                                </div>
                                <div className="font-bold text-sm text-brand-primary-900">{c.name}</div>
                                <div className="text-xs text-slate-500 mt-1">{c.org}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CTASection />
        </>
    );
}
