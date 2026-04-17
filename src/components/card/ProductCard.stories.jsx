import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { ProductCard } from './ProductCard';
import { products } from '../../data/products';

export default {
  title: 'Component/3. Card/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## ProductCard

Lumenstate 이커머스 도메인 시그니처 카드. 공간의 한 단면처럼 느껴지는 세로형 카드로,
Day/Night 쌍 이미지를 전역 시간 값으로 블렌드하여 **시간 블렌딩(Continuity)** 패턴을 구현한다.

### 브랜드 표현
- **영문 타이틀(선언) + 한글 해설(본문)** 의도적 병치 — Tiempos Headline + Pretendard
- **빛 메타 시그니처** — lux/kelvin/form을 overline으로 노출 (\`260LX · 3200K · circular ceiling ring\`)
- **절제된 외곽** — borderRadius 0, 그림자/테두리 없음 (Immanence)

### 시간 블렌딩
모든 스토리는 Storybook toolbar의 **Time of Day** 드롭다운(점심/오후/저녁/밤)으로만 제어된다.
각 ProductCard는 \`useTimelineSafe()\`로 TimelineContext를 구독해 toolbar 변경에 자동 반응.
\`timeValue\` prop을 명시하면 context를 무시하고 그 값을 쓸 수 있다(기본 스토리는 미지정).

### 공간 전이 준비
\`layoutId\` 전달 시 Framer Motion Shared Element 대상이 되어
랜딩 그리드 → 제품 상세 히어로로의 시선 이음 전이에 참여한다.
        `,
      },
    },
  },
  argTypes: {
    product: {
      control: 'object',
      description: '제품 전체 객체 (id, title, type, lux, kelvin, images). 개별 필드보다 우선',
    },
    title: {
      control: 'text',
      description: '제품명 (영문, 선언적 타이틀)',
    },
    type: {
      control: 'select',
      options: ['ceiling', 'stand', 'wall', 'desk'],
      description: '제품 카테고리 (Chip으로 표시)',
    },
    lux: {
      control: { type: 'number', min: 0, max: 1000 },
      description: '조도 값',
    },
    kelvin: {
      control: { type: 'number', min: 2000, max: 6500 },
      description: '색온도 (K)',
    },
    images: {
      control: 'object',
      description: '[DayImage, NightImage] 쌍',
    },
    timeValue: {
      control: { type: 'number', min: 0, max: 1, step: 0.01 },
      description: '시간 값 0(Day) ~ 1(Night). 미지정 시 toolbar Time of Day 구독',
    },
    ratio: {
      control: 'select',
      options: ['1/1', '3/4', '4/5', '16/9'],
      description: '이미지 비율',
    },
    layoutId: {
      control: 'text',
      description: 'Framer Motion Shared Element 식별자',
    },
    isInteractive: {
      control: 'boolean',
      description: 'hover 인터랙션 활성화',
    },
    onClick: {
      action: 'clicked',
      description: '클릭 핸들러',
    },
  },
};

/**
 * 기본 — products.js의 첫 제품을 렌더. Storybook toolbar의 Time of Day로 제어.
 */
export const Default = {
  args: {
    product: products[0],
    ratio: '4/5',
    isInteractive: true,
  },
  render: (args) => (
    <Box sx={ { width: 320 } }>
      <ProductCard { ...args } />
    </Box>
  ),
};

/**
 * Grid — 8개 제품을 그리드로 배치. toolbar 변경 시 모든 카드가 동시에 같은 시각을 공유.
 */
export const ShowcaseGrid = {
  parameters: { layout: 'padded' },
  render: () => {
    const sample = products.slice(0, 8);
    return (
      <Grid container spacing={ 4 }>
        { sample.map((p) => (
          <Grid key={ p.id } size={ { xs: 6, md: 3 } }>
            <ProductCard product={ p } />
          </Grid>
        )) }
      </Grid>
    );
  },
};

/**
 * Ratios — 비율별 느낌 비교. 모든 카드가 toolbar Time of Day를 공유.
 */
export const Ratios = {
  parameters: { layout: 'padded' },
  render: () => (
    <Grid container spacing={ 3 }>
      { ['1/1', '3/4', '4/5', '16/9'].map((r) => (
        <Grid key={ r } size={ { xs: 6, md: 3 } }>
          <Typography variant="overline" sx={ { color: 'text.secondary', mb: 1, display: 'block' } }>
            { r }
          </Typography>
          <ProductCard product={ products[2] } ratio={ r } />
        </Grid>
      )) }
    </Grid>
  ),
};

/**
 * Shared Element 준비 — layoutId를 부여한 카드.
 * 실제 전이는 상세 페이지의 같은 layoutId 요소와 짝을 이룰 때 일어난다.
 */
export const WithLayoutId = {
  args: {
    product: products[3],
    layoutId: `product-${ products[3].id }`,
  },
  render: (args) => (
    <Box sx={ { width: 320 } }>
      <ProductCard { ...args } />
      <Typography variant="caption" sx={ { color: 'text.secondary', mt: 1, display: 'block' } }>
        layoutId: { args.layoutId }
      </Typography>
    </Box>
  ),
};
