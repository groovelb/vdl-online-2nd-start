import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { TopSection } from '../../components/templates/TopSection';
import { BrandElevationSection } from '../../components/templates/BrandElevationSection';
import { ProductShowcase } from '../../components/templates/ProductShowcase';
import { products as defaultProducts } from '../../data/products';
import { content } from '../../data/content';
import { SPACING } from '../../styles/tokens';

/**
 * LandingPage 컴포넌트
 *
 * Lumenstate 랜딩 페이지 전체 조합. TopSection(Hero + BrandValueSection) → BrandElevationSection
 * → Product Showcase 섹션 순으로 수직 결합한 페이지 레벨 템플릿.
 *
 * 레이아웃 / 흐름:
 * 1. TopSection — 풀블리드. HeroSection + BrandValueSection을 LineGrid로 묶은 최상단 블록
 * 2. BrandElevationSection — 풀블리드 공간 단면 영상 3편(가로 스크롤 + 프레임 스크럽)
 * 3. Product Showcase 섹션 (풀블리드) — 가운데 정렬된 섹션 헤더 + ProductShowcase
 *
 * 동작 방식:
 * 1. products는 기본적으로 data/products.js를 사용. 외부 주입 가능.
 * 2. heroHeight / borderColor는 TopSection으로 전파.
 * 3. 쇼케이스 관련 prop(defaultType, columns, layoutIdPrefix, onProductClick)은
 *    ProductShowcase로 그대로 전파 — 페이지 상위에서 라우팅/상세전이 핸들링이 가능하다.
 *
 * Props:
 * @param {array} products - 제품 객체 배열 [Optional, 기본값: data/products.js의 products]
 * @param {string} heroHeight - HeroSection 높이. 미지정 시 이미지 원본 비율로 자동 결정 [Optional]
 * @param {string} borderColor - LineGrid 라인 색상 토큰 [Optional, 기본값: 'text.primary']
 * @param {string} defaultType - 쇼케이스 초기 선택 타입 id [Optional, 기본값: 'all']
 * @param {object} columns - 쇼케이스 그리드 브레이크포인트별 열 수 [Optional]
 * @param {string} layoutIdPrefix - Shared Element 전이용 layoutId 접두사 [Optional, 기본값: 'product-']
 * @param {function} onProductClick - 카드 클릭 핸들러. (product) => void [Optional, 기본값: /product/:id 네비게이트]
 * @param {object} sx - 외곽 래퍼 추가 스타일 [Optional]
 *
 * Example usage:
 * <LandingPage onProductClick={ (p) => navigate(`/product/${ p.id }`) } />
 */
const LandingPage = forwardRef(function LandingPage({
  products = defaultProducts,
  heroHeight,
  borderColor = 'text.primary',
  defaultType = 'all',
  columns,
  layoutIdPrefix = 'product-',
  onProductClick,
  sx,
  ...props
}, ref) {
  const navigate = useNavigate();
  /**
   * onProductClick 미지정 시 기본 동작: `/product/:id`로 네비게이트.
   * 상위에서 커스텀 핸들러를 주입하면 override된다.
   */
  const handleProductClick = onProductClick ?? ((product) => {
    if (product?.id !== undefined) navigate(`/product/${ product.id }`);
  });

  return (
    <Box
      ref={ ref }
      { ...props }
      sx={ {
        width: '100%',
        ...sx,
      } }
    >
      <TopSection heroHeight={ heroHeight } borderColor={ borderColor } />

      <BrandElevationSection />

      <Box
        component="section"
        sx={ {
          width: '100%',
          py: { xs: SPACING.section.lg, md: SPACING.section.xl },
          px: {
            xs: SPACING.page.gutter.xs,
            sm: SPACING.page.gutter.sm,
            md: SPACING.page.gutter.md,
            lg: SPACING.page.gutter.lg,
          },
        } }
      >
        <Box
          sx={ {
            mb: { xs: SPACING.section.sm, md: SPACING.section.md },
            textAlign: 'center',
          } }
        >
          <Typography
            component="h2"
            sx={ {
              typography: { xs: 'h4', md: 'h3' },
              fontWeight: 700,
              letterSpacing: '-0.01em',
              mb: 1,
            } }
          >
            { content.products.sectionTitle }
          </Typography>
          <Typography
            variant="body1"
            sx={ {
              color: 'text.secondary',
              lineHeight: 1.5,
              maxWidth: 560,
              mx: 'auto',
            } }
          >
            { content.products.sectionSubtitle }
          </Typography>
        </Box>

        <ProductShowcase
          products={ products }
          defaultType={ defaultType }
          columns={ columns }
          layoutIdPrefix={ layoutIdPrefix }
          onProductClick={ handleProductClick }
        />
      </Box>
    </Box>
  );
});

export { LandingPage };
