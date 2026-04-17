import { forwardRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { motion } from 'framer-motion';
import { SPACING } from '../../styles/tokens';
import { TimeBlendImage } from '../media/TimeBlendImage';

const MotionBox = motion(Box);

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
 * 2. 이미지 영역은 **TimeBlendImage**(`media/TimeBlendImage.jsx`)에 위임. Day/Night 블렌드
 *    공식(smoothstep + brightness/saturate filter + duration.slowest transition)은 해당
 *    공용 컴포넌트가 단일 소스로 관리한다.
 * 3. layoutId가 있으면 motion.div로 렌더하여 Framer Motion Shared Element 전이에 참여.
 * 4. isInteractive일 때 hover 시 TimeBlendImage 내부 `.ls-time-blend-media`에 scale 1.03
 *    transform 적용 (GPU 가속, transition은 TimeBlendImage가 이미 선언).
 * 5. prefers-reduced-motion: reduce 시 모든 transition 미적용.
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
          ...(isInteractive && {
            '&:hover .ls-time-blend-media': {
              transform: 'scale(1.03)',
            },
          }),
        },
        ...sx,
      } }
    >
      <TimeBlendImage
        dayImage={ dayImage }
        nightImage={ nightImage }
        alt={ resolved.title ? `${ resolved.title } — day` : '' }
        ratio={ ratio }
        timeValue={ timeValue }
      />

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
