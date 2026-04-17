import Box from '@mui/material/Box';
import { HeroSection } from './HeroSection';

export default {
  title: 'Template/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## HeroSection

Lumenstate 랜딩의 첫 히어로 섹션. LineGrid **2:1 수평 분할** 위에 브랜드 무드 이미지 두 장을 얹는다.

### 레이아웃
- 좌측 2/3: \`arc-lamp-living\` (거실의 아크 램프)
- 우측 1/3: \`arch-light-gallery\` (아치 조명 갤러리)
- \`gap=0\`의 LineGrid로 셀 사이 1px 라인 자동 삽입

### 시간 블렌딩
두 이미지 모두 Day/Night 쌍을 가지며, TimelineContext의 \`timeValue\`를 구독해 사이트 전체와
같은 smoothstep 비율로 블렌드된다. Storybook toolbar의 Time of Day 또는 하단
FloatingTimelineControl로 검증 가능.
        `,
      },
    },
  },
  argTypes: {
    height: {
      control: 'text',
      description: '히어로 전체 높이 (CSS 단위 문자열)',
      table: { defaultValue: { summary: '100vh' } },
    },
    borderColor: {
      control: 'text',
      description: 'LineGrid 라인 색상 (theme 토큰 경로 or hex)',
      table: { defaultValue: { summary: 'text.primary' } },
    },
  },
};

/**
 * 기본 — 뷰포트 전체 높이(100vh) 히어로.
 */
export const Default = {
  args: {
    height: '100vh',
    borderColor: 'text.primary',
  },
};

/**
 * Contained — 80vh 높이로 축소해 다른 섹션과의 조합을 가늠.
 */
export const Contained = {
  args: {
    height: '80vh',
  },
  render: (args) => (
    <Box>
      <HeroSection { ...args } />
      <Box sx={ { p: 4, textAlign: 'center', color: 'text.secondary' } }>
        다음 섹션은 여기부터 이어진다.
      </Box>
    </Box>
  ),
};
