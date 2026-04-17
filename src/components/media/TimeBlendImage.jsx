import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import { useTimelineSafe } from '../../contexts/TimelineContext';
import { smoothstep } from '../../utils/timeBlend';

/**
 * TimeBlendImage 컴포넌트
 *
 * Day/Night 쌍 이미지를 TimelineContext의 timeValue에 연동해 크로스페이드하는 공용 미디어
 * 프리미티브. Lumenstate의 "시간의 결" 시그니처를 구현하는 단일 진실 소스로, ProductCard
 * 이미지 영역·HeroSection 등 사이트 전역이 같은 곡선/타이밍/필터로 블렌드한다.
 *
 * 블렌드 규칙 (사이트 공용):
 * - Night opacity: `smoothstep(timeValue)` — utils/timeBlend.js 공식
 * - Wrapper filter: `brightness(1 → 0.92) saturate(1 → 0.90)` nightOpacity 연동
 * - Transition: `duration.slowest` · `easing.smooth` (양쪽 동일 리듬)
 *
 * 동작 방식:
 * 1. timeValue 우선순위: prop > TimelineContext > 0. Provider 밖에서도 안전.
 * 2. images[0]=Day 베이스, 그 위에 images[1]=Night를 opacity로 겹쳐 크로스페이드.
 * 3. 내부 wrapper에 `ls-time-blend-media` className 부여 — 부모에서 hover/scale 등 추가
 *    인터랙션을 parent selector로 걸 수 있도록 훅 포인트 제공.
 * 4. `ratio` 제공 시 aspect-ratio 박스로 렌더, 미제공 시 부모 높이 100% 채움.
 * 5. prefers-reduced-motion: reduce 시 모든 transition 생략 (값만 즉시 반영).
 *
 * Props:
 * @param {string} dayImage - 낮 이미지 URL [Required]
 * @param {string} nightImage - 밤 이미지 URL [Required]
 * @param {string} alt - Day 이미지 대체 텍스트 (Night은 aria-hidden 사용) [Optional, 기본값: '']
 * @param {string} ratio - aspect-ratio 문자열 (예: '4/5', '16/9'). 미제공 시 부모 높이 100% 사용 [Optional]
 * @param {string} objectFit - 'cover' | 'contain' [Optional, 기본값: 'cover']
 * @param {number} timeValue - 시간 값 0(Day)~1(Night). 미지정 시 TimelineContext 구독 [Optional]
 * @param {string} innerClassName - 내부 wrapper에 추가할 className (ls-time-blend-media와 병기) [Optional]
 * @param {object} sx - 외곽 컨테이너 추가 스타일 [Optional]
 *
 * Example usage:
 * <TimeBlendImage dayImage={ day } nightImage={ night } alt="..." ratio="4/5" />
 * // HeroSection처럼 부모 높이 100% 채우기
 * <TimeBlendImage dayImage={ day } nightImage={ night } alt="..." />
 */
const TimeBlendImage = forwardRef(function TimeBlendImage({
  dayImage,
  nightImage,
  alt = '',
  ratio,
  objectFit = 'cover',
  timeValue,
  innerClassName,
  sx,
  ...props
}, ref) {
  const timelineCtx = useTimelineSafe();
  const effectiveTimeValue = timeValue ?? timelineCtx?.timeValue ?? 0;
  const nightOpacity = smoothstep(effectiveTimeValue);
  const mediaFilter = `brightness(${ (1 - 0.08 * nightOpacity).toFixed(3) }) saturate(${ (1 - 0.10 * nightOpacity).toFixed(3) })`;

  const resolvedInnerClass = [ 'ls-time-blend-media', innerClassName ].filter(Boolean).join(' ');

  return (
    <Box
      ref={ ref }
      { ...props }
      sx={ {
        position: 'relative',
        width: '100%',
        ...(ratio ? { aspectRatio: ratio } : { height: '100%' }),
        overflow: 'hidden',
        backgroundColor: 'grey.100',
        ...sx,
      } }
    >
      <Box
        className={ resolvedInnerClass }
        sx={ {
          position: 'absolute',
          inset: 0,
          willChange: 'transform, filter',
          filter: mediaFilter,
          '@media (prefers-reduced-motion: no-preference)': {
            transition: (t) => `transform ${ t.transitions.duration.slow }ms ${ t.transitions.easing.smooth }, filter ${ t.transitions.duration.slowest }ms ${ t.transitions.easing.smooth }`,
          },
        } }
      >
        { dayImage && (
          <Box
            component="img"
            src={ dayImage }
            alt={ alt }
            sx={ {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit,
              display: 'block',
            } }
          />
        ) }
        { nightImage && nightImage !== dayImage && (
          <Box
            component="img"
            className="ls-time-blend-night"
            src={ nightImage }
            alt=""
            aria-hidden="true"
            sx={ {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit,
              display: 'block',
              opacity: nightOpacity,
              willChange: 'opacity',
              '@media (prefers-reduced-motion: no-preference)': {
                transition: (t) => `opacity ${ t.transitions.duration.slowest }ms ${ t.transitions.easing.smooth }`,
              },
            } }
          />
        ) }
      </Box>
    </Box>
  );
});

export { TimeBlendImage };
