/**
 * 字幕数据类型定义
 */

// 单条字幕项
export interface TranscriptItem {
  text: string;
  start: string; // 开始时间（秒）
  dur: string; // 持续时间（秒）
}

// 单个语言的字幕轨道
export interface TranscriptTrack {
  language: string;
  transcript: TranscriptItem[];
}

// 语言选项
export interface LanguageOption {
  label: string;
  languageCode: string;
}

// 视频元数据
export interface VideoMetadata {
  playerMicroformatRenderer: {
    title: {
      simpleText: string;
    };
    description: {
      simpleText: string;
    };
    lengthSeconds: string;
    ownerChannelName: string;
    viewCount: string;
    publishDate: string;
    category: string;
  };
}

// API响应结构
export interface TranscriptApiResponse {
  text: string; // 完整文本
  id: string; // 视频ID
  title: string; // 视频标题
  microformat: VideoMetadata;
  tracks: TranscriptTrack[];
  isLive: boolean;
  languages: LanguageOption[];
  isLoginRequired: boolean;
  playabilityStatus: {
    status: string;
    playableInEmbed: boolean;
  };
  author: string;
  channelId: string;
  keywords: string[];
}
