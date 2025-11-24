# 项目任务分解规划

## 已明确的决策

- **字幕获取方案**：使用 `youtube-transcript` npm 包（无需 API key，实现简单）
- **视频播放器**：使用 `react-player` 库（良好的 React 集成和 YouTube 支持）
- **用户认证**：MVP 阶段暂不实现，专注核心功能
- **数据存储**：仅使用前端状态管理（React Hooks + Context），无需后端数据库
- **技术栈**：Next.js 16 (App Router) + TypeScript + TailwindCSS 4 + shadcn/ui

## 整体规划概述

### 项目目标

构建一个最小可行产品（MVP），允许用户：
1. 输入 YouTube 视频 URL 并自动加载字幕
2. 在视频播放时实时高亮当前字幕
3. 点击字幕条目跳转到对应视频时间点
4. 使用播放、暂停、重复播放等控制功能

### 技术栈

**前端框架与库：**
- Next.js 16.0.3 (App Router)
- React 19.2.0
- TypeScript 5.x
- TailwindCSS 4.x

**UI 组件：**
- shadcn/ui（按需安装组件）
- Lucide React（图标库）

**核心功能库：**
- `react-player`：视频播放器（YouTube 嵌入支持）
- `youtube-transcript`：YouTube 字幕获取
- `react-hook-form`：表单处理
- `zod`：数据验证

**状态管理：**
- React Context API + Hooks（全局状态）
- useState/useEffect（组件本地状态）

### 主要阶段

1. **阶段 1：项目基础设施搭建**（环境配置、依赖安装、基础架构）
2. **阶段 2：核心功能开发**（YouTube 字幕获取、视频播放器、字幕同步）
3. **阶段 3：交互功能实现**（字幕点击跳转、播放控制）
4. **阶段 4：UI 优化与测试**（界面美化、响应式设计、功能测试）

---

## 详细任务分解

### 阶段 1：项目基础设施搭建

#### 任务 1.1：安装核心依赖包

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
│   │       └── route.ts        # 字幕获取 API
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
│   │   └── VideoUrlInput.tsx   # URL 输入表单
│   ├── subtitle/               # 字幕相关组件
│   │   ├── SubtitlePanel.tsx   # 字幕列表面板
│   │   ├── SubtitleItem.tsx    # 单条字幕条目
│   │   └── SubtitleTimeline.tsx# 字幕时间轴
│   └── layout/                 # 布局组件
│       └── AppLayout.tsx       # 主应用布局
├── lib/
│   ├── utils.ts                # 通用工具函数
│   ├── youtube.ts              # YouTube 相关工具
│   └── time.ts                 # 时间格式化工具
├── types/
│   ├── video.ts                # 视频相关类型定义
│   └── subtitle.ts             # 字幕相关类型定义
├── hooks/
│   ├── useVideoPlayer.ts       # 视频播放器自定义 Hook
│   ├── useSubtitleSync.ts      # 字幕同步 Hook
│   └── useVideoUrl.ts          # URL 处理 Hook
├── contexts/
│   └── VideoContext.tsx        # 视频全局状态 Context
└── constants/
    └── player.ts               # 播放器相关常量
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
  lang?: string;          // 语言代码
}

export interface SubtitleData {
  items: SubtitleItem[];
  videoId: string;
  language: string;
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
}

export interface PlayerControl {
  play: () => void;
  pause: () => void;
  seekTo: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
}
```

**验收标准**：
- 所有类型定义完整且准确
- 类型可被其他模块正常导入
- 符合 TypeScript 最佳实践

**预估工作量**：20 分钟

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

#### 任务 2.2：创建字幕获取 API 路由

**目标**：实现服务端 API 路由，从 YouTube 获取字幕数据

**输入**：视频 ID 和可选的语言参数

**输出**：格式化的字幕数据（JSON）

**涉及文件**：
- `/app/api/subtitles/route.ts`

**API 设计**：
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

**实现要点**：
- 使用 `youtube-transcript` 库获取字幕
- 错误处理（视频不存在、字幕不可用等）
- 支持多语言字幕（默认英文，可选中文）
- 设置适当的 CORS 和缓存头

**验收标准**：
- API 可通过 Postman/curl 正常调用
- 返回正确格式的 JSON 数据
- 错误情况有清晰的错误消息
- 响应时间 < 3秒

**预估工作量**：1 小时

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

  // 操作方法
  loadVideo: (url: string) => Promise<void>;
  updatePlaybackState: (updates: Partial<VideoState>) => void;
  setCurrentTime: (time: number) => void;

  // 播放器控制引用
  playerRef: React.RefObject<PlayerControl>;
}
```

