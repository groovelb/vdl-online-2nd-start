import { forwardRef, useMemo, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import StickyAsideCenterLayout from '../layout/StickyAsideCenterLayout';
import { CategoryTab } from '../in-page-navigation/CategoryTab';
import { ProductGrid } from './ProductGrid';
import { PRODUCT_TYPES } from '../../data/products';

/**
 * 기본 필터 카테고리. products.js의 PRODUCT_TYPES와 동기화.
 */
const DEFAULT_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: PRODUCT_TYPES.CEILING, label: 'Ceiling' },
  { id: PRODUCT_TYPES.STAND, label: 'Stand' },
  { id: PRODUCT_TYPES.WALL, label: 'Wall' },
  { id: PRODUCT_TYPES.DESK, label: 'Desk' },
];

/**
 * ProductShowcase 컴포넌트
 *
 * Lumenstate 랜딩의 제품 쇼케이스 섹션. 좌측 sticky aside에 타입별 Vertical Filter,
 * 중앙에 ProductGrid를 배치한 3열 레이아웃이다.
 *
 * 구성:
 * - 좌측 aside: CategoryTab으로 type 필터 (all / ceiling / stand / wall / desk)
 *   - 데스크톱(md 이상): vertical 방향, sticky
 *   - 모바일(md 미만): horizontal 방향, 상단에 스택되어 가로 스크롤 탭으로 노출
 * - 중앙 content: 선택된 type으로 필터링된 ProductGrid
 * - 우측: StickyAsideCenterLayout의 대칭 빈 영역
 *
 * 동작 방식:
 * 1. 내부 state로 selected type 관리. defaultType을 초기값으로 사용.
 * 2. 'all' 선택 시 전체 products, 그 외에는 product.type === selected로 필터.
 * 3. timeValue / layoutIdPrefix / onProductClick은 ProductGrid로 그대로 전파.
 * 4. useMediaQuery(md 미만)로 orientation을 horizontal로 전환한다.
 *
 * Props:
 * @param {array} products - 제품 객체 배열 [Required]
 * @param {array} categories - 커스텀 필터 카테고리 [{ id, label }]. id는 product.type 또는 'all' [Optional, 기본값: PRODUCT_TYPES 기반]
 * @param {string} defaultType - 초기 선택 타입 id [Optional, 기본값: 'all']
 * @param {number} timeValue - 시간 값 0(Day)~1(Night). ProductGrid로 전파. 미지정 시 각 ProductCard가 TimelineContext에서 자동 구독 [Optional]
 * @param {string} ratio - 카드 이미지 비율 [Optional, 기본값: '4/5']
 * @param {object} columns - 그리드 브레이크포인트별 열 수 [Optional, 기본값: { xs: 2, sm: 3, md: 3, lg: 4 }]
 * @param {number} centerSize - 중앙 콘텐츠 그리드 크기 (1-12) [Optional, 기본값: 8]
 * @param {number} stickyTop - aside sticky 위치 (px) [Optional, 기본값: 88]
 * @param {number} spacing - aside ↔ center 그리드 간격 (MUI spacing 단위, 1=8px) [Optional, 기본값: 0.5]
 * @param {string} layoutIdPrefix - Shared Element 전이용 layoutId 접두사 [Optional]
 * @param {function} onProductClick - 카드 클릭 핸들러. (product) => void [Optional]
 * @param {function} onFilterChange - 필터 변경 핸들러. (typeId) => void [Optional]
 * @param {object} sx - 컨테이너 추가 스타일 [Optional]
 *
 * Example usage:
 * <ProductShowcase products={ products } timeValue={ globalTime } onProductClick={ goDetail } />
 */
const ProductShowcase = forwardRef(function ProductShowcase({
  products,
  categories = DEFAULT_CATEGORIES,
  defaultType = 'all',
  timeValue,
  ratio = '4/5',
  columns = { xs: 2, sm: 3, md: 3, lg: 4 },
  centerSize = 8,
  stickyTop = 88,
  spacing = 0.5,
  layoutIdPrefix,
  onProductClick,
  onFilterChange,
  sx,
  ...props
}, ref) {
  const [selected, setSelected] = useState(defaultType);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    if (selected === 'all') return products;
    return products.filter((p) => p.type === selected);
  }, [products, selected]);

  const handleChange = (nextId) => {
    setSelected(nextId);
    onFilterChange?.(nextId);
  };

  return (
    <StickyAsideCenterLayout
      ref={ ref }
      centerSize={ centerSize }
      stickyTop={ stickyTop }
      spacing={ spacing }
      sx={ sx }
      { ...props }
      aside={
        <CategoryTab
          orientation={ isMobile ? 'horizontal' : 'vertical' }
          categories={ categories }
          selected={ selected }
          onChange={ handleChange }
        />
      }
    >
      <ProductGrid
        products={ filteredProducts }
        timeValue={ timeValue }
        ratio={ ratio }
        columns={ columns }
        layoutIdPrefix={ layoutIdPrefix }
        onProductClick={ onProductClick }
      />
    </StickyAsideCenterLayout>
  );
});

export { ProductShowcase };
