import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    const baseRoutes = [
        '',
        '/about',
        '/services',
        '/projects',
        '/certifications',
        '/process',
        '/faq',
        '/pricing',
        '/careers',
        '/contact',
        '/policies',
    ];
    return [
        ...baseRoutes.map((route) => ({
            url: `${site.url}${route}`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: route === '' ? 1 : 0.8,
        })),
        ...site.services.map((s) => ({
            url: `${site.url}/services/${s.slug}`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
    ];
}
