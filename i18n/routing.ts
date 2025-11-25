import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // 支持的语言列表
  locales: ['zh', 'en'],

  // 默认语言
  defaultLocale: 'zh',

  // URL路径前缀策略
  localePrefix: 'as-needed'
});

// 创建国际化导航函数
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
