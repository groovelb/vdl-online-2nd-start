import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { alpha, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { content } from '../../data/content';
import { SPACING } from '../../styles/tokens';

const DEFAULT_STEPS = [
  { id: 'cart', label: 'Cart' },
  { id: 'information', label: 'Information' },
  { id: 'complete', label: 'Complete' },
];

/**
 * CheckoutTopBar 컴포넌트
 *
 * 체크아웃의 격리 레이아웃 상단 바. UX 문서(시나리오 3, 패턴 5·8)에 따라 **GNB를 없애고
 * 로고 + 단계 표시만** 남긴다. 사용자는 현재 어느 단계에 있는지만 인지하고, 다른 곳으로의
 * 유혹(메뉴/카트/검색)은 노출하지 않는다.
 *
 * 구성:
 * - 좌측: 브랜드 로고 타이포(클릭 시 랜딩으로 — 최소한의 이탈 경로만 허용)
 * - 우측: 단계 표시 (Cart → Information → Complete)
 *
 * 동작 방식:
 * 1. activeStep 문자열 매칭으로 현재 단계에 강조.
 * 2. 로고 클릭 시 navigate('/') — 유일한 나갈 경로.
 *
 * Props:
 * @param {string} activeStep - 현재 단계 id [Optional, 기본값: 'information']
 * @param {array} steps - 단계 목록 [{ id, label }] [Optional, 기본값: DEFAULT_STEPS]
 * @param {object} sx - 외곽 스타일 [Optional]
 *
 * Example usage:
 * <CheckoutTopBar activeStep="information" />
 */
const CheckoutTopBar = forwardRef(function CheckoutTopBar({
  activeStep = 'information',
  steps = DEFAULT_STEPS,
  sx,
  ...props
}, ref) {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      ref={ ref }
      component="header"
      { ...props }
      sx={ {
        width: '100%',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: alpha(theme.palette.background.default, 0.6),
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        ...sx,
      } }
    >
      <Box
        sx={ {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: {
            xs: SPACING.page.gutter.xs,
            sm: SPACING.page.gutter.sm,
            md: SPACING.page.gutter.md,
            lg: SPACING.page.gutter.lg,
          },
          py: SPACING.inset.sm,
          maxWidth: 1440,
          mx: 'auto',
        } }
      >
        {/* 로고 */}
        <ButtonBase
          onClick={ () => navigate('/') }
          aria-label={ `${ content.brand.name } home` }
          sx={ {
            letterSpacing: '-0.02em',
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'text.primary',
              outlineOffset: 4,
            },
          } }
        >
          <Typography
            component="span"
            sx={ {
              typography: { xs: 'h6', md: 'h5' },
              color: 'text.primary',
            } }
          >
            { content.brand.name }
          </Typography>
        </ButtonBase>

        {/* 단계 표시 */}
        <Box
          sx={ {
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, md: SPACING.gap.md },
          } }
          aria-label="Checkout progress"
        >
          { steps.map((s, i) => {
            const isActive = s.id === activeStep;
            return (
              <Box
                key={ s.id }
                sx={ {
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1, md: SPACING.gap.md },
                } }
              >
                <Typography
                  variant="overline"
                  sx={ {
                    letterSpacing: '0.16em',
                    color: isActive ? 'text.primary' : 'text.secondary',
                    fontWeight: isActive ? 700 : 400,
                    fontSize: { xs: 10, md: 11 },
                  } }
                >
                  { s.label }
                </Typography>
                { i < steps.length - 1 && (
                  <Box
                    aria-hidden="true"
                    sx={ {
                      width: { xs: 12, md: 24 },
                      height: '1px',
                      backgroundColor: mutedLineColor(theme, isActive),
                    } }
                  />
                ) }
              </Box>
            );
          }) }
        </Box>
      </Box>
    </Box>
  );
});

const mutedLineColor = (theme, isActive) =>
  isActive ? theme.palette.text.primary : alpha(theme.palette.text.primary, 0.25);

export { CheckoutTopBar };
