import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { BrandValueCard } from './BrandValueCard';
import { content } from '../../data/content';

const features = content.brandValue.features;

export default {
  title: 'Component/3. Card/BrandValueCard',
  component: BrandValueCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## BrandValueCard

Lumenstate 브랜드의 세 가지 가치(**Immanence / Continuity / Flexibility**)를 소개하는 editorial 카드.
불필요한 chrome을 걷어내고 아이콘 · 영문 타이틀 · 영문 한 줄 · 한글 상세 설명을 수직으로 쌓는다.

### 브랜드 표현
- **Immanence** — 장식적 테두리/그림자 없이 공간에 녹아드는 카드.
- **Editorial pairing** — 영문 선언(H5) + 영문 한 줄(Body1) + 한글 해설(Body2 Secondary).
- **Lucide line icon** — strokeWidth 1.5, primary.main (Warm Black) 으로 제시.

### 데이터 소스
\`src/data/content.js\`의 \`brandValue.features\` 항목을 그대로 feature prop에 꽂을 수 있다.
        `,
      },
    },
  },
  argTypes: {
    feature: {
      control: 'object',
      description: 'content.js의 brandValue.features 항목 { id, icon, title, description, detailedDescription }',
    },
    icon: {
      control: 'select',
      options: ['CircleDot', 'Repeat', 'Activity'],
      description: '아이콘 id 문자열 (lucide-react)',
    },
    iconSize: {
      control: { type: 'number', min: 16, max: 64, step: 2 },
      description: '아이콘 크기 (px)',
    },
    iconColor: {
      control: 'text',
      description: '아이콘 색상 토큰 (예: primary.main)',
    },
    title: {
      control: 'text',
      description: '브랜드 가치명 (영문)',
    },
    description: {
      control: 'text',
      description: '영문 한 줄 설명',
    },
    detailedDescription: {
      control: 'text',
      description: '한글 상세 설명',
    },
    align: {
      control: 'radio',
      options: ['start', 'center'],
      description: '내부 정렬',
    },
  },
};

/**
 * 기본 — Immanence 항목을 content.js에서 그대로 전달.
 */
export const Default = {
  args: {
    feature: features[0],
    iconSize: 32,
    iconColor: 'primary.main',
    align: 'start',
  },
  render: (args) => (
    <Box sx={ { maxWidth: 360 } }>
      <BrandValueCard { ...args } />
    </Box>
  ),
};

/**
 * Triplet — 세 가치를 3-column Grid로 병치. 브랜드 소개 섹션의 실제 배치 모습.
 */
export const Triplet = {
  render: () => (
    <Box sx={ { maxWidth: 1080, width: '100%', px: 2 } }>
      <Grid container spacing={ 4 }>
        { features.map((f) => (
          <Grid key={ f.id } size={ { xs: 12, sm: 4 } }>
            <BrandValueCard feature={ f } />
          </Grid>
        )) }
      </Grid>
    </Box>
  ),
};

/**
 * Centered — 아이콘과 텍스트를 중앙 정렬. 히어로 하단 같은 강조 배치에 적합.
 */
export const Centered = {
  args: {
    feature: features[1],
    align: 'center',
    iconSize: 40,
  },
  render: (args) => (
    <Box sx={ { maxWidth: 480 } }>
      <BrandValueCard { ...args } />
    </Box>
  ),
};

/**
 * CompactNoDetail — detailedDescription을 생략한 간결한 버전.
 */
export const CompactNoDetail = {
  args: {
    icon: 'Activity',
    title: 'Flexibility',
    description: 'Auto by default, precise on demand.',
    align: 'start',
    iconSize: 28,
  },
  render: (args) => (
    <Box sx={ { maxWidth: 320 } }>
      <BrandValueCard { ...args } />
    </Box>
  ),
};
