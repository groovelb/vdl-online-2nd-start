import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { CheckoutTopBar } from '../../components/templates/CheckoutTopBar';
import { SPACING } from '../../styles/tokens';

/**
 * CheckoutCompletePage 컴포넌트
 *
 * 주문 완료 페이지. CheckoutTopBar의 activeStep="complete"로 단계가 끝났음을 명시하고,
 * 홈으로 돌아가는 단 하나의 CTA만 제공해 혼란을 최소화한다.
 *
 * 레이아웃:
 * - 상단: CheckoutTopBar
 * - 본문: 화면 가운데에 완료 아이콘 + 메시지 + 홈 CTA
 *
 * Props:
 * @param {object} sx - 외곽 스타일 [Optional]
 */
const CheckoutCompletePage = forwardRef(function CheckoutCompletePage({ sx, ...props }, ref) {
  const navigate = useNavigate();

  return (
    <Box
      ref={ ref }
      { ...props }
      sx={ {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      } }
    >
      <CheckoutTopBar activeStep="complete" />

      <Box
        sx={ {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: SPACING.stack.sm,
          px: SPACING.inset.lg,
          py: SPACING.section.xl,
        } }
      >
        <Box
          sx={ {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: '999px',
            border: '1px solid',
            borderColor: 'text.primary',
            color: 'text.primary',
            mb: SPACING.gap.md,
          } }
        >
          <Check size={ 24 } strokeWidth={ 1 } />
        </Box>

        <Typography
          component="h1"
          sx={ {
            typography: { xs: 'h4', md: 'h2' },
            letterSpacing: '-0.02em',
            mb: 1,
          } }
        >
          Thank you.
        </Typography>

        <Typography
          variant="body1"
          sx={ {
            color: 'text.secondary',
            maxWidth: 480,
            lineHeight: 1.7,
          } }
        >
          주문이 정상적으로 접수되었습니다. 확인 이메일을 곧 보내 드리며, 제품 준비 및 배송 일정은 별도로 안내드립니다.
        </Typography>

        <Button
          variant="outlined"
          onClick={ () => navigate('/') }
          sx={ {
            mt: SPACING.section.sm,
            color: 'text.primary',
            borderColor: 'text.primary',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 600,
            px: 4,
            py: 1.25,
            '&:hover': {
              borderColor: 'text.primary',
              backgroundColor: 'transparent',
              opacity: 0.85,
            },
          } }
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
});

export { CheckoutCompletePage };
