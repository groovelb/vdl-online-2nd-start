import Box from '@mui/material/Box';
import { BrandValueSection } from './BrandValueSection';
import { content } from '../../data/content';

export default {
  title: 'Template/BrandValueSection',
  component: BrandValueSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## BrandValueSection

Lumenstate 브랜드 가치(**Immanence / Continuity / Flexibility**)를 **LineGrid 3열 수평 분할**로
나열하는 섹션. HeroSection과 동일한 1px 라인 리듬을 공유해 페이지 상단이 하나의 그리드
판처럼 읽히도록 설계했다.

### 레이아웃
- 데스크톱(md↑): size \`xs:4\` × 3 — 좌/중/우 세로 라인으로 구분
- 모바일(md↓): size \`xs:12\` × 3 — 세로 스택, 가로 라인으로 구분

### 데이터
\`src/data/content.js\`의 \`brandValue.features\`를 기본 데이터로 사용한다.
외부에서 커스텀 \`features\` 배열을 넘기면 우선 적용.
        `,
      },
    },
  },
  argTypes: {
    features: {
      control: 'object',
      description: '브랜드 가치 항목 배열',
    },
    borderColor: {
      control: 'text',
      description: 'LineGrid 라인 색상 (theme 토큰 경로 or hex)',
      table: { defaultValue: { summary: 'text.primary' } },
    },
    cardSx: {
      control: 'object',
      description: '각 BrandValueCard에 전달되는 추가 스타일',
    },
  },
};

/**
 * 기본 — content.js의 3개 브랜드 가치를 그대로 노출.
 */
export const Default = {
  args: {
    borderColor: 'text.primary',
  },
};

/**
 * CustomFeatures — 외부에서 features 배열을 커스텀 주입.
 */
export const CustomFeatures = {
  args: {
    features: [
      {
        id: 'flex',
        icon: 'Activity',
        title: 'Flexibility',
        description: 'Auto by default, precise on demand.',
        detailedDescription: '필요한 순간에만 수동 제어를 꺼내는 절제된 유연성.',
      },
      {
        id: 'cont',
        icon: 'Repeat',
        title: 'Continuity',
        description: 'Seamless day to night.',
        detailedDescription: '시간의 흐름을 끊지 않는 빛.',
      },
    ],
  },
  render: (args) => (
    <Box sx={ { minHeight: '60vh' } }>
      <BrandValueSection { ...args } />
    </Box>
  ),
};

/**
 * FullFeatureList — 원본 features를 그대로 사용하되 wrapper에 minHeight을 부여한
 * 실 페이지 맥락과 유사한 배치.
 */
export const InPageContext = {
  render: () => (
    <Box sx={ { backgroundColor: 'background.default', py: 0 } }>
      <BrandValueSection features={ content.brandValue.features } />
    </Box>
  ),
};
