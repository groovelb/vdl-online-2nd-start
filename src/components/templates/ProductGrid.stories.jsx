import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { ProductGrid } from './ProductGrid';
import { products } from '../../data/products';

export default {
  title: 'Template/ProductGrid',
  component: ProductGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## ProductGrid

products 배열을 받아 ProductCard를 반응형 CSS Grid로 배치하는 도메인 그리드.
Lumenstate 랜딩의 **Product Showcase Section**에서 사용된다.

### 반응형 기본값
- **xs** (모바일): 2 columns
- **sm** (600+): 3 columns
- **md** (900+): 4 columns
- **lg** (1200+, PC): 5 columns

### 시간 공유 감각
\`timeValue\`를 부모에서 주입하면 그리드 내 모든 카드가 같은 시각을 공유한다.
전역 Timeline Provider가 생기면 이 prop이 그대로 연결된다.

### Shared Element
\`layoutIdPrefix\`를 주면 각 카드에 \`\${ prefix }\${ id }\` 형태의 layoutId가 자동 부여되어
제품 상세로의 Shared Element 전이에 참여한다.
        `,
      },
    },
  },
  argTypes: {
    products: {
      control: 'object',
      description: '제품 객체 배열',
    },
    columns: {
      control: 'object',
      description: '브레이크포인트별 열 수 { xs, sm, md, lg, xl }',
    },
    gap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '카드 사이 간격 토큰',
    },
    timeValue: {
      control: { type: 'number', min: 0, max: 1, step: 0.01 },
      description: '시간 값 0(Day)~1(Night). 모든 카드에 전파',
    },
    ratio: {
      control: 'select',
      options: ['1/1', '3/4', '4/5', '16/9'],
      description: '이미지 비율',
    },
    layoutIdPrefix: {
      control: 'text',
      description: 'Shared Element 전이용 layoutId 접두사',
    },
    onProductClick: {
      action: 'productClicked',
      description: '카드 클릭 핸들러',
    },
  },
};

/**
 * 기본 — PC 5 columns, products.js 전체 20개 제품 렌더.
 * 뷰포트를 줄이면 4 → 3 → 2 columns로 재배치된다.
 */
export const Default = {
  args: {
    products,
    columns: { xs: 2, sm: 3, md: 4, lg: 5 },
    gap: 'md',
    timeValue: 0,
    ratio: '4/5',
  },
};

/**
 * Showcase — 전역 타임라인 슬라이더로 그리드 전체를 같은 시각으로 묶는 데모.
 */
export const Showcase = {
  render: () => {
    const [time, setTime] = useState(0);

    return (
      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 4 } }>
        <Box sx={ { maxWidth: 360 } }>
          <Typography variant="overline" sx={ { color: 'text.secondary' } }>
            Global Time — { time < 0.5 ? 'Day' : 'Night' } ({ time.toFixed(2) })
          </Typography>
          <Slider
            value={ time }
            min={ 0 }
            max={ 1 }
            step={ 0.01 }
            onChange={ (_, v) => setTime(Array.isArray(v) ? v[0] : v) }
            sx={ { color: 'primary.main' } }
          />
        </Box>
        <ProductGrid products={ products } timeValue={ time } />
      </Box>
    );
  },
};

/**
 * Dense Grid — 6 columns로 더 촘촘한 배치.
 */
export const DenseGrid = {
  args: {
    products,
    columns: { xs: 2, sm: 3, md: 4, lg: 6 },
    gap: 'sm',
    ratio: '4/5',
  },
};

/**
 * Wide Grid — 3 columns, 1/1 비율로 더 시원한 배치.
 */
export const WideGrid = {
  args: {
    products: products.slice(0, 9),
    columns: { xs: 1, sm: 2, md: 3 },
    gap: 'lg',
    ratio: '1/1',
  },
};

/**
 * With Shared Element — layoutIdPrefix를 주면 각 카드가 전이 대상이 된다.
 */
export const WithSharedElement = {
  args: {
    products: products.slice(0, 10),
    columns: { xs: 2, sm: 3, md: 4, lg: 5 },
    layoutIdPrefix: 'product-',
  },
};
