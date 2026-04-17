import { LandingPage } from './LandingPage';
import { products } from '../../data/products';

export default {
  title: 'Page/LandingPage',
  component: LandingPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## LandingPage

Lumenstate 랜딩 페이지 전체 구성. **TopSection(Hero + BrandValueSection)** + **ProductShowcase**를
수직 결합한 페이지 레벨 템플릿이다.

### 구성
1. **TopSection** — 풀블리드. 내부 LineGrid로 Hero 2:1 분할 → 섹션 간 1px 가로 라인 → 브랜드 가치 3열 라인.
2. **Product Showcase 섹션** — 풀블리드(페이지 거터만 적용)로 가운데 정렬된 섹션 헤더 + 좌 vertical 필터 + ProductGrid.

### 시간 블렌딩 / 전이
- HeroSection 이미지와 ProductCard 이미지가 동일 TimelineContext를 구독해 일관된 Day/Night 리듬을 공유한다.
- \`layoutIdPrefix\`를 지정하면 ProductGrid의 각 카드가 Shared Element 전이에 참여한다.
        `,
      },
    },
  },
  argTypes: {
    products: {
      control: 'object',
      description: '제품 객체 배열 (기본: data/products.js)',
    },
    heroHeight: {
      control: 'text',
      description: 'HeroSection 높이 (CSS 단위 문자열). 미지정 시 이미지 원본 비율로 자동',
    },
    borderColor: {
      control: 'text',
      description: 'TopSection LineGrid 라인 색상 토큰',
      table: { defaultValue: { summary: 'text.primary' } },
    },
    defaultType: {
      control: 'select',
      options: ['all', 'ceiling', 'stand', 'wall', 'desk'],
      description: '쇼케이스 초기 선택 타입 id',
    },
    columns: {
      control: 'object',
      description: '쇼케이스 그리드 브레이크포인트별 열 수',
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
 * 기본 — data/products.js와 content.js 기반 전체 랜딩. Hero는 이미지 원본 비율로 렌더.
 */
export const Default = {
  args: {
    products,
    borderColor: 'text.primary',
    defaultType: 'all',
  },
};

/**
 * FixedHero — Hero 높이를 100vh로 고정 (이미지 cover 크롭 발생 가능).
 */
export const FixedHero = {
  args: {
    products,
    heroHeight: '100vh',
    defaultType: 'all',
  },
};

/**
 * CeilingStart — 초기 쇼케이스 필터를 'ceiling'으로 시작.
 */
export const CeilingStart = {
  args: {
    products,
    defaultType: 'ceiling',
  },
};
