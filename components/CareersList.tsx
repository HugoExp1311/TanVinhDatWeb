'use client';

import { useEffect, useState } from 'react';
import { site } from '@/lib/site';

type Job = { title: string; dept: string; type: string; location: string };

/**
 * Read-only careers list that reads from localStorage (`tvd_admin_jobs`)
 * — falls back to `site.jobs` default if no admin override exists.
 * Listens for `storage` events so changes made in /admin/stats sync live.
 */
export function CareersList() {
    const [items, setItems] = useState<Job[]>(site.jobs);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('tvd_admin_jobs');
            if (stored) setItems(JSON.parse(stored));
        } catch {
            /* ignore malformed JSON */
        }
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (!loaded) return;
        const handler = (e: StorageEvent) => {
            if (e.key === 'tvd_admin_jobs' && e.newValue) {
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

    if (items.length === 0) {
        return (
            <p className="text-center text-slate-500 italic py-8">
                Hiện chưa có vị trí tuyển dụng. Vui lòng kiểm tra lại sau.
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {items.map((job, i) => (
                <div
                    key={i}
                    className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div>
                        <h3 className="text-lg font-bold text-brand-primary-900">{job.title}</h3>
                        <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-600">
                            <span>📍 {job.location}</span>
                            <span>•</span>
                            <span>{job.dept}</span>
                            <span>•</span>
                            <span>{job.type}</span>
                        </div>
                    </div>
                    <a
                        href={`mailto:${site.email}?subject=${encodeURIComponent('Ứng tuyển: ' + job.title)}`}
                        className="btn-primary text-sm py-2 flex-shrink-0"
                    >
                        Ứng tuyển
                    </a>
                </div>
            ))}
        </div>
    );
}
