import { forwardRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import { ProductCard } from '../card/ProductCard';
import { SPACING } from '../../styles/tokens';

/**
 * 반응형 columns 설정을 CSS Grid gridTemplateColumns 값으로 변환.
 * { xs: 2, sm: 3, md: 4, lg: 5 } -> { xs: 'repeat(2, 1fr)', ... }
 */
const toGridTemplate = (columns) =>
  Object.fromEntries(
    Object.entries(columns).map(([bp, n]) => [bp, `repeat(${ n }, minmax(0, 1fr))`])
  );

/**
 * ProductGrid 컴포넌트
 *
 * products 배열을 받아 ProductCard를 반응형 그리드로 배치한다.
 * Lumenstate 랜딩의 Product Showcase Section에서 사용되는 도메인 그리드로,
 * PC에서 5 column을 기본값으로 한다.
 *
 * 동작 방식:
 * 1. products 배열을 순회하며 ProductCard를 렌더.
 * 2. columns prop으로 브레이크포인트별 열 수를 지정 (CSS Grid).
 * 3. timeValue를 모든 카드에 전파하여 "한 슬라이더가 그리드 전체를 묶는" 시간 공유 감각 지원.
 * 4. onProductClick(product)으로 카드 클릭 이벤트를 상위에서 수신.
 * 5. layoutIdPrefix를 주면 각 카드에 `${ prefix }${ id }` 형태의 layoutId가 부여되어
 *    제품 상세로의 Shared Element 전이가 가능해진다.
 *
 * Props:
 * @param {array} products - 제품 객체 배열 [Required]
 * @param {object} columns - 브레이크포인트별 열 수. 예: { xs: 2, sm: 3, md: 4, lg: 5 } [Optional, 기본값: { xs: 2, sm: 3, md: 4, lg: 5 }]
 * @param {string} gap - 카드 사이 간격 ('xs' | 'sm' | 'md' | 'lg' | 'xl') [Optional, 기본값: 'md']
 * @param {number} timeValue - 시간 값 0(Day)~1(Night). 모든 카드에 전파 [Optional, 기본값: 0]
 * @param {string} ratio - 이미지 비율 [Optional, 기본값: '4/5']
 * @param {function} onProductClick - 카드 클릭 핸들러. (product) => void [Optional]
 * @param {string} layoutIdPrefix - Shared Element 전이용 layoutId 접두사 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <ProductGrid products={ products } timeValue={ time } onProductClick={ (p) => navigate(`/product/${ p.id }`) } />
 */
const ProductGrid = forwardRef(function ProductGrid({
  products,
  columns = { xs: 2, sm: 3, md: 4, lg: 5 },
  gap = 'md',
  timeValue = 0,
  ratio = '4/5',
  onProductClick,
  layoutIdPrefix,
  sx,
  ...props
}, ref) {
  const gridTemplateColumns = useMemo(() => toGridTemplate(columns), [columns]);
  const gapValue = SPACING.gap[gap] ?? SPACING.gap.md;

  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <Box
      ref={ ref }
      { ...props }
      sx={ {
        display: 'grid',
        gridTemplateColumns,
        columnGap: gapValue,
        rowGap: (theme) => theme.spacing(typeof gapValue === 'number' ? gapValue * 1.5 : 4),
        width: '100%',
        ...sx,
      } }
    >
      { products.map((product) => (
        <ProductCard
          key={ product.id ?? product.title }
          product={ product }
          timeValue={ timeValue }
          ratio={ ratio }
          layoutId={ layoutIdPrefix ? `${ layoutIdPrefix }${ product.id }` : undefined }
          onClick={ onProductClick ? () => onProductClick(product) : undefined }
        />
      )) }
    </Box>
  );
});

export { ProductGrid };
