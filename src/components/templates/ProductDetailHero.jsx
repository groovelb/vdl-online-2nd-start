import { forwardRef, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { TimeBlendImage } from '../media/TimeBlendImage';
import { OptionSelector } from '../input/OptionSelector';
import { QuantityAddToCart } from '../input/QuantityAddToCart';
import { PRODUCT_OPTIONS } from '../../data/products';
import { SPACING } from '../../styles/tokens';

/**
 * 초기 옵션값 — 각 카테고리의 첫 번째 옵션을 기본 선택.
 */
const getInitialOptions = () => ({
  glassFinish: PRODUCT_OPTIONS.glassFinish[0]?.value,
  hardware: PRODUCT_OPTIONS.hardware[0]?.value,
  height: PRODUCT_OPTIONS.height[0]?.value,
});

/**
 * ProductDetailHero 컴포넌트
 *
 * 제품 상세 페이지의 상단 히어로. 좌측에 공간 속 제품 TimeBlendImage, 우측에 메타 정보·
 * 옵션(마감·금속·높이)·담기 액션을 배치. TimeBlendImage에 layoutId를 부여하여 랜딩
 * 그리드의 카드에서 Shared Element 정방향 전이 대상이 된다(후속 작업).
 *
 * 레이아웃:
 * - md 이상: 좌 6 / 우 6 수평 분할, 우측은 세로 스택(타이틀/메타/옵션/담기)
 * - md 미만: 이미지가 위, 정보가 아래
 *
 * 동작 방식:
 * 1. product 객체에서 images[0]=day, images[1]=night를 TimeBlendImage로 렌더.
 * 2. 내부 useState로 선택된 옵션과 수량을 관리(페이지 단위 상태).
 * 3. 담기 액션 클릭 → onAddToCart({ productId, title, image, options, quantity }).
 *
 * Props:
 * @param {object} product - products.js 배열 항목 [Required]
 * @param {string} layoutId - Shared Element 전이 식별자 (랜딩과 동일 값) [Optional]
 * @param {function} onAddToCart - (line) => void 콜백 [Optional]
 * @param {object} sx - 외곽 스타일 [Optional]
 *
 * Example usage:
 * <ProductDetailHero product={ product } layoutId={ `product-${ product.id }` } onAddToCart={ handleAdd } />
 */
const ProductDetailHero = forwardRef(function ProductDetailHero({
  product,
  layoutId,
  onAddToCart,
  sx,
  ...props
}, ref) {
  const [options, setOptions] = useState(getInitialOptions);

  if (!product) return null;

  const setOption = (key) => (value) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = (quantity) => {
    onAddToCart?.({
      productId: product.id,
      title: product.title,
      image: product.images?.[0],
      options,
      quantity,
    });
  };

  const metaParts = [
    typeof product.lux === 'number' ? `${ product.lux }LX` : null,
    typeof product.kelvin === 'number' ? `${ product.kelvin }K` : null,
    product.form,
  ].filter(Boolean);

  return (
    <Box ref={ ref } { ...props } sx={ { width: '100%', ...sx } }>
      <Grid container spacing={ { xs: 3, md: 0 } }>
        {/* 좌측 이미지 */}
        <Grid size={ { xs: 12, md: 6 } }>
          <Box
            sx={ {
              width: '100%',
              aspectRatio: '4/5',
            } }
          >
            <TimeBlendImage
              dayImage={ product.images?.[0] }
              nightImage={ product.images?.[1] ?? product.images?.[0] }
              alt={ product.title ? `${ product.title } in space` : '' }
              innerClassName={ layoutId ? 'product-detail-hero-media' : undefined }
              sx={ {
                width: '100%',
                height: '100%',
              } }
              { ...(layoutId ? { 'data-layout-id': layoutId } : {}) }
            />
          </Box>
        </Grid>

        {/* 우측 정보 */}
        <Grid size={ { xs: 12, md: 6 } }>
          <Box
            sx={ {
              display: 'flex',
              flexDirection: 'column',
              gap: SPACING.stack.md,
              px: { xs: 0, md: SPACING.inset.md, lg: SPACING.inset.lg },
              py: { xs: SPACING.section.sm, md: SPACING.section.md },
            } }
          >
            {/* 타입 overline */}
            { product.type && (
              <Typography
                variant="overline"
                sx={ {
                  color: 'text.secondary',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                } }
              >
                { product.type }
              </Typography>
            ) }

            {/* 영문 타이틀 */}
            <Typography
              component="h1"
              sx={ {
                typography: { xs: 'h3', md: 'h2' },
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
              } }
            >
              { product.title }
            </Typography>

            {/* 빛 메타 */}
            { metaParts.length > 0 && (
              <Typography
                variant="body2"
                sx={ {
                  color: 'text.secondary',
                  letterSpacing: '0.04em',
                  fontVariantNumeric: 'tabular-nums',
                } }
              >
                { metaParts.join(' · ') }
              </Typography>
            ) }

            {/* 한글 해설 */}
            { product.description && (
              <Typography
                variant="body1"
                sx={ {
                  color: 'text.primary',
                  opacity: 0.85,
                  lineHeight: 1.7,
                  mt: 1,
                } }
              >
                { product.description }
              </Typography>
            ) }

            {/* 옵션 3종 */}
            <Box sx={ { display: 'flex', flexDirection: 'column', gap: SPACING.stack.sm, mt: 1 } }>
              <OptionSelector
                label="Glass Finish"
                options={ PRODUCT_OPTIONS.glassFinish }
                value={ options.glassFinish }
                onChange={ setOption('glassFinish') }
              />
              <OptionSelector
                label="Hardware"
                options={ PRODUCT_OPTIONS.hardware }
                value={ options.hardware }
                onChange={ setOption('hardware') }
              />
              <OptionSelector
                label="Height"
                options={ PRODUCT_OPTIONS.height }
                value={ options.height }
                onChange={ setOption('height') }
              />
            </Box>

            {/* 담기 액션 */}
            <Box sx={ { mt: 2 } }>
              <QuantityAddToCart onAdd={ handleAdd } />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
});

export { ProductDetailHero };
