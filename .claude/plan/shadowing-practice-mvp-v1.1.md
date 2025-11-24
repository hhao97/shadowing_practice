# 项目任务分解规划 v1.1

> **版本说明**：此文档基于 v1.0 更新，整合了用户确认的 4 个关键决策

## 变更记录（v1.0 → v1.1）

### 新增功能
- ✅ **多语言字幕支持**：从仅英文扩展到所有可用语言
- ✅ **主题切换功能**：集成 `next-themes` 支持深色/浅色模式
- ✅ **数据层抽象**：为后端集成预留接口设计
- ✅ **单句循环播放**：实现点击字幕循环播放功能

### 受影响的任务
- 🔄 **任务 1.1**：依赖包列表增加 `next-themes`
- 🔄 **任务 2.2**：字幕 API 支持语言参数和语言列表获取
- 🔄 **任务 3.1**：URL 输入表单增加语言选择下拉菜单
- 🆕 **任务 1.5**：新增主题系统配置任务
- 🆕 **任务 2.6**：新增数据层抽象接口设计
- 🆕 **任务 3.5**：新增主题切换组件开发
- 🔄 **任务 4.1**：主页面布局增加主题切换入口
- 🔄 **所有 UI 组件**：确保支持深色模式样式

### 工作量变化
- **v1.0 总预估**：24 小时（含 30% 缓冲：31-32 小时）
- **v1.1 总预估**：30 小时（含 30% 缓冲：39-40 小时）
- **增加时间**：约 6 小时（主题适配 + 多语言 UI + 数据层设计）

---

## 已明确的决策

- **字幕获取方案**：使用 `youtube-transcript` npm 包（无需 API key，实现简单）
- **视频播放器**：使用 `react-player` 库（良好的 React 集成和 YouTube 支持）
- **用户认证**：MVP 阶段暂不实现，专注核心功能
- **技术栈**：Next.js 16 (App Router) + TypeScript + TailwindCSS 4 + shadcn/ui
- **字幕语言支持**：✨ **方案 C - 支持所有可用语言**（需添加语言选择 UI）
- **重复播放模式**：✨ **方案 A - 单句循环**（点击字幕循环播放，简单直观）
- **暗色模式支持**：✨ **方案 B - 支持主题切换**（集成 `next-themes`，所有组件适配深色模式）
- **数据持久化策略**：✨ **方案 C - 预留后端接口**（设计清晰的抽象层，便于后续接入 Drizzle ORM + Hono）

---

## 整体规划概述

### 项目目标

构建一个最小可行产品（MVP），允许用户：
1. 输入 YouTube 视频 URL 并自动加载字幕（支持多语言选择）
2. 在视频播放时实时高亮当前字幕
3. 点击字幕条目跳转到对应视频时间点
4. 使用播放、暂停、单句循环播放等控制功能
5. 自由切换深色/浅色主题
6. 预留数据持久化能力（未来可快速接入后端）

### 技术栈

**前端框架与库：**
- Next.js 16.0.3 (App Router)
- React 19.2.0
- TypeScript 5.x
- TailwindCSS 4.x

**UI 组件：**
- shadcn/ui（按需安装组件）
- Lucide React（图标库）
- `next-themes`（主题切换管理）

**核心功能库：**
- `react-player`：视频播放器（YouTube 嵌入支持）
- `youtube-transcript`：YouTube 字幕获取
- `react-hook-form`：表单处理
- `zod`：数据验证

**状态管理：**
- React Context API + Hooks（全局状态）
- useState/useEffect（组件本地状态）

### 主要阶段

1. **阶段 1：项目基础设施搭建**（环境配置、依赖安装、基础架构、主题系统）
2. **阶段 2：核心功能开发**（YouTube 字幕获取、视频播放器、字幕同步、数据层设计）
3. **阶段 3：交互功能实现**（字幕点击跳转、播放控制、主题切换 UI）
4. **阶段 4：UI 优化与测试**（界面美化、深色模式适配、响应式设计、功能测试）

---

## 详细任务分解

### 阶段 1：项目基础设施搭建

#### 任务 1.1：安装核心依赖包 ⚡️ 已更新

**目标**：安装项目所需的所有 npm 包（包含主题系统依赖）

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

# 主题系统（新增）
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
- `next-themes` 版本 ≥ 0.2.0

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
pnpx shadcn@latest add select        # 新增：语言选择下拉菜单
pnpx shadcn@latest add dropdown-menu  # 新增：主题切换菜单
```

**涉及文件**：
- `/components/ui/` (新建目录，包含各个 UI 组件)
- `/lib/utils.ts` (shadcn 工具函数)
- `/components.json` (shadcn 配置文件)

**验收标准**：
- shadcn/ui 配置完成
- 所有组件可正常导入使用
- TailwindCSS 类名正常工作
- 组件样式支持主题变量（CSS 变量）

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
│   │       └── route.ts        # 字幕获取 API（支持多语言）
│   ├── (root)/                 # 路由组
│   │   ├── layout.tsx
│   │   └── page.tsx            # 主页面（视频学习界面）
│   ├── globals.css
│   ├── layout.tsx
│   └── favicon.ico
├── components/
│   ├── ui/                     # shadcn/ui 组件
│   ├── theme/                  # 主题相关组件（新增）
│   │   ├── ThemeProvider.tsx   # 主题上下文提供者
│   │   └── ThemeToggle.tsx     # 主题切换按钮
│   ├── video/                  # 视频相关组件
│   │   ├── VideoPlayer.tsx     # 视频播放器封装
│   │   ├── VideoControls.tsx   # 播放控制面板
│   │   └── VideoUrlInput.tsx   # URL 输入表单（含语言选择）
│   ├── subtitle/               # 字幕相关组件
│   │   ├── SubtitlePanel.tsx   # 字幕列表面板
│   │   ├── SubtitleItem.tsx    # 单条字幕条目（含循环按钮）
│   │   └── SubtitleTimeline.tsx# 字幕时间轴
│   └── layout/                 # 布局组件
│       └── AppLayout.tsx       # 主应用布局
├── lib/
│   ├── utils.ts                # 通用工具函数
│   ├── youtube.ts              # YouTube 相关工具
│   └── time.ts                 # 时间格式化工具
├── services/                   # 数据层服务（新增）
│   ├── subtitle.service.ts     # 字幕数据服务抽象
│   └── video.service.ts        # 视频数据服务抽象
├── types/
│   ├── video.ts                # 视频相关类型定义
│   ├── subtitle.ts             # 字幕相关类型定义（扩展语言支持）
│   └── theme.ts                # 主题相关类型定义（新增）
├── hooks/
│   ├── useVideoPlayer.ts       # 视频播放器自定义 Hook
│   ├── useSubtitleSync.ts      # 字幕同步 Hook
│   ├── useVideoUrl.ts          # URL 处理 Hook
│   └── useRepeatMode.ts        # 单句循环播放 Hook（新增）
├── contexts/
│   └── VideoContext.tsx        # 视频全局状态 Context
└── constants/
    ├── player.ts               # 播放器相关常量
    └── languages.ts            # 支持的语言列表（新增）
```

