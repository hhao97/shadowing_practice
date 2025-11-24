import type { TranscriptApiResponse } from '@/types/transcript';

/**
 * 获取视频字幕
 */
export async function fetchTranscript(videoId: string): Promise<TranscriptApiResponse> {
  const response = await fetch('/api/transcript', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ videoId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '获取字幕失败');
  }

  return response.json();
}
