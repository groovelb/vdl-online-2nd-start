import { forwardRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { motion } from 'framer-motion';
import { SPACING } from '../../styles/tokens';
import { useTimelineSafe } from '../../contexts/TimelineContext';

const MotionBox = motion(Box);

/**
 * 시간 값(0~1)을 Night 이미지의 opacity로 변환.
 * Day 이미지는 항상 베이스, Night 이미지를 위에 얹어 투명도 전환.
 *
 * smoothstep(3x² - 2x³) ease-in-out 매핑으로 중간 구간(0.4~0.6)에서
 * 두 이미지가 50/50으로 겹쳐 보이는 시간을 줄여 "흐릿한 더블 노출"을
 * 피한다. 같은 timeValue=0.5라도 선형보다 한쪽이 살짝 더 지배적이게 보인다.
 */
const toNightOpacity = (value) => {
  if (typeof value !== 'number') return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value * value * (3 - 2 * value);
};

/**
 * ProductCard 컴포넌트
 *
 * Lumenstate 이커머스 도메인 시그니처 카드. 공간의 한 단면처럼 느껴지는 세로형 카드로,
 * Day/Night 쌍 이미지를 전역 시간 값으로 블렌드하고(Time Blend), 카테고리 Chip과 영문 타이틀,
 * 빛 메타(lux · kelvin)를 절제된 구성으로 노출한다.
 * 라우팅 전이 시 Shared Element 대상이 될 수 있도록 layoutId를 지원한다.
 *
 * 동작 방식:
 * 1. product 객체를 받거나 개별 필드(title/type/lux/kelvin/images)를 받는다.
 * 2. images[0]=Day, images[1]=Night 규약. timeValue(0~1)에 smoothstep을 적용해 Night 오버레이 opacity로 보간.
 * 3. timeValue에 연동된 brightness/saturate filter가 media wrapper에 걸려 밤이 깊어질수록 공간이 살짝 가라앉는다.
 * 4. 시간대 간 전환은 duration.slowest(1200ms)·easing.smooth를 사용해 "시간이 흐르는" 리듬을 낸다.
 * 5. layoutId가 있으면 motion.div로 렌더하여 Framer Motion Shared Element 전이에 참여.
 * 6. isInteractive일 때 hover 시 이미지 scale 1.03 (GPU 가속 transform만 사용).
 * 7. prefers-reduced-motion: reduce 시 모든 transition 미적용 (값만 즉시 반영).
 *
 * Props:
 * @param {object} product - 제품 전체 객체 (id, title, type, lux, kelvin, images). 개별 필드보다 우선 [Optional]
 * @param {string} title - 제품명 (영문, 선언적 타이틀) [Optional]
 * @param {string} type - 제품 카테고리 (예: 'ceiling', 'stand', 'wall', 'desk'). Chip으로 표시 [Optional]
 * @param {number} lux - 조도 값 [Optional]
 * @param {number} kelvin - 색온도 (K) [Optional]
 * @param {array} images - [DayImage, NightImage] 쌍 [Optional]
 * @param {number} timeValue - 시간 값 0(Day)~1(Night). 미지정 시 TimelineContext의 timeValue를 구독, 그것도 없으면 0 [Optional]
 * @param {string} ratio - 이미지 비율 ('4/5' | '1/1' | '3/4' | '16/9') [Optional, 기본값: '4/5']
 * @param {string} layoutId - Framer Motion Shared Element 식별자 [Optional]
 * @param {boolean} isInteractive - hover 인터랙션 활성화 [Optional, 기본값: true]
 * @param {function} onClick - 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <ProductCard product={ products[0] } timeValue={ globalTime } layoutId={ `product-${ products[0].id }` } onClick={ goDetail } />
 */
const ProductCard = forwardRef(function ProductCard({
  product,
  title,
  type,
  lux,
  kelvin,
  images,
  timeValue,
  ratio = '4/5',
  layoutId,
  isInteractive = true,
  onClick,
  sx,
  ...props
}, ref) {
  /**
   * timeValue 우선순위: prop > TimelineContext > 0.
   * Provider 밖(격리 렌더/테스트)에서도 안전하게 동작한다.
   */
  const timelineCtx = useTimelineSafe();
  const effectiveTimeValue = timeValue ?? timelineCtx?.timeValue ?? 0;

  /**
   * product 객체가 주어지면 내부 필드를 우선 사용. 개별 prop은 fallback.
   */
  const resolved = useMemo(() => ({
    title: product?.title ?? title,
    type: product?.type ?? type,
    lux: product?.lux ?? lux,
    kelvin: product?.kelvin ?? kelvin,
    images: product?.images ?? images ?? [],
  }), [product, title, type, lux, kelvin, images]);

  const dayImage = resolved.images?.[0];
  const nightImage = resolved.images?.[1] ?? dayImage;
  const nightOpacity = toNightOpacity(effectiveTimeValue);

  /**
   * 시간이 깊어질수록 공간 전체가 살짝 가라앉는 감각을 주기 위해
   * brightness/saturate를 nightOpacity에 연동한다. Immanence 원칙상
   * 과장 금지 — Day(1.0, 1.0) → Night(0.92, 0.90).
   */
  const mediaFilter = `brightness(${ (1 - 0.08 * nightOpacity).toFixed(3) }) saturate(${ (1 - 0.10 * nightOpacity).toFixed(3) })`;

  /**
   * 빛 메타 ('260LX · 3200K')
   */
  const metaText = useMemo(() => {
    const parts = [];
    if (typeof resolved.lux === 'number') parts.push(`${ resolved.lux }LX`);
    if (typeof resolved.kelvin === 'number') parts.push(`${ resolved.kelvin }K`);
    return parts.join(' · ');
  }, [resolved.lux, resolved.kelvin]);

  /**
   * layoutId 유무로 motion 적용 분기.
   */
  const Root = layoutId ? MotionBox : Box;
  const rootMotionProps = layoutId ? { layoutId } : {};

  return (
    <Root
      ref={ ref }
      onClick={ onClick }
      { ...rootMotionProps }
      { ...props }
      sx={ {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        cursor: isInteractive || onClick ? 'pointer' : 'default',
        color: 'text.primary',
        backgroundColor: 'transparent',
        '@media (prefers-reduced-motion: no-preference)': {
          '& .product-card-media-inner': {
            transition: (theme) => `transform ${ theme.transitions.duration.slow }ms ${ theme.transitions.easing.smooth }, filter ${ theme.transitions.duration.slowest }ms ${ theme.transitions.easing.smooth }`,
          },
          '& .product-card-night-layer': {
            transition: (theme) => `opacity ${ theme.transitions.duration.slowest }ms ${ theme.transitions.easing.smooth }`,
          },
          ...(isInteractive && {
            '&:hover .product-card-media-inner': {
              transform: 'scale(1.03)',
            },
          }),
        },
        ...sx,
      } }
    >
      <Box
        sx={ {
          position: 'relative',
          width: '100%',
          aspectRatio: ratio,
          overflow: 'hidden',
          backgroundColor: 'grey.100',
        } }
      >
        <Box
          className="product-card-media-inner"
          sx={ {
            position: 'absolute',
            inset: 0,
            willChange: 'transform, filter',
            filter: mediaFilter,
          } }
        >
          { dayImage && (
            <Box
              component="img"
              src={ dayImage }
              alt={ resolved.title ? `${ resolved.title } — day` : '' }
              sx={ {
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              } }
            />
          ) }
          { nightImage && nightImage !== dayImage && (
            <Box
              component="img"
              className="product-card-night-layer"
              src={ nightImage }
              alt=""
              aria-hidden="true"
              sx={ {
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                opacity: nightOpacity,
                willChange: 'opacity',
              } }
            />
          ) }
        </Box>
      </Box>

      <Box
        sx={ {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: SPACING.gap.xs,
          pt: SPACING.inset.sm,
          pb: SPACING.inset.xs,
        } }
      >
        { resolved.type && (
          <Chip
            label={ resolved.type }
            size="small"
            variant="filled"
            sx={ {
              height: 22,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: 11,
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '& .MuiChip-label': { px: 1 },
            } }
          />
        ) }

        { resolved.title && (
          <Typography
            variant="subtitle1"
            component="h3"
            sx={ {
              fontWeight: 700,
              lineHeight: 1.25,
            } }
          >
            { resolved.title }
          </Typography>
        ) }

        { metaText && (
          <Typography
            variant="caption"
            sx={ {
              color: 'text.secondary',
              display: 'block',
            } }
          >
            { metaText }
          </Typography>
        ) }
      </Box>
    </Root>
  );
});

export { ProductCard };