**涉及文件**：创建上述所有目录（暂时空文件或基础模板）

**验收标准**：
- 目录结构清晰合理
- 符合 Next.js App Router 最佳实践
- 便于后续开发和维护
- 新增目录（theme/、services/）结构合理

**预估工作量**：10 分钟

---

#### 任务 1.4：定义 TypeScript 类型系统

**目标**：创建完整的类型定义，确保类型安全

**输入**：业务需求分析

**输出**：所有核心数据类型定义

**涉及文件**：
- `/types/subtitle.ts`
- `/types/video.ts`
- `/types/theme.ts`（新增）

**`/types/subtitle.ts` 内容**（扩展语言支持）：
```typescript
export interface SubtitleItem {
  text: string;           // 字幕文本
  offset: number;         // 开始时间（秒）
  duration: number;       // 持续时间（秒）
  lang?: string;          // 语言代码
}

export interface SubtitleData {
  items: SubtitleItem[];
  videoId: string;
  language: string;       // 当前字幕语言
  availableLanguages?: string[];  // 新增：可用语言列表
}

// 新增：语言选项类型
export interface LanguageOption {
  code: string;           // ISO 639-1 语言代码（如 'en', 'zh'）
  name: string;           // 语言显示名称（如 'English', '中文'）
}
```

**`/types/video.ts` 内容**（扩展重复播放模式）：
```typescript
export interface VideoState {
  url: string | null;          // YouTube 视频 URL
  videoId: string | null;      // 提取的视频 ID
  isPlaying: boolean;          // 播放状态
  currentTime: number;         // 当前播放时间（秒）
  duration: number;            // 视频总时长
  playbackRate: number;        // 播放速率
  volume: number;              // 音量 (0-1)
  repeatMode: RepeatMode | null; // 新增：重复播放模式
}

// 新增：重复播放模式类型
export interface RepeatMode {
  type: 'single-subtitle';     // 单句循环
  subtitleIndex: number;       // 循环的字幕索引
  startTime: number;           // 循环起始时间
  endTime: number;             // 循环结束时间
}

export interface PlayerControl {
  play: () => void;
  pause: () => void;
  seekTo: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  enableRepeat: (subtitleIndex: number) => void;  // 新增
  disableRepeat: () => void;                      // 新增
}
```

**`/types/theme.ts` 内容**（新增）：
```typescript
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}
```

**验收标准**：
- 所有类型定义完整且准确
- 类型可被其他模块正常导入
- 符合 TypeScript 最佳实践
- 新增类型覆盖多语言和主题功能

**预估工作量**：25 分钟（从 20 分钟增加）

---

#### 任务 1.5：配置主题系统 🆕 新增任务

**目标**：集成 `next-themes` 并配置 TailwindCSS 支持深色模式

**输入**：已安装的 `next-themes` 依赖

**输出**：完整的主题系统配置

**涉及文件**：
- `/app/layout.tsx`
- `/components/theme/ThemeProvider.tsx`
- `/tailwind.config.ts`
- `/app/globals.css`

**`/components/theme/ThemeProvider.tsx` 实现**：
```typescript
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
```

**`/app/layout.tsx` 集成**：
```typescript
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

**`/tailwind.config.ts` 配置深色模式**：
```typescript
module.exports = {
  darkMode: ["class"],  // 使用 class 策略
  // ... 其他配置
};
```

**`/app/globals.css` 主题颜色变量**：
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... 其他浅色主题变量 */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... 其他深色主题变量 */
  }
}
```

**验收标准**：
- 主题切换功能正常工作
- 页面无闪烁（`suppressHydrationWarning` 生效）
- TailwindCSS 的 `dark:` 前缀正常工作
- 支持系统主题自动跟随

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

#### 任务 2.2：创建字幕获取 API 路由 ⚡️ 已更新

**目标**：实现服务端 API 路由，从 YouTube 获取字幕数据（支持多语言）

**输入**：视频 ID 和可选的语言参数

**输出**：格式化的字幕数据（JSON）+ 可用语言列表

**涉及文件**：
- `/app/api/subtitles/route.ts`

**API 设计**（扩展语言支持）：
```typescript
// GET /api/subtitles?videoId=xxx&lang=en
// Response:
{
  "success": true,
  "data": {
    "videoId": "xxx",
    "language": "en",
    "availableLanguages": [        // 新增：该视频可用的语言列表
      { "code": "en", "name": "English" },
      { "code": "zh", "name": "中文（简体）" },
      { "code": "es", "name": "Español" }
    ],
    "items": [
      { "text": "Hello", "offset": 0, "duration": 2.5 },
      ...
    ]
  }
}

// GET /api/subtitles/languages?videoId=xxx
// 新增：获取可用语言列表的专用端点
{
  "success": true,
  "data": {
    "languages": [
      { "code": "en", "name": "English" },
      { "code": "zh", "name": "中文（简体）" }
    ]
  }
}
```

