'use client';

import { useState } from 'react';

export type FAQItem = { q: string; a: string };

export function FAQAccordion({ items }: { items: FAQItem[] }) {
    const [open, setOpen] = useState<number | null>(0);
    return (
        <div className="space-y-3">
            {items.map((item, i) => {
                const isOpen = open === i;
                return (
                    <div
                        key={i}
                        className={`card overflow-hidden transition-all ${isOpen ? 'shadow-glow' : ''}`}
                    >
                        <button
                            className="w-full flex items-start justify-between gap-4 p-6 text-left"
                            aria-expanded={isOpen}
                            aria-controls={`faq-panel-${i}`}
                            id={`faq-trigger-${i}`}
                            onClick={() => setOpen(isOpen ? null : i)}
                        >
                            <span className="font-semibold text-brand-primary-900 text-base md:text-lg">
                                {item.q}
                            </span>
                            <span
                                className={`flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary-50 flex items-center justify-center text-brand-primary-800 transition-transform duration-300 ${isOpen ? 'rotate-45 bg-brand-secondary-100 text-brand-secondary-700' : ''
                                    }`}
                                aria-hidden="true"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </span>
                        </button>
                        <div
                            id={`faq-panel-${i}`}
                            role="region"
                            aria-labelledby={`faq-trigger-${i}`}
                            className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                }`}
                        >
                            <div className="overflow-hidden">
                                <p className="px-6 pb-6 text-slate-600 leading-relaxed">{item.a}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
