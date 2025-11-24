/**
 * 字幕相关类型定义
 */

/**
 * 单条字幕项
 */
export interface SubtitleItem {
  text: string;           // 字幕文本
  offset: number;         // 开始时间（秒）
  duration: number;       // 持续时间（秒）
  lang?: string;          // 语言代码
}

/**
 * 字幕数据
 */
export interface SubtitleData {
  items: SubtitleItem[];
  videoId: string;
  language: string;
  availableLanguages?: string[]; // 可用语言列表
}

/**
 * 语言信息
 */
export interface LanguageInfo {
  code: string;           // 语言代码（如 'en', 'zh-Hans'）
  name: string;           // 语言名称（如 'English', '简体中文'）
}
