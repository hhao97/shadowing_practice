import { NextRequest, NextResponse } from 'next/server';
import { getRecentTranscripts, getPopularTranscripts } from '@/lib/youtube-transcript-db';

/**
 * GET /api/transcripts/list?type=recent|popular&limit=20
 * 获取视频字幕列表
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'recent'; // recent 或 popular
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    let transcripts;

    if (type === 'popular') {
      transcripts = await getPopularTranscripts(limit);
    } else {
      transcripts = await getRecentTranscripts(limit);
    }

    return NextResponse.json({
      type,
      count: transcripts.length,
      transcripts,
    });
  } catch (error) {
    console.error('获取字幕列表错误:', error);
    return NextResponse.json(
      { error: '获取列表失败' },
      { status: 500 }
    );
  }
}
