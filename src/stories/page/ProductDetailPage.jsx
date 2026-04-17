import { forwardRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useParams, useNavigate } from 'react-router-dom';
import { SectionContainer } from '../../components/container/SectionContainer';
import { ProductDetailHero } from '../../components/templates/ProductDetailHero';
import { ProductInfoPanel } from '../../components/templates/ProductInfoPanel';
import { products as defaultProducts } from '../../data/products';
import { useCartSafe } from '../../contexts/CartContext';
import { SPACING } from '../../styles/tokens';

/**
 * 좁은 페이지 폭. LandingPage는 full-bleed지만 상세 페이지는 읽기 중심이라
 * maxWidth를 두고 중앙 정렬한다.
 */
const NARROW_MAX_WIDTH = 1120;

/**
 * ProductDetailPage 컴포넌트
 *
 * `/product/:id` 라우트의 페이지 레벨 템플릿. URL 파라미터로 제품 id를 받아
 * `products` 배열에서 찾아 `ProductDetailHero` + `ProductInfoPanel`로 렌더.
 * CartContext가 존재하면 담기 액션을 연결하고 drawer를 연다.
 *
 * 레이아웃:
 * - SectionContainer로 감싸고 `maxWidth: ${ NARROW_MAX_WIDTH }px`로 중앙 정렬.
 * - 다른 페이지(랜딩 등)보다 좁게 구성되어 읽기·선택에 집중하는 editorial 톤.
 * - 하단 정보는 탭으로 분리하지 않고 Description + Specification을 한 번에 보여줌.
 *
 * 동작 방식:
 * 1. useParams().id (문자열) → Number(id) 변환 후 products에서 find.
 * 2. 미발견 시 안내 + 랜딩 복귀 버튼.
 * 3. onAddToCart 콜백: cart.add(line) + cart.open() 으로 drawer 오픈.
 *
 * Props:
 * @param {array} products - 제품 배열 [Optional, 기본값: data/products.js]
 * @param {string} layoutIdPrefix - Shared Element 전이용 layoutId 접두사 [Optional, 기본값: 'product-']
 * @param {number} maxWidth - 페이지 최대 폭 (px) [Optional, 기본값: 1120]
 * @param {object} sx - 외곽 래퍼 스타일 [Optional]
 *
 * Example usage:
 * <Route path="/product/:id" element={ <ProductDetailPage /> } />
 */
const ProductDetailPage = forwardRef(function ProductDetailPage({
  products = defaultProducts,
  layoutIdPrefix = 'product-',
  maxWidth = NARROW_MAX_WIDTH,
  sx,
  ...props
}, ref) {
  const { id } = useParams();
  const navigate = useNavigate();
  const cart = useCartSafe();

  const product = useMemo(() => {
    const nid = Number(id);
    if (!Array.isArray(products) || Number.isNaN(nid)) return null;
    return products.find((p) => p.id === nid) ?? null;
  }, [products, id]);

  const handleAddToCart = (line) => {
    if (!cart) return;
    cart.add(line);
    cart.open();
  };

  if (!product) {
    return (
      <Box
        sx={ {
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: SPACING.stack.sm,
          textAlign: 'center',
          px: SPACING.inset.md,
        } }
      >
        <Typography variant="h4" component="h1">Product not found</Typography>
        <Typography variant="body1" sx={ { color: 'text.secondary' } }>
          요청한 제품(id: { id })을 찾을 수 없습니다.
        </Typography>
        <Button
          variant="outlined"
          onClick={ () => navigate('/') }
          sx={ {
            mt: 2,
            color: 'text.primary',
            borderColor: 'text.primary',
            textTransform: 'none',
            letterSpacing: '0.04em',
          } }
        >
          랜딩으로 돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <SectionContainer
      ref={ ref }
      { ...props }
      sx={ {
        maxWidth,
        mx: 'auto',
        px: {
          xs: SPACING.page.gutter.xs,
          sm: SPACING.page.gutter.sm,
          md: SPACING.page.gutter.md,
          lg: SPACING.page.gutter.lg,
        },
        ...sx,
      } }
    >
      <ProductDetailHero
        product={ product }
        layoutId={ `${ layoutIdPrefix }${ product.id }` }
        onAddToCart={ handleAddToCart }
      />

      <Box
        component="section"
        sx={ {
          pt: { xs: SPACING.section.md, md: SPACING.section.lg },
          pb: { xs: SPACING.section.lg, md: SPACING.section.xl },
        } }
      >
        <ProductInfoPanel product={ product } />
      </Box>
    </SectionContainer>
  );
});

export { ProductDetailPage };
