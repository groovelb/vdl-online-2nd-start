import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { UnderlineTextField } from '../input/UnderlineTextField';
import { SPACING } from '../../styles/tokens';

/**
 * 섹션 라벨 — 체크아웃 폼 내부 각 구획(Contact/Shipping/Discount)을 구분.
 */
const SectionLabel = ({ children }) => (
  <Typography
    component="h2"
    sx={ {
      typography: { xs: 'h6', md: 'h5' },
      letterSpacing: '-0.01em',
      mb: SPACING.gap.lg,
    } }
  >
    { children }
  </Typography>
);

/**
 * CheckoutForm 컴포넌트
 *
 * 체크아웃 좌측 폼 영역. Contact / Shipping / Discount 3개 섹션을 수직 스택으로 구성한다.
 * 모든 입력은 UnderlineTextField — 브랜드의 "절제된 언더라인" 톤 유지(시나리오 3).
 *
 * 제어 방식:
 * - `values` 객체와 `onChange(name, value)` 콜백으로 제어(controlled).
 * - 필수 필드는 HTML `required`로 브라우저 기본 validation 활용(간단 demo 수준).
 *
 * 필드 구성:
 * - Contact: email (required), phone
 * - Shipping: fullName (required), addressLine1 (required), addressLine2, city (required),
 *   postalCode (required), country (required)
 * - Discount: discountCode
 *
 * Props:
 * @param {object} values - 제어 상태 값 객체 [Required]
 * @param {function} onChange - (name, value) => void [Required]
 * @param {object} sx - 외곽 스타일 [Optional]
 *
 * Example usage:
 * const [values, setValues] = useState({});
 * const handleChange = (name, value) => setValues((v) => ({ ...v, [name]: value }));
 * <CheckoutForm values={ values } onChange={ handleChange } />
 */
const CheckoutForm = forwardRef(function CheckoutForm({
  values = {},
  onChange,
  sx,
  ...props
}, ref) {
  const bind = (name) => ({
    name,
    value: values[name] ?? '',
    onChange: (e) => onChange?.(name, e.target.value),
  });

  return (
    <Box
      ref={ ref }
      { ...props }
      sx={ {
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: SPACING.section.md, md: SPACING.section.lg },
        ...sx,
      } }
    >
      {/* Contact */}
      <Box>
        <SectionLabel>Contact</SectionLabel>
        <Grid container spacing={ 3 }>
          <Grid size={ { xs: 12, sm: 6 } }>
            <UnderlineTextField
              label="Email"
              type="email"
              autoComplete="email"
              required
              { ...bind('email') }
            />
          </Grid>
          <Grid size={ { xs: 12, sm: 6 } }>
            <UnderlineTextField
              label="Phone"
              type="tel"
              autoComplete="tel"
              { ...bind('phone') }
            />
          </Grid>
        </Grid>
      </Box>

      {/* Shipping */}
      <Box>
        <SectionLabel>Shipping</SectionLabel>
        <Grid container spacing={ 3 }>
          <Grid size={ { xs: 12 } }>
            <UnderlineTextField
              label="Full Name"
              autoComplete="name"
              required
              { ...bind('fullName') }
            />
          </Grid>
          <Grid size={ { xs: 12 } }>
            <UnderlineTextField
              label="Address Line 1"
              autoComplete="address-line1"
              required
              { ...bind('addressLine1') }
            />
          </Grid>
          <Grid size={ { xs: 12 } }>
            <UnderlineTextField
              label="Address Line 2"
              autoComplete="address-line2"
              { ...bind('addressLine2') }
            />
          </Grid>
          <Grid size={ { xs: 12, sm: 6 } }>
            <UnderlineTextField
              label="City"
              autoComplete="address-level2"
              required
              { ...bind('city') }
            />
          </Grid>
          <Grid size={ { xs: 12, sm: 6 } }>
            <UnderlineTextField
              label="Postal Code"
              autoComplete="postal-code"
              required
              { ...bind('postalCode') }
            />
          </Grid>
          <Grid size={ { xs: 12 } }>
            <UnderlineTextField
              label="Country"
              autoComplete="country-name"
              required
              { ...bind('country') }
            />
          </Grid>
        </Grid>
      </Box>

      {/* Discount */}
      <Box>
        <SectionLabel>Discount</SectionLabel>
        <UnderlineTextField
          label="Discount Code"
          helperText="쿠폰이나 프로모션 코드가 있으면 입력하세요."
          { ...bind('discountCode') }
        />
      </Box>
    </Box>
  );
});

export { CheckoutForm };