**实现要点**：
- 使用 `youtube-transcript` 库获取字幕
- **新增**：调用 `listLanguages(videoId)` 获取可用语言列表
- 支持通过 `lang` 参数指定字幕语言
- 默认语言优先级：用户指定 → 英文 → 第一个可用语言
- 错误处理（视频不存在、字幕不可用等）
- 设置适当的 CORS 和缓存头

**错误处理扩展**：
```typescript
// 字幕不可用
{ "success": false, "error": "NO_SUBTITLES", "message": "该视频没有可用的字幕" }

// 指定语言不存在
{
  "success": false,
  "error": "LANGUAGE_NOT_AVAILABLE",
  "message": "该视频不支持语言 'fr'",
  "availableLanguages": [...]  // 返回可用语言供选择
}
```

**验收标准**：
- API 可通过 Postman/curl 正常调用
- 返回正确格式的 JSON 数据
- 正确返回可用语言列表
- 支持动态语言切换
- 错误情况有清晰的错误消息
- 响应时间 < 3秒

**预估工作量**：1.5 小时（从 1 小时增加）

---

#### 任务 2.3：开发 VideoContext 全局状态管理

**目标**：创建 Context 管理视频播放状态和字幕数据

**输入**：视频状态和字幕数据

**输出**：全局可访问的状态和更新方法

**涉及文件**：
- `/contexts/VideoContext.tsx`

**Context 设计**（扩展重复播放状态）：
```typescript
interface VideoContextValue {
  // 状态
  videoState: VideoState;
  subtitles: SubtitleData | null;
  currentSubtitleIndex: number;
  isLoading: boolean;
  error: string | null;

  // 操作方法
  loadVideo: (url: string, language?: string) => Promise<void>;  // 新增 language 参数
  updatePlaybackState: (updates: Partial<VideoState>) => void;
  setCurrentTime: (time: number) => void;
  switchLanguage: (languageCode: string) => Promise<void>;  // 新增：切换字幕语言

  // 播放器控制引用
  playerRef: React.RefObject<PlayerControl>;
}
```

**实现要点**：
- 使用 `useReducer` 管理复杂状态
- 提供 Provider 组件包裹整个应用
- 实现字幕自动高亮逻辑（根据 currentTime 计算）
- **新增**：实现语言切换逻辑（重新获取字幕）
- 错误边界处理

**验收标准**：
- Context 可在任意子组件中正常使用
- 状态更新触发正确的组件重渲染
- 无不必要的重渲染（使用 useMemo/useCallback 优化）
- 语言切换流畅无卡顿

**预估工作量**：1.5 小时

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
- **深色模式适配**：播放器边框和背景颜色跟随主题

**验收标准**：
- 播放器可正常加载 YouTube 视频
- 播放进度实时更新（至少 100ms 间隔）
- 可通过代码控制播放/暂停/跳转
- 在移动端和桌面端都能正常显示
- 深色模式下视觉效果良好

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

#### 任务 2.6：设计数据层抽象接口 🆕 新增任务

**目标**：为后端集成预留清晰的接口抽象层

**输入**：业务需求分析

**输出**：数据服务接口定义和前端模拟实现

**涉及文件**：
- `/services/subtitle.service.ts`
- `/services/video.service.ts`

