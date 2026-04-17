import Box from '@mui/material/Box';
import { BrandElevationSection } from './BrandElevationSection';

export default {
  title: 'Template/BrandElevationSection',
  component: BrandElevationSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## BrandElevationSection

Lumenstate "공간의 단면(Elevation)" 영상 3편을 **텍스트 없이 풀블리드**로 제시하는 섹션.
한 화면에 하나의 영상(100vw × 100vh)만 노출되며, 세로 스크롤이 가로 이동으로 변환되면서
해당 영상의 프레임이 실시간으로 스크럽된다.

### 스크롤 흐름
1. HorizontalScrollContainer가 세로 스크롤을 가로 이동(0→-distance px)으로 변환.
2. 같은 진행도(0~1)를 \`onScrollProgress\`로 노출.
3. BrandElevationSection이 이 값을 3등분하여 각 슬라이드의 VideoScrubbing \`progress\`에 주입.
4. VideoScrubbing은 progress 기반 External Progress 모드로 currentTime을 직접 제어.

### 모바일 (md↓)
가로 스크롤 UX가 어색하므로 세로 스택으로 전환 — 각 슬라이드는 200vh 섹션 안 sticky 100vh
비디오로 배치되고, VideoScrubbing은 기존 scrollY + containerRef 모드로 동작.

### 로드 부하 완화
현재 활성 슬라이드 ±1만 \`preload='auto'\`, 나머지는 \`preload='metadata'\`로 토글.
        `,
      },
    },
  },
  argTypes: {
    videos: {
      control: 'object',
      description: '비디오 경로 배열 (3개 권장)',
    },
    slideWidth: {
      control: 'text',
      description: '데스크톱 슬라이드 너비 (CSS 단위)',
      table: { defaultValue: { summary: '100vw' } },
    },
    slideHeight: {
      control: 'text',
      description: '데스크톱 슬라이드 높이 (CSS 단위)',
      table: { defaultValue: { summary: '100vh' } },
    },
    gap: {
      control: 'text',
      description: '슬라이드 간 간격 (CSS 단위)',
      table: { defaultValue: { summary: '0px' } },
    },
    padding: {
      control: 'text',
      description: 'HorizontalScrollContainer 좌우 패딩 (CSS 단위)',
      table: { defaultValue: { summary: '0px' } },
    },
  },
};

/**
 * 기본 — 1 영상 = 100vw × 100vh, 슬라이드 간격 0.
 */
export const Default = {
  args: {
    slideWidth: '100vw',
    slideHeight: '100vh',
    gap: '0px',
    padding: '0px',
  },
  render: (args) => (
    <Box>
      <Box sx={ { height: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' } }>
        <Box sx={ { color: 'text.secondary', fontSize: 14 } }>↓ Scroll down to enter horizontal elevation scroll</Box>
      </Box>
      <BrandElevationSection { ...args } />
      <Box sx={ { height: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' } }>
        <Box sx={ { color: 'text.secondary', fontSize: 14 } }>End of section</Box>
      </Box>
    </Box>
  ),
};

/**
 * Shorter — 각 슬라이드 높이를 80vh로 줄여 상하에 여유를 둔 배치.
 */
export const Shorter = {
  args: {
    slideWidth: '100vw',
    slideHeight: '80vh',
    gap: '0px',
    padding: '0px',
  },
  render: (args) => (
    <Box>
      <Box sx={ { height: '30vh' } } />
      <BrandElevationSection { ...args } />
      <Box sx={ { height: '30vh' } } />
    </Box>
  ),
};
