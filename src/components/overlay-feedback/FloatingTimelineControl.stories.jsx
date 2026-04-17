import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FloatingTimelineControl } from './FloatingTimelineControl';

export default {
  title: 'Component/9. Overlay & Feedback/FloatingTimelineControl',
  component: FloatingTimelineControl,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## FloatingTimelineControl

사이트 전역에서 **항상 뷰포트 중앙 하단에 떠 있는** 시간대 컨트롤.

### 특징
- **글래스모피즘** 컨테이너 — backdrop-filter blur/saturate + 반투명 배경
- **4슬롯** (점심 12 · 오후 16 · 저녁 20 · 밤 24) — 아이콘(Material Symbols) + 시간 표기
- **layoutId 슬라이딩 하이라이트** — 선택 표시가 슬롯 사이를 spring으로 이동
- **TimelineContext 구독** — 버튼 클릭 시 사이트 전체 배경·테마·제품 카드 블렌드가 동기 전환

### Storybook에서
Storybook 최상단 toolbar의 **Time of Day**와 본 컴포넌트가 양방향 싱크되어 있어, 어느 쪽을 조작해도 반대쪽이 따라온다.
        `,
      },
    },
  },
  argTypes: {
    bottom: {
      control: { type: 'number', min: 0, max: 120 },
      description: '화면 하단에서의 거리 (px)',
    },
    zIndex: {
      control: { type: 'number' },
      description: '스택 레벨',
    },
  },
};

/**
 * 기본 — 뷰포트 중앙 하단에 고정. 클릭/toolbar 어느 쪽으로든 슬롯 전환 가능.
 */
export const Default = {
  args: {
    bottom: 24,
    zIndex: 1200,
  },
  render: (args) => (
    <Box
      sx={ {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      } }
    >
      <Typography variant="overline" sx={ { color: 'text.secondary' } }>
        컨트롤은 하단 고정 — 스크롤·줌과 무관하게 항상 같은 위치
      </Typography>
      <FloatingTimelineControl { ...args } />
    </Box>
  ),
};

/**
 * Raised — 하단 여백을 늘려 다른 UI(예: 하단 CTA, 쿠키 배너)와의 충돌을 피한다.
 */
export const Raised = {
  args: {
    bottom: 80,
    zIndex: 1200,
  },
  render: (args) => (
    <Box sx={ { minHeight: '100vh', p: 4 } }>
      <Typography variant="overline" sx={ { color: 'text.secondary' } }>
        bottom: 80
      </Typography>
      <FloatingTimelineControl { ...args } />
    </Box>
  ),
};
