import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import { defaultTheme, darkTheme } from '../src/styles/themes';
import { TimelineProvider, useTimeline } from '../src/contexts/TimelineContext';
import { TIME_SLOTS } from '../src/data/timeSlots';

// Google Fonts 로드 (Material Symbols + 기본 폰트)
const googleFonts = [
  // Material Symbols
  'Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  'Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  'Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
];

googleFonts.forEach((font) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font}&display=swap`;
  document.head.appendChild(link);
});

/**
 * 내부 셸 — TimelineProvider 자식에서 현재 슬롯 theme을 구독해 MUI 테마 주입.
 * 추가로 palette.timeline[slotId].{bg,fg}를 Box에 적용해 4개 슬롯 톤을 통과하는
 * 연속 배경 블렌딩을 구현한다 (App.jsx의 ThemedShell과 동일 구조).
 */
function StoryShell({ children }) {
  const { theme, slot } = useTimeline();
  const activeTheme = theme === 'dark' ? darkTheme : defaultTheme;
  const slotTokens = activeTheme.palette.timeline[slot.id];
  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: slotTokens.bg,
          color: slotTokens.fg,
          pt: 5,
          px: 2,
          '@media (prefers-reduced-motion: no-preference)': {
            transition: (t) => `background-color ${t.transitions.duration.slowest}ms ${t.transitions.easing.smooth}, color ${t.transitions.duration.slowest}ms ${t.transitions.easing.smooth}`,
          },
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
}

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    options: {
      storySort: {
        order: [
          'Overview',
          'Style',
          ['Overview', 'Colors', 'Typography', 'Icons', 'Spacing', 'Component Tokens'],
          'Component',
          [
            '1. Typography',
            '2. Container',
            '3. Card',
            '4. Media',
            '5. Data Display',
            '6. In-page Navigation',
            '7. Input & Control',
            '8. Layout',
            '9. Overlay & Feedback',
            '10. Navigation',
          ],
          'Interactive',
          ['12. Scroll'],
          'Common',
          'Template',
          'Test Data',
        ],
        method: 'alphabetical',
      },
    },
  },
  globalTypes: {
    timeOfDay: {
      name: 'Time of Day',
      description: '4개 시간대 슬롯을 전환해 라이트/다크 테마 + Day/Night 블렌드를 동시에 테스트',
      defaultValue: TIME_SLOTS[0].id,
      toolbar: {
        icon: 'time',
        items: TIME_SLOTS.map((s) => ({
          value: s.id,
          title: `${s.label} ${s.hour}:00 · ${s.theme}`,
        })),
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const slotId = context.globals.timeOfDay ?? TIME_SLOTS[0].id;
      return (
        <TimelineProvider slotId={slotId}>
          <StoryShell>
            <Story />
          </StoryShell>
        </TimelineProvider>
      );
    },
  ],
};

export default preview;