**实现要点**：
- 使用 `useReducer` 管理复杂状态
- 提供 Provider 组件包裹整个应用
- 实现字幕自动高亮逻辑（根据 currentTime 计算）
- 错误边界处理

**验收标准**：
- Context 可在任意子组件中正常使用
- 状态更新触发正确的组件重渲染
- 无不必要的重渲染（使用 useMemo/useCallback 优化）

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

**验收标准**：
- 播放器可正常加载 YouTube 视频
- 播放进度实时更新（至少 100ms 间隔）
- 可通过代码控制播放/暂停/跳转
- 在移动端和桌面端都能正常显示

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

### 阶段 3：交互功能实现

#### 任务 3.1：开发 VideoUrlInput 表单组件

**目标**：创建 URL 输入表单，验证并加载视频

**输入**：用户输入的 URL

**输出**：验证后的视频 ID，触发视频加载

**涉及文件**：
- `/components/video/VideoUrlInput.tsx`

**UI 设计要点**：
- 使用 shadcn/ui 的 `Input` 和 `Button` 组件
- 输入框占位符："请输入 YouTube 视频链接..."
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
    })
});
```

**验收标准**：
- 表单验证实时生效
- 提交后触发 `loadVideo` 函数
- 错误消息清晰易懂
- 支持回车键提交

**预估工作量**：1 小时

---

#### 任务 3.2：构建 SubtitlePanel 字幕面板

**目标**：显示字幕列表，支持点击跳转

**输入**：字幕数据和当前激活索引

**输出**：可滚动的字幕列表 UI

**涉及文件**：
- `/components/subtitle/SubtitlePanel.tsx`
- `/components/subtitle/SubtitleItem.tsx`

**UI 布局**（需要 UI 设计建议）：
根据专业 UI/UX 设计原则，字幕面板应包含：

1. **面板容器**：
   - 使用 shadcn/ui `Card` 组件
   - 固定高度（建议 60vh）
   - 使用 `ScrollArea` 组件实现虚拟滚动

2. **字幕条目设计**：
   - 每条字幕显示：时间戳 + 文本
   - 当前播放字幕：高亮背景色（如 `bg-primary/10`）
   - 悬停效果：`hover:bg-accent`
   - 点击涟漪效果（可选）

3. **时间戳格式化**：
   - 使用 `00:00` 或 `00:00.0` 格式
   - 灰色小字体显示

4. **自动滚动**：
   - 当前字幕自动滚动到可视区域中心
   - 用户手动滚动时暂停自动滚动
   - 3 秒后恢复自动滚动

**交互功能**：
```typescript
const handleSubtitleClick = (subtitle: SubtitleItem) => {
  playerRef.current?.seekTo(subtitle.offset);
};
```

**验收标准**：
- 字幕列表流畅滚动（支持 1000+ 条目）
- 当前字幕视觉上明显区分
- 点击字幕立即跳转到对应时间
- 自动滚动平滑自然

**预估工作量**：2 小时

---

#### 任务 3.3：实现 VideoControls 播放控制面板

**目标**：提供播放、暂停、进度条、速率调节等控制

**输入**：播放状态和控制函数

**输出**：自定义播放控制 UI

**涉及文件**：
- `/components/video/VideoControls.tsx`

**UI 组件**（需要 UI 设计建议）：
基于 shadcn/ui 组件库，控制面板应包含：

1. **播放/暂停按钮**：
   - 使用 `Button` 组件（variant="ghost"）
   - 图标：Lucide 的 `Play` / `Pause`
   - 圆形按钮，居中放置

2. **进度条**：
   - 使用 `Slider` 组件
   - 显示当前时间 / 总时长
   - 支持拖动跳转

3. **播放速率选择**：
   - 下拉菜单或按钮组
   - 选项：0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x
   - 当前速率高亮显示

4. **重复播放按钮**：
   - 图标：`Repeat`
   - 点击在当前字幕段落循环播放

5. **音量控制**（可选）：
   - 使用 `Slider` 组件
   - 静音切换按钮

**布局设计**：
```
[播放/暂停] [00:30 / 05:45] [进度条======================>] [1.0x] [🔁]
```

**功能实现**：
- 空格键切换播放/暂停
- 左右箭头键 ±5 秒跳转
- 上下箭头键调节音量

**验收标准**：
- 所有控制按钮响应灵敏
- 进度条拖动平滑准确
- 键盘快捷键正常工作
- 移动端触摸操作友好

**预估工作量**：2.5 小时

---

#### 任务 3.4：实现重复播放功能

**目标**：支持选定字幕段落的循环播放

**输入**：选中的字幕条目

**输出**：循环播放该字幕对应的视频片段

**涉及文件**：
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

### 阶段 4：UI 优化与测试

#### 任务 4.1：设计并实现主页面布局

**目标**：整合所有组件，创建美观的整体布局

**输入**：所有开发完成的组件

**输出**：完整的主页面 UI

**涉及文件**：
- `/app/(root)/page.tsx`
- `/components/layout/AppLayout.tsx`

**布局设计**（需要 UI 设计建议）：

**桌面端布局（≥1024px）**：
```
┌─────────────────────────────────────────────────────┐
│  🎥 YouTube 影子跟读练习系统                           │
├─────────────────────────────────────────────────────┤
│  [请输入 YouTube 视频链接...        ] [加载视频]        │
├───────────────────────┬─────────────────────────────┤
│                       │  📝 字幕列表                  │
│   🎬 视频播放器         │  ┌─────────────────────┐   │
│   (16:9)              │  │ 00:00 Hello...      │   │
│                       │  │ 00:03 Welcome...    │   │
│                       │  │ 00:07 Today...      │◄──┤
│                       │  └─────────────────────┘   │
├───────────────────────┤                            │
│ [▶️] 00:30/05:45 [====│===>] [1.0x] [🔁]           │
└───────────────────────┴─────────────────────────────┘
```

**移动端布局（<768px）**：
```
┌─────────────────┐
│ [输入框] [加载] │
├─────────────────┤
│  🎬 视频播放器   │
├─────────────────┤
│ [播放控制栏]     │
├─────────────────┤
│  📝 字幕列表     │
│  (可折叠)       │
└─────────────────┘
```

**视觉设计要点**：
- 使用 TailwindCSS 深色/浅色主题
- 字幕面板与视频等高（桌面端）
- 合理的间距和留白
- 流畅的加载状态动画
- 空状态提示（未加载视频时）

**验收标准**：
- 桌面和移动端布局美观合理
- 组件间配合协调
- 无布局错位或溢出
- 加载/错误状态有友好提示

**预估工作量**：2 小时

---

#### 任务 4.2：响应式设计优化

**目标**：确保所有屏幕尺寸下的良好体验

**输入**：现有 UI 组件

**输出**：适配多种设备的响应式界面

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

**涉及文件**：所有组件文件

**验收标准**：
- 在所有测试尺寸下无横向滚动
- 文本可读性良好
- 交互元素易于点击/触摸
- 通过 Chrome DevTools 响应式测试

**预估工作量**：1.5 小时

---

#### 任务 4.3：错误处理和边界情况

**目标**：处理所有可能的错误和特殊情况

**输入**：各种异常场景

**输出**：友好的错误提示和降级方案

**需要处理的场景**：

1. **字幕不可用**：
   - 提示："该视频暂无字幕，请尝试其他视频"
   - 显示建议（选择有字幕的视频）

2. **网络错误**：
   - 提示："网络连接失败，请检查网络后重试"
   - 提供"重试"按钮

3. **无效 URL**：
   - 实时表单验证提示
   - 高亮错误输入框

4. **视频加载失败**：
   - 提示："视频加载失败，可能是该视频不可嵌入"
   - 建议复制 URL 在 YouTube 应用中打开

5. **字幕数据为空**：
   - 显示空状态插图
   - 引导用户输入新视频

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
- 开发环境显示详细错误信息

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

**性能指标目标**：
- First Contentful Paint (FCP) < 1.5s
- Time to Interactive (TTI) < 3s
- Lighthouse 性能分数 > 90

**涉及文件**：所有组件和 API 文件

**验收标准**：
- 通过 Lighthouse 性能测试
- 字幕列表滚动流畅（60fps）
- 视频切换响应快速
- 内存占用合理（< 150MB）

**预估工作量**：2 小时

---

#### 任务 4.5：功能测试和 Bug 修复

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
   - ✅ 重复播放模式正常工作

2. **边界测试**：
   - ✅ 无字幕视频的处理
   - ✅ 超长字幕列表（1000+ 条）
   - ✅ 网络中断后恢复
   - ✅ 连续快速切换视频

3. **浏览器兼容性**：
   - Chrome（最新版）
   - Firefox（最新版）
   - Safari（最新版）
   - Edge（最新版）

4. **设备测试**：
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
- 无明显 UI 错位或交互问题
- 用户体验流畅自然

**预估工作量**：3 小时

---

## 任务依赖关系图

```
阶段 1（基础设施）
├─ 1.1 安装依赖 → 1.2 配置 shadcn/ui
├─ 1.2 配置 shadcn/ui → 1.3 创建目录结构
└─ 1.3 创建目录结构 → 1.4 定义类型系统

