import { NextRequest, NextResponse } from 'next/server';
import type { TranscriptApiResponse } from '@/types/transcript';
import { getTranscriptFromDB, saveTranscriptToDB } from '@/lib/youtube-transcript-db';

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

    // 1. 首先尝试从数据库获取
    console.log(`尝试从数据库获取视频字幕: ${videoId}`);
    const cachedData = await getTranscriptFromDB(videoId);

    if (cachedData) {
      console.log(`✅ 从数据库缓存获取: ${videoId}`);
      return NextResponse.json({
        ...cachedData,
        _cached: true, // 标记数据来自缓存
      });
    }

    // 2. 数据库中不存在，调用外部API
    console.log(`📡 从外部API获取: ${videoId}`);
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

    const transcriptData = data[0];

    // 3. 保存到数据库以供后续使用
    console.log(`💾 保存字幕到数据库: ${videoId}`);
    await saveTranscriptToDB(transcriptData);

    return NextResponse.json({
      ...transcriptData,
      _cached: false, // 标记数据来自API
    });
  } catch (error) {
    console.error('获取字幕错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
