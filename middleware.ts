import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 匹配所有路径，除了以下路径：
  // - api routes
  // - _next (Next.js internals)
  // - _vercel (Vercel internals)
  // - 静态文件 (images, favicon等)
  matcher: ['/', '/(zh|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