阶段 2（核心功能）
├─ 1.4 → 2.1 YouTube ID 提取
├─ 2.1 → 2.2 字幕 API
├─ 1.4 → 2.3 VideoContext
├─ 2.3 → 2.4 VideoPlayer
└─ 2.4 + 2.2 → 2.5 字幕同步

阶段 3（交互功能）
├─ 2.1 + 2.3 → 3.1 URL 输入表单
├─ 2.5 → 3.2 字幕面板
├─ 2.4 → 3.3 播放控制
└─ 3.3 + 2.5 → 3.4 重复播放

阶段 4（优化测试）
├─ 3.1 + 3.2 + 3.3 → 4.1 主页面布局
├─ 4.1 → 4.2 响应式优化
├─ 4.1 → 4.3 错误处理
├─ 4.2 + 4.3 → 4.4 性能优化
└─ 4.4 → 4.5 测试修复
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

## 开发建议与最佳实践

### 1. Git 提交规范

采用 Conventional Commits 规范：
```
feat(player): 实现视频播放器组件
fix(subtitle): 修复字幕同步延迟问题
docs(readme): 更新安装说明
style(ui): 调整字幕面板样式
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

### 3. 测试策略

虽然 MVP 阶段可暂不写自动化测试，但应：
- 手动测试每个功能点
- 记录测试用例和结果
- 重点测试核心路径（加载视频 → 播放 → 字幕同步 → 点击跳转）

### 4. 性能监控

开发过程中使用：
- React DevTools Profiler（检测重渲染）
- Chrome Performance 面板（检测卡顿）
- Lighthouse（整体性能评分）

---

## 需要进一步明确的问题

### 问题 1：字幕语言支持范围

**推荐方案**：

- **方案 A：仅支持英文字幕（MVP 推荐）**
  - 优点：实现简单，专注核心功能
  - 缺点：用户群体受限

- **方案 B：支持英文 + 中文字幕**
  - 优点：覆盖更多用户需求
  - 缺点：需要语言选择 UI，复杂度增加

- **方案 C：支持所有可用语言**
  - 优点：最大灵活性
  - 缺点：UI 复杂，测试工作量大

**等待用户选择**：
```
请选择您偏好的方案，或提供其他建议：
[ ] 方案 A - 仅英文
[ ] 方案 B - 英文 + 中文
[ ] 方案 C - 所有语言
[ ] 其他方案：_______________
```

---

### 问题 2：重复播放模式的交互设计

**推荐方案**：

- **方案 A：单句循环（推荐）**
  - 点击字幕条目旁的循环图标，循环播放该条字幕
  - 简单直观，适合逐句练习

- **方案 B：区间循环**
  - 用户选择开始和结束字幕，循环播放整个区间
  - 灵活性高，但交互稍复杂

- **方案 C：自动循环（AB 点循环）**
  - 播放到字幕结束后自动循环 N 次（可设置次数）
  - 适合强化记忆，但可能打断学习节奏

**等待用户选择**：
```
请选择您偏好的方案，或提供其他建议：
[ ] 方案 A - 单句循环
[ ] 方案 B - 区间循环
[ ] 方案 C - 自动循环 N 次
[ ] 其他方案：_______________
```

---

### 问题 3：是否需要暗色模式支持

**推荐方案**：

- **方案 A：仅浅色模式（MVP 推荐）**
  - 快速上线，后续迭代添加

- **方案 B：同时支持浅色和暗色模式**
  - 使用 `next-themes` 库实现
  - 提升用户体验，但增加 UI 工作量

**等待用户选择**：
```
请选择您偏好的方案：
[ ] 方案 A - 仅浅色模式
[ ] 方案 B - 支持主题切换
[ ] 其他方案：_______________
```

---

### 问题 4：数据持久化策略（未来扩展）

虽然 MVP 阶段不实现后端，但需要考虑未来扩展性：

**推荐方案**：

- **方案 A：纯前端，不考虑持久化**
  - 每次刷新页面重新加载视频

- **方案 B：LocalStorage 缓存**
  - 缓存最近观看的视频 URL 和字幕数据
  - 保存播放进度（下次打开继续播放）

- **方案 C：预留后端接口设计**
  - 在代码中预留 API 调用位置
  - 便于后续快速接入 Drizzle ORM + Hono

**等待用户选择**：
```
请选择您偏好的方案：
[ ] 方案 A - 不持久化
[ ] 方案 B - LocalStorage 缓存
[ ] 方案 C - 预留后端接口
[ ] 其他方案：_______________
```

---

## 用户反馈区域

请在此区域补充您对整体规划的意见和建议：

```
用户补充内容：

