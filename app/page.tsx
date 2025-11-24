'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Header from '@/components/Header';
import YouTubePlayer, { type YouTubePlayerRef } from '@/components/YouTubePlayer';
import TranscriptList from '@/components/TranscriptList';
import { extractVideoId } from '@/lib/youtube-utils';
import { fetchTranscript } from '@/lib/transcript-service';
import type { TranscriptApiResponse, TranscriptItem, TranscriptTrack } from '@/types/transcript';
import { Loader2, Youtube, AlertCircle } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transcriptData, setTranscriptData] = useState<TranscriptApiResponse | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [currentTime, setCurrentTime] = useState(0);

  const playerRef = useRef<YouTubePlayerRef>(null);

  // 加载字幕
  const handleLoadTranscript = async () => {
    setError('');
    setTranscriptData(null);
    setVideoId('');

    const extractedId = extractVideoId(url);

    if (!extractedId) {
      setError('无效的 YouTube URL 或视频 ID');
      return;
    }

    setLoading(true);

    try {
      const data = await fetchTranscript(extractedId);
      setTranscriptData(data);
      setVideoId(extractedId);

      // 默认选择第一个语言
      if (data.languages && data.languages.length > 0) {
        setSelectedLanguage(data.languages[0].languageCode);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取字幕失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取当前选择的字幕轨道
  const getCurrentTrack = (): TranscriptItem[] => {
    if (!transcriptData || !selectedLanguage) return [];

    const track = transcriptData.tracks.find(
      (t: TranscriptTrack) => t.language === selectedLanguage
    );

    return track?.transcript || [];
  };

  // 跳转到指定时间
  const handleSeek = (time: number) => {
    playerRef.current?.seekTo(time);
  };

  // 处理键盘回车提交
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoadTranscript();
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto p-4 md:p-8">
          {/* 标语 */}
          <div className="mb-8 text-center">
            <p className="text-lg text-muted-foreground">
              通过跟读 YouTube 视频字幕提升语言能力
            </p>
          </div>

        {/* 输入区域 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>加载视频</CardTitle>
            <CardDescription>
              输入 YouTube 视频 URL 或视频 ID 来获取字幕
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
                disabled={loading}
              />
              <Button
                onClick={handleLoadTranscript}
                disabled={loading || !url.trim()}
                className="sm:w-32"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    加载中
                  </>
                ) : (
                  '加载字幕'
                )}
              </Button>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {/* 语言选择 */}
            {transcriptData && transcriptData.languages.length > 1 && (
              <div className="mt-4 flex items-center gap-3">
                <label className="text-sm font-medium">选择语言:</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    {transcriptData.languages.map((lang) => (
                      <SelectItem key={lang.languageCode} value={lang.languageCode}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 视频和字幕区域 */}
        {videoId && transcriptData && (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* 左侧：视频播放器 */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{transcriptData.title}</CardTitle>
                  <CardDescription>
                    作者: {transcriptData.author} • {transcriptData.microformat.playerMicroformatRenderer.category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <YouTubePlayer
                    ref={playerRef}
                    videoId={videoId}
                    onProgress={(state) => setCurrentTime(state.playedSeconds)}
                  />
                </CardContent>
              </Card>

              {/* 使用提示 */}
              <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-base">使用提示</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• 点击右侧字幕可以跳转到对应时间点</p>
                  <p>• 当前播放的字幕会自动高亮显示</p>
                  <p>• 字幕列表会自动滚动跟随播放进度</p>
                  <p>• 支持暂停播放进行跟读练习</p>
                </CardContent>
              </Card>
            </div>

            {/* 右侧：字幕列表 */}
            <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>字幕列表</CardTitle>
                  <CardDescription>
                    点击字幕跳转到对应时间点
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-5rem)]">
                  <TranscriptList
                    transcripts={getCurrentTrack()}
                    currentTime={currentTime}
                    onSeek={handleSeek}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!videoId && !loading && (
          <Card className="border-dashed">
            <CardContent className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
              <Youtube className="h-16 w-16 text-muted-foreground/50" />
              <div>
                <p className="text-lg font-medium text-muted-foreground">
                  请输入 YouTube 视频链接开始
                </p>
                <p className="mt-2 text-sm text-muted-foreground/80">
                  支持标准 YouTube URL 或视频 ID
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </>
  );
}
