'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import VideoTranscriptList from '@/components/VideoTranscriptList';
import { extractVideoId } from '@/lib/youtube-utils';
import { Loader2, Youtube, AlertCircle, Play } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  // 处理URL提交
  const handleSubmit = () => {
    setError('');

    const extractedId = extractVideoId(url);

    if (!extractedId) {
      setError('无效的 YouTube URL 或视频 ID');
      return;
    }

    // 导航到练习页面
    router.push(`/practice/${extractedId}`);
  };

  // 从视频列表选择
  const handleVideoSelect = (videoId: string) => {
    router.push(`/practice/${videoId}`);
  };

  // 处理键盘回车提交
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto p-4 md:p-8">
          {/* 标语 */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              YouTube 影子跟读练习
            </h1>
            <p className="text-lg text-muted-foreground">
              通过跟读 YouTube 视频字幕提升语言能力
            </p>
          </div>

          {/* 输入区域 */}
          <Card className="mb-8 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="h-5 w-5" />
                开始练习
              </CardTitle>
              <CardDescription>
                输入 YouTube 视频 URL 或视频 ID 来获取字幕并开始练习
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Input
                  placeholder="例如: https://www.youtube.com/watch?v=jNQXAC9IVRw"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!url.trim()}
                  className="sm:w-32"
                  size="lg"
                >
                  <Play className="mr-2 h-4 w-4" />
                  开始练习
                </Button>
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* 使用说明 */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      1
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">输入链接</h4>
                    <p className="text-xs text-muted-foreground">
                      粘贴 YouTube 视频链接
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      2
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">加载字幕</h4>
                    <p className="text-xs text-muted-foreground">
                      自动获取视频字幕
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      3
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">跟读练习</h4>
                    <p className="text-xs text-muted-foreground">
                      跟随字幕进行练习
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      4
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">提升能力</h4>
                    <p className="text-xs text-muted-foreground">
                      持续练习提升语言
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 视频字幕库 */}
          <VideoTranscriptList onVideoSelect={handleVideoSelect} />
        </div>
      </div>
    </>
  );
}