---
1. 对于任务优先级的调整建议：


---
2. 需要增加或删减的功能点：


---
3. 对技术选型的其他考虑：


---
4. 其他意见或疑问：


---
```

---

## 总预估工作量

| 阶段 | 任务数 | 预估时间 |
|------|--------|----------|
| 阶段 1：基础设施 | 4 | 1.5 小时 |
| 阶段 2：核心功能 | 5 | 6 小时 |
| 阶段 3：交互功能 | 4 | 6.5 小时 |
| 阶段 4：优化测试 | 5 | 10 小时 |
| **总计** | **18** | **24 小时** |

*注：预估时间为理想情况下的开发时间，实际开发建议预留 30% 的缓冲时间（约 31-32 小时）*

---

## 下一步行动

1. **用户确认**：
   - 审阅本规划文档
   - 回答"需要进一步明确的问题"部分
   - 在"用户反馈区域"补充意见

2. **启动开发**：
   - 确认规划后，按阶段 1 → 阶段 4 顺序开始开发
   - 建议采用敏捷迭代方式，每完成一个阶段进行演示和调整

3. **持续跟踪**：
   - 使用 Git 进行版本控制
   - 每个任务完成后创建对应的 commit
   - 遇到问题及时调整规划

---

**文档版本**：v1.0
**创建日期**：2025-11-23
**最后更新**：2025-11-23