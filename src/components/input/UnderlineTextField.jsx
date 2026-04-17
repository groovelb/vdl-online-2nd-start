import { forwardRef } from 'react';
import TextField from '@mui/material/TextField';
import { alpha, useTheme } from '@mui/material/styles';

/**
 * UnderlineTextField 컴포넌트
 *
 * MUI TextField `variant="standard"`를 Lumenstate 브랜드 톤(언더라인 중심, 장식 최소화)으로
 * 감싼 래퍼. 체크아웃 폼을 중심으로 사용되며, 입력 중에도 차분함이 유지되도록 모든 상태가
 * 색과 언더라인 두께의 미세한 변화로만 표현된다.
 *
 * 스타일 원칙 (02-ux-flow.md 패턴 8):
 * - 언더라인 1px → focus 시 text.primary 컬러로 유지. filled / outlined 배경 금지.
 * - 라벨은 overline 톤(uppercase, 작은 size, letter-spacing)으로 차분하게.
 * - error 상태도 색만 바꾸고, 테두리/아이콘 장식은 지양.
 *
 * Props:
 * MUI TextField의 모든 prop을 그대로 수용. variant는 'standard'로 강제한다.
 *
 * Example usage:
 * <UnderlineTextField label="Email" name="email" required fullWidth />
 */
const UnderlineTextField = forwardRef(function UnderlineTextField({
  sx,
  InputLabelProps,
  InputProps,
  ...props
}, ref) {
  const theme = useTheme();
  const mutedLine = alpha(theme.palette.text.primary, 0.25);

  return (
    <TextField
      ref={ ref }
      variant="standard"
      fullWidth
      InputLabelProps={ {
        shrink: true,
        ...InputLabelProps,
        sx: {
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontSize: 11,
          color: 'text.secondary',
          fontWeight: 500,
          '&.Mui-focused': { color: 'text.primary' },
          '&.Mui-error': { color: 'error.main' },
          ...(InputLabelProps?.sx),
        },
      } }
      InputProps={ {
        ...InputProps,
        sx: {
          fontSize: 15,
          letterSpacing: '0.01em',
          color: 'text.primary',
          '&:before': { borderBottomColor: mutedLine, borderBottomWidth: 1 },
          '&:hover:not(.Mui-disabled, .Mui-error):before': { borderBottomColor: 'text.primary' },
          '&:after': { borderBottomColor: 'text.primary', borderBottomWidth: 1 },
          '& input': { py: 1 },
          ...(InputProps?.sx),
        },
      } }
      sx={ {
        '& .MuiFormHelperText-root': {
          fontSize: 11,
          letterSpacing: '0.04em',
          color: 'text.secondary',
        },
        ...sx,
      } }
      { ...props }
    />
  );
});

export { UnderlineTextField };
