import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { SPACING } from '../../styles/tokens';

/**
 * OptionSelector 컴포넌트
 *
 * Lumenstate 제품 상세에서 사용하는 옵션(마감·금속·높이) 선택기. 선택 가능한 **pill chip**
 * 리스트로 노출한다. 배경 칠을 쓰지 않아 글래스·Immanence 톤과 일관되며, 선택 상태는
 * **border + font-weight**로만 표시한다.
 *
 * 디자인:
 * - pill borderRadius: 999px — 모든 칩이 완전한 캡슐 형태
 * - 비선택: 1px `divider` 보더 + `text.secondary`
 * - 선택: 1.5px `text.primary` 보더 + `text.primary` + fontWeight 600
 * - hover: 보더가 `text.primary`로 강조되어도 배경 fill은 그대로 transparent
 *
 * 동작 방식:
 * 1. options 배열([{ value, label }])을 받아 수평 나열 (wrap 허용).
 * 2. value prop으로 제어형. 클릭 시 onChange(nextValue).
 * 3. MUI Chip(variant="outlined")에 sx로 pill radius + 팔레트 토큰만 override.
 *
 * Props:
 * @param {string} label - 섹션 레이블 (예: 'Glass Finish') [Optional]
 * @param {array} options - [{ value, label }] [Required]
 * @param {string} value - 현재 선택된 value [Optional]
 * @param {function} onChange - (nextValue) => void [Optional]
 * @param {object} sx - 외곽 래퍼 추가 스타일 [Optional]
 *
 * Example usage:
 * <OptionSelector
 *   label="Glass Finish"
 *   options={ PRODUCT_OPTIONS.glassFinish }
 *   value={ finish }
 *   onChange={ setFinish }
 * />
 */
const OptionSelector = forwardRef(function OptionSelector({
  label,
  options = [],
  value,
  onChange,
  sx,
  ...props
}, ref) {
  const theme = useTheme();

  return (
    <Box ref={ ref } { ...props } sx={ { ...sx } }>
      { label && (
        <Typography
          variant="overline"
          sx={ {
            display: 'block',
            color: 'text.secondary',
            letterSpacing: '0.12em',
            mb: SPACING.gap.sm,
          } }
        >
          { label }
        </Typography>
      ) }
      <Box
        sx={ {
          display: 'flex',
          flexWrap: 'wrap',
          gap: SPACING.gap.sm,
        } }
      >
        { options.map((opt) => {
          const isActive = opt.value === value;
          return (
            <Chip
              key={ opt.value }
              label={ opt.label }
              onClick={ () => onChange?.(opt.value) }
              variant="outlined"
              clickable
              aria-pressed={ isActive }
              sx={ {
                borderRadius: '999px',
                height: 'auto',
                py: 0.75,
                color: isActive ? 'text.primary' : 'text.secondary',
                borderColor: isActive ? 'text.primary' : 'divider',
                borderWidth: isActive ? 1.5 : 1,
                backgroundColor: 'transparent',
                letterSpacing: '0.02em',
                '& .MuiChip-label': {
                  px: 1.75,
                  py: 0.25,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                },
                '&.MuiChip-clickable:hover': {
                  backgroundColor: 'transparent',
                  borderColor: isActive ? 'text.primary' : alpha(theme.palette.text.primary, 0.5),
                },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'text.primary',
                  outlineOffset: 2,
                },
                '@media (prefers-reduced-motion: no-preference)': {
                  transition: (t) => `color ${ t.transitions.duration.short }ms ${ t.transitions.easing.smooth }, border-color ${ t.transitions.duration.short }ms ${ t.transitions.easing.smooth }`,
                },
              } }
            />
          );
        }) }
      </Box>
    </Box>
  );
});

export { OptionSelector };
