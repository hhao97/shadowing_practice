'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import type { TranscriptItem } from '@/types/transcript';
import { formatTime, timeToSeconds } from '@/lib/youtube-utils';
import { cn } from '@/lib/utils';

interface TranscriptListProps {
  transcripts: TranscriptItem[];
  currentTime: number;
  onSeek: (time: number) => void;
}

export default function TranscriptList({
  transcripts,
  currentTime,
  onSeek,
}: TranscriptListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);

  // 查找当前激活的字幕
  const activeIndex = transcripts.findIndex((item, index) => {
    const startTime = timeToSeconds(item.start);
    const endTime = startTime + timeToSeconds(item.dur);
    const nextStartTime = index < transcripts.length - 1
      ? timeToSeconds(transcripts[index + 1].start)
      : Infinity;

    return currentTime >= startTime && currentTime < Math.min(endTime, nextStartTime);
  });

  // 自动滚动到当前激活的字幕
  useEffect(() => {
    if (activeItemRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const activeElement = activeItemRef.current;

      const containerRect = container.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();

      // 只有当激活元素不在可见区域时才滚动
      if (
        activeRect.top < containerRect.top ||
        activeRect.bottom > containerRect.bottom
      ) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [activeIndex]);

  if (transcripts.length === 0) {
    return (
      <Card className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
        <p>暂无字幕数据</p>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-full w-full rounded-md border" ref={scrollRef}>
      <div className="space-y-1 p-4">
        {transcripts.map((item, index) => {
          const startTime = timeToSeconds(item.start);
          const isActive = index === activeIndex;

          return (
            <div
              key={index}
              ref={isActive ? activeItemRef : null}
              className={cn(
                'group cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:border-primary hover:bg-accent',
                isActive
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-transparent'
              )}
              onClick={() => onSeek(startTime)}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'min-w-[4rem] select-none text-sm font-mono transition-colors',
                    isActive
                      ? 'font-semibold text-primary'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                >
                  {formatTime(startTime)}
                </span>
                <p
                  className={cn(
                    'flex-1 text-sm leading-relaxed transition-colors',
                    isActive
                      ? 'font-medium text-foreground'
                      : 'text-foreground/80 group-hover:text-foreground'
                  )}
                >
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
