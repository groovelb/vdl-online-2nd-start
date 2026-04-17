import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { AppShell } from './components/layout/AppShell';
import { TimelineProvider, useTimeline } from './contexts/TimelineContext';
import { defaultTheme, darkTheme } from './styles/themes';

/**
 * 현재 슬롯의 theme 필드로 MUI 테마를 선택하고, slot.bg/slot.fg로
 * 전역 배경·전경 색을 연속 블렌딩한다. MUI 테마 스왑은 light↔dark 2개만
 * 커버하지만, palette.timeline[slotId].{bg,fg}는 4개 슬롯 톤을 제공하여
 * afternoon·evening 중간 값을 지나가는 연속적 시간의 결을 구현한다.
 * ProductCard가 timeValue로 Day/Night 이미지를 블렌드하는 것과 동일한
 * TimelineContext 구독 체계. TimelineProvider 내부에서만 렌더해야 한다.
 */
function ThemedShell({ children }) {
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

function App() {
  return (
    <TimelineProvider>
      <ThemedShell>
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<div />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </ThemedShell>
    </TimelineProvider>
  );
}

export default App;
