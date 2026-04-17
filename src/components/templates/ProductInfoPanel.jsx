import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Divider from '@mui/material/Divider';
import { SPACING } from '../../styles/tokens';

/**
 * Specification 테이블 정의. product의 어떤 필드를 어떤 레이블로 노출할지.
 */
const SPEC_ROWS = [
  { key: 'type', label: 'Type' },
  { key: 'mounting', label: 'Mounting' },
  { key: 'form', label: 'Form' },
  { key: 'lightPattern', label: 'Light Pattern' },
  { key: 'lux', label: 'Illuminance', format: (v) => `${ v } LX` },
  { key: 'kelvin', label: 'Color Temperature', format: (v) => `${ v } K` },
];

/**
 * 섹션 레이블 — overline 톤으로 Description / Specification 구분만 제공.
 */
const SectionLabel = ({ children }) => (
  <Typography
    variant="overline"
    sx={ {
      display: 'block',
      color: 'text.secondary',
      letterSpacing: '0.16em',
      mb: SPACING.gap.md,
    } }
  >
    { children }
  </Typography>
);

/**
 * ProductInfoPanel 컴포넌트
 *
 * 제품 상세 하단 정보 패널. Description과 Specification을 **탭 없이 한 번에 수직 배치**하여
 * 사용자가 스크롤만으로 모든 정보를 훑을 수 있게 한다. Lumenstate Immanence 톤:
 * 섹션 구분은 overline 레이블 + Divider 1px로만 표시, 장식 없음.
 *
 * 구성:
 * 1. Description — product.description 본문 단락
 * 2. Divider
 * 3. Specification — SPEC_ROWS에 따라 product의 필드를 테이블로 표시 (값 없으면 skip)
 *
 * Props:
 * @param {object} product - products.js 배열 항목 [Required]
 * @param {object} sx - 외곽 스타일 [Optional]
 *
 * Example usage:
 * <ProductInfoPanel product={ product } />
 */
const ProductInfoPanel = forwardRef(function ProductInfoPanel({
  product,
  sx,
  ...props
}, ref) {
  if (!product) return null;

  return (
    <Box ref={ ref } { ...props } sx={ { width: '100%', ...sx } }>
      {/* Description */}
      <Box sx={ { mb: SPACING.section.lg } }>
        <SectionLabel>Description</SectionLabel>
        <Typography
          variant="body1"
          sx={ {
            color: 'text.primary',
            lineHeight: 1.8,
            letterSpacing: '0.01em',
          } }
        >
          { product.description }
        </Typography>
      </Box>

      <Divider sx={ { borderColor: 'divider', mb: SPACING.section.lg } } />

      {/* Specification */}
      <Box>
        <SectionLabel>Specification</SectionLabel>
        <TableContainer>
          <Table size="small">
            <TableBody>
              { SPEC_ROWS.map(({ key, label, format }) => {
                const v = product[key];
                if (v === undefined || v === null || v === '') return null;
                const display = format ? format(v) : String(v);
                return (
                  <TableRow key={ key } sx={ { '& td': { borderColor: 'divider' } } }>
                    <TableCell
                      sx={ {
                        color: 'text.secondary',
                        width: '40%',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        fontSize: 12,
                      } }
                    >
                      { label }
                    </TableCell>
                    <TableCell
                      sx={ {
                        color: 'text.primary',
                        fontFamily: 'inherit',
                        fontVariantNumeric: 'tabular-nums',
                      } }
                    >
                      { display }
                    </TableCell>
                  </TableRow>
                );
              }) }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
});

export { ProductInfoPanel };
