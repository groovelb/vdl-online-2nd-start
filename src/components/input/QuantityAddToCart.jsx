import { forwardRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { Minus, Plus } from 'lucide-react';
import { SPACING } from '../../styles/tokens';

/**
 * QuantityAddToCart 컴포넌트
 *
 * 제품 상세의 "담기 액션" 묶음. 수량 스테퍼(-/+)와 Add to Cart CTA 버튼을 한 단위로 제공한다.
 * 내부 수량 state를 관리하며, 클릭 시 `onAdd(quantity)` 콜백을 호출한다 — 이후 실제
 * 장바구니 로직은 상위 페이지에서 처리.
 *
 * 동작 방식:
 * 1. 초기 수량은 `initialQuantity` (기본 1), min/max로 경계.
 * 2. -/+ 버튼은 lucide-react Minus/Plus (1px stroke) — 디자인 시스템 기본 아이콘 규칙 준수.
 * 3. CTA 클릭 → onAdd(quantity) → (선택적으로) 내부 수량을 초기값으로 리셋.
 *
 * Props:
 * @param {function} onAdd - (quantity) => void. 클릭 시 호출 [Optional]
 * @param {number} initialQuantity - 초기 수량 [Optional, 기본값: 1]
 * @param {number} min - 최소 수량 [Optional, 기본값: 1]
 * @param {number} max - 최대 수량 [Optional, 기본값: 99]
 * @param {string} ctaLabel - CTA 텍스트 [Optional, 기본값: 'Add to Cart']
 * @param {boolean} resetAfterAdd - 추가 후 수량 초기값으로 복원 [Optional, 기본값: true]
 * @param {boolean} isDisabled - 전체 비활성화 [Optional, 기본값: false]
 * @param {object} sx - 외곽 스타일 [Optional]
 *
 * Example usage:
 * <QuantityAddToCart onAdd={ (q) => cart.add({ ...item, quantity: q }) } />
 */
const QuantityAddToCart = forwardRef(function QuantityAddToCart({
  onAdd,
  initialQuantity = 1,
  min = 1,
  max = 99,
  ctaLabel = 'Add to Cart',
  resetAfterAdd = true,
  isDisabled = false,
  sx,
  ...props
}, ref) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const theme = useTheme();

  const clamp = (n) => Math.max(min, Math.min(max, n));
  const dec = () => setQuantity((q) => clamp(q - 1));
  const inc = () => setQuantity((q) => clamp(q + 1));

  const handleAdd = () => {
    if (isDisabled) return;
    onAdd?.(quantity);
    if (resetAfterAdd) setQuantity(initialQuantity);
  };

  return (
    <Box
      ref={ ref }
      { ...props }
      sx={ {
        display: 'flex',
        alignItems: 'stretch',
        gap: SPACING.gap.md,
        width: '100%',
        ...sx,
      } }
    >
      {/* 수량 스테퍼 */}
      <Box
        sx={ {
          display: 'flex',
          alignItems: 'center',
          border: '1px solid',
          borderColor: 'divider',
          px: 0.5,
          minWidth: 136,
        } }
      >
        <IconButton
          size="small"
          onClick={ dec }
          disabled={ isDisabled || quantity <= min }
          aria-label="Decrease quantity"
          sx={ {
            color: 'text.primary',
            borderRadius: 0,
            '&:hover': { backgroundColor: alpha(theme.palette.text.primary, 0.06) },
          } }
        >
          <Minus size={ 16 } strokeWidth={ 1 } />
        </IconButton>
        <Typography
          sx={ {
            flex: 1,
            textAlign: 'center',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 600,
            userSelect: 'none',
          } }
        >
          { quantity }
        </Typography>
        <IconButton
          size="small"
          onClick={ inc }
          disabled={ isDisabled || quantity >= max }
          aria-label="Increase quantity"
          sx={ {
            color: 'text.primary',
            borderRadius: 0,
            '&:hover': { backgroundColor: alpha(theme.palette.text.primary, 0.06) },
          } }
        >
          <Plus size={ 16 } strokeWidth={ 1 } />
        </IconButton>
      </Box>

      {/* Add to Cart CTA */}
      <Button
        variant="contained"
        onClick={ handleAdd }
        disabled={ isDisabled }
        sx={ {
          flex: 1,
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
        { ctaLabel }
      </Button>
    </Box>
  );
});

export { QuantityAddToCart };
