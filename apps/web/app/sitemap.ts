import { MetadataRoute } from 'next';
import { mockFilms } from '@/lib/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indianshortfilms.com';

  const staticRoutes = [
    '',
    '/discover',
    '/filmmakers',
    '/submit',
    '/watchlist',
    '/login',
    '/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const filmRoutes = mockFilms.map((film) => ({
    url: `${baseUrl}/film/${film.slug}`,
    lastModified: new Date(film.updated_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...filmRoutes];
}
