import { TopSection } from './TopSection';

export default {
  title: 'Template/TopSection',
  component: TopSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## TopSection

Lumenstate 랜딩 최상단 결합 블록. **HeroSection + BrandValueSection**을 LineGrid stack 모드로
수직 결합한다.

### 시각 연속성
- Hero 내부 2:1 세로 라인 → 섹션 사이 1px 가로 라인 → BrandValue 3열 라인이
  하나의 격자처럼 이어진다.
- 모든 라인이 동일한 \`borderColor\` 토큰을 공유해 테마 전환 시 동시 반전.

### 시간 블렌딩
HeroSection의 두 무드 이미지가 TimelineContext를 구독하므로, Storybook toolbar의
Time of Day로 자동 반응한다.
        `,
      },
    },
  },
  argTypes: {
    heroHeight: {
      control: 'text',
      description: 'HeroSection 높이 (CSS 단위 문자열)',
      table: { defaultValue: { summary: '100vh' } },
    },
    borderColor: {
      control: 'text',
      description: 'LineGrid 라인 색상 (theme 토큰 경로 or hex)',
      table: { defaultValue: { summary: 'text.primary' } },
    },
    features: {
      control: 'object',
      description: 'BrandValueSection에 전달할 브랜드 가치 항목 배열',
    },
  },
};

/**
 * 기본 — Hero 100vh + BrandValueSection.
 */
export const Default = {
  args: {
    heroHeight: '100vh',
    borderColor: 'text.primary',
  },
};

/**
 * ShorterHero — 히어로 비중을 줄여 스크롤 없이 브랜드 가치가 빠르게 드러나도록.
 */
export const ShorterHero = {
  args: {
    heroHeight: '80vh',
    borderColor: 'text.primary',
  },
};
