import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LineGrid from '../layout/LineGrid';
import { BrandValueCard } from '../card/BrandValueCard';
import { content } from '../../data/content';
import { SPACING } from '../../styles/tokens';

/**
 * BrandValueSection 컴포넌트
 *
 * Lumenstate 브랜드의 세 가치(Immanence / Continuity / Flexibility)를 `LineGrid` 기반의
 * 3열 수평 분할로 나열하는 섹션. 각 셀은 `BrandValueCard`를 하나씩 담으며, 셀 사이의
 * 1px 라인은 HeroSection과 동일한 그리드 리듬을 만든다. 모바일(md 미만)에서는 3행
 * 수직 스택으로 전환되고, LineGrid가 가로선 → 세로선으로 자동 전환한다.
 *
 * 동작 방식:
 * 1. content.js의 `brandValue.features` (3개 항목)를 기본 데이터로 사용.
 *    외부에서 `features` prop을 넘기면 그 값이 우선한다.
 * 2. 셀 크기: 데스크톱(md↑) size xs:4, 모바일 size xs:12.
 * 3. 각 셀 내부는 `SPACING.inset`을 사용한 일관된 여백으로 카드를 감싼다.
 * 4. LineGrid borderColor는 `text.primary` 토큰으로 테마 반전에 자동 대응.
 *
 * Props:
 * @param {array} features - 브랜드 가치 항목 배열 [{ id, icon, title, description, detailedDescription }] [Optional, 기본값: content.brandValue.features]
 * @param {string} borderColor - LineGrid 라인 색상 토큰 [Optional, 기본값: 'text.primary']
 * @param {object} cardSx - 각 BrandValueCard에 전달되는 추가 스타일 [Optional]
 * @param {object} sx - 외곽 래퍼 추가 스타일 [Optional]
 *
 * Example usage:
 * <BrandValueSection />
 * <BrandValueSection features={ customFeatures } borderColor="divider" />
 */
const BrandValueSection = forwardRef(function BrandValueSection({
  features = content.brandValue.features,
  borderColor = 'text.primary',
  cardSx,
  sx,
  ...props
}, ref) {
  return (
    <Box
      ref={ ref }
      { ...props }
      sx={ {
        width: '100%',
        ...sx,
      } }
    >
      <LineGrid container gap={ 0 } borderColor={ borderColor }>
        { features.map((feature) => (
          <Grid key={ feature.id } size={ { xs: 12, md: 4 } }>
            <Box
              sx={ {
                height: '100%',
                p: {
                  xs: SPACING.inset.lg,
                  md: SPACING.inset.xl,
                },
              } }
            >
              <BrandValueCard feature={ feature } sx={ cardSx } />
            </Box>
          </Grid>
        )) }
      </LineGrid>
    </Box>
  );
});

export { BrandValueSection };