**`/services/subtitle.service.ts` 接口设计**：
```typescript
/**
 * 字幕数据服务接口
 * 当前实现：调用前端 API 路由
 * 未来扩展：直接调用后端 Hono API
 */
export interface ISubtitleService {
  /**
   * 获取视频字幕
   * @param videoId - YouTube 视频 ID
   * @param language - 语言代码（可选）
   */
  getSubtitles(videoId: string, language?: string): Promise<SubtitleData>;

  /**
   * 获取视频可用语言列表
   * @param videoId - YouTube 视频 ID
   */
  getAvailableLanguages(videoId: string): Promise<LanguageOption[]>;
}

/**
 * 前端实现（调用 /api/subtitles）
 */
export class FrontendSubtitleService implements ISubtitleService {
  async getSubtitles(videoId: string, language?: string): Promise<SubtitleData> {
    const params = new URLSearchParams({ videoId });
    if (language) params.set('lang', language);

    const response = await fetch(`/api/subtitles?${params}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  }

  async getAvailableLanguages(videoId: string): Promise<LanguageOption[]> {
    const response = await fetch(`/api/subtitles/languages?videoId=${videoId}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data.languages;
  }
}

/**
 * 服务实例（后续可替换为后端实现）
 */
export const subtitleService: ISubtitleService = new FrontendSubtitleService();

/**
 * 🔮 未来后端实现示例（Drizzle ORM + Hono）
 */
// export class BackendSubtitleService implements ISubtitleService {
//   async getSubtitles(videoId: string, language?: string): Promise<SubtitleData> {
//     // 调用后端 Hono API: POST https://api.example.com/subtitles
//     const response = await fetch('https://api.example.com/subtitles', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ videoId, language })
//     });
//     return response.json();
//   }
// }
```

**`/services/video.service.ts` 接口设计**：
```typescript
/**
 * 视频数据服务接口（为未来持久化预留）
 */
export interface IVideoService {
  /**
   * 保存用户观看历史（未来实现）
   */
  saveWatchHistory?(videoId: string, currentTime: number): Promise<void>;

  /**
   * 获取观看历史（未来实现）
   */
  getWatchHistory?(videoId: string): Promise<{ currentTime: number } | null>;

  /**
   * 保存用户设置（未来实现）
   */
  saveUserSettings?(settings: UserSettings): Promise<void>;
}

/**
 * 前端模拟实现（使用 LocalStorage）
 */
export class LocalStorageVideoService implements IVideoService {
  async saveWatchHistory(videoId: string, currentTime: number): Promise<void> {
    localStorage.setItem(`video_${videoId}_progress`, String(currentTime));
  }

  async getWatchHistory(videoId: string): Promise<{ currentTime: number } | null> {
    const progress = localStorage.getItem(`video_${videoId}_progress`);
    return progress ? { currentTime: Number(progress) } : null;
  }
}

export const videoService: IVideoService = new LocalStorageVideoService();
```

**设计原则**：
- 使用接口（Interface）定义契约
- 当前实现和未来实现分离
- 便于通过依赖注入切换实现
- 保持 API 调用位置清晰可追溯

**验收标准**：
- 接口定义清晰完整
- 前端实现可正常工作
- 代码中包含未来扩展的注释示例
- 易于后续替换为后端实现（仅需修改服务实例化代码）

**预估工作量**：1 小时

---

### 阶段 3：交互功能实现

#### 任务 3.1：开发 VideoUrlInput 表单组件 ⚡️ 已更新

**目标**：创建 URL 输入表单，验证并加载视频（包含语言选择）

**输入**：用户输入的 URL 和语言选择

**输出**：验证后的视频 ID，触发视频加载

**涉及文件**：
- `/components/video/VideoUrlInput.tsx`
- `/constants/languages.ts`（新增）

**UI 设计要点**（扩展语言选择）：
- 使用 shadcn/ui 的 `Input`、`Button` 和 `Select` 组件
- 输入框占位符："请输入 YouTube 视频链接..."
- **新增**：语言选择下拉菜单（shadcn/ui `Select`）
  - 初始状态：自动检测（显示"自动"）
  - 加载视频后：动态填充可用语言列表
  - 切换语言后：重新加载字幕
- 加载按钮：显示 loading 状态
- 错误提示：使用红色文本或 Toast 通知
- 快捷示例链接（可选）

**`/constants/languages.ts` 常用语言列表**：
```typescript
export const COMMON_LANGUAGES: LanguageOption[] = [
  { code: 'auto', name: '自动检测' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文（简体）' },
  { code: 'zh-Hant', name: '中文（繁体）' },
  { code: 'es', name: 'Español' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ru', name: 'Русский' },
];
```

**组件布局**：
```tsx
<form className="flex flex-col gap-4 sm:flex-row">
  <Input
    placeholder="请输入 YouTube 视频链接..."
    className="flex-1"
  />
  <Select
    defaultValue="auto"
    className="w-full sm:w-40"
  >
    {/* 语言选项 */}
  </Select>
  <Button type="submit" disabled={isLoading}>
    {isLoading ? '加载中...' : '加载视频'}
  </Button>
</form>
```

**表单验证**：
```typescript
const formSchema = z.object({
  url: z.string()
    .url("请输入有效的 URL")
    .refine((url) => isValidYouTubeUrl(url), {
      message: "请输入有效的 YouTube 视频链接"
    }),
  language: z.string().optional()  // 新增
});
```

**深色模式适配**：
- Input 边框颜色：`border-input dark:border-gray-700`
- Select 下拉菜单背景：`bg-background dark:bg-gray-800`
- Button 悬停效果：`hover:bg-primary/90 dark:hover:bg-primary/80`

**验收标准**：
- 表单验证实时生效
- 提交后触发 `loadVideo` 函数（包含语言参数）
- 语言切换流畅，UI 反馈清晰
- 错误消息清晰易懂
- 支持回车键提交
- 深色模式下视觉效果良好

**预估工作量**：1.5 小时（从 1 小时增加）

---

#### 任务 3.2：构建 SubtitlePanel 字幕面板 ⚡️ 已更新

**目标**：显示字幕列表，支持点击跳转和单句循环

**输入**：字幕数据和当前激活索引

**输出**：可滚动的字幕列表 UI（含循环按钮）

**涉及文件**：
- `/components/subtitle/SubtitlePanel.tsx`
- `/components/subtitle/SubtitleItem.tsx`

**UI 布局**（扩展单句循环功能）：
根据专业 UI/UX 设计原则，字幕面板应包含：

1. **面板容器**：
   - 使用 shadcn/ui `Card` 组件
   - 固定高度（建议 60vh）
   - 使用 `ScrollArea` 组件实现虚拟滚动
   - **深色模式**：`bg-card dark:bg-gray-900 border-border dark:border-gray-700`

2. **字幕条目设计**（扩展循环按钮）：
   - 每条字幕显示：时间戳 + 文本 + 循环图标
   - 布局：`[00:00] 字幕文本...  [🔁]`
   - 当前播放字幕：高亮背景色（`bg-primary/10 dark:bg-primary/20`）
   - 悬停效果：`hover:bg-accent dark:hover:bg-gray-800`
   - **新增**：循环模式激活状态（`border-l-4 border-primary`）
   - 点击涟漪效果（可选）

3. **循环图标设计**：
   - 默认状态：`<Repeat className="opacity-50" />`
   - 悬停状态：`opacity-100`
   - 激活状态：`text-primary animate-spin-slow`（旋转动画提示）
   - 位置：字幕条目右侧

4. **时间戳格式化**：
   - 使用 `00:00` 或 `00:00.0` 格式
   - 灰色小字体显示
   - 深色模式：`text-muted-foreground dark:text-gray-500`

5. **自动滚动**：
   - 当前字幕自动滚动到可视区域中心
   - 用户手动滚动时暂停自动滚动
   - 3 秒后恢复自动滚动

**交互功能**（扩展单句循环）：
```typescript
const handleSubtitleClick = (subtitle: SubtitleItem) => {
  playerRef.current?.seekTo(subtitle.offset);
};

// 新增：单句循环
const handleRepeatClick = (index: number, e: React.MouseEvent) => {
  e.stopPropagation();  // 阻止冒泡到字幕点击事件

  if (repeatMode?.subtitleIndex === index) {
    // 已激活循环，点击取消
    playerRef.current?.disableRepeat();
  } else {
    // 激活循环
    playerRef.current?.enableRepeat(index);
  }
};
```

**深色模式完整适配**：
```tsx
<Card className="h-[60vh] bg-card dark:bg-gray-900 border-border dark:border-gray-700">
  <ScrollArea className="h-full">
    {subtitles.map((subtitle, index) => (
      <SubtitleItem
        key={index}
        subtitle={subtitle}
        isActive={index === currentSubtitleIndex}
        isRepeating={repeatMode?.subtitleIndex === index}
        onClick={() => handleSubtitleClick(subtitle)}
        onRepeatClick={(e) => handleRepeatClick(index, e)}
        className={cn(
          "hover:bg-accent dark:hover:bg-gray-800",
          isActive && "bg-primary/10 dark:bg-primary/20",
          isRepeating && "border-l-4 border-primary"
        )}
      />
    ))}
  </ScrollArea>
</Card>
```

**验收标准**：
- 字幕列表流畅滚动（支持 1000+ 条目）
- 当前字幕视觉上明显区分
- 点击字幕立即跳转到对应时间
- 循环图标点击响应准确（不触发字幕跳转）
- 循环状态视觉反馈清晰
- 自动滚动平滑自然
- 深色模式下所有元素清晰可见

**预估工作量**：2.5 小时（从 2 小时增加）

---

#### 任务 3.3：实现 VideoControls 播放控制面板 ⚡️ 已更新

**目标**：提供播放、暂停、进度条、速率调节等控制

**输入**：播放状态和控制函数

**输出**：自定义播放控制 UI

**涉及文件**：
- `/components/video/VideoControls.tsx`

**UI 组件**（深色模式适配）：
基于 shadcn/ui 组件库，控制面板应包含：

1. **播放/暂停按钮**：
   - 使用 `Button` 组件（`variant="ghost"`）
   - 图标：Lucide 的 `Play` / `Pause`
   - 圆形按钮，居中放置
   - 深色模式：`hover:bg-gray-800`

2. **进度条**：
   - 使用 `Slider` 组件
   - 显示当前时间 / 总时长
   - 支持拖动跳转
   - 深色模式：轨道颜色 `bg-gray-700`，滑块 `bg-primary`

3. **播放速率选择**：
   - 下拉菜单或按钮组
   - 选项：0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x
   - 当前速率高亮显示
   - 深色模式：菜单背景 `dark:bg-gray-800`

4. **重复播放按钮**：
   - 图标：`Repeat`
   - 激活状态：`text-primary`
   - 未激活状态：`text-muted-foreground dark:text-gray-500`
   - 工具提示："单句循环播放"

5. **音量控制**（可选）：
   - 使用 `Slider` 组件
   - 静音切换按钮
   - 深色模式：图标颜色 `dark:text-gray-400`

**布局设计**（深色模式适配）：
```tsx
<div className="flex items-center gap-4 p-4 bg-card dark:bg-gray-900 border-t dark:border-gray-700">
  <Button variant="ghost" size="icon">
    {isPlaying ? <Pause /> : <Play />}
  </Button>

  <span className="text-sm text-muted-foreground dark:text-gray-400">
    {formatTime(currentTime)} / {formatTime(duration)}
  </span>

  <Slider
    value={[currentTime]}
    max={duration}
    className="flex-1 dark:[&>span]:bg-gray-700"
  />

  <Select value={playbackRate}>
    {/* 速率选项 */}
  </Select>

  <Button
    variant="ghost"
    size="icon"
    className={cn(repeatMode && "text-primary")}
  >
    <Repeat />
  </Button>
</div>
```

**功能实现**：
- 空格键切换播放/暂停
- 左右箭头键 ±5 秒跳转
- 上下箭头键调节音量

**深色模式完整适配清单**：
- ✅ 控制面板背景：`bg-card dark:bg-gray-900`
- ✅ 边框颜色：`border-border dark:border-gray-700`
- ✅ 文本颜色：`text-foreground dark:text-gray-200`
- ✅ 次要文本：`text-muted-foreground dark:text-gray-400`
- ✅ 按钮悬停：`hover:bg-accent dark:hover:bg-gray-800`
- ✅ Slider 轨道：`dark:[&>span]:bg-gray-700`

**验收标准**：
- 所有控制按钮响应灵敏
- 进度条拖动平滑准确
- 键盘快捷键正常工作
- 移动端触摸操作友好
- 深色模式下所有元素清晰可见，对比度良好

**预估工作量**：2.5 小时

---

#### 任务 3.4：实现重复播放功能

**目标**：支持选定字幕段落的循环播放

**输入**：选中的字幕条目

**输出**：循环播放该字幕对应的视频片段

**涉及文件**：
- `/hooks/useRepeatMode.ts`（新增）
- `/hooks/useVideoPlayer.ts`（扩展）
- `/components/video/VideoControls.tsx`（扩展）

**实现逻辑**：
```typescript
const enableRepeatMode = (subtitleIndex: number) => {
  const subtitle = subtitles[subtitleIndex];
  const startTime = subtitle.offset;
  const endTime = subtitle.offset + subtitle.duration;

  // 监听播放进度，超过结束时间则跳回开始
  onProgress((state) => {
    if (state.playedSeconds >= endTime) {
      seekTo(startTime);
    }
  });
};
```

**UI 交互**：
- 点击字幕条目旁的"重复"图标
- 控制面板显示重复模式指示器
- 再次点击取消重复

**验收标准**：
- 循环播放无明显卡顿
- 可随时取消重复模式
- 视觉上明确显示重复状态

**预估工作量**：1 小时

---

#### 任务 3.5：开发主题切换组件 🆕 新增任务

**目标**：创建主题切换 UI 组件，支持浅色/深色/系统模式

**输入**：当前主题状态

**输出**：主题切换按钮或菜单

**涉及文件**：
- `/components/theme/ThemeToggle.tsx`

**UI 设计方案**（推荐下拉菜单）：
```tsx
"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <DropdownMenuContent align="end" className="dark:bg-gray-800">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="dark:hover:bg-gray-700"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>浅色</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="dark:hover:bg-gray-700"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>深色</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="dark:hover:bg-gray-700"
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>跟随系统</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**替代方案（简单切换按钮）**：
```tsx
export function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

**动画效果**：
- 图标切换使用 CSS `transition-all` 动画
- 图标旋转效果（`rotate-0` → `rotate-90`）
- 缩放效果（`scale-100` ↔ `scale-0`）

**验收标准**：
- 点击后主题立即切换
- 图标动画流畅自然
- 下拉菜单在深色模式下清晰可见
- 选中状态有视觉反馈（可选）
- 支持键盘导航（无障碍）

**预估工作量**：30 分钟

---

### 阶段 4：UI 优化与测试

#### 任务 4.1：设计并实现主页面布局 ⚡️ 已更新

**目标**：整合所有组件，创建美观的整体布局（包含主题切换入口）

**输入**：所有开发完成的组件

**输出**：完整的主页面 UI

**涉及文件**：
- `/app/(root)/page.tsx`
- `/components/layout/AppLayout.tsx`

**布局设计**（扩展主题切换按钮）：

**桌面端布局（≥1024px）**：
```
┌─────────────────────────────────────────────────────┐
│  🎥 YouTube 影子跟读练习系统          [语言] [🌓]     │
├─────────────────────────────────────────────────────┤
│  [请输入 YouTube 视频链接...  ] [语言选择▼] [加载]   │
├───────────────────────┬─────────────────────────────┤
│                       │  📝 字幕列表                  │
│   🎬 视频播放器         │  ┌─────────────────────┐   │
│   (16:9)              │  │ 00:00 Hello...  🔁  │   │
│                       │  │ 00:03 Welcome...🔁  │   │
│                       │  │ 00:07 Today...  🔁  │◄──┤
│                       │  └─────────────────────┘   │
├───────────────────────┤                            │
│ [▶️] 00:30/05:45 [====│===>] [1.0x] [🔁]           │
└───────────────────────┴─────────────────────────────┘
```

**移动端布局（<768px）**：
```
┌─────────────────┐
│ [输入框] [语言▼] │
│ [加载]     [🌓] │
├─────────────────┤
│  🎬 视频播放器   │
├─────────────────┤
│ [播放控制栏]     │
├─────────────────┤
│  📝 字幕列表     │
│  (可折叠)       │
└─────────────────┘
```

**视觉设计要点**（深色模式适配）：
- 使用 TailwindCSS 深色/浅色主题
- **新增**：顶部导航栏右上角放置主题切换按钮
- **新增**：语言选择下拉菜单与 URL 输入框在同一行
- 字幕面板与视频等高（桌面端）
- 合理的间距和留白
- 流畅的加载状态动画
- 空状态提示（未加载视频时）
- **深色模式**：
  - 背景：`bg-background dark:bg-gray-950`
  - 卡片：`bg-card dark:bg-gray-900`
  - 边框：`border-border dark:border-gray-800`

**`/components/layout/AppLayout.tsx` 实现**：
```tsx
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      <header className="border-b border-border dark:border-gray-800">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-foreground dark:text-gray-100">
            🎥 YouTube 影子跟读练习系统
          </h1>
          <div className="flex items-center gap-2">
            {/* 语言选择器（全局） */}
            <LanguageSelector />
            {/* 主题切换按钮 */}
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}
```

**验收标准**：
- 桌面和移动端布局美观合理
- 组件间配合协调
- 无布局错位或溢出
- 加载/错误状态有友好提示
- 主题切换按钮位置显眼且易于访问
- 深色模式下整体视觉一致性良好

**预估工作量**：2.5 小时（从 2 小时增加）

---

#### 任务 4.2：响应式设计优化 ⚡️ 已更新

**目标**：确保所有屏幕尺寸下的良好体验（包含深色模式适配）

**输入**：现有 UI 组件

**输出**：适配多种设备和主题的响应式界面

**测试设备尺寸**：
- 移动端：375px (iPhone SE), 390px (iPhone 12)
- 平板：768px (iPad), 1024px (iPad Pro)
- 桌面：1280px, 1920px

**优化要点**：
- 使用 TailwindCSS 响应式前缀（`sm:`, `md:`, `lg:`）
- 字体大小自适应（`text-sm md:text-base`）
- 按钮和交互目标尺寸 ≥44px（触摸友好）
- 视频播放器保持 16:9 比例
- 字幕面板在小屏幕上可折叠
- **深色模式响应式适配**：
  - 确保所有断点下深色模式样式正确
  - 移动端深色模式对比度更高（更好的阅读体验）

**深色模式对比度检查清单**：
- ✅ 文本与背景对比度 ≥ 4.5:1（WCAG AA 标准）
- ✅ 按钮与背景对比度 ≥ 3:1
- ✅ 边框可见性良好（不过于微弱）
- ✅ 高亮状态清晰可辨

**涉及文件**：所有组件文件

**验收标准**：
- 在所有测试尺寸下无横向滚动
- 文本可读性良好（浅色和深色模式）
- 交互元素易于点击/触摸
- 通过 Chrome DevTools 响应式测试
- 深色模式在所有断点下正常工作
- 通过 WCAG AA 对比度检查

**预估工作量**：2 小时（从 1.5 小时增加）

---

#### 任务 4.3：错误处理和边界情况 ⚡️ 已更新

**目标**：处理所有可能的错误和特殊情况（包含语言相关错误）

**输入**：各种异常场景

**输出**：友好的错误提示和降级方案

**需要处理的场景**（扩展多语言错误）：

1. **字幕不可用**：
   - 提示："该视频暂无字幕，请尝试其他视频"
   - 显示建议（选择有字幕的视频）

2. **指定语言字幕不可用（新增）**：
   - 提示："该视频不支持 {语言名称} 字幕"
   - 显示可用语言列表供用户选择
   - 自动降级到英文或第一个可用语言

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

7. **主题切换失败（新增）**：
   - 降级到默认浅色主题
   - 控制台记录错误信息

**错误 UI 组件**（深色模式适配）：
```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>

// 错误提示组件
<Alert variant="destructive" className="dark:bg-red-950 dark:border-red-800">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>错误</AlertTitle>
  <AlertDescription className="dark:text-red-200">
    {errorMessage}
  </AlertDescription>
</Alert>
```

**涉及文件**：
- `/components/layout/ErrorBoundary.tsx`（新建）
- `/components/ui/ErrorMessage.tsx`（新建）
- 所有 API 和异步操作文件

**验收标准**：
- 所有错误都有清晰提示
- 应用不会因错误而崩溃
- 用户可从错误状态恢复
- 开发环境显示详细错误信息
- 语言切换错误有降级方案
- 错误提示在深色模式下清晰可见

**预估工作量**：2 小时（从 1.5 小时增加）

---

#### 任务 4.4：性能优化

**目标**：提升应用加载速度和运行性能

**输入**：完成的应用代码

**输出**：优化后的高性能应用

**优化清单**：

1. **代码分割**：
   - 使用 `dynamic()` 懒加载 ReactPlayer
   - 路由级代码分割（如果有多个页面）

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
   - 缓存已获取的字幕数据（SessionStorage）
   - 避免重复请求相同视频的字幕

6. **主题切换优化（新增）**：
   - 使用 CSS 变量而非 JavaScript 重渲染
   - 避免主题切换时的闪烁（`suppressHydrationWarning`）

**性能指标目标**：
- First Contentful Paint (FCP) < 1.5s
- Time to Interactive (TTI) < 3s
- Lighthouse 性能分数 > 90
- 主题切换响应时间 < 100ms

**涉及文件**：所有组件和 API 文件

**验收标准**：
- 通过 Lighthouse 性能测试
- 字幕列表滚动流畅（60fps）
- 视频切换响应快速
- 内存占用合理（< 150MB）
- 主题切换无闪烁或卡顿

**预估工作量**：2 小时

---

#### 任务 4.5：功能测试和 Bug 修复 ⚡️ 已更新

**目标**：全面测试应用功能，修复发现的问题（包含新增功能）

**输入**：完整的应用功能

**输出**：通过所有测试用例的稳定版本

**测试用例**（扩展多语言和主题功能）：

1. **基础功能测试**：
   - ✅ 输入有效 YouTube URL 并加载视频
   - ✅ 视频正常播放和暂停
   - ✅ 字幕实时高亮
   - ✅ 点击字幕跳转到对应时间
   - ✅ 播放速率调节生效
   - ✅ 重复播放模式正常工作

2. **多语言功能测试（新增）**：
   - ✅ 语言选择下拉菜单显示正确
   - ✅ 切换语言后字幕正确加载
   - ✅ 不可用语言显示错误提示
   - ✅ 自动检测功能正常工作
   - ✅ 语言切换时保持播放位置

3. **主题切换测试（新增）**：
   - ✅ 浅色主题显示正常
   - ✅ 深色主题显示正常
   - ✅ 系统主题自动跟随
   - ✅ 主题切换无闪烁
   - ✅ 所有组件深色模式适配正确
   - ✅ 对比度符合无障碍标准

4. **单句循环测试（新增）**：
   - ✅ 点击循环图标激活循环
   - ✅ 循环播放流畅无卡顿
   - ✅ 视觉状态反馈清晰
   - ✅ 可随时取消循环

5. **边界测试**：
   - ✅ 无字幕视频的处理
   - ✅ 超长字幕列表（1000+ 条）
   - ✅ 网络中断后恢复
   - ✅ 连续快速切换视频
   - ✅ 连续快速切换语言
   - ✅ 连续快速切换主题

6. **浏览器兼容性**：
   - Chrome（最新版）- 浅色 + 深色
   - Firefox（最新版）- 浅色 + 深色
   - Safari（最新版）- 浅色 + 深色
   - Edge（最新版）- 浅色 + 深色

7. **设备测试**：
   - iPhone（Safari）- 浅色 + 深色
   - Android 手机（Chrome）- 浅色 + 深色
   - iPad - 浅色 + 深色
   - 桌面浏览器 - 浅色 + 深色

**Bug 修复流程**：
1. 记录 Bug（描述、重现步骤、截图）
2. 优先级排序（Critical > High > Medium > Low）
3. 修复并回归测试
4. 更新测试用例

**涉及文件**：可能涉及任何文件

**验收标准**：
- 所有 Critical 和 High 优先级 Bug 已修复
- 核心功能在所有主流浏览器正常工作
- 深色模式在所有测试场景下表现良好
- 多语言切换流畅稳定
- 无明显 UI 错位或交互问题
- 用户体验流畅自然

**预估工作量**：4 小时（从 3 小时增加）

---

## 任务依赖关系图

```
阶段 1（基础设施）
├─ 1.1 安装依赖 → 1.2 配置 shadcn/ui
├─ 1.2 配置 shadcn/ui → 1.3 创建目录结构
├─ 1.3 创建目录结构 → 1.4 定义类型系统
└─ 1.1 + 1.4 → 1.5 配置主题系统（新增）

阶段 2（核心功能）
├─ 1.4 → 2.1 YouTube ID 提取
├─ 2.1 → 2.2 字幕 API（扩展多语言）
├─ 1.4 → 2.3 VideoContext（扩展语言切换）
├─ 2.3 → 2.4 VideoPlayer（深色模式适配）
├─ 2.4 + 2.2 → 2.5 字幕同步
└─ 1.4 → 2.6 数据层抽象（新增）

阶段 3（交互功能）
├─ 2.1 + 2.3 + 2.2 → 3.1 URL 输入表单（含语言选择）
├─ 2.5 → 3.2 字幕面板（含循环按钮，深色模式适配）
├─ 2.4 → 3.3 播放控制（深色模式适配）
├─ 3.3 + 2.5 → 3.4 重复播放
└─ 1.5 → 3.5 主题切换组件（新增）

阶段 4（优化测试）
├─ 3.1 + 3.2 + 3.3 + 3.5 → 4.1 主页面布局（含主题入口）
├─ 4.1 → 4.2 响应式优化（深色模式适配）
├─ 4.1 → 4.3 错误处理（多语言错误）
├─ 4.2 + 4.3 → 4.4 性能优化（含主题切换优化）
└─ 4.4 → 4.5 测试修复（扩展测试用例）
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

### 风险 5：多语言字幕获取不稳定 🆕 新增

**风险描述**：部分视频的字幕语言列表可能不完整或获取失败

**影响程度**：中（多语言功能）

**应对策略**：
1. 实现语言降级机制（用户选择语言 → 英文 → 第一个可用语言）
2. 缓存已成功获取的语言列表（避免重复请求）
3. 提供清晰的错误提示和可用语言列表
4. 允许用户手动刷新语言列表

---

### 风险 6：深色模式适配工作量大 🆕 新增

**风险描述**：所有 UI 组件需要适配深色模式，可能遗漏部分样式

**影响程度**：中（视觉体验）

**应对策略**：
1. 使用 CSS 变量统一管理颜色（shadcn/ui 默认支持）
2. 建立深色模式检查清单，逐组件验证
3. 使用浏览器扩展（如 Dark Reader）快速预览效果
4. 重点测试对比度和可读性（WCAG 标准）

---

## 开发建议与最佳实践

### 1. Git 提交规范

采用 Conventional Commits 规范：
```
feat(player): 实现视频播放器组件
feat(theme): 添加深色模式支持
feat(i18n): 实现多语言字幕切换
fix(subtitle): 修复字幕同步延迟问题
docs(readme): 更新安装说明
style(ui): 调整字幕面板深色模式样式
refactor(api): 重构字幕获取逻辑
test(player): 添加播放器单元测试
```

### 2. 代码审查检查点

每个任务完成后自查：
- ✅ TypeScript 类型完整，无 `any`
- ✅ 组件拆分合理，单一职责
- ✅ 错误边界处理完善
- ✅ 性能优化（memo/callback）
- ✅ 代码注释清晰（复杂逻辑）
- ✅ 命名规范（组件 PascalCase，函数 camelCase）
- ✅ 深色模式样式完整（新增）
- ✅ 无障碍性考虑（aria-label, 对比度）

### 3. 测试策略

虽然 MVP 阶段可暂不写自动化测试，但应：
- 手动测试每个功能点
- 记录测试用例和结果
- 重点测试核心路径（加载视频 → 播放 → 字幕同步 → 点击跳转）
- **新增**：深色模式下所有功能路径测试
- **新增**：多语言切换场景测试

### 4. 性能监控

开发过程中使用：
- React DevTools Profiler（检测重渲染）
- Chrome Performance 面板（检测卡顿）
- Lighthouse（整体性能评分）
- **新增**：Chrome DevTools 的 "Rendering" 面板（检测主题切换性能）

### 5. 深色模式开发技巧 🆕 新增

- 使用 TailwindCSS 的 `dark:` 前缀统一管理样式
- 优先使用 shadcn/ui 的主题变量（`bg-background`, `text-foreground`）
- 避免硬编码颜色值（如 `#ffffff`），使用语义化变量
- 使用浏览器扩展快速切换主题测试
- 重点检查边框、阴影、背景色的对比度

---

## 总预估工作量

| 阶段 | 任务数 | 预估时间（v1.0） | 预估时间（v1.1） | 增加时间 |
|------|--------|-----------------|-----------------|---------|
| 阶段 1：基础设施 | 4 → 5 | 1.5 小时 | 2 小时 | +0.5 小时 |
| 阶段 2：核心功能 | 5 → 6 | 6 小时 | 7.5 小时 | +1.5 小时 |
| 阶段 3：交互功能 | 4 → 5 | 6.5 小时 | 8.5 小时 | +2 小时 |
| 阶段 4：优化测试 | 5 | 10 小时 | 12 小时 | +2 小时 |
| **总计** | **18 → 21** | **24 小时** | **30 小时** | **+6 小时** |

**工作量增加分析**：
- 主题系统配置和组件开发：+1.5 小时
- 多语言 UI 和 API 扩展：+2 小时
- 所有组件深色模式适配：+1.5 小时
- 数据层抽象接口设计：+1 小时

*注：预估时间为理想情况下的开发时间，实际开发建议预留 30% 的缓冲时间（约 **39-40 小时**）*

---

## 下一步行动

1. **用户确认**：
   - 审阅本规划文档 v1.1
   - 确认新增功能和工作量评估合理
   - 如有调整需求，在下方反馈区域补充

2. **启动开发**：
   - 确认规划后，按阶段 1 → 阶段 4 顺序开始开发
   - 建议采用敏捷迭代方式，每完成一个阶段进行演示和调整
   - **优先级建议**：
     - 第一轮迭代：完成基础功能（不含多语言和主题）
     - 第二轮迭代：添加多语言支持
     - 第三轮迭代：添加深色模式和主题切换

3. **持续跟踪**：
   - 使用 Git 进行版本控制
   - 每个任务完成后创建对应的 commit
   - 遇到问题及时调整规划
   - 记录深色模式适配中的常见问题（供后续参考）

---

## 用户反馈区域 v1.1

请在此区域补充您对更新后规划的意见和建议：

```
用户补充内容：

---
1. 对于新增任务的优先级建议：


---
2. 深色模式适配是否需要调整范围：


---
3. 多语言功能是否需要进一步细化：


---
4. 工作量评估是否合理（是否需要调整）：


---
5. 其他意见或疑问：


---
```

---

**文档版本**：v1.1
**基于版本**：v1.0
**创建日期**：2025-11-23
**最后更新**：2025-11-23

**主要变更**：
- ✅ 新增多语言字幕支持功能
- ✅ 新增深色模式和主题切换功能
- ✅ 新增数据层抽象接口设计
- ✅ 新增单句循环播放功能细节
- ✅ 更新所有受影响任务的实现细节
- ✅ 重新评估工作量（24h → 30h）
- ✅ 扩展技术风险分析
- ✅ 添加深色模式开发最佳实践