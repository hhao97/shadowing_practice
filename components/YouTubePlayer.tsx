'use client';

import { useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  onProgress?: (state: { playedSeconds: number }) => void;
  onReady?: () => void;
}

export interface YouTubePlayerRef {
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  play: () => void;
  pause: () => void;
}

// 扩展Window接口以包含YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

let apiLoadPromise: Promise<void> | null = null;

const loadYouTubeAPI = (): Promise<void> => {
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
  });

  return apiLoadPromise;
};

const YouTubePlayer = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(
  ({ videoId, onProgress, onReady }, ref) => {
    const playerRef = useRef<any>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const playerIdRef = useRef(`youtube-player-${Math.random().toString(36).substr(2, 9)}`);

    // 使用ref存储回调函数，避免不必要的重新渲染
    const onProgressRef = useRef(onProgress);
    const onReadyRef = useRef(onReady);

    // 更新回调ref
    useEffect(() => {
      onProgressRef.current = onProgress;
      onReadyRef.current = onReady;
    }, [onProgress, onReady]);

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
          try {
            playerRef.current.seekTo(seconds, true);
          } catch (error) {
            console.error('跳转失败:', error);
          }
        }
      },
      getCurrentTime: () => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            return playerRef.current.getCurrentTime();
          } catch {
            return 0;
          }
        }
        return 0;
      },
      getDuration: () => {
        if (playerRef.current && typeof playerRef.current.getDuration === 'function') {
          try {
            return playerRef.current.getDuration();
          } catch {
            return 0;
          }
        }
        return 0;
      },
      play: () => {
        if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
          try {
            playerRef.current.playVideo();
          } catch (error) {
            console.error('播放失败:', error);
          }
        }
      },
      pause: () => {
        if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
          try {
            playerRef.current.pauseVideo();
          } catch (error) {
            console.error('暂停失败:', error);
          }
        }
      },
    }));

    // 只在videoId变化时初始化播放器
    useEffect(() => {
      let mounted = true;

      const initPlayer = async () => {
        try {
          await loadYouTubeAPI();

          if (!mounted) return;

          // 清理旧的播放器
          if (playerRef.current) {
            try {
              playerRef.current.destroy();
            } catch (e) {
              console.error('清理旧播放器失败:', e);
            }
            playerRef.current = null;
          }

          // 清理进度更新定时器
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }

          // 确保容器存在
          const container = document.getElementById(playerIdRef.current);
          if (!container) {
            console.error('播放器容器未找到');
            return;
          }

          console.log('初始化YouTube播放器, videoId:', videoId);

          playerRef.current = new window.YT.Player(playerIdRef.current, {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
              modestbranding: 1,
              rel: 0,
              enablejsapi: 1,
            },
            events: {
              onReady: () => {
                console.log('✅ YouTube播放器就绪');
                if (!mounted) return;

                setIsLoading(false);
                onReadyRef.current?.();

                // 开始进度更新
                progressIntervalRef.current = setInterval(() => {
                  if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                    try {
                      const currentTime = playerRef.current.getCurrentTime();
                      onProgressRef.current?.({ playedSeconds: currentTime });
                    } catch (e) {
                      // 忽略错误
                    }
                  }
                }, 100);
              },
              onError: (event: any) => {
                console.error('YouTube播放器错误:', event.data);
                if (!mounted) return;
                setIsLoading(false);
              },
            },
          });
        } catch (error) {
          console.error('初始化播放器失败:', error);
          if (mounted) {
            setIsLoading(false);
          }
        }
      };

      initPlayer();

      // 清理函数
      return () => {
        console.log('清理播放器组件');
        mounted = false;
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch (error) {
            console.error('销毁播放器失败:', error);
          }
          playerRef.current = null;
        }
      };
    }, [videoId]); // 只依赖videoId

    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black text-white">
            <div className="text-center">
              <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
              <p>加载播放器中...</p>
            </div>
          </div>
        )}
        <div id={playerIdRef.current} className="h-full w-full" />
      </div>
    );
  }
);

YouTubePlayer.displayName = 'YouTubePlayer';

export default YouTubePlayer;
