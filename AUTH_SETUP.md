# Better Auth + Supabase 集成指南

## ✅ 已完成的步骤

### 1. 依赖安装
```bash
pnpm add better-auth @supabase/supabase-js pg
pnpm add -D @types/pg
```

**注意**：已将数据库驱动从 `postgres` 更新为 `pg`，因为 Better Auth 官方推荐使用 `pg` 库。

### 2. 数据库配置

#### 步骤 1: 获取数据库连接字符串

⚠️ **重要：使用 Session Mode (端口 5432)**

Better Auth 需要使用 **Session Mode** 以支持准备语句等高级功能。

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目: `vmmjfgjdaytetdaywlci`
3. 进入 **Project Settings** → **Database**
4. 找到 **Connection string** 部分
5. 选择 **Session Mode (使用端口 5432)**
6. 复制 **URI** 格式的连接字符串
7. 格式类似: `postgresql://postgres.vmmjfgjdaytetdaywlci:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres`

**端口说明**：
- ✅ **5432** - Session Mode（推荐用于 Better Auth）
- ❌ **6543** - Transaction Mode（不适用于 Better Auth）

#### 步骤 2: 更新 .env.local

⚠️ **当前状态**：DATABASE_URL 仍然是占位符，必须更新！

将上面复制的连接字符串替换 `.env.local` 文件中的 `DATABASE_URL`：
```env
DATABASE_URL=postgresql://postgres.vmmjfgjdaytetdaywlci:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

**安全提示**：
- 替换 `[YOUR-PASSWORD]` 为实际数据库密码
- 不要提交包含密码的 `.env.local` 文件到 Git

#### 步骤 3: 创建数据库表
1. 打开 Supabase Dashboard
2. 进入 **SQL Editor**
3. 点击 **New Query**
4. 复制并粘贴 `supabase-schema.sql` 文件的全部内容
5. 点击 **Run** 执行 SQL

### 3. 已创建的文件

```
shadowing_practice/
├── lib/
│   ├── auth.ts                      # Better Auth 服务端配置
│   └── auth-client.ts               # Better Auth 客户端 hooks
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts         # Auth API 路由处理器
│   └── auth/
│       └── page.tsx                 # 登录注册页面
├── supabase-schema.sql              # 数据库DDL
└── AUTH_SETUP.md                    # 本文档
```

## 📋 TODO: 完成集成

### 1. 更新主页面添加用户状态

修改 `app/page.tsx`，在顶部添加用户信息和登录按钮：

```typescript
'use client';

import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const { data: session, isLoading } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto p-4 md:p-8">
        {/* 用户状态栏 */}
        <div className="mb-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
            ) : session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {session.user.email}
                </span>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                >
                  退出登录
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button>登录</Button>
              </Link>
            )}
          </div>
        </div>

        {/* 其余页面内容 */}
        {/* ... */}
      </div>
    </div>
  );
}
```

### 2. 可选：添加中间件保护路由

创建 `middleware.ts` 文件（可选，如果需要登录才能访问）：

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 从cookie获取session
  const session = request.cookies.get('better-auth.session_token');

  // 如果没有登录且不是auth页面，重定向到登录
  if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // 如果已登录且访问auth页面，重定向到首页
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## 🧪 测试步骤

1. **确保数据库表已创建**
   - 在 Supabase Dashboard 的 Table Editor 中应该能看到 4 个表: `user`, `session`, `account`, `verification`

2. **启动开发服务器**
   ```bash
   pnpm dev
   ```

3. **测试注册**
   - 访问 http://localhost:3001/auth
   - 填写邮箱、密码和用户名
   - 点击"注册"
   - 应该自动跳转到首页并显示用户邮箱

4. **测试登录**
   - 退出登录
   - 再次访问 /auth
   - 使用刚才注册的邮箱和密码登录
   - 应该成功登录并跳转到首页

5. **验证数据库**
   - 在 Supabase Table Editor 中查看 `user` 表
   - 应该能看到新注册的用户记录

## 🔧 配置说明

### Better Auth 配置 (lib/auth.ts)
- 使用 PostgreSQL 适配器连接 Supabase
- 启用邮箱+密码认证
- 禁用邮箱验证（按需求）

### API 路由 (app/api/auth/[...all]/route.ts)
- 处理所有认证相关的 API 请求
- 路径: /api/auth/*

### 客户端 Hooks (lib/auth-client.ts)
- `useSession()` - 获取当前用户会话
- `signIn.email()` - 邮箱登录
- `signUp.email()` - 邮箱注册
- `signOut()` - 退出登录

## ⚠️ 重要提示

1. **DATABASE_URL 必须配置**
   - 没有这个环境变量应用将无法启动
   - 连接字符串需要包含正确的密码

2. **数据库表必须先创建**
   - 运行 supabase-schema.sql 创建必要的表
   - Better Auth 不会自动创建表

3. **端口配置**
   - 当前运行在 3001 端口
   - 如果改变端口，需要更新 .env.local 中的 BETTER_AUTH_URL

## 🎯 下一步

- [ ] 配置 DATABASE_URL
- [ ] 在 Supabase 执行 DDL
- [ ] 更新主页面添加用户状态
- [ ] 测试注册和登录功能
- [ ] 可选：添加中间件保护路由

## 📚 参考文档

- [Better Auth 文档](https://www.better-auth.com)
- [Supabase 文档](https://supabase.com/docs)
- [Next.js 认证指南](https://nextjs.org/docs/authentication)
