import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { AppShell } from './components/layout/AppShell';
import { FloatingTimelineControl } from './components/overlay-feedback/FloatingTimelineControl';
import { TimelineProvider, useTimeline } from './contexts/TimelineContext';
import { defaultTheme, darkTheme } from './styles/themes';
import { smoothstep, lerpHex } from './utils/timeBlend';

/**
 * 사이트 전역 배경/전경 색을 ProductCard의 Day/Night 이미지와 동일한 비율로 블렌드한다.
 * - 공용 곡선: `smoothstep(timeValue)` (utils/timeBlend.js)
 * - 배경: lerpHex(wallTintWhite, warmBlack, smoothstep(t))
 * - 전경: lerpHex(warmBlack, warmWhite, smoothstep(t))
 * MUI 테마 스왑은 afternoon↔evening 경계에서 component 색상을 뒤집는 역할만 맡는다.
 * TimelineProvider 내부에서만 렌더해야 한다.
 */
function ThemedShell({ children }) {
  const { theme, timeValue } = useTimeline();
  const activeTheme = theme === 'dark' ? darkTheme : defaultTheme;
  const brand = activeTheme.palette.brand;
  const blend = smoothstep(timeValue);
  const bg = lerpHex(brand.wallTintWhite, brand.warmBlack, blend);
  const fg = lerpHex(brand.warmBlack, brand.warmWhite, blend);

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: bg,
          color: fg,
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
        <FloatingTimelineControl />
      </ThemedShell>
    </TimelineProvider>
  );
}

export default App;
