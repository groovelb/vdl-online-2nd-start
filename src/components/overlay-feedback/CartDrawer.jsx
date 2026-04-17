import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartSafe } from '../../contexts/CartContext';
import { SPACING } from '../../styles/tokens';

/**
 * 옵션 객체를 한 줄 메타로 표현 ('Clear · Patina Brass · 36" - 48"').
 * 개별 option value는 products.js PRODUCT_OPTIONS의 label 미매핑 — 현재는 value 그대로 표기.
 */
const formatOptions = (options) => {
  if (!options) return '';
  const parts = [ options.glassFinish, options.hardware, options.height ].filter(Boolean);
  return parts.join(' · ');
};

/**
 * CartDrawer 컴포넌트
 *
 * 사이트 전역 우측 슬라이드 장바구니. CartContext를 구독해 `isOpen`이 true일 때 슬라이드 인.
 * "결제를 강요하지 않는다"는 원칙(`02-ux-flow.md:128`)에 따라 모달 대신 drawer,
 * 닫으면 원래 화면으로 복귀한다.
 *
 * 동작 방식:
 * 1. useCartSafe로 items·isOpen·close·update·remove 구독 (Provider 없으면 렌더 안 함).
 * 2. 각 아이템에 수량 조정(-/+)과 삭제 버튼.
 * 3. 하단 체크아웃 CTA (현재는 no-op — 라우트 생기면 navigate('/checkout') 연결).
 *
 * Props:
 * @param {object} sx - Drawer paper 추가 스타일 [Optional]
 *
 * Example usage:
 * // App.jsx 최상단에 한 번 렌더
 * <CartDrawer />
 */
const CartDrawer = forwardRef(function CartDrawer({ sx }, ref) {
  const cart = useCartSafe();
  const theme = useTheme();
  const navigate = useNavigate();

  if (!cart) return null;

  const { items, isOpen, close, update, remove, totalCount, clear } = cart;
  const isEmpty = items.length === 0;

  const handleCheckout = () => {
    close();
    navigate('/checkout');
  };

  return (
    <Drawer
      ref={ ref }
      anchor="right"
      open={ isOpen }
      onClose={ close }
      slotProps={ {
        paper: {
          sx: {
            width: { xs: '100%', sm: 420 },
            backgroundColor: 'background.default',
            backgroundImage: 'none',
            color: 'text.primary',
            ...sx,
          },
        },
      } }
    >
      <Box
        sx={ {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        } }
      >
        {/* 헤더 */}
        <Box
          sx={ {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: SPACING.inset.md,
            py: SPACING.inset.sm,
            borderBottom: '1px solid',
            borderColor: 'divider',
          } }
        >
          <Typography
            component="h2"
            sx={ {
              typography: { xs: 'h6', md: 'h5' },
              letterSpacing: '0.02em',
            } }
          >
            Cart { totalCount > 0 && `(${ totalCount })` }
          </Typography>
          <IconButton onClick={ close } aria-label="Close cart" sx={ { color: 'text.primary' } }>
            <X size={ 20 } strokeWidth={ 1 } />
          </IconButton>
        </Box>

        {/* 아이템 리스트 */}
        <Box
          sx={ {
            flex: 1,
            overflowY: 'auto',
            px: SPACING.inset.md,
            py: SPACING.inset.sm,
          } }
        >
          { isEmpty ? (
            <Box sx={ { textAlign: 'center', py: SPACING.section.lg, color: 'text.secondary' } }>
              <Typography variant="body1">장바구니가 비어 있습니다.</Typography>
              <Typography variant="body2" sx={ { mt: 1, opacity: 0.8 } }>
                관심 있는 제품을 담아 보세요.
              </Typography>
            </Box>
          ) : (
            items.map((it, idx) => (
              <Box
                key={ it.lineId }
                sx={ {
                  display: 'flex',
                  gap: SPACING.gap.md,
                  py: SPACING.inset.sm,
                  ...(idx < items.length - 1 && {
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }),
                } }
              >
                {/* 썸네일 */}
                { it.image && (
                  <Box
                    component="img"
                    src={ it.image }
                    alt={ it.title ?? '' }
                    sx={ {
                      width: 72,
                      height: 90,
                      objectFit: 'cover',
                      flexShrink: 0,
                      backgroundColor: 'grey.100',
                    } }
                  />
                ) }
                {/* 메타 + 수량 */}
                <Box sx={ { flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 } }>
                  <Typography variant="subtitle2" sx={ { fontWeight: 700 } }>
                    { it.title }
                  </Typography>
                  { formatOptions(it.options) && (
                    <Typography variant="caption" sx={ { color: 'text.secondary' } }>
                      { formatOptions(it.options) }
                    </Typography>
                  ) }
                  <Box
                    sx={ {
                      mt: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    } }
                  >
                    {/* 수량 스테퍼 */}
                    <Box
                      sx={ {
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                      } }
                    >
                      <IconButton
                        size="small"
                        onClick={ () => update(it.lineId, it.quantity - 1) }
                        aria-label="Decrease quantity"
                        sx={ { color: 'text.primary', borderRadius: 0 } }
                      >
                        <Minus size={ 14 } strokeWidth={ 1 } />
                      </IconButton>
                      <Typography
                        sx={ {
                          px: 1.5,
                          fontVariantNumeric: 'tabular-nums',
                          fontWeight: 600,
                          minWidth: 24,
                          textAlign: 'center',
                        } }
                      >
                        { it.quantity }
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={ () => update(it.lineId, it.quantity + 1) }
                        aria-label="Increase quantity"
                        sx={ { color: 'text.primary', borderRadius: 0 } }
                      >
                        <Plus size={ 14 } strokeWidth={ 1 } />
                      </IconButton>
                    </Box>
                    {/* 삭제 */}
                    <IconButton
                      size="small"
                      onClick={ () => remove(it.lineId) }
                      aria-label="Remove item"
                      sx={ {
                        color: 'text.secondary',
                        '&:hover': { color: 'text.primary', backgroundColor: alpha(theme.palette.text.primary, 0.06) },
                      } }
                    >
                      <Trash2 size={ 16 } strokeWidth={ 1 } />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))
          ) }
        </Box>

        {/* 하단 액션 */}
        { !isEmpty && (
          <>
            <Divider />
            <Box sx={ { px: SPACING.inset.md, py: SPACING.inset.md, display: 'flex', flexDirection: 'column', gap: SPACING.gap.sm } }>
              <Button
                variant="contained"
                onClick={ handleCheckout }
                sx={ {
                  backgroundColor: 'text.primary',
                  color: 'background.default',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  py: 1.5,
                  '&:hover': { backgroundColor: 'text.primary', opacity: 0.85 },
                } }
              >
                Checkout
              </Button>
              <Button
                variant="text"
                onClick={ clear }
                sx={ {
                  color: 'text.secondary',
                  textTransform: 'none',
                  fontWeight: 400,
                  alignSelf: 'center',
                } }
              >
                Clear cart
              </Button>
            </Box>
          </>
        ) }
      </Box>
    </Drawer>
  );
});

export { CartDrawer };
