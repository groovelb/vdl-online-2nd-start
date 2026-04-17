import { forwardRef, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { CheckoutTopBar } from '../../components/templates/CheckoutTopBar';
import { CheckoutForm } from '../../components/templates/CheckoutForm';
import { CheckoutSummary } from '../../components/templates/CheckoutSummary';
import { useCartSafe } from '../../contexts/CartContext';
import { SPACING } from '../../styles/tokens';

const INITIAL_VALUES = {
  email: '',
  phone: '',
  fullName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postalCode: '',
  country: '',
  discountCode: '',
};

/**
 * CheckoutPage 컴포넌트
 *
 * `/checkout` 라우트의 **격리 레이아웃 페이지**. AppShell(GNB) 바깥에서 렌더되어 사용자가
 * 결제 한 가지 일에 집중할 수 있도록 네비게이션·유혹 요소를 모두 제거한다
 * (02-ux-flow.md 시나리오 3, 패턴 5·8).
 *
 * 레이아웃:
 * - 상단: CheckoutTopBar (로고 + 단계 표시만)
 * - 본문 2열: 좌 CheckoutForm / 우 CheckoutSummary(sticky)
 * - mobile: 폼 위, 요약 아래로 스택
 *
 * 동작 방식:
 * 1. 폼 값은 내부 useState 하나의 객체(`values`)로 제어.
 * 2. Place Order → 필수 필드 체크 → 통과 시 `cart.clear()` + `navigate('/checkout/complete')`.
 *    간단 demo 범위로 브라우저 기본 required validation만 의존.
 *
 * Props:
 * @param {number} maxWidth - 본문 최대 폭 (px) [Optional, 기본값: 1240]
 * @param {object} sx - 외곽 스타일 [Optional]
 */
const CheckoutPage = forwardRef(function CheckoutPage({
  maxWidth = 1240,
  sx,
  ...props
}, ref) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cart = useCartSafe();
  const navigate = useNavigate();

  const handleChange = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    // demo 제출 플로우 — 장바구니 비우고 완료 페이지로.
    cart?.clear?.();
    navigate('/checkout/complete');
  };

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
      <CheckoutTopBar activeStep="information" />

      <Box
        component="form"
        onSubmit={ handleSubmit }
        sx={ {
          flex: 1,
          width: '100%',
          maxWidth,
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
        <Grid container spacing={ { xs: 4, md: 8 } }>
          <Grid size={ { xs: 12, md: 7, lg: 8 } }>
            <CheckoutForm values={ values } onChange={ handleChange } />
          </Grid>
          <Grid size={ { xs: 12, md: 5, lg: 4 } }>
            <CheckoutSummary
              onPlaceOrder={ handleSubmit }
              isSubmitting={ isSubmitting }
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
});

export { CheckoutPage };
