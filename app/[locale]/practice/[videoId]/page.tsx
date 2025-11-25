"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import YouTubePlayer, {
  type YouTubePlayerRef,
} from "@/components/YouTubePlayer";
import TranscriptList from "@/components/TranscriptList";
import SubtitleControls from "@/components/SubtitleControls";
import { fetchTranscript } from "@/lib/transcript-service";
import type {
  TranscriptApiResponse,
  TranscriptItem,
  TranscriptTrack,
} from "@/types/transcript";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";

export default function PracticePage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.videoId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transcriptData, setTranscriptData] =
    useState<TranscriptApiResponse | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [currentTime, setCurrentTime] = useState(0);

  // 字幕控制状态
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);

  const playerRef = useRef<YouTubePlayerRef>(null);
  const lastSubtitleIndexRef = useRef(-1);

  // 加载视频字幕
  useEffect(() => {
    const loadTranscript = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchTranscript(videoId);
        setTranscriptData(data);

        // 默认选择第一个语言
        if (data.languages && data.languages.length > 0) {
          setSelectedLanguage(data.languages[0].languageCode);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "获取字幕失败");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      loadTranscript();
    }
  }, [videoId]);

  // 获取当前选择的字幕轨道
  const getCurrentTrack = (): TranscriptItem[] => {
    if (!transcriptData || !selectedLanguage) return [];

    // 找到选中语言对应的完整标签
    const selectedLang = transcriptData.languages.find(
      (lang) => lang.languageCode === selectedLanguage,
    );

    if (!selectedLang) return [];

    // 使用完整的语言标签来匹配track
    const track = transcriptData.tracks.find(
      (t: TranscriptTrack) => t.language === selectedLang.label,
    );

    return track?.transcript || [];
  };

  // 跳转到指定时间
  const handleSeek = (time: number) => {
    playerRef.current?.seekTo(time);
  };

  // 返回首页
  const handleBack = () => {
    router.push("/");
  };

  // 播放指定字幕
  const playSubtitle = (index: number) => {
    const transcripts = getCurrentTrack();
    if (index < 0 || index >= transcripts.length) return;

    const subtitle = transcripts[index];
    const startTime = parseFloat(subtitle.start);

    setCurrentSubtitleIndex(index);
    playerRef.current?.seekTo(startTime);
    playerRef.current?.play();
    setIsPlaying(true);
  };

  // 字幕控制函数
  const handlePrevious = () => {
    if (currentSubtitleIndex > 0) {
      playSubtitle(currentSubtitleIndex - 1);
    }
  };

  const handleRepeat = () => {
    playSubtitle(currentSubtitleIndex);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      playerRef.current?.pause();
      setIsPlaying(false);
    } else {
      playerRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    const transcripts = getCurrentTrack();
    if (currentSubtitleIndex < transcripts.length - 1) {
      playSubtitle(currentSubtitleIndex + 1);
    }
  };

  const handleAutoPlayToggle = (enabled: boolean) => {
    setAutoPlayNext(enabled);
  };

  // 监听播放进度，自动控制字幕播放
  useEffect(() => {
    const transcripts = getCurrentTrack();
    if (transcripts.length === 0 || !isPlaying) return;

    const currentSubtitle = transcripts[currentSubtitleIndex];
    if (!currentSubtitle) return;

    const startTime = parseFloat(currentSubtitle.start);
    const duration = parseFloat(currentSubtitle.dur);
    const endTime = startTime + duration;

    // 检查当前字幕是否播放完毕
    if (currentTime >= endTime && currentTime > startTime) {
      if (autoPlayNext) {
        // 自动播放下一条 - 需要防止重复触发
        if (lastSubtitleIndexRef.current === currentSubtitleIndex) return;
        lastSubtitleIndexRef.current = currentSubtitleIndex;

        if (currentSubtitleIndex < transcripts.length - 1) {
          setTimeout(() => {
            playSubtitle(currentSubtitleIndex + 1);
          }, 100);
        } else {
          // 已经是最后一条，暂停
          setIsPlaying(false);
          playerRef.current?.pause();
        }
      } else {
        // 重复播放当前字幕 - 需要每次都触发，所以要重置lastSubtitleIndexRef
        // 但为了避免在同一帧内重复触发，需要检查是否刚刚触发过
        const now = Date.now();
        if (lastSubtitleIndexRef.current === currentSubtitleIndex &&
            now - (lastSubtitleIndexRef as any).lastTriggerTime < 500) {
          return;
        }

        lastSubtitleIndexRef.current = currentSubtitleIndex;
        (lastSubtitleIndexRef as any).lastTriggerTime = now;

        setTimeout(() => {
          playSubtitle(currentSubtitleIndex);
        }, 100);
      }
    }
  }, [currentTime, currentSubtitleIndex, isPlaying, autoPlayNext]);

  // 重置lastSubtitleIndexRef当字幕切换时
  useEffect(() => {
    lastSubtitleIndexRef.current = -1;
  }, [currentSubtitleIndex]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto p-4 md:p-8">
          {/* 返回按钮 */}
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>

          {/* 加载状态 */}
          {loading && (
            <Card>
              <CardContent className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                  <p className="mt-4 text-muted-foreground">加载字幕中...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 错误状态 */}
          {error && (
            <Card>
              <CardContent className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                  <p className="mt-4 text-lg font-medium text-destructive">
                    {error}
                  </p>
                  <Button onClick={handleBack} className="mt-4">
                    返回首页
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 视频和字幕区域 */}
          {!loading && !error && transcriptData && (
            <div className="grid gap-8 lg:grid-cols-2">
              {/* 左侧：视频播放器 */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {transcriptData.title}
                    </CardTitle>
                    <CardDescription>
                      作者: {transcriptData.author} •{" "}
                      {
                        transcriptData.microformat.playerMicroformatRenderer
                          .category
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <YouTubePlayer
                      ref={playerRef}
                      videoId={videoId}
                      onProgress={(state) =>
                        setCurrentTime(state.playedSeconds)
                      }
                    />
                  </CardContent>
                </Card>

                {/* 字幕控制面板 */}
                <SubtitleControls
                  isPlaying={isPlaying}
                  autoPlayNext={autoPlayNext}
                  onPrevious={handlePrevious}
                  onRepeat={handleRepeat}
                  onPlayPause={handlePlayPause}
                  onNext={handleNext}
                  onAutoPlayToggle={handleAutoPlayToggle}
                  currentIndex={currentSubtitleIndex}
                  totalCount={getCurrentTrack().length}
                />

                {/* 语言选择 */}
                {transcriptData.languages.length > 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">语言选择</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select
                        value={selectedLanguage}
                        onValueChange={setSelectedLanguage}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择语言" />
                        </SelectTrigger>
                        <SelectContent>
                          {transcriptData.languages.map((lang) => (
                            <SelectItem
                              key={lang.languageCode}
                              value={lang.languageCode}
                            >
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                )}

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
                    <CardDescription>点击字幕跳转到对应时间点</CardDescription>
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
        </div>
      </div>
    </>
  );
}
