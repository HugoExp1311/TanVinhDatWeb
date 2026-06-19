import Link from 'next/link';
import type { ReactNode } from 'react';

export function PageHero({
    eyebrow,
    title,
    description,
    breadcrumb,
    children,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    breadcrumb?: { href: string; label: string }[];
    children?: ReactNode;
}) {
    return (
        <section className="relative overflow-hidden bg-hero-gradient text-white">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-secondary-500/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-brand-accent/10 blur-3xl" />

            <div className="container-x relative py-20 md:py-28">
                {breadcrumb && (
                    <nav aria-label="Breadcrumb" className="mb-6 animate-fade-in">
                        <ol className="flex items-center gap-2 text-sm text-white/70">
                            {breadcrumb.map((b, i) => (
                                <li key={b.href} className="flex items-center gap-2">
                                    {i > 0 && <span className="text-white/40">/</span>}
                                    {i === breadcrumb.length - 1 ? (
                                        <span className="text-white">{b.label}</span>
                                    ) : (
                                        <Link href={b.href} className="hover:text-white transition-colors">
                                            {b.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}
                <div className="max-w-3xl animate-fade-in-up">
                    {eyebrow && (
                        <div className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary-300 mb-4">
                            {eyebrow}
                        </div>
                    )}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl text-balance">
                            {description}
                        </p>
                    )}
                    {children && <div className="mt-8">{children}</div>}
                </div>
            </div>
        </section>
    );
}
