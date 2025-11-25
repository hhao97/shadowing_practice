'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { Loader2, Youtube, Eye, EyeOff, AlertCircle } from 'lucide-react';

// 登录表单验证 schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, '请输入邮箱')
    .email('邮箱格式不正确'),
  password: z
    .string()
    .min(1, '请输入密码'),
});

// 注册表单验证 schema
const signupSchema = z.object({
  name: z
    .string()
    .min(2, '用户名至少2个字符')
    .max(50, '用户名最多50个字符')
    .regex(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, '用户名只能包含字母、数字、下划线和中文'),
  email: z
    .string()
    .min(1, '请输入邮箱')
    .email('邮箱格式不正确'),
  password: z
    .string()
    .min(8, '密码至少8个字符')
    .max(100, '密码最多100个字符')
    .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
    .regex(/[a-z]/, '密码必须包含至少一个小写字母')
    .regex(/[0-9]/, '密码必须包含至少一个数字'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

// 错误消息映射
const getErrorMessage = (error: any): string => {
  const message = error?.message || error?.toString() || '';

  // Better Auth 错误消息映射
  const errorMap: Record<string, string> = {
    'Password is too short': '密码长度不足，请输入至少8个字符',
    'Invalid email or password': '邮箱或密码错误',
    'User already exists': '该邮箱已被注册',
    'Email already in use': '该邮箱已被注册',
    'Invalid credentials': '邮箱或密码错误',
    'User not found': '用户不存在',
  };

  // 检查是否有匹配的错误消息
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.includes(key)) {
      return value;
    }
  }

  return message || '操作失败，请重试';
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  // 登录表单
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  // 注册表单
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  // 根据当前模式选择使用的表单
  const currentForm = isLogin ? loginForm : signupForm;
  const { handleSubmit, formState: { isSubmitting } } = currentForm;

  // 切换登录/注册模式
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setServerError('');
    setShowPassword(false);
    loginForm.reset();
    signupForm.reset();
  };

  // 表单提交处理
  const onSubmit = async (data: any) => {
    setServerError('');

    try {
      if (isLogin) {
        // 登录
        const result = await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });

        if (result.error) {
          setServerError(getErrorMessage(result.error));
          return;
        }

        router.push('/');
      } else {
        // 注册
        const result = await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: data.name,
        });

        if (result.error) {
          setServerError(getErrorMessage(result.error));
          return;
        }

        router.push('/');
      }
    } catch (err: any) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Youtube className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? '登录' : '注册'} YouTube 影子跟读
          </CardTitle>
          <CardDescription>
            {isLogin ? '使用您的账号登录' : '创建一个新账号开始学习'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 用户名字段（仅注册时显示） */}
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  用户名
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="请输入用户名（2-50个字符）"
                  {...signupForm.register('name')}
                  disabled={isSubmitting}
                  className={signupForm.formState.errors.name ? 'border-destructive' : ''}
                />
                {signupForm.formState.errors.name && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {signupForm.formState.errors.name.message}
                  </p>
                )}
              </div>
            )}

            {/* 邮箱字段 */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                邮箱
              </label>
              <Input
                id="email"
                type="email"
                placeholder="请输入邮箱"
                {...(isLogin ? loginForm.register('email') : signupForm.register('email'))}
                disabled={isSubmitting}
                className={currentForm.formState.errors.email ? 'border-destructive' : ''}
              />
              {currentForm.formState.errors.email && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {currentForm.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* 密码字段 */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                密码
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isLogin ? '请输入密码' : '请输入密码（至少8个字符）'}
                  {...(isLogin ? loginForm.register('password') : signupForm.register('password'))}
                  disabled={isSubmitting}
                  className={currentForm.formState.errors.password ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {currentForm.formState.errors.password && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {currentForm.formState.errors.password.message}
                </p>
              )}
              {!isLogin && !currentForm.formState.errors.password && (
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>密码要求：</p>
                  <ul className="ml-4 list-disc space-y-0.5">
                    <li>至少8个字符</li>
                    <li>包含大写字母、小写字母和数字</li>
                  </ul>
                </div>
              )}
            </div>

            {/* 服务器错误提示 */}
            {serverError && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* 提交按钮 */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? '登录中...' : '注册中...'}
                </>
              ) : (
                <>{isLogin ? '登录' : '注册'}</>
              )}
            </Button>

            {/* 模式切换 */}
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary hover:underline"
                disabled={isSubmitting}
              >
                {isLogin ? '没有账号？立即注册' : '已有账号？立即登录'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
