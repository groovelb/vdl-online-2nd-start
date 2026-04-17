import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { ShoppingBag } from 'lucide-react';
import { AppShell } from './components/layout/AppShell';
import { FloatingTimelineControl } from './components/overlay-feedback/FloatingTimelineControl';
import { CartDrawer } from './components/overlay-feedback/CartDrawer';
import { Footer } from './components/navigation/Footer';
import { LandingPage } from './stories/page/LandingPage';
import { ProductDetailPage } from './stories/page/ProductDetailPage';
import { CheckoutPage } from './stories/page/CheckoutPage';
import { CheckoutCompletePage } from './stories/page/CheckoutCompletePage';
import { TimelineProvider, useTimeline } from './contexts/TimelineContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { defaultTheme, darkTheme } from './styles/themes';
import { smoothstep, lerpHex } from './utils/timeBlend';
import { content } from './data/content';

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
    <ThemeProvider theme={ activeTheme }>
      <CssBaseline />
      <Box
        sx={ {
          minHeight: '100vh',
          backgroundColor: bg,
          color: fg,
          '@media (prefers-reduced-motion: no-preference)': {
            transition: (t) => `background-color ${ t.transitions.duration.slowest }ms ${ t.transitions.easing.smooth }, color ${ t.transitions.duration.slowest }ms ${ t.transitions.easing.smooth }`,
          },
        } }
      >
        { children }
      </Box>
    </ThemeProvider>
  );
}

/**
 * GNB 좌측 로고 — 브랜드명을 h5/h6 크기로 노출하고 '/' 링크.
 */
function ShellLogo() {
  return (
    <Typography
      component={ Link }
      to="/"
      sx={ {
        typography: { xs: 'h6', md: 'h5' },
        color: 'text.primary',
        textDecoration: 'none',
        letterSpacing: '-0.02em',
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'text.primary',
          outlineOffset: 4,
        },
      } }
    >
      { content.brand.name }
    </Typography>
  );
}

/**
 * GNB에 노출할 실존 라우트 화이트리스트.
 * content.navigation.menuItems 중 여기 포함된 path만 렌더되어 404 링크를 방지한다.
 * 새 페이지가 생기면 이 Set에 path를 추가한다.
 */
const EXISTING_NAV_PATHS = new Set(['/']);

const visibleNavItems = content.navigation.menuItems.filter((item) =>
  EXISTING_NAV_PATHS.has(item.path),
);

/**
 * GNB 우측 네비 — content.navigation.menuItems 중 실존 라우트만 수평 나열.
 * 모바일에선 drawer로 이동. 노출 가능한 항목이 없으면 null.
 */
function ShellNav() {
  if (visibleNavItems.length === 0) return null;
  return (
    <Box
      component="nav"
      aria-label="Primary"
      sx={ {
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 1.5, md: 3 },
      } }
    >
      { visibleNavItems.map((item) => (
        <Box
          key={ item.id }
          component={ Link }
          to={ item.path }
          sx={ {
            color: 'text.primary',
            textDecoration: 'none',
            fontSize: 14,
            letterSpacing: '0.04em',
            py: 0.5,
            '&:hover': { opacity: 0.7 },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'text.primary',
              outlineOffset: 2,
            },
            '@media (prefers-reduced-motion: no-preference)': {
              transition: (t) => `opacity ${ t.transitions.duration.short }ms ${ t.transitions.easing.smooth }`,
            },
          } }
        >
          { item.label }
        </Box>
      )) }
    </Box>
  );
}

/**
 * GNB persistent 카트 버튼 — 현재 담긴 수량 badge 표시, 클릭 시 CartDrawer 오픈.
 */
function ShellCartButton() {
  const cart = useCart();
  return (
    <IconButton
      onClick={ cart.open }
      aria-label={ `Open cart (${ cart.totalCount } items)` }
      sx={ {
        color: 'text.primary',
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'text.primary',
          outlineOffset: 2,
        },
      } }
    >
      <Badge
        badgeContent={ cart.totalCount }
        color="primary"
        sx={ {
          '& .MuiBadge-badge': {
            fontSize: 10,
            minWidth: 16,
            height: 16,
            letterSpacing: 0,
          },
        } }
      >
        <ShoppingBag size={ 20 } strokeWidth={ 1 } />
      </Badge>
    </IconButton>
  );
}

/**
 * AppShell layout route — 랜딩·제품 상세 등 앱 셸(GNB·Footer·FloatingTimelineControl·CartDrawer)을
 * 공유하는 라우트 묶음. react-router v6의 Outlet 패턴으로 자식 라우트를 받는다.
 * 체크아웃 라우트는 이 레이아웃 바깥에 배치되어 GNB/Footer/Timeline/CartDrawer 전부 제외된다
 * (02-ux-flow.md 시나리오 3, 패턴 5·8 — 격리 체크아웃).
 */
function AppShellLayout() {
  const hasNav = visibleNavItems.length > 0;
  return (
    <>
      <AppShell
        logo={ <ShellLogo /> }
        headerCollapsible={ hasNav ? <ShellNav /> : undefined }
        headerPersistent={ <ShellCartButton /> }
        footer={ <Footer /> }
      >
        <Outlet />
      </AppShell>
      <CartDrawer />
      <FloatingTimelineControl />
    </>
  );
}

function App() {
  return (
    <TimelineProvider>
      <CartProvider>
        <ThemedShell>
          <BrowserRouter>
            <Routes>
              {/* 앱 셸 안 — 랜딩/제품 상세 */}
              <Route element={ <AppShellLayout /> }>
                <Route path="/" element={ <LandingPage /> } />
                <Route path="/product/:id" element={ <ProductDetailPage /> } />
              </Route>

              {/* 앱 셸 바깥 — 격리 체크아웃 */}
              <Route path="/checkout" element={ <CheckoutPage /> } />
              <Route path="/checkout/complete" element={ <CheckoutCompletePage /> } />
            </Routes>
          </BrowserRouter>
        </ThemedShell>
      </CartProvider>
    </TimelineProvider>
  );
}

export default App;
