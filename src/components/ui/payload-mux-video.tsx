'use client';

import { useCallback, useEffect, useRef } from 'react';

import type { MuxPlayerRefAttributes } from '@mux/mux-player-react';
import MuxPlayer from '@mux/mux-player-react';

import type { MuxVideo } from '@/payload/payload-types';
import { cn } from '@/utils/cn';

interface Props {
  className?: string;
  onPlaying?: () => void;
  video: string | MuxVideo;
}

export default function PayloadMuxVideo({ className, onPlaying, video }: Props) {
  if (
    typeof video === 'string' ||
    !video?.playbackOptions?.length ||
    !video?.playbackOptions[0]?.playbackId ||
    !video?.playbackOptions[0]?.posterUrl
  ) {
    return null;
  }

  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const playerRefCallback = useCallback((element: MuxPlayerRefAttributes | null) => {
    videoElementRef.current = element?.media?.nativeEl ?? null;
  }, []);

  const startTimer = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      if (videoElementRef.current) {
        videoElementRef.current.pause();
      }
    }, 60_000);
  }, []);

  const clearTimer = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    const currentVideoElement = videoElementRef.current;

    if (!currentVideoElement) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void currentVideoElement.play().catch(() => {
              // Video autoplay may be blocked by browser - this is expected
            });
            startTimer();
          } else {
            currentVideoElement.pause();
            clearTimer();
          }
        });
      },
      {
        threshold: 0.5,
      },
    );

    observer.observe(currentVideoElement);

    return () => {
      observer.disconnect();
      clearTimer();
    };
  }, [startTimer, clearTimer]);

  return (
    <MuxPlayer
      ref={playerRefCallback}
      autoPlay="muted"
      disablePictureInPicture
      loop
      muted
      onPlaying={onPlaying}
      playbackId={video.playbackOptions[0].playbackId}
      poster={video.playbackOptions[0].posterUrl}
      className={cn('pointer-events-none', className)}
    />
  );
}
