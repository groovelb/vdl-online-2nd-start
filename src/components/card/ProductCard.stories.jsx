import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
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
\`timeValue\` (0~1) prop으로 Day→Night 크로스페이드.
전역 Timeline Provider가 생기면 이 값을 구독해 페이지 전체가 같은 시각을 공유하게 된다.

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
      description: '시간 값 0(Day) ~ 1(Night)',
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
 * 기본 — products.js의 첫 제품을 Day 상태(timeValue=0)로 표시.
 * Controls 탭에서 timeValue를 조작하면 Night 이미지로 블렌드된다.
 */
export const Default = {
  args: {
    product: products[0],
    timeValue: 0,
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
 * Time Blend — 슬라이더로 Day↔Night 전환을 직접 체험.
 * 실제 랜딩에서는 이 값이 전역 Timeline 상태로 대체된다.
 */
export const TimeBlend = {
  render: () => {
    const [time, setTime] = useState(0);

    return (
      <Box sx={ { width: 360, display: 'flex', flexDirection: 'column', gap: 3 } }>
        <ProductCard product={ products[1] } timeValue={ time } />
        <Box sx={ { px: 0.5 } }>
          <Typography variant="overline" sx={ { color: 'text.secondary' } }>
            Timeline — { time < 0.5 ? 'Day' : 'Night' } ({ time.toFixed(2) })
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
      </Box>
    );
  },
};

/**
 * Product Showcase Grid — products.js 데이터로 제품 쇼케이스 섹션 시뮬레이션.
 * 한 슬라이더가 그리드 전체를 같은 시각으로 묶는다 (전역 시간 공유 감각).
 */
export const ShowcaseGrid = {
  parameters: { layout: 'padded' },
  render: () => {
    const [time, setTime] = useState(0);
    const sample = products.slice(0, 8);

    return (
      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 4 } }>
        <Box sx={ { maxWidth: 320 } }>
          <Typography variant="overline" sx={ { color: 'text.secondary' } }>
            Global Time — { time.toFixed(2) }
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
        <Grid container spacing={ 4 }>
          { sample.map((p) => (
            <Grid key={ p.id } size={ { xs: 6, md: 3 } }>
              <ProductCard product={ p } timeValue={ time } />
            </Grid>
          )) }
        </Grid>
      </Box>
    );
  },
};

/**
 * Ratios — 비율별 느낌 비교.
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
