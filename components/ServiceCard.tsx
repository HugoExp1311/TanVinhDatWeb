import Link from 'next/link';
import { ServiceIcon } from './ServiceIcon';

export type ServiceCardProps = {
    slug: string;
    title: string;
    summary: string;
    icon: 'truck' | 'route' | 'recycle';
    bullets?: string[];
    variant?: 'default' | 'compact';
};

export function ServiceCard({ slug, title, summary, icon, bullets, variant = 'default' }: ServiceCardProps) {
    return (
        <Link
            href={`/services/${slug}`}
            className="group card p-6 md:p-8 relative overflow-hidden block"
            id={`service-card-${slug}`}
        >
            <div className="absolute inset-0 bg-card-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-primary-800 to-brand-secondary-600 flex items-center justify-center text-white shadow-soft group-hover:scale-110 transition-transform duration-300">
                    <ServiceIcon name={icon} className="w-7 h-7" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-brand-primary-900 group-hover:text-brand-secondary-700 transition-colors">
                    {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{summary}</p>
                {variant === 'default' && bullets && (
                    <ul className="mt-5 space-y-2">
                        {bullets.slice(0, 3).map((b) => (
                            <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                                <svg className="w-4 h-4 text-brand-secondary-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {b}
                            </li>
                        ))}
                    </ul>
                )}
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary-800 group-hover:text-brand-secondary-700 transition-colors">
                    Tìm hiểu thêm
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </span>
            </div>
        </Link>
    );
}
