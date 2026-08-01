'use client';

import Link from 'next/link';
import { useState } from 'react';
import { site } from '@/lib/site';

export function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
            <div className="container-x flex items-center justify-between h-24">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group" aria-label="Trang chủ Tân Vĩnh Đạt">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-primary-800 to-brand-secondary-600 flex items-center justify-center text-white font-extrabold text-lg shadow-glow group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        TVĐ
                    </div>
                    <div className="hidden sm:block leading-tight">
                        <div className="font-extrabold text-brand-primary-900 text-xl tracking-tight">Tân Vĩnh Đạt</div>
                        <div className="text-[11px] uppercase tracking-[0.15em] text-brand-secondary-700 font-bold mt-0.5">
                            Industrial Waste Solution
                        </div>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav aria-label="Điều hướng chính" className="hidden lg:flex items-center gap-2">
                    {site.nav.slice(0, 7).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group relative px-5 py-3 text-base font-bold text-slate-700 hover:text-brand-primary-800 transition-colors"
                        >
                            {item.label}
                            {/* Animated underline */}
                            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-[3px] w-0 group-hover:w-[70%] bg-gradient-to-r from-brand-primary-600 to-brand-secondary-500 rounded-full transition-all duration-300 ease-out" />
                        </Link>
                    ))}
                </nav>

                {/* Right CTA */}
                <div className="hidden lg:flex items-center gap-4">
                    <Link
                        href="/dev/weight-tickets"
                        className="px-5 py-3 rounded-xl border-2 border-brand-primary-200 text-brand-primary-800 text-base font-bold hover:bg-brand-primary-50 transition-colors"
                    >
                        Phiếu cân
                    </Link>
                    <a
                        href={`tel:${site.hotline.replace(/\s/g, '')}`}
                        className="text-base font-bold text-brand-primary-800 hover:text-brand-secondary-600 transition-colors"
                    >
                        ☎ {site.hotline}
                    </a>
                    <Link
                        href="/contact"
                        className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-primary-800 to-brand-secondary-600 text-white text-base font-bold shadow-glow hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.03] transition-all duration-300"
                    >
                        Liên hệ ngay
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    aria-label="Mở menu"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                    className="lg:hidden p-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                    <svg className="w-8 h-8 text-brand-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {open ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="lg:hidden border-t border-slate-200 bg-white shadow-lg">
                    <nav className="container-x py-4 flex flex-col gap-1" aria-label="Điều hướng di động">
                        {site.nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="px-4 py-3.5 text-lg font-semibold text-slate-700 hover:text-brand-primary-800 hover:bg-brand-primary-50 rounded-lg transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href="/dev/weight-tickets"
                            onClick={() => setOpen(false)}
                            className="px-4 py-3.5 text-lg font-semibold text-brand-primary-800 hover:bg-brand-primary-50 rounded-lg transition-colors"
                        >
                            📋 Phiếu cân (Dev)
                        </Link>
                        <a
                            href={`tel:${site.hotline.replace(/\s/g, '')}`}
                            className="mt-2 px-4 py-3.5 text-lg font-bold text-brand-secondary-700"
                        >
                            ☎ Hotline: {site.hotline}
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
}

