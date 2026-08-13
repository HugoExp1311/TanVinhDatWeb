'use client';

import { useEffect, useState } from 'react';
import { FAQAccordion, type FAQItem } from '@/components/FAQAccordion';
import { site } from '@/lib/site';

/**
 * Read-only FAQ list that reads from localStorage (`tvd_admin_faqs`)
 * — falls back to `site.faqs` default if no admin override exists.
 * Listens for `storage` events so changes made in /admin/stats sync live.
 */
export function FAQList() {
    const [items, setItems] = useState<FAQItem[]>(site.faqs);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('tvd_admin_faqs');
            if (stored) setItems(JSON.parse(stored));
        } catch {
            /* ignore malformed JSON */
        }
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (!loaded) return;
        const handler = (e: StorageEvent) => {
            if (e.key === 'tvd_admin_faqs' && e.newValue) {
                try {
                    setItems(JSON.parse(e.newValue));
                } catch {
                    /* ignore malformed JSON */
                }
            }
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, [loaded]);

    return <FAQAccordion items={items} />;
}
