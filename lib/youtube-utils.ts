/**
 * YouTube 工具函数
 */

/**
 * 从 YouTube URL 中提取视频 ID
 * 支持多种格式:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 */
export function extractVideoId(url: string): string | null {
  try {
    // 如果输入的就是11位ID，直接返回
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
      return url.trim();
    }

    const urlObj = new URL(url);

    // 处理 youtube.com 域名
    if (urlObj.hostname.includes('youtube.com')) {
      // watch?v=VIDEO_ID 格式
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return videoId;
      }

      // embed/VIDEO_ID 或 v/VIDEO_ID 格式
      const pathMatch = urlObj.pathname.match(/\/(embed|v)\/([a-zA-Z0-9_-]{11})/);
      if (pathMatch) {
        return pathMatch[2];
      }
    }

    // 处理 youtu.be 短链接
    if (urlObj.hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1);
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * 验证视频 ID 格式
 */
export function isValidVideoId(videoId: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}

/**
 * 将时间字符串转换为秒数
 */
export function timeToSeconds(time: string): number {
  return parseFloat(time);
}

/**
 * 将秒数格式化为时间字符串 (MM:SS 或 HH:MM:SS)
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
