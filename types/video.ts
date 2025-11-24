/**
 * 视频相关类型定义
 */

/**
 * 视频状态
 */
export interface VideoState {
  url: string | null;          // YouTube 视频 URL
  videoId: string | null;      // 提取的视频 ID
  isPlaying: boolean;          // 播放状态
  currentTime: number;         // 当前播放时间（秒）
  duration: number;            // 视频总时长
  playbackRate: number;        // 播放速率
  volume: number;              // 音量 (0-1)
  selectedLanguage: string;    // 当前选择的字幕语言
  repeatMode: {                // 循环播放状态
    enabled: boolean;
    subtitleIndex: number | null;
  };
}

/**
 * 播放器控制接口
 */
export interface PlayerControl {
  play: () => void;
  pause: () => void;
  seekTo: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  enableRepeat: (subtitleIndex: number) => void;
  disableRepeat: () => void;
}
