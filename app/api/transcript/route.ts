import { NextRequest, NextResponse } from 'next/server';
import type { TranscriptApiResponse } from '@/types/transcript';

const API_URL = 'https://www.youtube-transcript.io/api/transcripts';
const API_KEY = '6924118fa3ceb6fbf6a11402';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json(
        { error: '缺少视频ID参数' },
        { status: 400 }
      );
    }

    // 调用外部API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: [videoId] }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API错误:', errorText);
      return NextResponse.json(
        { error: `获取字幕失败: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data: TranscriptApiResponse[] = await response.json();

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: '未找到字幕数据' },
        { status: 404 }
      );
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('获取字幕错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
