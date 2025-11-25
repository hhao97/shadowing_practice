import { Pool } from 'pg';
import type { TranscriptApiResponse } from '@/types/transcript';

// 使用全局pool以避免重复创建连接
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
}

/**
 * 从数据库获取YouTube视频字幕
 */
export async function getTranscriptFromDB(videoId: string): Promise<TranscriptApiResponse | null> {
  try {
    const pool = getPool();
    const result = await pool.query(
      `UPDATE youtube_transcripts
       SET view_count = view_count + 1,
           last_accessed_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [videoId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    // 重构数据库数据为API响应格式
    const response: TranscriptApiResponse = {
      id: row.id,
      title: row.title,
      author: row.author,
      channelId: row.channel_id,
      keywords: row.keywords || [],
      tracks: row.tracks,
      languages: row.languages,
      microformat: row.metadata.microformat,
      text: row.metadata.text || '',
      isLive: row.metadata.isLive || false,
      isLoginRequired: row.metadata.isLoginRequired || false,
      playabilityStatus: row.metadata.playabilityStatus || { status: 'OK', playableInEmbed: true },
    };

    return response;
  } catch (error) {
    console.error('从数据库获取字幕失败:', error);
    return null;
  }
}

/**
 * 保存YouTube视频字幕到数据库
 */
export async function saveTranscriptToDB(data: TranscriptApiResponse): Promise<boolean> {
  try {
    const pool = getPool();

    // 准备元数据
    const metadata = {
      microformat: data.microformat,
      text: data.text,
      isLive: data.isLive,
      isLoginRequired: data.isLoginRequired,
      playabilityStatus: data.playabilityStatus,
    };

    // 提取作者信息（优先使用author字段，否则从microformat中提取）
    const author = data.author ||
                   data.microformat?.playerMicroformatRenderer?.ownerChannelName ||
                   '未知作者';

    // 提取频道ID（如果没有则使用空字符串）
    const channelId = data.channelId || '';

    await pool.query(
      `INSERT INTO youtube_transcripts
        (id, title, author, channel_id, keywords, tracks, languages, metadata, view_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1)
       ON CONFLICT (id)
       DO UPDATE SET
         title = EXCLUDED.title,
         author = EXCLUDED.author,
         tracks = EXCLUDED.tracks,
         languages = EXCLUDED.languages,
         metadata = EXCLUDED.metadata,
         updated_at = CURRENT_TIMESTAMP`,
      [
        data.id,
        data.title,
        author,
        channelId,
        data.keywords || [],
        JSON.stringify(data.tracks),
        JSON.stringify(data.languages),
        JSON.stringify(metadata),
      ]
    );

    return true;
  } catch (error) {
    console.error('保存字幕到数据库失败:', error);
    return false;
  }
}

/**
 * 获取最近使用的视频列表
 */
export async function getRecentTranscripts(limit: number = 20): Promise<Array<{
  id: string;
  title: string;
  author: string;
  viewCount: number;
  lastAccessedAt: Date;
}>> {
  try {
    const pool = getPool();
    const result = await pool.query(
      `SELECT id, title, author, view_count, last_accessed_at
       FROM youtube_transcripts
       ORDER BY last_accessed_at DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows.map(row => ({
      id: row.id,
      title: row.title,
      author: row.author,
      viewCount: row.view_count,
      lastAccessedAt: new Date(row.last_accessed_at),
    }));
  } catch (error) {
    console.error('获取最近字幕列表失败:', error);
    return [];
  }
}

/**
 * 获取热门视频列表
 */
export async function getPopularTranscripts(limit: number = 20): Promise<Array<{
  id: string;
  title: string;
  author: string;
  viewCount: number;
  lastAccessedAt: Date;
}>> {
  try {
    const pool = getPool();
    const result = await pool.query(
      `SELECT id, title, author, view_count, last_accessed_at
       FROM youtube_transcripts
       ORDER BY view_count DESC, last_accessed_at DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows.map(row => ({
      id: row.id,
      title: row.title,
      author: row.author,
      viewCount: row.view_count,
      lastAccessedAt: new Date(row.last_accessed_at),
    }));
  } catch (error) {
    console.error('获取热门字幕列表失败:', error);
    return [];
  }
}
