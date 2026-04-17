import { useRef, useEffect, useState } from 'react';
import Box from '@mui/material/Box';

/**
 * VideoScrubbing Component
 * 스크롤 위치에 따라 비디오를 프레임 단위로 재생(스크러빙)하는 컴포넌트입니다.
 *
 * 제어 모드:
 * 1. **Scroll 모드 (기본)** — progress prop 미지정 시 내부 scrollY 기반으로 자동 스크럽.
 * 2. **External Progress 모드** — progress (0~1) 지정 시 외부 진행도로 currentTime 직접 제어.
 *    HorizontalScrollContainer처럼 window.scrollY가 무의미한 상위 컨테이너 내부에서 사용.
 *
 * @param {string} src - 비디오 소스 경로 [Required]
 * @param {React.RefObject} containerRef - 스크롤 추적용 컨테이너 요소 (Scroll 모드) [Optional]
 * @param {Object} sx - MUI sx 스타일 [Optional]
 * @param {Object} scrollRange - 스크롤 범위 매핑 { start: 0, end: 1 } (Scroll 모드) [Optional]
 * @param {function} onProgressChange - 진행도 변경 콜백 (progress: 0-1) [Optional]
 * @param {number} progress - 외부 진행도 (0~1). 지정 시 External Progress 모드로 전환 [Optional]
 * @param {string} preload - 비디오 preload 속성 ('auto' | 'metadata' | 'none') [Optional, 기본값: 'auto']
 */
const VideoScrubbing = ({
  src,
  containerRef = null,
  sx = {},
  scrollRange = { start: 0, end: 1 },
  onProgressChange,
  progress,
  preload = 'auto',
  ...props
}) => {
  const videoRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const isExternalProgress = progress !== undefined;

  // Initialize video to frame 0 on load
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      video.currentTime = 0;
    };

    video.addEventListener('loadeddata', handleLoadedData);

    if (video.readyState >= 2) {
      video.currentTime = 0;
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  // External progress 모드: progress 변화에 따라 currentTime 직접 업데이트
  useEffect(() => {
    if (!isExternalProgress) return;
    const video = videoRef.current;
    if (!video) return;

    const apply = () => {
      if (!video.duration) return;
      const p = Math.max(0, Math.min(1, progress));
      const targetTime = video.duration * p;
      if (Math.abs(video.currentTime - targetTime) > 0.033) {
        video.currentTime = targetTime;
      }
      onProgressChange?.(p);
    };

    if (video.readyState >= 1) {
      apply();
    } else {
      const handler = () => apply();
      video.addEventListener('loadedmetadata', handler);
      return () => video.removeEventListener('loadedmetadata', handler);
    }
    return undefined;
  }, [progress, isExternalProgress, onProgressChange]);

  useEffect(() => {
    if (isExternalProgress) return undefined;
    const video = videoRef.current;
    if (!video) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [isExternalProgress]);

  useEffect(() => {
    if (isExternalProgress) return undefined;
    const video = videoRef.current;
    if (!video || !isInView) return undefined;

    let animationFrameId = null;
    let lastScrollTime = 0;
    const throttleDelay = 16; // ~60fps

    const updateVideoTime = () => {
      const now = Date.now();
      if (now - lastScrollTime < throttleDelay) {
        animationFrameId = requestAnimationFrame(updateVideoTime);
        return;
      }
      lastScrollTime = now;

      let progress = 0;

      if (containerRef && containerRef.current) {
        const container = containerRef.current;
        const containerHeight = container.offsetHeight;
        const containerOffsetTop = container.offsetTop;
        const scrollY = window.scrollY || window.pageYOffset;

        progress = (scrollY - containerOffsetTop) / containerHeight;
      } else {
        const videoHeight = video.offsetHeight;
        const videoOffsetTop = video.offsetTop;
        const scrollY = window.scrollY || window.pageYOffset;

        progress = (scrollY - videoOffsetTop) / videoHeight;
      }

      // Apply scroll range mapping
      const { start, end } = scrollRange;
      progress = (progress - start) / (end - start);

      // Clamp between 0 and 1
      progress = Math.max(0, Math.min(1, progress));

      // Callback
      if (onProgressChange) {
        onProgressChange(progress);
      }

      // Update video time
      if (video.duration) {
        const targetTime = video.duration * progress;
        if (Math.abs(video.currentTime - targetTime) > 0.033) {
          video.currentTime = targetTime;
        }
      }

      animationFrameId = requestAnimationFrame(updateVideoTime);
    };

    animationFrameId = requestAnimationFrame(updateVideoTime);

    const handleScroll = () => {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateVideoTime);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isInView, containerRef, scrollRange, onProgressChange, isExternalProgress]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Video */}
      <Box
        component="video"
        ref={videoRef}
        muted
        playsInline
        preload={preload}
        sx={{
          width: '100%',
          height: 'auto',
          display: 'block',
          position: 'relative',
          zIndex: 0,
          ...sx,
        }}
        {...props}
      >
        <source src={src} type="video/mp4" />
      </Box>
    </Box>
  );
};

export default VideoScrubbing;
