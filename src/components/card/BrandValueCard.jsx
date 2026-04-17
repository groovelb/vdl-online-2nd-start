import { forwardRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Activity, CircleDot, Repeat } from 'lucide-react';
import { SPACING } from '../../styles/tokens';

/**
 * 문자열 아이콘 id → lucide-react 컴포넌트 매핑.
 * content.js의 brandValue.features[].icon 값과 동기화.
 * 확장이 필요하면 여기에만 추가하면 된다.
 */
const ICON_MAP = {
  CircleDot,
  Repeat,
  Activity,
};

/**
 * BrandValueCard 컴포넌트
 *
 * Lumenstate 브랜드 가치(Immanence / Continuity / Flexibility)를 소개하는 카드.
 * 장식을 덜어낸 editorial 레이아웃으로, 공간 안에 조용히 자리한 조명처럼
 * 아이콘 → 영문 타이틀 → 영문 한줄 → 한글 상세 설명을 수직 스택으로 배치한다.
 *
 * 동작 방식:
 * 1. feature 객체를 받거나 개별 필드(icon/title/description/detailedDescription)를 받는다.
 *    feature가 있으면 feature 값을 우선, 없으면 개별 prop 사용.
 * 2. icon은 문자열 id ('CircleDot' | 'Repeat' | 'Activity')를 받아 ICON_MAP에서 lucide 컴포넌트로 해석.
 *    커스텀 컴포넌트를 직접 ReactNode로 전달할 수도 있다.
 * 3. iconSize / iconColor / align 으로 시각 리듬을 미세 조정한다.
 * 4. detailedDescription이 없으면 해당 문단은 렌더하지 않는다.
 *
 * Props:
 * @param {object} feature - content.js의 brandValue.features 항목 { id, icon, title, description, detailedDescription } [Optional]
 * @param {string|node} icon - 아이콘 id 문자열 또는 ReactNode [Optional]
 * @param {number} iconSize - 아이콘 크기 (px) [Optional, 기본값: 32]
 * @param {string} iconColor - 아이콘 색상 토큰 [Optional, 기본값: 'primary.main']
 * @param {string} title - 브랜드 가치명 (영문) [Optional]
 * @param {string} description - 영문 한 줄 설명 [Optional]
 * @param {string} detailedDescription - 한글 상세 설명 [Optional]
 * @param {string} align - 내부 정렬 ('start' | 'center') [Optional, 기본값: 'start']
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <BrandValueCard feature={ content.brandValue.features[0] } />
 * <BrandValueCard icon="Repeat" title="Continuity" description="Seamless flow." detailedDescription="..." />
 */
const BrandValueCard = forwardRef(function BrandValueCard({
  feature,
  icon,
  iconSize = 32,
  iconColor = 'primary.main',
  title,
  description,
  detailedDescription,
  align = 'start',
  sx,
  ...props
}, ref) {
  const resolved = useMemo(() => ({
    icon: feature?.icon ?? icon,
    title: feature?.title ?? title,
    description: feature?.description ?? description,
    detailedDescription: feature?.detailedDescription ?? detailedDescription,
  }), [feature, icon, title, description, detailedDescription]);

  /**
   * icon prop이 문자열이면 ICON_MAP에서 찾고, 객체이면 ReactNode로 간주.
   */
  const IconComponent = typeof resolved.icon === 'string' ? ICON_MAP[resolved.icon] : null;

  const alignItems = align === 'center' ? 'center' : 'flex-start';
  const textAlign = align === 'center' ? 'center' : 'left';

  return (
    <Box
      ref={ ref }
      { ...props }
      sx={ {
        display: 'flex',
        flexDirection: 'column',
        alignItems,
        textAlign,
        gap: SPACING.gap.md,
        width: '100%',
        ...sx,
      } }
    >
      { (IconComponent || (resolved.icon && typeof resolved.icon !== 'string')) && (
        <Box
          aria-hidden="true"
          sx={ {
            display: 'inline-flex',
            color: iconColor,
            lineHeight: 0,
          } }
        >
          { IconComponent
            ? <IconComponent size={ iconSize } strokeWidth={ 1.5 } />
            : resolved.icon }
        </Box>
      ) }

      <Box sx={ { display: 'flex', flexDirection: 'column', gap: SPACING.gap.sm } }>
        { resolved.title && (
          <Typography
            variant="h5"
            component="h3"
            sx={ {
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
            } }
          >
            { resolved.title }
          </Typography>
        ) }

        { resolved.description && (
          <Typography
            variant="body1"
            sx={ {
              color: 'text.primary',
              fontWeight: 500,
              lineHeight: 1.5,
            } }
          >
            { resolved.description }
          </Typography>
        ) }

        { resolved.detailedDescription && (
          <Typography
            variant="body2"
            sx={ {
              color: 'text.secondary',
              lineHeight: 1.7,
            } }
          >
            { resolved.detailedDescription }
          </Typography>
        ) }
      </Box>
    </Box>
  );
});

export { BrandValueCard };
