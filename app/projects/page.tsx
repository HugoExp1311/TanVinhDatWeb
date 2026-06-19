import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { site } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Dự án tiêu biểu',
    description: 'Các dự án xử lý chất thải công nghiệp tiêu biểu của Tân Vĩnh Đạt trên toàn quốc.',
};

export default function ProjectsPage() {
    return (
        <>
            <PageHero
                eyebrow="Dự án tiêu biểu"
                title="Hơn 200 dự án đã thực hiện thành công"
                description="Từ các khu công nghiệp lớn đến nhà máy sản xuất quy mô vừa, Tân Vĩnh Đạt đã và đang đồng hành cùng doanh nghiệp Việt."
                breadcrumb={[
                    { href: '/', label: 'Trang chủ' },
                    { href: '/projects', label: 'Dự án' },
                ]}
            />

            <section className="section">
                <div className="container-x">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {site.projects.map((project) => (
                            <article key={project.title} className="card overflow-hidden group">
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-950/70 via-transparent to-transparent" />
                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-brand-primary-800">
                                        {project.year}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-lg font-bold text-white">{project.title}</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="text-xs uppercase tracking-wider text-brand-secondary-700 font-semibold">
                                        {project.client}
                                    </div>
                                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">{project.scope}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <CTASection
                title="Bạn có dự án cần đối tác xử lý chất thải?"
                description="Hãy chia sẻ yêu cầu của bạn — chúng tôi sẽ liên hệ tư vấn trong 24 giờ."
            />
        </>
    );
}
