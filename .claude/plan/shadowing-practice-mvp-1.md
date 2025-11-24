# 项目任务分解规划 v1.1

> **变更记录**：基于 v1.0，整合用户确认的 4 项决策，新增 3 个任务，更新 8 个任务，总工作量增加 6 小时

---

## 已明确的决策

### 核心技术决策（v1.0）
- **字幕获取方案**：使用 `youtube-transcript` npm 包（无需 API key，实现简单）
- **视频播放器**：使用 `react-player` 库（良好的 React 集成和 YouTube 支持）
- **用户认证**：MVP 阶段暂不实现，专注核心功能
- **技术栈**：Next.js 16 (App Router) + TypeScript + TailwindCSS 4 + shadcn/ui

### 用户确认的功能决策（v1.1 新增）✨
- **字幕语言支持** ✅ 方案 C：支持所有可用语言
  - 添加语言选择 UI（下拉菜单）
  - API 返回可用语言列表
  - 支持动态切换字幕语言

- **重复播放模式** ✅ 方案 A：单句循环
  - 点击字幕条目旁的循环图标
  - 循环播放单条字幕对应的视频片段
  - 简单直观，适合逐句练习

- **主题支持** ✅ 方案 B：支持主题切换
  - 集成 `next-themes` 库
  - 所有组件支持深色/浅色模式
  - 提供主题切换开关

- **数据持久化** ✅ 方案 C：预留后端接口
  - 设计抽象的数据层接口
  - 代码中预留 API 调用位置
  - 便于后续接入 Drizzle ORM + Hono

---

## 整体规划概述

### 项目目标

构建一个最小可行产品（MVP），允许用户：
1. 输入 YouTube 视频 URL 并自动加载字幕（支持多语言）
2. 在视频播放时实时高亮当前字幕
3. 点击字幕条目跳转到对应视频时间点
4. 使用播放、暂停、单句循环等控制功能
5. 切换深色/浅色主题
6. 为未来后端集成预留接口

### 技术栈

**前端框架与库：**
- Next.js 16.0.3 (App Router)
- React 19.2.0
- TypeScript 5.x
- TailwindCSS 4.x

**UI 组件：**
- shadcn/ui（按需安装组件）
- Lucide React（图标库）
- `next-themes`（主题管理）✨

**核心功能库：**
- `react-player`：视频播放器（YouTube 嵌入支持）
- `youtube-transcript`：YouTube 字幕获取
- `react-hook-form`：表单处理
- `zod`：数据验证

**状态管理：**
- React Context API + Hooks（全局状态）
- useState/useEffect（组件本地状态）

### 主要阶段

1. **阶段 1：项目基础设施搭建**（环境配置、依赖安装、基础架构、主题配置）
2. **阶段 2：核心功能开发**（YouTube 字幕获取、视频播放器、字幕同步、数据层抽象）
3. **阶段 3：交互功能实现**（字幕点击跳转、播放控制、主题切换）
4. **阶段 4：UI 优化与测试**（深色模式适配、响应式设计、功能测试）

---

## 详细任务分解

### 阶段 1：项目基础设施搭建

#### 任务 1.1：安装核心依赖包 [已更新] ✨

**目标**：安装项目所需的所有 npm 包

**输入**：当前 `package.json` 配置

**输出**：更新后的 `package.json` 和 `pnpm-lock.yaml`

**需要安装的依赖**：
```bash
# 核心功能库
pnpm add react-player youtube-transcript

# 表单和验证
pnpm add react-hook-form zod @hookform/resolvers

# shadcn/ui 依赖
pnpm add class-variance-authority clsx tailwind-merge
pnpm add lucide-react

# 主题管理 ✨ [新增]
pnpm add next-themes

# 类型定义
pnpm add -D @types/youtube-transcript
```

**涉及文件**：
- `/package.json`
- `/pnpm-lock.yaml`

**验收标准**：
- 所有依赖成功安装
- `pnpm dev` 可正常启动开发服务器
- 无依赖冲突错误

**预估工作量**：15 分钟

---

#### 任务 1.2：配置 shadcn/ui 组件库

**目标**：初始化 shadcn/ui 并安装必要的 UI 组件

**输入**：项目基础配置

**输出**：shadcn/ui 配置文件和组件目录

**操作步骤**：
```bash
# 初始化 shadcn/ui
pnpx shadcn@latest init

# 安装需要的组件
pnpx shadcn@latest add button
pnpx shadcn@latest add input
pnpx shadcn@latest add card
pnpx shadcn@latest add separator
pnpx shadcn@latest add slider
pnpx shadcn@latest add scroll-area
pnpx shadcn@latest add select  # ✨ [新增] 用于语言选择
pnpx shadcn@latest add switch  # ✨ [新增] 用于主题切换
```

**涉及文件**：
- `/components/ui/` (新建目录，包含各个 UI 组件)
- `/lib/utils.ts` (shadcn 工具函数)
- `/components.json` (shadcn 配置文件)

**验收标准**：
- shadcn/ui 配置完成
- 所有组件可正常导入使用
- TailwindCSS 类名正常工作

**预估工作量**：20 分钟

---

#### 任务 1.3：创建项目目录结构

**目标**：建立清晰的项目文件组织结构

**输入**：Next.js 默认项目结构

**输出**：完整的项目目录架构

