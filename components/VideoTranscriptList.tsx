'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, TrendingUp, Play, Eye, Loader2 } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  author: string;
  viewCount: number;
  lastAccessedAt: string;
}

interface VideoTranscriptListProps {
  onVideoSelect: (videoId: string) => void;
}

export default function VideoTranscriptList({ onVideoSelect }: VideoTranscriptListProps) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<'recent' | 'popular'>('recent');

  // 加载视频列表
  const loadVideos = async (type: 'recent' | 'popular') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/transcripts/list?type=${type}&limit=20`);
      if (response.ok) {
        const data = await response.json();
        setVideos(data.transcripts || []);
      }
    } catch (error) {
      console.error('加载视频列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadVideos(viewType);
  }, [viewType]);

  // 切换视图类型
  const handleViewTypeChange = (type: 'recent' | 'popular') => {
    setViewType(type);
  };

  // 选择视频
  const handleVideoClick = (videoId: string) => {
    onVideoSelect(videoId);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>视频字幕库</CardTitle>
            <CardDescription>
              点击视频快速开始影子跟读训练
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewType === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewTypeChange('recent')}
            >
              <Clock className="mr-2 h-4 w-4" />
              最近使用
            </Button>
            <Button
              variant={viewType === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewTypeChange('popular')}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              热门视频
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">
              {viewType === 'recent' ? '暂无最近使用的视频' : '暂无热门视频'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground/80">
              在上方输入YouTube链接开始使用
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video) => (
                <Card
                  key={video.id}
                  className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 overflow-hidden"
                  onClick={() => handleVideoClick(video.id)}
                >
                  {/* 视频封面 */}
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                      alt={video.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* 播放按钮悬浮 */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                        <Play className="h-6 w-6 text-primary-foreground ml-1" fill="currentColor" />
                      </div>
                    </div>
                    {/* 观看次数标签 */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
                      <Eye className="h-3 w-3" />
                      {video.viewCount}
                    </div>
                  </div>

                  {/* 视频信息 */}
                  <CardContent className="p-3">
                    <h4 className="text-sm font-medium line-clamp-2 mb-2 leading-tight">
                      {video.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                      {video.author}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(video.lastAccessedAt)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * 格式化相对时间
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
  return `${Math.floor(diffDays / 365)}年前`;
}
