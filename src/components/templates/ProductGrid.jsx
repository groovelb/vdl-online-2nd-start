import { forwardRef, useLayoutEffect, useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ProductCard } from '../card/ProductCard';
import { SPACING } from '../../styles/tokens';

/**
 * 필터 전환 3-phase 타이밍 (ms). Phase 사이의 엄격한 순차 대신 소폭 overlap으로 전환 간 공백을 줄였다.
 * Lumenstate Continuity 원칙: 사라짐 → 수평 이동 → 수직 이동 → 등장 (순서는 유지, 이어붙임은 overlap).
 *
 * 시간축:
 *   0       Exit 시작 (fade-out, 1000ms)
 *   150     Rearrange X 시작 (이전 대기 500 → 150으로 단축)
 *   750     Rearrange Y 시작
 *   1000    Exit 종료
 *   1150    Enter 시작 (Y 종료 200ms 전부터 fade-in 오버랩)
 *   1350    Rearrange Y 종료
 *   2150    Enter 종료 (fade-in, 1000ms)
 *
 * Easing은 easeOutQuart(도착 감속).
 */
const EXIT_MS = 1000;
const REARRANGE_START_DELAY_MS = 150;
const REARRANGE_X_MS = 600;
const REARRANGE_Y_MS = 600;
const ENTER_MS = 1000;
const ENTER_OVERLAP_MS = 200;
const ENTER_DELAY_MS =
  REARRANGE_START_DELAY_MS + REARRANGE_X_MS + REARRANGE_Y_MS - ENTER_OVERLAP_MS; // 1150
const FLIP_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'; // easeOutQuart
const EASING_POINTS = [0.22, 1, 0.36, 1];
const BLUR_AMOUNT = 8;

/**
 * 반응형 columns 설정을 CSS Grid gridTemplateColumns 값으로 변환.
 */
const toGridTemplate = (columns) =>
  Object.fromEntries(
    Object.entries(columns).map(([bp, n]) => [bp, `repeat(${ n }, minmax(0, 1fr))`])
  );

/**
 * ProductGrid 컴포넌트
 *
 * products 배열을 받아 ProductCard를 반응형 그리드로 배치하고,
 * 목록 변화 시 Lumenstate Continuity 원칙에 따른 **3-phase 필터 전환**을 실행한다.
 *
 * 3-Phase 전환 시퀀스 (총 900ms):
 *   1. Exit (0~250ms)       — 제거 대상 카드: opacity 1→0, blur 0→8px (제자리에서 소멸)
 *   2. Rearrange X (250~450ms) — 유지 카드 중 이동 대상: 수평 delta만 이동
 *   3. Rearrange Y (450~650ms) — 이어서 수직 delta 이동 (사선 이동 금지)
 *   4. Enter (650~900ms)    — 신규 카드: 최종 위치에서 opacity 0→1, blur 8→0px (이동 없음)
 *
 * 구현:
 * - AnimatePresence `mode="popLayout"`: 제거 카드를 시각적으로 제자리에 두고 그리드 reflow 허용
 * - 수동 FLIP: useLayoutEffect에서 prev/next bounding rect 비교 → inverted transform 적용 후
 *   setTimeout 시퀀스로 X → Y 순차 재생 (Framer Motion `layout`은 사선이므로 미사용)
 * - 신규 카드: initial={ opacity:0, blur } → animate={ opacity:1, blur:0 } with delay 650ms
 * - prefers-reduced-motion: 시퀀스 전부 스킵, 즉시 표시
 *
 * 동작 방식:
 * 1. products 배열을 순회하며 ProductCard를 렌더 (motion.div 래퍼).
 * 2. columns prop으로 브레이크포인트별 열 수를 지정 (CSS Grid).
 * 3. timeValue를 모든 카드에 전파하여 "한 슬라이더가 그리드 전체를 묶는" 시간 공유 감각 지원.
 * 4. onProductClick(product)으로 카드 클릭 이벤트를 상위에서 수신.
 * 5. layoutIdPrefix가 있으면 각 카드에 `${ prefix }${ id }` 형태의 layoutId가 부여된다.
 *
 * Props:
 * @param {array} products - 제품 객체 배열 [Required]
 * @param {object} columns - 브레이크포인트별 열 수. 예: { xs: 2, sm: 3, md: 4, lg: 5 } [Optional, 기본값: { xs: 2, sm: 3, md: 4, lg: 5 }]
 * @param {string} gap - 카드 사이 간격 ('xs' | 'sm' | 'md' | 'lg' | 'xl') [Optional, 기본값: 'md']
 * @param {number} timeValue - 시간 값 0(Day)~1(Night). 모든 카드에 전파. 미지정 시 각 ProductCard가 TimelineContext에서 자동 구독 [Optional]
 * @param {string} ratio - 이미지 비율 [Optional, 기본값: '4/5']
 * @param {function} onProductClick - 카드 클릭 핸들러. (product) => void [Optional]
 * @param {string} layoutIdPrefix - Shared Element 전이용 layoutId 접두사 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <ProductGrid products={ filteredProducts } timeValue={ time } onProductClick={ (p) => navigate(`/product/${ p.id }`) } />
 */