**目录结构**：
```
/shadowing_practice
├── app/
│   ├── api/                    # API 路由
│   │   └── subtitles/
│   │       ├── route.ts        # 字幕获取 API
│   │       └── languages/      # ✨ [新增] 语言列表 API
│   │           └── route.ts
│   ├── (root)/                 # 路由组
│   │   ├── layout.tsx
│   │   └── page.tsx            # 主页面（视频学习界面）
│   ├── globals.css
│   ├── layout.tsx
│   └── favicon.ico
├── components/
│   ├── ui/                     # shadcn/ui 组件
│   ├── video/                  # 视频相关组件
│   │   ├── VideoPlayer.tsx     # 视频播放器封装
│   │   ├── VideoControls.tsx   # 播放控制面板
│   │   └── VideoUrlInput.tsx   # URL 输入表单（含语言选择）✨
│   ├── subtitle/               # 字幕相关组件
│   │   ├── SubtitlePanel.tsx   # 字幕列表面板
│   │   ├── SubtitleItem.tsx    # 单条字幕条目（含循环按钮）✨
│   │   └── SubtitleTimeline.tsx# 字幕时间轴
│   ├── theme/                  # ✨ [新增] 主题相关组件
│   │   └── ThemeToggle.tsx     # 主题切换按钮
│   └── layout/                 # 布局组件
│       └── AppLayout.tsx       # 主应用布局
├── lib/
│   ├── utils.ts                # 通用工具函数
│   ├── youtube.ts              # YouTube 相关工具
│   ├── time.ts                 # 时间格式化工具
│   └── api/                    # ✨ [新增] 数据层抽象
│       ├── client.ts           # API 客户端封装
│       ├── subtitles.ts        # 字幕 API 接口
│       └── types.ts            # API 类型定义
├── types/
│   ├── video.ts                # 视频相关类型定义
│   └── subtitle.ts             # 字幕相关类型定义
├── hooks/
│   ├── useVideoPlayer.ts       # 视频播放器自定义 Hook
│   ├── useSubtitleSync.ts      # 字幕同步 Hook
│   ├── useVideoUrl.ts          # URL 处理 Hook
│   └── useRepeatMode.ts        # ✨ [新增] 循环播放 Hook
├── contexts/
│   └── VideoContext.tsx        # 视频全局状态 Context
├── constants/
│   └── player.ts               # 播放器相关常量
└── providers/                  # ✨ [新增] 全局 Providers
    └── ThemeProvider.tsx       # 主题 Provider
```

**涉及文件**：创建上述所有目录（暂时空文件或基础模板）

**验收标准**：
- 目录结构清晰合理
- 符合 Next.js App Router 最佳实践
- 便于后续开发和维护

**预估工作量**：10 分钟

---

#### 任务 1.4：定义 TypeScript 类型系统

**目标**：创建完整的类型定义，确保类型安全

**输入**：业务需求分析

**输出**：所有核心数据类型定义

**涉及文件**：
- `/types/subtitle.ts`
- `/types/video.ts`

**`/types/subtitle.ts` 内容**：
```typescript
export interface SubtitleItem {
  text: string;           // 字幕文本
  offset: number;         // 开始时间（秒）
  duration: number;       // 持续时间（秒）
  lang?: string;          // 语言代码 ✨ [扩展]
}

export interface SubtitleData {
  items: SubtitleItem[];
  videoId: string;
  language: string;
  availableLanguages?: string[]; // ✨ [新增] 可用语言列表
}

// ✨ [新增] 语言信息
export interface LanguageInfo {
  code: string;           // 语言代码（如 'en', 'zh-Hans'）
  name: string;           // 语言名称（如 'English', '简体中文'）
}
```

**`/types/video.ts` 内容**：
```typescript
export interface VideoState {
  url: string | null;          // YouTube 视频 URL
  videoId: string | null;      // 提取的视频 ID
  isPlaying: boolean;          // 播放状态
  currentTime: number;         // 当前播放时间（秒）
  duration: number;            // 视频总时长
  playbackRate: number;        // 播放速率
  volume: number;              // 音量 (0-1)
  selectedLanguage: string;    // ✨ [新增] 当前选择的字幕语言
  repeatMode: {                // ✨ [新增] 循环播放状态
    enabled: boolean;
    subtitleIndex: number | null;
  };
}

export interface PlayerControl {
  play: () => void;
  pause: () => void;
  seekTo: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  enableRepeat: (subtitleIndex: number) => void;  // ✨ [新增]
  disableRepeat: () => void;                      // ✨ [新增]
}
```

**验收标准**：
- 所有类型定义完整且准确
- 类型可被其他模块正常导入
- 符合 TypeScript 最佳实践

**预估工作量**：20 分钟

---

#### 任务 1.5：配置主题系统 [新增任务] ✨

**目标**：配置 `next-themes` 并设置深色/浅色模式

**输入**：安装完成的 `next-themes` 依赖

**输出**：全局主题配置和 CSS 变量

**涉及文件**：
- `/providers/ThemeProvider.tsx`（新建）
- `/app/layout.tsx`（更新）
- `/app/globals.css`（更新）

