import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { site } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Giới thiệu',
    description: 'Công ty TNHH TM - DV Tân Vĩnh Đạt - Đối tác xử lý chất thải công nghiệp uy tín tại Việt Nam.',
};

export default function AboutPage() {
    return (
        <>
            <PageHero
                eyebrow="Về Tân Vĩnh Đạt"
                title="Đối tác tin cậy trong lĩnh vực xử lý chất thải công nghiệp"
                description="Thành lập năm 2025, Công ty TNHH TM - DV Tân Vĩnh Đạt nhanh chóng trở thành một trong những đơn vị uy tín trong lĩnh vực thu gom, vận chuyển và xử lý chất thải công nghiệp tại Việt Nam."
                breadcrumb={[
                    { href: '/', label: 'Trang chủ' },
                    { href: '/about', label: 'Giới thiệu' },
                ]}
            />

            <section className="section">
                <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="eyebrow">Câu chuyện của chúng tôi</div>
                        <h2 className="section-title">Hành trình xây dựng niềm tin</h2>
                        <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
                            <p>
                                Thành lập năm 2025, <strong className="text-brand-primary-900">Công ty TNHH TM - DV Tân Vĩnh Đạt</strong> ra đời với sứ mệnh giải quyết bài toán chất thải công nghiệp — một thách thức lớn trong quá trình công nghiệp hóa của Việt Nam.
                            </p>
                            <p>
                                Với tầm nhìn dài hạn và đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi đã đầu tư mạnh vào hệ thống xe chuyên dụng, nhà máy xử lý đạt chuẩn, và mạng lưới đối tác chiến lược trên cả nước.
                            </p>
                            <p>
                                Mỗi tấn chất thải chúng tôi xử lý là một cam kết về trách nhiệm với môi trường và sức khỏe cộng đồng.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="rounded-3xl overflow-hidden shadow-glow">
                            <Image
                                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                                alt="Văn phòng Tân Vĩnh Đạt"
                                width={600}
                                height={450}
                                className="w-full h-[450px] object-cover"
                                unoptimized
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-6 shadow-glow max-w-[200px]">
                            <div className="text-4xl font-bold text-brand-secondary-700">2025</div>
                            <div className="text-sm text-slate-700 mt-1">Năm thành lập</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission / Vision / Values */}
            <section className="section bg-subtle-gradient">
                <div className="container-x">
                    <div className="text-center mb-12">
                        <div className="eyebrow">Giá trị cốt lõi</div>
                        <h2 className="section-title">Sứ mệnh · Tầm nhìn · Giá trị</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Sứ mệnh',
                                desc: 'Cung cấp giải pháp xử lý chất thải công nghiệp toàn diện, góp phần bảo vệ môi trường và phát triển bền vững cho doanh nghiệp Việt.',
                                icon: '🎯',
                            },
                            {
                                title: 'Tầm nhìn 2030',
                                desc: 'Trở thành công ty xử lý chất thải công nghiệp hàng đầu khu vực phía Nam, dẫn đầu về công nghệ xanh và chuyển đổi số trong ngành.',
                                icon: '🌏',
                            },
                            {
                                title: 'Giá trị',
                                desc: 'Trách nhiệm · Minh bạch · Đổi mới · Hợp tác. Chúng tôi tin rằng kinh doanh bền vững đi đôi với trách nhiệm xã hội.',
                                icon: '💎',
                            },
                        ].map((item) => (
                            <div key={item.title} className="card p-8 text-center hover:bg-gradient-to-br hover:from-white hover:to-brand-secondary-50">
                                <div className="text-5xl mb-4">{item.icon}</div>
                                <h3 className="text-xl font-bold text-brand-primary-900">{item.title}</h3>
                                <p className="mt-3 text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="section">
                <div className="container-x">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {site.stats.map((stat) => (
                            <div key={stat.label} className="card p-8 text-center">
                                <div className="text-5xl font-bold bg-gradient-to-br from-brand-primary-800 to-brand-secondary-600 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="mt-2 text-sm font-medium text-slate-600 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CTASection
                title="Bắt đầu hợp tác cùng Tân Vĩnh Đạt"
                description="Đặt lịch khảo sát miễn phí tại nhà máy của bạn — chúng tôi sẽ phản hồi trong vòng 24 giờ."
            />
        </>
    );
}