const ProductGrid = forwardRef(function ProductGrid({
  products,
  columns = { xs: 2, sm: 3, md: 4, lg: 5 },
  gap = 'md',
  timeValue,
  ratio = '4/5',
  onProductClick,
  layoutIdPrefix,
  sx,
  ...props
}, ref) {
  const gridTemplateColumns = useMemo(() => toGridTemplate(columns), [columns]);
  const gapValue = SPACING.gap[gap] ?? SPACING.gap.md;

  const reduceMotion = useReducedMotion();

  /** id -> DOM 엘리먼트 맵. 카드 래퍼 측정용. */
  const itemRefs = useRef(new Map());
  /** id -> { x, y } 이전 layout에서의 viewport 기준 좌표. */
  const positions = useRef(new Map());
  /** 이전 렌더의 id Set. null이면 최초 렌더. */
  const prevIds = useRef(null);
  /** 진행 중인 FLIP 타이머 추적. 필터 연타 시 취소. */
  const activeTimers = useRef([]);

  /**
   * 필터 변화 감지 시 FLIP 시퀀스 실행.
   * 레이아웃이 커밋된 직후(useLayoutEffect)에 prev/next 좌표 비교.
   */
  useLayoutEffect(() => {
    if (reduceMotion) {
      prevIds.current = new Set((products || []).map((p) => p.id ?? p.title));
      return undefined;
    }

    // 이전 시퀀스 취소
    activeTimers.current.forEach(clearTimeout);
    activeTimers.current = [];

    const newPositions = new Map();
    const nextIds = new Set();
    const toMove = [];

    itemRefs.current.forEach((el, id) => {
      if (!el || !document.contains(el)) return;
      const rect = el.getBoundingClientRect();
      newPositions.set(id, { x: rect.left, y: rect.top });
      nextIds.add(id);

      if (prevIds.current && prevIds.current.has(id)) {
        const prev = positions.current.get(id);
        if (prev) {
          const dx = prev.x - rect.left;
          const dy = prev.y - rect.top;
          if (dx !== 0 || dy !== 0) {
            toMove.push({ el, dx, dy });
          }
        }
      }
    });

    if (toMove.length > 0) {
      // FLIP 반전: 이전 위치로 즉시 이동 (transition 없음)
      toMove.forEach(({ el, dx, dy }) => {
        el.style.transition = 'none';
        el.style.transform = `translate(${ dx }px, ${ dy }px)`;
      });
      // 스타일 확정을 위한 레이아웃 강제 flush
      // eslint-disable-next-line no-unused-expressions
      toMove[0].el.offsetHeight;

      // Phase 1(Exit) 시작 후 REARRANGE_START_DELAY_MS 만에 Phase 2a(X) 시작
      const tStartX = setTimeout(() => {
        toMove.forEach(({ el, dy }) => {
          el.style.transition = `transform ${ REARRANGE_X_MS }ms ${ FLIP_EASING }`;
          el.style.transform = `translate(0px, ${ dy }px)`;
        });

        // Phase 2b(Y)
        const tStartY = setTimeout(() => {
          toMove.forEach(({ el }) => {
            el.style.transition = `transform ${ REARRANGE_Y_MS }ms ${ FLIP_EASING }`;
            el.style.transform = 'translate(0px, 0px)';
          });

          // 완료 후 cleanup
          const tCleanup = setTimeout(() => {
            toMove.forEach(({ el }) => {
              el.style.transition = '';
              el.style.transform = '';
            });
          }, REARRANGE_Y_MS);
          activeTimers.current.push(tCleanup);
        }, REARRANGE_X_MS);
        activeTimers.current.push(tStartY);
      }, REARRANGE_START_DELAY_MS);
      activeTimers.current.push(tStartX);
    }

    positions.current = newPositions;
    prevIds.current = nextIds;

    return () => {
      activeTimers.current.forEach(clearTimeout);
      activeTimers.current = [];
    };
  }, [products, reduceMotion]);

  if (!Array.isArray(products) || products.length === 0) return null;

  const isFirstRender = prevIds.current === null;

  /**
   * Enter transition — 신규 카드만 mount 시 적용.
   * 최초 렌더는 delay 없이, 필터 변경 이후부터 ENTER_DELAY_MS 만큼 지연.
   */
  const enterTransition = reduceMotion
    ? { duration: 0 }
    : {
      duration: ENTER_MS / 1000,
      delay: isFirstRender ? 0 : ENTER_DELAY_MS / 1000,
      ease: EASING_POINTS,
    };

  const exitTransition = reduceMotion
    ? { duration: 0 }
    : { duration: EXIT_MS / 1000, ease: EASING_POINTS };

  return (
    <Box
      ref={ ref }
      { ...props }
      sx={ {
        display: 'grid',
        gridTemplateColumns,
        columnGap: gapValue,
        rowGap: (theme) => theme.spacing(typeof gapValue === 'number' ? gapValue * 1.5 : 4),
        width: '100%',
        ...sx,
      } }
    >
      <AnimatePresence mode="popLayout" initial={ false }>
        { products.map((product) => {
          const key = product.id ?? product.title;
          return (
            <motion.div
              key={ key }
              ref={ (el) => {
                if (el) itemRefs.current.set(key, el);
                else itemRefs.current.delete(key);
              } }
              initial={ reduceMotion ? false : { opacity: 0, filter: `blur(${ BLUR_AMOUNT }px)` } }
              animate={ { opacity: 1, filter: 'blur(0px)' } }
              exit={ { opacity: 0, filter: `blur(${ BLUR_AMOUNT }px)`, transition: exitTransition } }
              transition={ enterTransition }
              style={ { minWidth: 0, willChange: 'transform, opacity, filter' } }
            >
              <ProductCard
                product={ product }
                timeValue={ timeValue }
                ratio={ ratio }
                layoutId={ layoutIdPrefix ? `${ layoutIdPrefix }${ product.id }` : undefined }
                onClick={ onProductClick ? () => onProductClick(product) : undefined }
              />
            </motion.div>
          );
        }) }
      </AnimatePresence>
    </Box>
  );
});

export { ProductGrid };
