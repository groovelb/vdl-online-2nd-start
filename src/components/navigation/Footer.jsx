import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { content } from '../../data/content';
import { SPACING } from '../../styles/tokens';

/**
 * Footer 컴포넌트
 *
 * 사이트 전역 하단 Footer. Lumenstate 톤에 맞춰 장식 없이 브랜드명·태그라인·네비게이션
 * 링크·카피라이트만 노출. 상단 1px divider로 본문과 구분하며, 테마 토큰 기반 색상으로
 * 타임라인 전환 시 자연스럽게 반전된다.
 *
 * 레이아웃:
 * - md 이상: 좌측 브랜드 블록(name + tagline) / 우측 네비 링크 수평 나열
 * - md 미만: 수직 스택 (브랜드 → 네비 → 카피라이트)
 *
 * 동작 방식:
 * 1. content.js의 `brand` + `navigation.menuItems` + `footer.copyright`를 데이터 소스로.
 * 2. 네비는 react-router Link로 이동.
 *
 * Props:
 * @param {object} sx - 외곽 래퍼 추가 스타일 [Optional]
 *
 * Example usage:
 * <Footer />
 */
const Footer = forwardRef(function Footer({ sx, ...props }, ref) {
  return (
    <Box
      ref={ ref }
      component="footer"
      { ...props }
      sx={ {
        width: '100%',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
        ...sx,
      } }
    >
      <Box
        sx={ {
          maxWidth: 1440,
          mx: 'auto',
          px: {
            xs: SPACING.page.gutter.xs,
            sm: SPACING.page.gutter.sm,
            md: SPACING.page.gutter.md,
            lg: SPACING.page.gutter.lg,
          },
          py: { xs: SPACING.section.md, md: SPACING.section.lg },
        } }
      >
        {/* 상단 — 브랜드 / 네비 */}
        <Box
          sx={ {
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            gap: { xs: SPACING.stack.md, md: 4 },
          } }
        >
          {/* 브랜드 */}
          <Box>
            <Typography
              component="p"
              sx={ {
                typography: { xs: 'h5', md: 'h4' },
                letterSpacing: '-0.02em',
                lineHeight: 1,
                mb: 1,
              } }
            >
              { content.brand.name }
            </Typography>
            <Typography
              variant="body2"
              sx={ {
                color: 'text.secondary',
                letterSpacing: '0.02em',
              } }
            >
              { content.brand.tagline }
            </Typography>
          </Box>

          {/* 네비 링크 */}
          <Box
            component="nav"
            aria-label="Footer navigation"
            sx={ {
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 3 },
            } }
          >
            { content.navigation.menuItems.map((item) => (
              <Box
                key={ item.id }
                component={ Link }
                to={ item.path }
                sx={ {
                  color: 'text.secondary',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  fontSize: 14,
                  py: 0.5,
                  '&:hover': { color: 'text.primary' },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'text.primary',
                    outlineOffset: 2,
                  },
                  '@media (prefers-reduced-motion: no-preference)': {
                    transition: (t) => `color ${ t.transitions.duration.short }ms ${ t.transitions.easing.smooth }`,
                  },
                } }
              >
                { item.label }
              </Box>
            )) }
          </Box>
        </Box>

        {/* 하단 — 카피라이트 */}
        <Box
          sx={ {
            mt: { xs: SPACING.section.md, md: SPACING.section.md },
            pt: { xs: SPACING.inset.md, md: SPACING.inset.lg },
            borderTop: '1px solid',
            borderColor: 'divider',
          } }
        >
          <Typography
            variant="caption"
            sx={ {
              color: 'text.secondary',
              letterSpacing: '0.04em',
            } }
          >
            { content.footer.copyright }
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});

export { Footer };
