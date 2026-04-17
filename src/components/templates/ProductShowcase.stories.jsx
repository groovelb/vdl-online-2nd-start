import Box from '@mui/material/Box';
import { ProductShowcase } from './ProductShowcase';
import { products } from '../../data/products';

export default {
  title: 'Template/ProductShowcase',
  component: ProductShowcase,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## ProductShowcase

Lumenstate 랜딩의 **Product Showcase Section** 템플릿.
\`StickyAsideCenterLayout\`을 사용한 3열 레이아웃으로,
좌측 sticky aside에 **Vertical 타입 필터**(CategoryTab), 중앙에 **ProductGrid**를 배치한다.

### 구성
- **좌측 aside**: All / Ceiling / Stand / Wall / Desk — MUI Tabs orientation="vertical"
- **중앙 content**: 선택된 type으로 필터링된 ProductGrid (기본 xs:2 sm:3 md:3 lg:4)
- **우측**: aside와 대칭인 빈 영역 (시각적 균형)

### 시간 공유 / 전이
- 모든 스토리는 Storybook toolbar의 **Time of Day**(점심/오후/저녁/밤)로만 제어. 그리드 전 카드가 같은 시각을 자동 공유.
- \`timeValue\` prop은 옵션 — 명시 시 context를 덮어쓴다.
- \`layoutIdPrefix\`: 각 카드에 Shared Element 전이 식별자 부여
        `,
      },
    },
  },
  argTypes: {
    products: {
      control: 'object',
      description: '제품 객체 배열',
    },
    categories: {
      control: 'object',
      description: '필터 카테고리 [{ id, label }]',
    },
    defaultType: {
      control: 'select',
      options: ['all', 'ceiling', 'stand', 'wall', 'desk'],
      description: '초기 선택 타입 id',
    },
    timeValue: {
      control: { type: 'number', min: 0, max: 1, step: 0.01 },
      description: '시간 값 0(Day)~1(Night)',
    },
    ratio: {
      control: 'select',
      options: ['1/1', '3/4', '4/5', '16/9'],
      description: '카드 이미지 비율',
    },
    columns: {
      control: 'object',
      description: '그리드 브레이크포인트별 열 수',
    },
    centerSize: {
      control: { type: 'number', min: 6, max: 10 },
      description: '중앙 콘텐츠 그리드 크기 (1-12)',
    },
    stickyTop: {
      control: { type: 'number', min: 0, max: 200 },
      description: 'aside sticky 위치 (px)',
    },
    layoutIdPrefix: {
      control: 'text',
      description: 'Shared Element 전이용 layoutId 접두사',
    },
    onProductClick: {
      action: 'productClicked',
      description: '카드 클릭 핸들러',
    },
    onFilterChange: {
      action: 'filterChanged',
      description: '필터 변경 핸들러',
    },
  },
};

/**
 * 기본 — 전체 제품(20개) + vertical 필터. 필터 클릭 시 해당 타입만 남는다.
 * timeValue를 args로 주지 않으므로 Storybook toolbar의 Time of Day가
 * 각 ProductCard의 TimelineContext를 통해 자동 반영된다.
 */
export const Default = {
  args: {
    products,
    defaultType: 'all',
    ratio: '4/5',
    columns: { xs: 2, sm: 3, md: 3, lg: 4 },
    centerSize: 8,
    stickyTop: 88,
  },
  render: (args) => (
    <Box sx={ { minHeight: '120vh' } }>
      <ProductShowcase { ...args } />
    </Box>
  ),
};

/**
 * Ceiling Start — 초기 필터를 'ceiling'으로 시작.
 */
export const CeilingStart = {
  args: {
    products,
    defaultType: 'ceiling',
  },
  render: (args) => (
    <Box sx={ { minHeight: '120vh' } }>
      <ProductShowcase { ...args } />
    </Box>
  ),
};

/**
 * Dense — 중앙 그리드를 5 column으로 더 촘촘하게.
 */
export const Dense = {
  args: {
    products,
    columns: { xs: 2, sm: 3, md: 4, lg: 5 },
    centerSize: 9,
  },
  render: (args) => (
    <Box sx={ { minHeight: '120vh' } }>
      <ProductShowcase { ...args } />
    </Box>
  ),
};
