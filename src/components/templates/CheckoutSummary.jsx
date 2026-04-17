import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useCartSafe } from '../../contexts/CartContext';
import { SPACING } from '../../styles/tokens';

/**
 * 옵션 객체 → 한 줄 메타 ('Clear · Patina Brass · 36" - 48"').
 */
const formatOptions = (options) => {
  if (!options) return '';
  const parts = [ options.glassFinish, options.hardware, options.height ].filter(Boolean);
  return parts.join(' · ');
};

/**
 * CheckoutSummary 컴포넌트
 *
 * 체크아웃 우측 **스티키 주문 요약 영역**. 사용자가 긴 폼을 채우는 동안에도 지금 무엇을
 * 사고 있는지(시나리오 3) 내내 확인할 수 있게 한다.
 *
 * 구성:
 * 1. Section header — "Order Summary" 라벨 + 총 수량
 * 2. 아이템 리스트 — 썸네일 + 제목 + 옵션 메타 + 수량
 * 3. Divider
 * 4. Place Order CTA
 *
 * 금액 표기는 이번 demo 범위에서 생략 — 제품 데이터에 가격 필드가 없으므로
 * 'Contact for pricing' 안내만 노출한다.
 *
 * 동작 방식:
 * 1. useCartSafe로 items·totalCount 구독(없으면 null 렌더).
 * 2. CTA 클릭 → onPlaceOrder() 호출. 버튼 상태는 `isSubmitting`로 제어.
 *
 * Props:
 * @param {function} onPlaceOrder - () => void. CTA 클릭 핸들러 [Optional]
 * @param {boolean} isSubmitting - 제출 중 상태 [Optional, 기본값: false]
 * @param {object} sx - 외곽 스타일 [Optional]
 */
const CheckoutSummary = forwardRef(function CheckoutSummary({
  onPlaceOrder,
  isSubmitting = false,
  sx,
  ...props
}, ref) {
  const cart = useCartSafe();
  if (!cart) return null;

  const { items, totalCount } = cart;
  const isEmpty = items.length === 0;

  return (
    <Box
      ref={ ref }
      component="aside"
      aria-label="Order summary"
      { ...props }
      sx={ {
        position: { md: 'sticky' },
        top: { md: 96 },
        alignSelf: { md: 'flex-start' },
        display: 'flex',
        flexDirection: 'column',
        gap: SPACING.stack.sm,
        ...sx,
      } }
    >
      <Box sx={ { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' } }>
        <Typography
          component="h2"
          sx={ {
            typography: { xs: 'h6', md: 'h5' },
            letterSpacing: '-0.01em',
          } }
        >
          Order Summary
        </Typography>
        { !isEmpty && (
          <Typography variant="caption" sx={ { color: 'text.secondary', fontVariantNumeric: 'tabular-nums' } }>
            { totalCount } item{ totalCount === 1 ? '' : 's' }
          </Typography>
        ) }
      </Box>

      <Divider sx={ { borderColor: 'divider' } } />

      { isEmpty ? (
        <Box sx={ { py: SPACING.inset.lg, color: 'text.secondary', textAlign: 'center' } }>
          <Typography variant="body2">장바구니가 비어 있습니다.</Typography>
        </Box>
      ) : (
        <Box
          sx={ {
            display: 'flex',
            flexDirection: 'column',
            gap: SPACING.stack.sm,
            maxHeight: { md: '50vh' },
            overflowY: { md: 'auto' },
            pr: { md: 1 },
          } }
        >
          { items.map((it) => (
            <Box
              key={ it.lineId }
              sx={ {
                display: 'flex',
                gap: SPACING.gap.md,
                py: SPACING.inset.xs,
              } }
            >
              { it.image && (
                <Box
                  component="img"
                  src={ it.image }
                  alt={ it.title ?? '' }
                  sx={ {
                    width: 64,
                    height: 80,
                    objectFit: 'cover',
                    flexShrink: 0,
                    backgroundColor: 'grey.100',
                  } }
                />
              ) }
              <Box sx={ { flex: 1, display: 'flex', flexDirection: 'column', gap: 0.25 } }>
                <Typography variant="subtitle2" sx={ { fontWeight: 700, letterSpacing: '0.01em' } }>
                  { it.title }
                </Typography>
                { formatOptions(it.options) && (
                  <Typography variant="caption" sx={ { color: 'text.secondary' } }>
                    { formatOptions(it.options) }
                  </Typography>
                ) }
                <Typography
                  variant="caption"
                  sx={ {
                    color: 'text.secondary',
                    mt: 0.5,
                    fontVariantNumeric: 'tabular-nums',
                  } }
                >
                  Qty { it.quantity }
                </Typography>
              </Box>
            </Box>
          )) }
        </Box>
      ) }

      <Divider sx={ { borderColor: 'divider' } } />

      {/* 가격 placeholder — demo 범위에서는 정식 단가 없음 */}
      <Box sx={ { display: 'flex', flexDirection: 'column', gap: SPACING.gap.sm } }>
        <Box sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } }>
          <Typography variant="overline" sx={ { letterSpacing: '0.16em', color: 'text.secondary' } }>
            Total
          </Typography>
          <Typography variant="body2" sx={ { color: 'text.secondary' } }>
            Contact for pricing
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        type="submit"
        onClick={ onPlaceOrder }
        disabled={ isEmpty || isSubmitting }
        sx={ {
          mt: SPACING.gap.md,
          backgroundColor: 'text.primary',
          color: 'background.default',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 600,
          py: 1.5,
          '&:hover': {
            backgroundColor: 'text.primary',
            opacity: 0.85,
          },
        } }
      >
        { isSubmitting ? 'Placing order…' : 'Place Order' }
      </Button>
    </Box>
  );
});

export { CheckoutSummary };
