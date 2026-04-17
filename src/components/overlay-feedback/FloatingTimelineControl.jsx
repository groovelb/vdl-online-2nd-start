import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';
import { Sun, SunDim, Sunset, MoonStar } from 'lucide-react';
import { useTimelineSafe } from '../../contexts/TimelineContext';
import { TIME_SLOTS } from '../../data/timeSlots';

/**
 * 슬롯별 lucide-react 아이콘 컴포넌트.
 * - noon(12): 정오의 태양
 * - afternoon(16): 기우는 태양 (낮은 강도)
 * - evening(20): 해질녘
 * - midnight(24): 별이 있는 달
 */
const SLOT_ICONS = {
  noon: Sun,
  afternoon: SunDim,
  evening: Sunset,
  midnight: MoonStar,
};

const ICON_SIZE = 16;
const ICON_STROKE = 1;
const LABEL_FONT_SIZE = 10;

/**
 * FloatingTimelineControl 컴포넌트
 *
 * 사이트 전역에서 **항상 뷰포트 중앙 하단에 떠 있는** 시간대 컨트롤. 4개 슬롯(점심 12·오후 16·
 * 저녁 20·밤 24시)을 세로로 쌓인 아이콘 + 시간으로 노출하고, 클릭 시 TimelineContext의
 * setSlot을 호출해 사이트 전체의 시각·테마·이미지 블렌드를 동기 전환한다.
 *
 * 디자인:
 * - **큰 border radius** — 컨테이너 32. 떠 있는 패널 감각.
 * - **글래스모피즘** — backdrop-filter blur/saturate + 반투명 배경, soft border/shadow.
 * - **배경 칠 전면 금지** — 버튼은 활성·hover·비활성 어떤 상태에서도 배경 fill을 갖지 않는다.
 *   글래스의 투명한 공간감을 훼손하지 않도록 상태 표시는 오직 `color` + `stroke width` +
 *   `font-weight`로만 구현.
 * - **세로 배치** — 아이콘 위, 시간 아래, 수평 중앙 정렬.
 * - 색상: `text.primary`(활성) / `text.secondary`(비활성). 테마 전환 시 자동 반전.
 *
 * 동작 방식:
 * 1. TimelineProvider 내부에서 `useTimelineSafe()`로 현재 slotId·setSlot 구독.
 *    Provider 밖이면 아무 것도 렌더하지 않음.
 * 2. TIME_SLOTS 순회하며 각 슬롯에 세로 ButtonBase 렌더.
 * 3. 버튼 클릭 → setSlot(id) → context timeValue/theme 전환 → 사이트 bg/카드 이미지 반영.
 *
 * Props:
 * @param {number} bottom - 화면 하단에서의 거리 (px) [Optional, 기본값: 24]
 * @param {number} zIndex - 스택 레벨 [Optional, 기본값: 1200]
 * @param {object} sx - 래퍼 추가 스타일 [Optional]
 *
 * Example usage:
 * <FloatingTimelineControl />
 */
const FloatingTimelineControl = forwardRef(function FloatingTimelineControl({
  bottom = 24,
  zIndex = 1200,
  sx,
}, ref) {
  const timelineCtx = useTimelineSafe();
  const theme = useTheme();

  if (!timelineCtx) return null;

  const { slotId, setSlot } = timelineCtx;
  const activeColor = theme.palette.text.primary;
  const idleColor = theme.palette.text.secondary;

  return (
    <Box
      ref={ ref }
      role="group"
      aria-label="Time of day control"
      sx={ {
        position: 'fixed',
        bottom,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex,
        ...sx,
      } }
    >
      <Box
        sx={ {
          display: 'flex',
          alignItems: 'stretch',
          gap: 0.25,
          px: 1,
          py: 1,
          borderRadius: '999px',
          backgroundColor: alpha(theme.palette.background.default, 0.35),
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid',
          borderColor: alpha(theme.palette.text.primary, 0.12),
          boxShadow: `0 8px 32px ${ alpha(theme.palette.common.black, 0.12) }`,
          '@media (prefers-reduced-motion: no-preference)': {
            transition: (t) => `background-color ${ t.transitions.duration.slowest }ms ${ t.transitions.easing.smooth }, border-color ${ t.transitions.duration.slowest }ms ${ t.transitions.easing.smooth }`,
          },
        } }
      >
        { TIME_SLOTS.map((s) => {
          const isActive = s.id === slotId;
          const Icon = SLOT_ICONS[s.id];

          return (
            <ButtonBase
              key={ s.id }
              onClick={ () => setSlot(s.id) }
              aria-label={ `${ s.label } ${ s.hour }시` }
              aria-pressed={ isActive }
              sx={ {
                position: 'relative',
                px: 1.25,
                py: 0.5,
                minWidth: 52,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.375,
                color: isActive ? activeColor : idleColor,
                backgroundColor: 'transparent',
                '@media (prefers-reduced-motion: no-preference)': {
                  transition: (t) => `color ${ t.transitions.duration.short }ms ${ t.transitions.easing.smooth }`,
                },
                '&:hover': {
                  color: activeColor,
                  backgroundColor: 'transparent',
                },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: activeColor,
                  outlineOffset: 2,
                  borderRadius: '999px',
                },
              } }
            >
              <Box
                component={ Icon }
                size={ ICON_SIZE }
                strokeWidth={ isActive ? ICON_STROKE + 0.5 : ICON_STROKE }
                aria-hidden="true"
                sx={ { display: 'block' } }
              />

              <Typography
                variant="caption"
                sx={ {
                  fontSize: LABEL_FONT_SIZE,
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  fontVariantNumeric: 'tabular-nums',
                  '@media (prefers-reduced-motion: no-preference)': {
                    transition: (t) => `font-weight ${ t.transitions.duration.short }ms ${ t.transitions.easing.smooth }`,
                  },
                } }
              >
                { s.hour }:00
              </Typography>
            </ButtonBase>
          );
        }) }
      </Box>
    </Box>
  );
});

export { FloatingTimelineControl };
