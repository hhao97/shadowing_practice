'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  SkipBack,
  Repeat,
  Play,
  Pause,
  SkipForward,
  RefreshCw
} from 'lucide-react';

interface SubtitleControlsProps {
  isPlaying: boolean;
  autoPlayNext: boolean;
  onPrevious: () => void;
  onRepeat: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onAutoPlayToggle: (enabled: boolean) => void;
  currentIndex: number;
  totalCount: number;
}

export default function SubtitleControls({
  isPlaying,
  autoPlayNext,
  onPrevious,
  onRepeat,
  onPlayPause,
  onNext,
  onAutoPlayToggle,
  currentIndex,
  totalCount,
}: SubtitleControlsProps) {
  return (
    <Card className="border-2">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* 进度指示 */}
          <div className="text-center text-sm text-muted-foreground">
            字幕进度: {currentIndex + 1} / {totalCount}
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center justify-center gap-2">
            {/* 上一条字幕 */}
            <Button
              variant="outline"
              size="lg"
              onClick={onPrevious}
              disabled={currentIndex === 0}
              title="上一条字幕"
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            {/* 重复当前字幕 */}
            <Button
              variant="outline"
              size="lg"
              onClick={onRepeat}
              title="重复当前字幕"
            >
              <Repeat className="h-5 w-5" />
            </Button>

            {/* 播放/暂停 */}
            <Button
              variant="default"
              size="lg"
              onClick={onPlayPause}
              title={isPlaying ? "暂停" : "播放"}
              className="px-8"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>

            {/* 下一条字幕 */}
            <Button
              variant="outline"
              size="lg"
              onClick={onNext}
              disabled={currentIndex >= totalCount - 1}
              title="下一条字幕"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* 自动播放下一条开关 */}
          <div className="flex items-center justify-center gap-3 pt-2 border-t">
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              自动播放下一条
            </span>
            <Switch
              checked={autoPlayNext}
              onCheckedChange={onAutoPlayToggle}
            />
          </div>

          {/* 提示文字 */}
          <div className="text-center text-xs text-muted-foreground">
            {autoPlayNext ? (
              <span>✓ 当前字幕播放完后自动播放下一条</span>
            ) : (
              <span>✓ 当前字幕播放完后自动重复播放</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
