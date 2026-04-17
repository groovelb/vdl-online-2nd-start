import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LineGrid from '../layout/LineGrid';
import { TimeBlendImage } from '../media/TimeBlendImage';
import { content } from '../../data/content';
import arcLampLivingDay from '../../assets/brand-mood/arc-lamp-living.png';
import arcLampLivingNight from '../../assets/brand-mood/arc-lamp-living-night.png';
import archLightGalleryDay from '../../assets/brand-mood/arch-light-gallery.png';
import archLightGalleryNight from '../../assets/brand-mood/arch-light-gallery-night.png';

/**
 * 원본 이미지 aspect ratio — crop 없이 본 비율 그대로 표시하기 위해 사용.
 * 두 이미지는 2:1 그리드 셀에서 자연 높이가 서로 근접하도록 설계되어 있다.
 */
const ARC_LAMP_RATIO = '2528/1696';      // ≈ 1.49 (가로)
const ARCH_GALLERY_RATIO = '1792/2400';  // ≈ 0.75 (세로)

/**
 * 브랜드 타이틀 + 태그라인 오버레이. 데스크톱에서는 1번째(arc-lamp-living) 위에,
 * 모바일에서는 2번째(arch-light-gallery) 위에 얹힌다. 반응형 크기/패딩 포함.
 */
function BrandOverlay() {
  return (
    <Box
      sx={ {
        position: 'absolute',
        top: 0,
        left: 0,
        p: { xs: 3, sm: 4, md: 6, lg: 8 },
        zIndex: 2,
        color: 'text.primary',
        pointerEvents: 'none',
        maxWidth: '90%',
      } }
    >
      <Typography
        component="h1"
        sx={ {
          typography: { xs: 'h4', md: 'h1' },
          mb: { xs: 1.5, md: 2.5 },
        } }
      >
        { content.brand.name }
      </Typography>
      <Typography
        sx={ {
          fontWeight: 400,
          opacity: 0.85,
          letterSpacing: '0.02em',
          ml: 1,
          fontSize: {
            xs: '1.125rem',  // 18px
            md: '1.5rem',    // 24px
            lg: '1.75rem',   // 28px
          },
          lineHeight: 1.4,
        } }
      >
        { content.brand.tagline }
      </Typography>
    </Box>
  );
}

/**
 * HeroSection 컴포넌트
 *
 * Lumenstate 랜딩의 첫 히어로 섹션. 뷰포트 폭에 따라 구성이 달라진다.
 *
 * 반응형:
 * - **md 이상 (데스크톱)**: LineGrid 2:1 분할. 좌 arc-lamp-living(8, 브랜드 텍스트 오버레이),
 *   우 arch-light-gallery(4).
 * - **md 미만 (모바일)**: 2번째 이미지(arch-light-gallery)만 풀폭으로 노출하고 브랜드 텍스트
 *   오버레이가 이 이미지 위로 이동. 1번째 이미지는 렌더되지 않는다.
 *
 * 이미지 비율:
 * - 원본 aspect ratio를 유지하기 위해 TimeBlendImage에 `ratio` prop을 전달.
 * - arc-lamp-living: 2528×1696 (가로), arch-light-gallery: 1792×2400 (세로).
 *
 * 동작 방식:
 * 1. TimeBlendImage가 TimelineContext를 구독해 Day/Night 블렌드 자동 수행.
 * 2. 브랜드 타이틀은 `text.primary` 토큰 사용 → 테마 전환 시 자동 반전.
 * 3. 데스크톱·모바일 레이아웃은 CSS `display` 브레이크포인트로 전환(JS useMediaQuery 미사용).
 *
 * Props:
 * @param {string} height - 데스크톱 레이아웃 고정 높이. 미지정 시 이미지 원본 비율로 자동 [Optional]
 * @param {string} borderColor - LineGrid 라인 색상 토큰 [Optional, 기본값: 'text.primary']
 * @param {object} sx - 외곽 래퍼 추가 스타일 [Optional]
 *
 * Example usage:
 * <HeroSection />
 * <HeroSection height="100vh" />
 */
const HeroSection = forwardRef(function HeroSection({
  height,
  borderColor = 'text.primary',
  sx,
  ...props
}, ref) {
  const hasFixedHeight = height !== undefined;

  return (
    <Box
      ref={ ref }
      { ...props }
      sx={ {
        width: '100%',
        ...sx,
      } }
    >
      {/* Mobile: 2번째 이미지만 + 그 위에 브랜드 오버레이 */}
      <Box
        sx={ {
          display: { xs: 'block', md: 'none' },
          position: 'relative',
          width: '100%',
        } }
      >
        <TimeBlendImage
          dayImage={ archLightGalleryDay }
          nightImage={ archLightGalleryNight }
          alt="Arch light gallery"
          ratio={ ARCH_GALLERY_RATIO }
        />
        <BrandOverlay />
      </Box>

      {/* Desktop: LineGrid 2:1, 1번째 이미지에 오버레이 */}
      <Box
        sx={ {
          display: { xs: 'none', md: 'block' },
          width: '100%',
          ...(hasFixedHeight && { height }),
        } }
      >
        <LineGrid
          container
          gap={ 0 }
          borderColor={ borderColor }
          { ...(hasFixedHeight ? { equalHeight: true } : {}) }
        >
          <Grid
            size={ { xs: 8 } }
            sx={ hasFixedHeight ? undefined : { alignSelf: 'flex-start' } }
          >
            <Box
              sx={ {
                position: 'relative',
                width: '100%',
                ...(hasFixedHeight && { height: '100%' }),
              } }
            >
              <TimeBlendImage
                dayImage={ arcLampLivingDay }
                nightImage={ arcLampLivingNight }
                alt="Arc lamp in living space"
                { ...(hasFixedHeight ? {} : { ratio: ARC_LAMP_RATIO }) }
              />
              <BrandOverlay />
            </Box>
          </Grid>
          <Grid
            size={ { xs: 4 } }
            sx={ hasFixedHeight ? undefined : { alignSelf: 'flex-start' } }
          >
            <TimeBlendImage
              dayImage={ archLightGalleryDay }
              nightImage={ archLightGalleryNight }
              alt="Arch light gallery"
              { ...(hasFixedHeight ? {} : { ratio: ARCH_GALLERY_RATIO }) }
            />
          </Grid>
        </LineGrid>
      </Box>
    </Box>
  );
});

export { HeroSection };
