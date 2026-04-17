import { forwardRef, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { HorizontalScrollContainer } from '../content-transition/HorizontalScrollContainer';
import VideoScrubbing from '../scroll/VideoScrubbing';
import {
  elevationSet1Video,
  elevationSet2Video,
  elevationSet3Video,
} from '../../assets/elevation';

/**
 * 기본 비디오 — /assets/elevation/set{1,2,3}_moving.mp4.
 */
const DEFAULT_VIDEOS = [
  elevationSet1Video,
  elevationSet2Video,
  elevationSet3Video,
];

const clamp01 = (v) => Math.max(0, Math.min(1, v));

/**
 * 전체 진행도(0~1)를 n등분한 구간 중 index 번째 구간의 로컬 진행도(0~1)를 반환.
 */
const getSegmentProgress = (total, index, count) => {
  const start = index / count;
  const span = 1 / count;
  return clamp01((total - start) / span);
};

/**
 * 단일 슬라이드 — 비디오만 렌더 (텍스트 캡션 없음).
 */
function ElevationSlide({
  src,
  progress,
  width,
  height,
  preload = 'auto',
}) {
  return (
    <Box
      sx={ {
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'background.default',
      } }
    >
      <VideoScrubbing
        src={ src }
        progress={ progress }
        preload={ preload }
        sx={ {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        } }
      />
    </Box>
  );
}

/**
 * BrandElevationSection 컴포넌트
 *
 * Lumenstate "공간의 단면(Elevation)" 영상 3편을 텍스트 없이 풀블리드로 제시하는 섹션.
 * **전 브레이크포인트 동일 방식** — HorizontalScrollContainer로 세로 스크롤을 가로 이동에
 * 매핑하고, 각 슬라이드의 VideoScrubbing이 해당 구간 진행도로 프레임을 스크럽한다.
 * 슬라이드 간 간격 없이 한 화면에 하나의 영상만 풀 뷰포트로 노출된다.
 *
 * 모바일에서도 데스크톱과 동일하게 가로 스크롤로 진행하여 사용자 경험을 통일한다
 * (과거 버전의 단계적 세로 스크롤 방식은 제거됨).
 *
 * Props:
 * @param {array} videos - 비디오 경로 배열. 3개 권장 [Optional, 기본값: elevation set1/2/3]
 * @param {string} slideWidth - 슬라이드 너비 (CSS 단위) [Optional, 기본값: '100vw']
 * @param {string} slideHeight - 슬라이드 높이 (CSS 단위) [Optional, 기본값: '100vh']
 * @param {string} gap - 슬라이드 간 간격 [Optional, 기본값: '0px']
 * @param {string} padding - HorizontalScrollContainer 좌우 패딩 [Optional, 기본값: '0px']
 * @param {object} sx - 외곽 래퍼 추가 스타일 [Optional]
 *
 * Example usage:
 * <BrandElevationSection />
 */
const BrandElevationSection = forwardRef(function BrandElevationSection({
  videos = DEFAULT_VIDEOS,
  slideWidth = '100vw',
  slideHeight = '100vh',
  gap = '0px',
  padding = '0px',
  sx,
  ...props
}, ref) {
  const [progress, setProgress] = useState(0);

  /**
   * 각 슬라이드의 로컬 진행도. 현재 활성 ±1만 preload='auto', 그 외는 'metadata'.
   */
  const segmentStates = useMemo(() => {
    const activeIndex = Math.min(
      videos.length - 1,
      Math.floor(progress * videos.length)
    );
    return videos.map((_, i) => ({
      localProgress: getSegmentProgress(progress, i, videos.length),
      preload: Math.abs(i - activeIndex) <= 1 ? 'auto' : 'metadata',
    }));
  }, [progress, videos]);

  return (
    <Box
      ref={ ref }
      { ...props }
      sx={ {
        width: '100%',
        ...sx,
      } }
    >
      <HorizontalScrollContainer
        gap={ gap }
        padding={ padding }
        onScrollProgress={ setProgress }
      >
        { videos.map((src, i) => (
          <HorizontalScrollContainer.Slide key={ i }>
            <ElevationSlide
              src={ src }
              progress={ segmentStates[i].localProgress }
              preload={ segmentStates[i].preload }
              width={ slideWidth }
              height={ slideHeight }
            />
          </HorizontalScrollContainer.Slide>
        )) }
      </HorizontalScrollContainer>
    </Box>
  );
});

export { BrandElevationSection };
