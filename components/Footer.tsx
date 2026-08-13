import Link from 'next/link';
import { site } from '@/lib/site';

export function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-brand-primary-950 text-slate-300 mt-16">
            <div className="container-x py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                <div>
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary-600 to-brand-secondary-600 flex items-center justify-center text-white font-bold">
                            TVĐ
                        </div>
                        <div className="leading-tight">
                            <div className="font-bold text-white text-base">Tân Vĩnh Đạt</div>
                            <div className="text-[10px] uppercase tracking-wider text-brand-secondary-400 font-semibold">
                                Since {site.established}
                            </div>
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400">{site.description}</p>
                    <div className="flex gap-3 mt-5">
                        {Object.entries(site.social).map(([key, url]) => (
                            <a
                                key={key}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Theo dõi ${key}`}
                                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-brand-secondary-600 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 hover:-translate-y-0.5 capitalize text-xs font-bold"
                            >
                                {key.charAt(0).toUpperCase()}
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Liên kết nhanh</h3>
                    <ul className="space-y-2.5">
                        {site.nav.slice(0, 7).map((item) => (
                            <li key={item.href}>
                                <Link href={item.href} className="text-sm text-slate-400 hover:text-brand-secondary-400 transition-colors">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Dịch vụ</h3>
                    <ul className="space-y-2.5">
                        {site.services.map((s) => (
                            <li key={s.slug}>
                                <Link href={`/services/${s.slug}`} className="text-sm text-slate-400 hover:text-brand-secondary-400 transition-colors">
                                    {s.title}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link href="/policies" className="text-sm text-slate-400 hover:text-brand-secondary-400 transition-colors">
                                Chính sách & Điều khoản
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Liên hệ</h3>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li>
                            <span className="block text-xs uppercase tracking-wider text-brand-secondary-400 font-semibold mb-1">
                                Địa chỉ
                            </span>
                            {site.address}
                        </li>
                        <li>
                            <span className="block text-xs uppercase tracking-wider text-brand-secondary-400 font-semibold mb-1">
                                Hotline
                            </span>
                            <a href={`tel:${site.hotline.replace(/\s/g, '')}`} className="hover:text-white">
                                {site.hotline}
                            </a>
                        </li>
                        <li>
                            <span className="block text-xs uppercase tracking-wider text-brand-secondary-400 font-semibold mb-1">
                                Email
                            </span>
                            <a href={`mailto:${site.email}`} className="hover:text-white">
                                {site.email}
                            </a>
                        </li>
                        <li>
                            <span className="block text-xs uppercase tracking-wider text-brand-secondary-400 font-semibold mb-1">
                                Giờ làm việc
                            </span>
                            {site.workingHours}
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="container-x py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                    <p>
                        © {year} {site.name}. Mọi quyền được bảo lưu.<br />
                        <span className="text-slate-600">Mã số thuế: {site.taxCode}</span>
                    </p>
                    <div className="flex gap-5">
                        <Link href="/policies" className="hover:text-brand-secondary-400 transition-colors">
                            Chính sách bảo mật
                        </Link>
                        <Link href="/policies" className="hover:text-brand-secondary-400 transition-colors">
                            Điều khoản sử dụng
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
