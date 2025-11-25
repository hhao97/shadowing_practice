import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com';

  // 基础页面
  const routes = ['', '/auth'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 添加多语言版本
  const locales = ['zh', 'en'];
  const localizedRoutes = locales.flatMap((locale) =>
    routes.map((route) => ({
      ...route,
      url: locale === 'zh' ? route.url : `${baseUrl}/${locale}${route.url.replace(baseUrl, '')}`,
      alternates: {
        languages: {
          zh: route.url,
          en: `${baseUrl}/en${route.url.replace(baseUrl, '')}`,
        },
      },
    }))
  );

  return localizedRoutes;
}
