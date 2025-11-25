-- YouTube视频字幕缓存表
CREATE TABLE IF NOT EXISTS youtube_transcripts (
  id VARCHAR(20) PRIMARY KEY, -- YouTube视频ID
  title TEXT NOT NULL, -- 视频标题
  author TEXT NOT NULL, -- 作者名称
  channel_id VARCHAR(100) NOT NULL, -- 频道ID
  keywords TEXT[], -- 关键词数组

  -- 字幕轨道数据（JSON格式）
  tracks JSONB NOT NULL, -- 存储多语言字幕 [{language: string, transcript: [...]}]

  -- 可用语言列表（JSON格式）
  languages JSONB NOT NULL, -- 存储可用语言 [{label: string, languageCode: string}]

  -- 视频元数据
  metadata JSONB NOT NULL, -- 存储视频的元数据（分类、时长、浏览量、发布日期等）

  -- 使用统计
  view_count INTEGER DEFAULT 0, -- 字幕被查看次数
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- 最后访问时间

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_youtube_transcripts_view_count ON youtube_transcripts(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_transcripts_last_accessed ON youtube_transcripts(last_accessed_at DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_transcripts_created_at ON youtube_transcripts(created_at DESC);

-- 自动更新updated_at时间戳的触发器
CREATE OR REPLACE FUNCTION update_youtube_transcripts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_youtube_transcripts_timestamp
  BEFORE UPDATE ON youtube_transcripts
  FOR EACH ROW
  EXECUTE FUNCTION update_youtube_transcripts_updated_at();