**`/providers/ThemeProvider.tsx` 内容**：
```typescript
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

**更新 `/app/layout.tsx`**：
```typescript
import { ThemeProvider } from '@/providers/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**更新 `/app/globals.css`** - 添加深色模式 CSS 变量：
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* ... 其他浅色主题变量 */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    /* ... 其他深色主题变量 */
  }
}
```

**验收标准**：
- 主题可正常切换（浅色/深色/跟随系统）
- 无闪烁（`suppressHydrationWarning`）
- CSS 变量在两种主题下正确应用
- shadcn/ui 组件自动适配主题

**预估工作量**：30 分钟

---

### 阶段 2：核心功能开发

#### 任务 2.1：实现 YouTube 视频 ID 提取工具

**目标**：从各种格式的 YouTube URL 中提取视频 ID

**输入**：用户输入的 YouTube URL（多种格式）

**输出**：标准化的视频 ID 或错误提示

**涉及文件**：
- `/lib/youtube.ts`

**实现要点**：
```typescript
/**
 * 支持的 URL 格式：
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function extractVideoId(url: string): string | null {
  // 使用正则表达式提取 ID
  // 返回 11 位视频 ID 或 null
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}
```

**验收标准**：
- 能正确识别所有常见 YouTube URL 格式
- 对无效 URL 返回 null
- 包含单元测试覆盖边界情况

**预估工作量**：30 分钟

---

#### 任务 2.2：创建字幕获取 API 路由 [已更新] ✨

**目标**：实现服务端 API 路由，从 YouTube 获取字幕数据，支持多语言

**输入**：视频 ID 和可选的语言参数

**输出**：格式化的字幕数据（JSON）

**涉及文件**：
- `/app/api/subtitles/route.ts`
- `/app/api/subtitles/languages/route.ts` ✨ [新增]

**API 设计**：

**1. 获取字幕数据**
```typescript
// GET /api/subtitles?videoId=xxx&lang=en
// Response:
{
  "success": true,
  "data": {
    "videoId": "xxx",
    "language": "en",
    "items": [
      { "text": "Hello", "offset": 0, "duration": 2.5 },
      ...
    ]
  }
}
```

**2. 获取可用语言列表** ✨ [新增]
```typescript
// GET /api/subtitles/languages?videoId=xxx
// Response:
{
  "success": true,
  "data": {
    "videoId": "xxx",
    "languages": [
      { "code": "en", "name": "English" },
      { "code": "zh-Hans", "name": "Chinese (Simplified)" },
      { "code": "es", "name": "Spanish" }
    ]
  }
}
```

**实现要点**：
- 使用 `youtube-transcript` 库获取字幕
- 支持获取视频所有可用语言列表 ✨
- 错误处理（视频不存在、字幕不可用、语言不支持等）
- 设置适当的 CORS 和缓存头
- 语言代码规范化（ISO 639-1 + 地区代码）

**验收标准**：
- API 可通过 Postman/curl 正常调用
- 返回正确格式的 JSON 数据
- 语言列表准确完整 ✨
- 错误情况有清晰的错误消息
- 响应时间 < 3秒

**预估工作量**：1.5 小时（增加 0.5 小时用于语言列表功能）

---

#### 任务 2.3：开发 VideoContext 全局状态管理

**目标**：创建 Context 管理视频播放状态和字幕数据

**输入**：视频状态和字幕数据

**输出**：全局可访问的状态和更新方法

**涉及文件**：
- `/contexts/VideoContext.tsx`

**Context 设计**：
```typescript
interface VideoContextValue {
  // 状态
  videoState: VideoState;
  subtitles: SubtitleData | null;
  currentSubtitleIndex: number;
  isLoading: boolean;
  error: string | null;
  availableLanguages: LanguageInfo[];  // ✨ [新增]

  // 操作方法
  loadVideo: (url: string) => Promise<void>;
  updatePlaybackState: (updates: Partial<VideoState>) => void;
  setCurrentTime: (time: number) => void;
  changeLanguage: (langCode: string) => Promise<void>;  // ✨ [新增]
  toggleRepeatMode: (subtitleIndex?: number) => void;   // ✨ [新增]

  // 播放器控制引用
  playerRef: React.RefObject<PlayerControl>;
}
```

**实现要点**：
- 使用 `useReducer` 管理复杂状态
- 提供 Provider 组件包裹整个应用
- 实现字幕自动高亮逻辑（根据 currentTime 计算）
- 支持动态切换语言（重新获取字幕） ✨
- 管理循环播放状态 ✨
- 错误边界处理

**验收标准**：
- Context 可在任意子组件中正常使用
- 状态更新触发正确的组件重渲染
- 语言切换流畅无卡顿 ✨
- 循环播放状态正确维护 ✨
- 无不必要的重渲染（使用 useMemo/useCallback 优化）

**预估工作量**：2 小时（增加 0.5 小时用于新增功能）

---

#### 任务 2.4：封装 VideoPlayer 组件

**目标**：基于 react-player 创建可控的视频播放器组件

**输入**：视频 URL 和播放控制函数

**输出**：完整的播放器 UI 组件

**涉及文件**：
- `/components/video/VideoPlayer.tsx`
- `/hooks/useVideoPlayer.ts`

**组件功能**：
```typescript
interface VideoPlayerProps {
  url: string;
  onProgress: (state: { playedSeconds: number }) => void;
  onDuration: (duration: number) => void;
  onReady: () => void;
  onError: (error: any) => void;
}
```

**实现要点**：
- 使用 `react-player` 的 YouTube 播放器
- 向上传递播放进度事件（用于字幕同步）
- 暴露播放控制方法（play/pause/seekTo）
- 响应式尺寸（16:9 宽高比）
- 禁用 YouTube 默认控制栏（使用自定义控制）
- 深色模式下播放器边框适配 ✨

**验收标准**：
- 播放器可正常加载 YouTube 视频
- 播放进度实时更新（至少 100ms 间隔）
- 可通过代码控制播放/暂停/跳转
- 在移动端和桌面端都能正常显示
- 深色模式下视觉效果良好 ✨

**预估工作量**：2 小时

---

#### 任务 2.5：实现字幕同步逻辑

**目标**：根据视频播放时间自动高亮当前字幕

**输入**：当前播放时间和字幕数据

**输出**：当前激活的字幕索引

**涉及文件**：
- `/hooks/useSubtitleSync.ts`

**核心算法**：
```typescript
function findCurrentSubtitleIndex(
  currentTime: number,
  subtitles: SubtitleItem[]
): number {
  return subtitles.findIndex((item) => {
    const start = item.offset;
    const end = item.offset + item.duration;
    return currentTime >= start && currentTime < end;
  });
}
```

**实现要点**：
- 高效的二分查找或顺序查找（视字幕数量决定）
- 处理字幕间隙（无字幕时返回 -1）
- 提供预加载机制（提前 0.2 秒高亮下一条）
- 性能优化（避免每帧重新计算）

**验收标准**：
- 字幕高亮与视频时间精确同步（误差 < 100ms）
- 快进/快退时字幕立即更新
- 无卡顿或性能问题

**预估工作量**：1 小时

---

#### 任务 2.6：设计数据层抽象接口 [新增任务] ✨

**目标**：为未来后端集成预留清晰的接口抽象层

**输入**：当前前端 API 实现

**输出**：抽象的数据层接口和适配器模式实现

**涉及文件**：
- `/lib/api/client.ts`（新建）
- `/lib/api/subtitles.ts`（新建）
- `/lib/api/types.ts`（新建）

**接口设计**：

**`/lib/api/types.ts` - 定义抽象接口**
```typescript
// 数据源抽象接口
export interface ISubtitleDataSource {
  getSubtitles(videoId: string, lang: string): Promise<SubtitleData>;
  getAvailableLanguages(videoId: string): Promise<LanguageInfo[]>;
}

// 前端实现（调用 Next.js API Routes）
export class FrontendSubtitleDataSource implements ISubtitleDataSource {
  async getSubtitles(videoId: string, lang: string): Promise<SubtitleData> {
    const res = await fetch(`/api/subtitles?videoId=${videoId}&lang=${lang}`);
    const data = await res.json();
    return data.data;
  }

  async getAvailableLanguages(videoId: string): Promise<LanguageInfo[]> {
    const res = await fetch(`/api/subtitles/languages?videoId=${videoId}`);
    const data = await res.json();
    return data.data.languages;
  }
}

// 后端实现（未来接入 Drizzle ORM + Hono）
export class BackendSubtitleDataSource implements ISubtitleDataSource {
  constructor(private apiBaseUrl: string) {}

  async getSubtitles(videoId: string, lang: string): Promise<SubtitleData> {
    // TODO: 调用后端 API
    // const res = await fetch(`${this.apiBaseUrl}/subtitles/${videoId}?lang=${lang}`);
    throw new Error('Backend not implemented yet');
  }

  async getAvailableLanguages(videoId: string): Promise<LanguageInfo[]> {
    // TODO: 调用后端 API
    throw new Error('Backend not implemented yet');
  }
}
```

**`/lib/api/client.ts` - 配置数据源**
```typescript
import { FrontendSubtitleDataSource } from './types';

// 当前使用前端数据源
export const subtitleDataSource = new FrontendSubtitleDataSource();

// 未来切换到后端只需修改这一行：
// export const subtitleDataSource = new BackendSubtitleDataSource(process.env.NEXT_PUBLIC_API_URL!);
```

**`/lib/api/subtitles.ts` - 暴露业务方法**
```typescript
import { subtitleDataSource } from './client';

export async function fetchSubtitles(videoId: string, lang: string) {
  return subtitleDataSource.getSubtitles(videoId, lang);
}

export async function fetchAvailableLanguages(videoId: string) {
  return subtitleDataSource.getAvailableLanguages(videoId);
}
```

**使用示例（在 VideoContext 中）**：
```typescript
import { fetchSubtitles, fetchAvailableLanguages } from '@/lib/api/subtitles';

// 加载视频时
const languages = await fetchAvailableLanguages(videoId);
const subtitles = await fetchSubtitles(videoId, selectedLang);
```

**验收标准**：
- 接口定义清晰，符合 SOLID 原则（依赖倒置）
- 前端实现完整可用
- 后端实现预留代码注释
- 切换数据源无需修改业务代码
- 提供详细的集成文档

**预估工作量**：1 小时

---

### 阶段 3：交互功能实现

#### 任务 3.1：开发 VideoUrlInput 表单组件 [已更新] ✨

**目标**：创建 URL 输入表单，验证并加载视频，支持语言选择

**输入**：用户输入的 URL 和选择的语言

**输出**：验证后的视频 ID 和语言代码，触发视频加载

**涉及文件**：
- `/components/video/VideoUrlInput.tsx`

**UI 设计要点**：
- 使用 shadcn/ui 的 `Input`、`Button` 和 `Select` 组件 ✨
- 输入框占位符："请输入 YouTube 视频链接..."
- 语言选择下拉菜单（初始禁用，加载视频后启用） ✨
- 加载按钮：显示 loading 状态
- 错误提示：使用红色文本或 Toast 通知
- 快捷示例链接（可选）

**表单验证**：
```typescript
const formSchema = z.object({
  url: z.string()
    .url("请输入有效的 URL")
    .refine((url) => isValidYouTubeUrl(url), {
      message: "请输入有效的 YouTube 视频链接"
    }),
  language: z.string().optional(), // ✨ [新增]
});
```

**组件布局**：
```
┌────────────────────────────────────────────────────────┐
│  [请输入 YouTube 视频链接...                 ] [语言 ▼] │
│  [加载视频按钮]                                        │
└────────────────────────────────────────────────────────┘
```

**交互逻辑** ✨：
1. 初始状态：语言选择禁用
2. 用户输入 URL 并点击加载 → 获取可用语言列表
3. 语言下拉菜单填充并启用，默认选择第一个语言
4. 加载对应语言的字幕
5. 用户切换语言 → 重新加载新语言的字幕

**验收标准**：
- 表单验证实时生效
- 提交后触发 `loadVideo` 函数
- 语言选择联动正常 ✨
- 错误消息清晰易懂
- 支持回车键提交

**预估工作量**：1.5 小时（增加 0.5 小时用于语言选择功能）

---

#### 任务 3.2：构建 SubtitlePanel 字幕面板 [已更新] ✨

**目标**：显示字幕列表，支持点击跳转和单句循环

**输入**：字幕数据和当前激活索引

**输出**：可滚动的字幕列表 UI

**涉及文件**：
- `/components/subtitle/SubtitlePanel.tsx`
- `/components/subtitle/SubtitleItem.tsx`

**UI 布局**（包含循环按钮）✨：

**字幕面板容器**：
- 使用 shadcn/ui `Card` 组件
- 固定高度（建议 60vh）
- 使用 `ScrollArea` 组件实现虚拟滚动
- 深色模式适配（`bg-card` 自动切换）

**字幕条目设计** ✨：
```
┌──────────────────────────────────────────┐
│ 00:00  Hello, welcome to...      [🔁]   │  ← 当前播放（高亮）
│ 00:03  Today we will discuss...          │
│ 00:07  The main topic is...              │
└──────────────────────────────────────────┘
```

- 每条字幕显示：时间戳 + 文本 + 循环按钮 ✨
- 当前播放字幕：高亮背景色（`bg-primary/10` 浅色模式，`bg-primary/20` 深色模式）
- 循环模式激活：循环按钮高亮（`text-primary`）✨
- 悬停效果：`hover:bg-accent`
- 点击涟漪效果（可选）

**时间戳格式化**：
- 使用 `00:00` 格式
- 灰色小字体显示（`text-muted-foreground`）

**自动滚动**：
- 当前字幕自动滚动到可视区域中心
- 用户手动滚动时暂停自动滚动
- 3 秒后恢复自动滚动

**交互功能** ✨：
```typescript
const handleSubtitleClick = (subtitle: SubtitleItem) => {
  playerRef.current?.seekTo(subtitle.offset);
};

const handleRepeatClick = (subtitleIndex: number) => {
  toggleRepeatMode(subtitleIndex);
};
```

**验收标准**：
- 字幕列表流畅滚动（支持 1000+ 条目）
- 当前字幕视觉上明显区分
- 点击字幕立即跳转到对应时间
- 循环按钮交互正常 ✨
- 深色模式下可读性良好 ✨
- 自动滚动平滑自然

**预估工作量**：2.5 小时（增加 0.5 小时用于循环按钮和深色模式）

---

#### 任务 3.3：实现 VideoControls 播放控制面板 [已更新] ✨

**目标**：提供播放、暂停、进度条、速率调节等控制

**输入**：播放状态和控制函数

**输出**：自定义播放控制 UI

**涉及文件**：
- `/components/video/VideoControls.tsx`

**UI 组件**（深色模式适配）✨：

**布局设计**：
```
[▶️/⏸️] [00:30 / 05:45] [进度条======================>] [1.0x] [🔁 关闭]
```

1. **播放/暂停按钮**：
   - 使用 `Button` 组件（variant="ghost"）
   - 图标：Lucide 的 `Play` / `Pause`
   - 圆形按钮，居中放置
   - 深色模式：`hover:bg-accent` ✨

2. **进度条**：
   - 使用 `Slider` 组件
   - 显示当前时间 / 总时长
   - 支持拖动跳转
   - 深色模式：滑块颜色 `bg-primary` ✨

3. **播放速率选择**：
   - 下拉菜单或按钮组
   - 选项：0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x
   - 当前速率高亮显示

4. **循环播放指示器** ✨：
   - 显示："🔁 关闭" 或 "🔁 单句循环"
   - 激活时高亮（`text-primary`）
   - 点击可快速关闭循环模式

5. **音量控制**（可选）：
   - 使用 `Slider` 组件
   - 静音切换按钮

**功能实现**：
- 空格键切换播放/暂停
- 左右箭头键 ±5 秒跳转
- 上下箭头键调节音量
- Esc 键关闭循环模式 ✨

**验收标准**：
- 所有控制按钮响应灵敏
- 进度条拖动平滑准确
- 键盘快捷键正常工作
- 循环指示器状态准确 ✨
- 深色模式下视觉效果良好 ✨
- 移动端触摸操作友好

**预估工作量**：2.5 小时

---

#### 任务 3.4：实现重复播放功能

**目标**：支持选定字幕段落的循环播放（单句循环）

**输入**：选中的字幕条目

**输出**：循环播放该字幕对应的视频片段

**涉及文件**：
- `/hooks/useRepeatMode.ts`（新建）✨
- `/components/video/VideoControls.tsx`（扩展）

**实现逻辑**：
```typescript
const useRepeatMode = (
  subtitles: SubtitleItem[],
  currentTime: number,
  playerRef: React.RefObject<PlayerControl>
) => {
  const [repeatState, setRepeatState] = useState({
    enabled: false,
    subtitleIndex: null as number | null,
  });

  const enableRepeat = (subtitleIndex: number) => {
    setRepeatState({ enabled: true, subtitleIndex });
  };

  const disableRepeat = () => {
    setRepeatState({ enabled: false, subtitleIndex: null });
  };

  useEffect(() => {
    if (!repeatState.enabled || repeatState.subtitleIndex === null) return;

    const subtitle = subtitles[repeatState.subtitleIndex];
    const startTime = subtitle.offset;
    const endTime = subtitle.offset + subtitle.duration;

    // 监听播放进度，超过结束时间则跳回开始
    if (currentTime >= endTime) {
      playerRef.current?.seekTo(startTime);
    }
  }, [currentTime, repeatState, subtitles, playerRef]);

  return { repeatState, enableRepeat, disableRepeat };
};
```

**UI 交互**：
- 点击字幕条目旁的"🔁"图标启用循环
- 控制面板显示"🔁 单句循环"
- 再次点击或按 Esc 取消循环

**验收标准**：
- 循环播放无明显卡顿
- 可随时取消循环模式
- 视觉上明确显示循环状态
- 切换字幕或视频时自动关闭循环 ✨

**预估工作量**：1 小时

---

#### 任务 3.5：开发主题切换组件 [新增任务] ✨

**目标**：创建主题切换按钮，支持浅色/深色/跟随系统

**输入**：当前主题状态

**输出**：主题切换 UI 组件

**涉及文件**：
- `/components/theme/ThemeToggle.tsx`（新建）

**组件设计**：
```typescript
'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          浅色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          深色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          跟随系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**UI 特点**：
- 使用图标（太阳/月亮）表示当前主题
- 下拉菜单提供三种选项
- 平滑的切换动画
- 响应式设计（移动端友好）

**验收标准**：
- 主题切换立即生效
- 图标动画流畅
- 选中状态正确显示
- 刷新页面后主题保持 ✨

**预估工作量**：30 分钟

---

### 阶段 4：UI 优化与测试

#### 任务 4.1：设计并实现主页面布局 [已更新] ✨

**目标**：整合所有组件，创建美观的整体布局，包含主题切换

**输入**：所有开发完成的组件

**输出**：完整的主页面 UI

**涉及文件**：
- `/app/(root)/page.tsx`
- `/components/layout/AppLayout.tsx`

**布局设计**（包含主题切换按钮）✨：

**桌面端布局（≥1024px）**：
```
┌─────────────────────────────────────────────────────────┐
│  🎥 YouTube 影子跟读练习系统              [☀️/🌙] ←主题  │
├─────────────────────────────────────────────────────────┤
│  [请输入 YouTube 视频链接...    ] [语言▼] [加载视频]    │
├───────────────────────┬─────────────────────────────────┤
│                       │  📝 字幕列表                     │
│   🎬 视频播放器         │  ┌──────────────────────────┐  │
│   (16:9)              │  │ 00:00 Hello...      [🔁] │  │
│                       │  │ 00:03 Welcome...          │  │
│                       │  │ 00:07 Today...            │◄─┤
│                       │  └──────────────────────────┘  │
├───────────────────────┤                                │
│ [▶️] 00:30/05:45 [====│===>] [1.0x] [🔁 关闭]          │
└───────────────────────┴─────────────────────────────────┘
```

**移动端布局（<768px）**：
```
┌─────────────────────────┐
│ 🎥 标题      [☀️/🌙] ←主题│
├─────────────────────────┤
│ [输入框] [语言▼] [加载] │
├─────────────────────────┤
│  🎬 视频播放器           │
├─────────────────────────┤
│ [播放控制栏]             │
├─────────────────────────┤
│  📝 字幕列表（可折叠）   │
└─────────────────────────┘
```

**视觉设计要点** ✨：
- 深色/浅色主题无缝切换
- 字幕面板与视频等高（桌面端）
- 合理的间距和留白（TailwindCSS spacing）
- 流畅的加载状态动画
- 空状态提示（未加载视频时）
- 主题切换按钮位于页面右上角

**深色模式适配清单** ✨：
- ✅ 背景色：`bg-background`
- ✅ 文本色：`text-foreground`
- ✅ 卡片：`bg-card`
- ✅ 边框：`border-border`
- ✅ 按钮：自动适配 shadcn/ui 主题
- ✅ 滚动条：深色模式下样式调整

**验收标准**：
- 桌面和移动端布局美观合理
- 组件间配合协调
- 深色/浅色模式切换流畅 ✨
- 无布局错位或溢出
- 加载/错误状态有友好提示

**预估工作量**：2.5 小时（增加 0.5 小时用于主题适配）

---

#### 任务 4.2：响应式设计优化 [已更新] ✨

**目标**：确保所有屏幕尺寸和主题下的良好体验

**输入**：现有 UI 组件

**输出**：适配多种设备和主题的响应式界面

**测试设备尺寸**：
- 移动端：375px (iPhone SE), 390px (iPhone 12)
- 平板：768px (iPad), 1024px (iPad Pro)
- 桌面：1280px, 1920px

**测试主题** ✨：
- ✅ 浅色模式
- ✅ 深色模式
- ✅ 跟随系统（切换操作系统主题时应自动切换）

**优化要点**：
- 使用 TailwindCSS 响应式前缀（`sm:`, `md:`, `lg:`）
- 字体大小自适应（`text-sm md:text-base`）
- 按钮和交互目标尺寸 ≥44px（触摸友好）
- 视频播放器保持 16:9 比例
- 字幕面板在小屏幕上可折叠
- 深色模式对比度检查（WCAG AA 标准）✨

**深色模式对比度检查清单** ✨：
- ✅ 主文本：对比度 ≥ 7:1
- ✅ 次要文本：对比度 ≥ 4.5:1
- ✅ 交互元素：对比度 ≥ 3:1
- ✅ 高亮背景：易于区分但不刺眼

**涉及文件**：所有组件文件

**验收标准**：
- 在所有测试尺寸下无横向滚动
- 文本可读性良好
- 深色模式下所有元素清晰可见 ✨
- 交互元素易于点击/触摸
- 通过 Chrome DevTools 响应式测试
- 通过 WCAG 对比度测试 ✨

**预估工作量**：2 小时（增加 0.5 小时用于深色模式对比度优化）

---

#### 任务 4.3：错误处理和边界情况 [已更新] ✨

**目标**：处理所有可能的错误和特殊情况

**输入**：各种异常场景

**输出**：友好的错误提示和降级方案

**需要处理的场景**：

1. **字幕不可用**：
   - 提示："该视频暂无字幕，请尝试其他视频"
   - 显示建议（选择有字幕的视频）

2. **特定语言字幕不可用** ✨：
   - 提示："该视频没有 [语言名] 字幕，已为您加载 [默认语言] 字幕"
   - 自动回退到可用的第一个语言

3. **网络错误**：
   - 提示："网络连接失败，请检查网络后重试"
   - 提供"重试"按钮

4. **无效 URL**：
   - 实时表单验证提示
   - 高亮错误输入框

5. **视频加载失败**：
   - 提示："视频加载失败，可能是该视频不可嵌入"
   - 建议复制 URL 在 YouTube 应用中打开

6. **字幕数据为空**：
   - 显示空状态插图
   - 引导用户输入新视频

7. **语言列表获取失败** ✨：
   - 提示："无法获取可用语言列表"
   - 提供默认语言选项（英文）

**错误 UI 组件**：
```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

**涉及文件**：
- `/components/layout/ErrorBoundary.tsx`（新建）
- `/components/ui/ErrorMessage.tsx`（新建）
- 所有 API 和异步操作文件

**验收标准**：
- 所有错误都有清晰提示
- 应用不会因错误而崩溃
- 用户可从错误状态恢复
- 语言切换错误有友好提示 ✨
- 开发环境显示详细错误信息
- 深色模式下错误提示清晰可见 ✨

**预估工作量**：1.5 小时

---

#### 任务 4.4：性能优化

**目标**：提升应用加载速度和运行性能

**输入**：完成的应用代码

**输出**：优化后的高性能应用

**优化清单**：

1. **代码分割**：
   - 使用 `dynamic()` 懒加载 ReactPlayer
   - 路由级代码分割（如果有多个页面）
   - 懒加载 `ThemeToggle` 组件（可选）✨

2. **组件优化**：
   - 使用 `React.memo` 包裹纯组件
   - `useCallback` 和 `useMemo` 优化重复计算
   - 避免不必要的重渲染

3. **字幕渲染优化**：
   - 虚拟列表（react-window 或 自定义）
   - 仅渲染可见字幕条目（±10 条缓冲）

4. **图片和资源优化**：
   - 使用 Next.js `<Image>` 组件
   - 启用 WebP 格式

5. **API 缓存**：
   - 缓存已获取的字幕数据（SessionStorage）✨
   - 缓存语言列表（避免重复请求）✨
   - 避免重复请求相同视频的字幕

6. **主题切换优化** ✨：
   - 使用 CSS 变量（已在任务 1.5 实现）
   - 禁用切换时的过渡动画（`disableTransitionOnChange`）
   - 避免主题切换时的闪烁

**性能指标目标**：
- First Contentful Paint (FCP) < 1.5s
- Time to Interactive (TTI) < 3s
- Lighthouse 性能分数 > 90
- 主题切换延迟 < 50ms ✨

**涉及文件**：所有组件和 API 文件

**验收标准**：
- 通过 Lighthouse 性能测试
- 字幕列表滚动流畅（60fps）
- 视频切换响应快速
- 主题切换无闪烁 ✨
- 内存占用合理（< 150MB）

**预估工作量**：2 小时

---

#### 任务 4.5：功能测试和 Bug 修复 [已更新] ✨

**目标**：全面测试应用功能，修复发现的问题

**输入**：完整的应用功能

**输出**：通过所有测试用例的稳定版本

**测试用例**：

1. **基础功能测试**：
   - ✅ 输入有效 YouTube URL 并加载视频
   - ✅ 视频正常播放和暂停
   - ✅ 字幕实时高亮
   - ✅ 点击字幕跳转到对应时间
   - ✅ 播放速率调节生效
   - ✅ 单句循环模式正常工作 ✨

2. **多语言功能测试** ✨：
   - ✅ 语言列表正确加载
   - ✅ 切换语言后字幕正确更新
   - ✅ 无可用语言时显示友好提示
   - ✅ 语言切换不影响播放状态

3. **主题切换测试** ✨：
   - ✅ 浅色/深色/系统主题正常切换
   - ✅ 刷新页面后主题保持
   - ✅ 所有组件在深色模式下清晰可见
   - ✅ 主题切换无闪烁或卡顿

4. **边界测试**：
   - ✅ 无字幕视频的处理
   - ✅ 超长字幕列表（1000+ 条）
   - ✅ 网络中断后恢复
   - ✅ 连续快速切换视频
   - ✅ 连续快速切换语言 ✨

5. **浏览器兼容性**：
   - Chrome（最新版）
   - Firefox（最新版）
   - Safari（最新版）
   - Edge（最新版）

6. **设备测试**：
   - iPhone（Safari）
   - Android 手机（Chrome）
   - iPad
   - 桌面浏览器

**Bug 修复流程**：
1. 记录 Bug（描述、重现步骤、截图）
2. 优先级排序（Critical > High > Medium > Low）
3. 修复并回归测试
4. 更新测试用例

**涉及文件**：可能涉及任何文件

**验收标准**：
- 所有 Critical 和 High 优先级 Bug 已修复
- 核心功能在所有主流浏览器正常工作
- 多语言和主题切换稳定可靠 ✨
- 无明显 UI 错位或交互问题
- 用户体验流畅自然

**预估工作量**：3.5 小时（增加 0.5 小时用于新增功能测试）

---

## 任务依赖关系图

```
阶段 1（基础设施）
├─ 1.1 安装依赖 → 1.2 配置 shadcn/ui
├─ 1.2 配置 shadcn/ui → 1.3 创建目录结构
├─ 1.3 创建目录结构 → 1.4 定义类型系统
└─ 1.1 + 1.3 → 1.5 配置主题系统 ✨

阶段 2（核心功能）
├─ 1.4 → 2.1 YouTube ID 提取
├─ 2.1 → 2.2 字幕 API（多语言）✨
├─ 1.4 → 2.3 VideoContext
├─ 2.3 → 2.4 VideoPlayer
├─ 2.4 + 2.2 → 2.5 字幕同步
└─ 2.2 → 2.6 数据层抽象接口 ✨

阶段 3（交互功能）
├─ 2.1 + 2.3 + 2.2 → 3.1 URL 输入表单（语言选择）✨
├─ 2.5 → 3.2 字幕面板（循环按钮）✨
├─ 2.4 → 3.3 播放控制（深色模式）✨
├─ 3.3 + 2.5 → 3.4 重复播放
└─ 1.5 → 3.5 主题切换组件 ✨

阶段 4（优化测试）
├─ 3.1 + 3.2 + 3.3 + 3.5 → 4.1 主页面布局（主题）✨
├─ 4.1 → 4.2 响应式优化（深色模式）✨
├─ 4.1 → 4.3 错误处理（多语言）✨
├─ 4.2 + 4.3 → 4.4 性能优化（缓存）✨
└─ 4.4 → 4.5 测试修复（扩展用例）✨
```

---

## 技术风险与应对策略

### 风险 1：YouTube 字幕获取失败

**风险描述**：`youtube-transcript` 库可能无法获取某些视频的字幕（私有视频、地区限制、无字幕）

**影响程度**：高（核心功能）

**应对策略**：
1. 完善的错误提示，引导用户选择有字幕的公开视频
2. 提供测试视频列表（已验证有字幕）
3. 后续考虑备用方案（YouTube Data API、手动上传 SRT 文件）

---

### 风险 2：视频与字幕同步精度

**风险描述**：视频播放时间与字幕高亮可能存在延迟或不准确

**影响程度**：中（用户体验）

**应对策略**：
1. 使用 `react-player` 的 `progressInterval` 设置为 100ms
2. 实现微调功能（允许用户手动调整字幕偏移 ±2 秒）
3. 充分测试不同播放速率下的同步效果

---

### 风险 3：大量字幕导致性能问题

**风险描述**：长视频可能有 1000+ 条字幕，渲染和滚动可能卡顿

**影响程度**：中（性能）

**应对策略**：
1. 使用虚拟滚动技术（react-window）
2. 字幕条目使用 `React.memo` 避免重复渲染
3. 分页或懒加载字幕（仅加载可见区域 ±50 条）

---

### 风险 4：移动端视频嵌入限制

**风险描述**：部分移动浏览器对 YouTube 嵌入播放器有限制

**影响程度**：低（部分用户）

**应对策略**：
1. 检测移动环境，提供降级方案（跳转到 YouTube App）
2. 使用 `react-player` 的 fallback 配置
3. 在移动端优先使用原生播放器 API

---

### 风险 5：多语言字幕获取不稳定 ✨ [新增]

**风险描述**：某些视频的部分语言字幕可能无法获取，或者语言代码不规范

**影响程度**：中（多语言功能）

**应对策略**：
1. 实现语言回退机制（优先级：用户选择 → 英文 → 第一个可用语言）
2. 对 `youtube-transcript` 返回的语言代码进行规范化处理
3. 缓存已成功获取的语言列表，避免重复尝试失败的语言
4. 提供清晰的错误提示："该视频不支持 [语言名] 字幕"

---

### 风险 6：深色模式适配工作量大 ✨ [新增]

**风险描述**：所有组件都需要适配深色模式，可能存在遗漏或对比度不足的情况

**影响程度**：中（用户体验）

**应对策略**：
1. 使用 shadcn/ui 的 CSS 变量系统，统一管理颜色
2. 建立深色模式检查清单，逐个组件验证
3. 使用对比度检查工具（如 Chrome DevTools Contrast Ratio）
4. 在开发过程中频繁切换主题测试
5. 使用 `dark:` 前缀确保所有自定义样式适配深色模式

---

## 开发建议与最佳实践

### 1. Git 提交规范

采用 Conventional Commits 规范：
```
feat(player): 实现视频播放器组件
feat(i18n): 添加多语言字幕支持 ✨
feat(theme): 集成深色模式切换 ✨
fix(subtitle): 修复字幕同步延迟问题
docs(readme): 更新安装说明
style(ui): 调整字幕面板深色模式样式 ✨
refactor(api): 重构字幕获取逻辑为抽象接口 ✨
test(player): 添加播放器单元测试
```

### 2. 代码审查检查点

每个任务完成后自查：
- ✅ TypeScript 类型完整，无 `any`
- ✅ 组件拆分合理，单一职责
- ✅ 错误边界处理完善
- ✅ 性能优化（memo/callback）
- ✅ 深色模式适配完整 ✨
- ✅ 多语言支持测试 ✨
- ✅ 代码注释清晰（复杂逻辑）
- ✅ 命名规范（组件 PascalCase，函数 camelCase）

### 3. 测试策略

虽然 MVP 阶段可暂不写自动化测试，但应：
- 手动测试每个功能点
- 记录测试用例和结果
- 重点测试核心路径（加载视频 → 播放 → 字幕同步 → 点击跳转）
- 多语言切换测试 ✨
- 主题切换测试（浅色/深色/系统）✨

### 4. 性能监控

开发过程中使用：
- React DevTools Profiler（检测重渲染）
- Chrome Performance 面板（检测卡顿）
- Lighthouse（整体性能评分）
- 主题切换性能测试（检测闪烁） ✨

### 5. 深色模式开发建议 ✨

**使用 Tailwind 深色模式前缀**：
```tsx
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-gray-100">文本</p>
</div>
```

**优先使用 shadcn/ui 的语义化 CSS 变量**：
```tsx
<div className="bg-background text-foreground">
  <Card className="bg-card text-card-foreground">
    <Button className="bg-primary text-primary-foreground">
      按钮
    </Button>
  </Card>
</div>
```

**对比度检查**：
- 使用 Chrome DevTools > Elements > Accessibility > Contrast
- 确保文本对比度 ≥ 4.5:1（正文），≥ 3:1（大文本）

---

## 版本变更记录

### v1.1 (当前版本) - 2025-11-23

**新增功能**：
- ✅ 支持所有可用语言的字幕（方案 C）
- ✅ 单句循环播放模式（方案 A）
- ✅ 深色/浅色主题切换（方案 B）
- ✅ 预留后端接口抽象层（方案 C）

**新增任务**（3 个）：
- 任务 1.5：配置主题系统
- 任务 2.6：设计数据层抽象接口
- 任务 3.5：开发主题切换组件

**更新任务**（8 个）：
- 任务 1.1：增加 `next-themes` 依赖
- 任务 2.2：字幕 API 支持多语言
- 任务 3.1：URL 输入表单增加语言选择
- 任务 3.2：字幕面板增加循环按钮
- 任务 3.3：播放控制深色模式适配
- 任务 4.1：主页面布局增加主题切换
- 任务 4.2：响应式设计包含深色模式
- 任务 4.5：测试用例扩展

**工作量变化**：
- v1.0：24 小时 → v1.1：30 小时（+6 小时）

**新增风险**：
- 风险 5：多语言字幕获取不稳定
- 风险 6：深色模式适配工作量大

---

### v1.0 (基础版本) - 2025-11-23

**初始功能**：
- 基础字幕获取（默认英文）
- 视频播放器
- 字幕同步
- 基础播放控制

**总任务数**：18 个
**预估工作量**：24 小时

---

## 总预估工作量

| 阶段 | 任务数 | 预估时间 (v1.0) | 预估时间 (v1.1) | 增加时间 |
|------|--------|-----------------|-----------------|----------|
| 阶段 1：基础设施 | 4 → 5 | 1.5 小时 | 2 小时 | +0.5 小时 |
| 阶段 2：核心功能 | 5 → 6 | 6 小时 | 8 小时 | +2 小时 |
| 阶段 3：交互功能 | 4 → 5 | 6.5 小时 | 8.5 小时 | +2 小时 |
| 阶段 4：优化测试 | 5 | 10 小时 | 11.5 小时 | +1.5 小时 |
| **总计** | **18 → 21** | **24 小时** | **30 小时** | **+6 小时** |

*注：预估时间为理想情况下的开发时间，实际开发建议预留 30% 的缓冲时间（v1.1 约 39-40 小时）*

---

## 下一步行动

### 1. 用户确认 ✅
- ✅ 已整合用户选择的 4 个方案
- ✅ 已更新规划文档为 v1.1

### 2. 启动开发
- 按阶段 1 → 阶段 4 顺序开始开发
- 建议采用敏捷迭代方式，每完成一个阶段进行演示和调整
- 优先实现核心功能，主题和多语言可在后期调整

### 3. 持续跟踪
- 使用 Git 进行版本控制
- 每个任务完成后创建对应的 commit
- 遇到问题及时调整规划
- 定期检查深色模式适配情况 ✨
- 测试多语言切换稳定性 ✨

### 4. 开发建议
- **阶段 1**：先完成基础设施和主题配置，确保后续开发可以直接使用
- **阶段 2**：字幕 API 支持多语言是核心，需要充分测试
- **阶段 3**：语言选择 UI 和主题切换 UI 可以并行开发
- **阶段 4**：预留充足时间进行深色模式适配和测试

---

**文档版本**：v1.1
**创建日期**：2025-11-23
**最后更新**：2025-11-23
**变更内容**：整合用户决策，新增 3 个任务，更新 8 个任务，增加 6 小时工作量