# Components

Vibe Dictionary 텍소노미 v0.4 기반 분류. 번호는 텍소노미 카테고리 번호.

## 참조 문서

- 전체 텍소노미: `.claude/skills/component-work/resources/taxonomy-v0.4.md`
- 빠른 인덱스: `.claude/skills/component-work/resources/taxonomy-index.md`

새 컴포넌트 생성 시 위 문서에서 해당 카테고리 번호와 컴포넌트 원형을 확인한 후 구현할 것.

---

## 1. Typography — 텍스트 표현과 장식

- FitText: 컨테이너에 맞춤 텍스트 (`components/typography/FitText.jsx`)
- HighlightedTypography: 하이라이트 타이포그래피 (`components/typography/HighlightedTypography.jsx`)
- InlineTypography: 인라인 타이포그래피 (`components/typography/InlineTypography.jsx`)
- StretchedHeadline: 스트레치 헤드라인 (`components/typography/StretchedHeadline.jsx`)
- StyledParagraph: 스타일드 문단 (`components/typography/StyledParagraph.jsx`)
- Title: 타이틀 컴포넌트 (`components/typography/Title.jsx`)
- QuotedContainer: 인용 컨테이너 (`components/typography/QuotedContainer.jsx`)

## 2. Container — 시각적 경계와 그룹핑

- SectionContainer: 페이지 섹션 컨테이너. MUI Container 기반 (`components/container/SectionContainer.jsx`)
- CarouselContainer: 캐로셀 컨테이너 (`components/container/CarouselContainer.jsx`)
- RatioContainer: 비율 기반 컨테이너 (`components/container/RatioContainer.jsx`)

## 3. Card — 독립적 정보 단위

- CardContainer: 카드 기본 컨테이너. variant, padding, elevation (`components/card/CardContainer.jsx`)
- CustomCard: 미디어+콘텐츠 카드. vertical/horizontal/overlay 레이아웃 (`components/card/CustomCard.jsx`)
- ImageCard: 이미지 카드 (`components/card/ImageCard.jsx`)
- MoodboardCard: 무드보드 컬렉션 카드. 2x2 썸네일 그리드 (`components/card/MoodboardCard.jsx`)
- ProductCard: Lumenstate 제품 시그니처 카드. 이미지 영역은 TimeBlendImage에 위임, type Chip + 영문 타이틀 + 빛 메타(lux·kelvin), hover 시 `.ls-time-blend-media` scale 1.03, Framer Motion layoutId로 Shared Element 전이 준비 (`components/card/ProductCard.jsx`)
- BrandValueCard: Lumenstate 브랜드 가치 소개 카드. Lucide 라인 아이콘(CircleDot/Repeat/Activity) + 영문 타이틀(H5) + 영문 한 줄(Body1) + 한글 상세(Body2 Secondary). content.js의 brandValue.features 항목을 feature prop으로 그대로 수용 (`components/card/BrandValueCard.jsx`)
- Card: MUI Card 컴포넌트 [MUI]

## 4. Media — 이미지, 비디오 표시

- AspectMedia: 비율 기반 미디어 컨테이너 (`components/media/AspectMedia.jsx`)
- ImageCarousel: 이미지 캐로셀 (`components/media/ImageCarousel.jsx`)
- ImageTransition: 이미지 트랜지션 효과 (`components/media/ImageTransition.jsx`)
- CarouselIndicator: 캐로셀 인디케이터 (`components/media/CarouselIndicator.jsx`)
- TimeBlendImage: Day/Night 쌍 이미지 시간 블렌드 공용 프리미티브. TimelineContext 구독(prop > context > 0), smoothstep(timeValue) + brightness/saturate filter, `.ls-time-blend-media` 훅으로 부모 hover/scale 조합 가능. ProductCard·HeroSection이 공통 사용 (`components/media/TimeBlendImage.jsx`)

## 5. Data Display — 구조화된 데이터 시각화

- Table: MUI Table 컴포넌트 [MUI]

## 6. In-page Navigation — 페이지 내 탐색

- CategoryTab: 카테고리 탭. horizontal/vertical 방향 지원, MUI Tabs 기반 (`components/in-page-navigation/CategoryTab.jsx`)
- Tabs: MUI Tabs 컴포넌트 [MUI]

## 7. Input & Control — 사용자 입력

- FileDropzone: 파일 드래그&드롭 영역 (`components/input/FileDropzone.jsx`)
- SearchBar: 검색 입력 바 (`components/input/SearchBar.jsx`)
- TagInput: 태그 입력 필드 (`components/input/TagInput.jsx`)
- OptionSelector: 제품 옵션(마감·금속·높이) 선택기. MUI Chip outlined 기반 pill(borderRadius 999px) 칩 리스트. 배경 fill 없이 border(1→1.5px) + color + fontWeight로 선택 표시. glassFinish/hardware/height 공용 (`components/input/OptionSelector.jsx`)
- QuantityAddToCart: 수량 스테퍼(-/+) + Add to Cart CTA 묶음. lucide Minus/Plus 1px stroke, onAdd(quantity) 콜백 (`components/input/QuantityAddToCart.jsx`)
- UnderlineTextField: MUI TextField variant=standard 래퍼. 브랜드 톤의 **절제된 언더라인 인풋**(체크아웃 폼 공용). overline 라벨 + hover/focus 언더라인 컬러 전환만으로 상태 표현 (`components/input/UnderlineTextField.jsx`)
- Button: MUI Button 컴포넌트 [MUI]
- Checkbox: MUI Checkbox 컴포넌트 [MUI]
- Select: MUI Select 컴포넌트 [MUI]
- Switch: MUI Switch 컴포넌트 [MUI]
- TextField: MUI TextField 컴포넌트 [MUI]

## 8. Layout — 공간 배치와 구조

- PhiSplit: 황금비 분할 레이아웃 (`components/layout/PhiSplit.jsx`)
- SplitScreen: 좌우 분할 레이아웃. ratio, stackAt, stackOrder 지원 (`components/layout/SplitScreen.jsx`)
- BentoGrid: 벤토 그리드 레이아웃 (`components/layout/BentoGrid.jsx`)
- LineGrid: 그리드 아이템 사이 1px 라인 자동 삽입 (`components/layout/LineGrid.jsx`)
- FullPageContainer: 전체 페이지 컨테이너 (`components/layout/FullPageContainer.jsx`)
- PageContainer: 반응형 페이지 컨테이너. PC maxWidth 고정, 모바일 100% (`components/layout/PageContainer.jsx`)
- AppShell: 반응형 앱 셸. GNB(header) + main + 선택적 footer slot. `logo`/`headerPersistent`/`headerCollapsible`/`footer` prop으로 슬롯 주입 (`components/layout/AppShell.jsx`)
- StickyAsideCenterLayout: 대칭 3열 그리드. sticky aside + 페이지 정중앙 콘텐츠 + 빈 대칭 칼럼 (`components/layout/StickyAsideCenterLayout.jsx`)
- Grid: MUI Grid 컴포넌트 [MUI]
- Masonry: MUI Masonry 컴포넌트 [MUI]

## 9. Overlay & Feedback — 맥락적 정보 표시

- Dialog: MUI Dialog 컴포넌트 [MUI]
- FloatingTimelineControl: 뷰포트 중앙 하단 고정 시간대 컨트롤. 글래스모피즘(backdrop-filter blur/saturate) + 큰 border radius(32) 컨테이너, 4슬롯(점심/오후/저녁/밤) 세로 배치(아이콘↑ 시간↓) 버튼. **배경 칠 없음** — 상태 표시는 color/stroke/font-weight만 사용. lucide-react 아이콘(Sun/SunDim/Sunset/MoonStar) 1px stroke 기본, 활성 시 1.5. TimelineContext 양방향 구독 (`components/overlay-feedback/FloatingTimelineControl.jsx`)
- CartDrawer: 사이트 전역 우측 슬라이드 장바구니. CartContext 구독(`isOpen`/`items`/`update`/`remove`/`clear`), 썸네일 + 옵션 메타 + 수량 스테퍼 + 삭제, 하단 Checkout CTA. 모달 대신 drawer로 "결제 강요 금지" 원칙 준수 (`components/overlay-feedback/CartDrawer.jsx`)

## 10. Navigation (Global) — 페이지 간 이동

- GNB: 반응형 글로벌 네비게이션 바. 데스크탑 메뉴 / 모바일 Drawer (`components/navigation/GNB.jsx`)
- NavMenu: 네비게이션 메뉴 (`components/navigation/NavMenu.jsx`)
- SlidingHighlightMenu: 슬라이딩 하이라이트 메뉴. hover 시 layoutId 기반 인디케이터 이동, background/underline, horizontal/vertical (`components/navigation/SlidingHighlightMenu.jsx`)
- Footer: 사이트 전역 하단. content.js(brand.name/tagline, navigation.menuItems, footer.copyright)를 데이터 소스로 사용. md+ 2열(브랜드/네비), 하단 divider + 카피라이트. 테마 토큰 색상만 사용해 타임라인 전환 자동 반전 (`components/navigation/Footer.jsx`)

## 11. KineticTypography (Interactive) — 텍스트 애니메이션 효과

- RandomRevealText: 랜덤 순서 blur 리빌 타이포그래피. Fisher-Yates 셔플 기반. trigger='mount'|'inview' (IntersectionObserver), delay/stagger/threshold/replay 지원 (`components/kinetic-typography/RandomRevealText.jsx`)
- ScrambleText: 텍스트 스크램블 전환 효과. requestAnimationFrame 기반 (`components/kinetic-typography/ScrambleText.jsx`)
- ScrollRevealText: 스크롤 진행에 따른 텍스트 순차 리빌 (`components/kinetic-typography/ScrollRevealText.jsx`)

## 13. ContentTransition (Interactive) — 섹션 간 전환

- HorizontalScrollContainer: 세로 스크롤→가로 이동 변환 컨테이너. 픽셀 기반 DOM 측정, Framer Motion (`components/content-transition/HorizontalScrollContainer.jsx`)

## 12. Scroll (Interactive) — 스크롤 기반 효과

- VideoScrubbing: 스크롤 기반 비디오 스크러빙. 두 가지 제어 모드 — (1) Scroll 모드: progress prop 미지정 시 내부 scrollY 기반 자동 스크럽, (2) External Progress 모드: progress(0~1) 지정 시 외부 진행도로 currentTime 직접 제어(HSC 등 상위 스크롤 변환 컨테이너 내부에서 사용). preload prop으로 디코드 부하 조절 (`components/scroll/VideoScrubbing.jsx`)
- ScrollScaleContainer: 뷰포트 노출 비율 연동 스케일 컨테이너. Framer Motion useScroll + useTransform (`components/scroll/ScrollScaleContainer.jsx`)

## 14. Motion (Interactive) — 스토리텔링 모션

- FadeTransition: 기본 opacity 전환 애니메이션. 등장/퇴장 페이드 + 방향 슬라이드, IntersectionObserver 자동 트리거 (`components/motion/FadeTransition.jsx`)
- PerspectiveTransition: 3D 원근 회전 전환. 뒤로 누워있다가 세워지는 효과, CSS perspective + rotateX, IntersectionObserver 자동 트리거 (`components/motion/PerspectiveTransition.jsx`)
- MarqueeContainer: 무한 루프 수평 흐름 컨테이너. CSS keyframes 기반 (`components/motion/MarqueeContainer.jsx`)

## 15. DynamicColor (Interactive) — 동적 색상 변화

- GradientOverlay: Three.js WebGL 스크롤 반응형 그라데이션 배경. Simplex Noise + 필름 그레인 (`components/dynamic-color/GradientOverlay.jsx`)
- GradientOverlayDynamic: Next.js 동적 import 래퍼 (ssr: false). 페이지에서 사용 시 이것을 import (`components/dynamic-color/GradientOverlayDynamic.jsx`)

---

## Common (유틸리티)

- Indicator: 범용 인디케이터 (`common/ui/Indicator.jsx`)
- Placeholder: 스토리 예제용 FPO 플레이스홀더 시스템. Box/Image/Media/Text/Line/Paragraph/Card 서브컴포넌트 (`common/ui/Placeholder.jsx`)
- FilterBar: 필터 바 (`components/templates/FilterBar.jsx`)
- ProductGrid: ProductCard를 반응형 CSS Grid로 배치하는 제품 쇼케이스 템플릿. 기본 xs:2 sm:3 md:4 lg:5, timeValue 전파, layoutIdPrefix로 카드 일괄 Shared Element 지원 (`components/templates/ProductGrid.jsx`)
- ProductShowcase: StickyAsideCenterLayout 기반 3열 쇼케이스 섹션. 좌측 aside에 CategoryTab(vertical) 타입 필터(All/Ceiling/Stand/Wall/Desk), 중앙에 ProductGrid 배치 (`components/templates/ProductShowcase.jsx`)
- ProductDetailHero: 제품 상세 상단 히어로. 좌 TimeBlendImage(4/5 비율, layoutId로 Shared Element 수신 준비) + 우 타이틀/빛 메타/한글 해설/OptionSelector 3종/QuantityAddToCart. 옵션·수량 상태는 페이지 단위. onAddToCart(line) 콜백 (`components/templates/ProductDetailHero.jsx`)
- ProductInfoPanel: 제품 상세 하단 정보 패널. **탭 없이** Description + Specification을 수직으로 한 번에 노출, Divider 1px로 구분. SPEC_ROWS(type/mounting/form/lightPattern/lux/kelvin)를 테이블로 표시 (`components/templates/ProductInfoPanel.jsx`)
- CheckoutTopBar: 체크아웃 격리 레이아웃 상단 바. 로고(home navigate) + 단계 표시(Cart/Information/Complete)만 노출, GNB·검색·카트 미노출 (`components/templates/CheckoutTopBar.jsx`)
- CheckoutForm: 체크아웃 좌측 폼. Contact(email/phone) / Shipping(name/address/city/postal/country) / Discount(code) 3 섹션, 모두 UnderlineTextField. values/onChange 제어형 (`components/templates/CheckoutForm.jsx`)
- CheckoutSummary: 체크아웃 우측 **스티키** 주문 요약. CartContext 구독해 아이템 리스트·수량 노출, Place Order CTA(onPlaceOrder 콜백) (`components/templates/CheckoutSummary.jsx`)
- HeroSection: Lumenstate 랜딩 히어로. LineGrid 2:1 수평 분할(좌: arc-lamp-living 2528×1696 / 우: arch-light-gallery 1792×2400)에 Day/Night 쌍 이미지 배치, TimelineContext 구독해 smoothstep 블렌드. height 미지정 시 원본 이미지 aspect ratio 유지(셀 높이 자연 결정), 지정 시 기존 고정 높이 + equalHeight 동작 (`components/templates/HeroSection.jsx`)
- BrandValueSection: LineGrid 3열 수평 분할로 브랜드 가치(Immanence/Continuity/Flexibility)를 BrandValueCard로 나열. md↑ 3열, md↓ 수직 스택. content.brandValue.features 기본 데이터 사용, 1px 라인으로 셀 분리 (`components/templates/BrandValueSection.jsx`)
- TopSection: HeroSection + BrandValueSection을 LineGrid stack 모드로 수직 결합한 랜딩 최상단 블록. 히어로 내부 세로 라인 → 섹션 간 가로 라인 → 브랜드 가치 3열 라인으로 이어지는 하나의 그리드 판 (`components/templates/TopSection.jsx`)
- BrandElevationSection: 공간 단면 영상 3편을 텍스트 없이 풀블리드로 제시. 1 영상 = 100vw × 100vh, 슬라이드 간격 0. 데스크톱은 HorizontalScrollContainer + VideoScrubbing(progress 모드)로 세로→가로 스크롤 + 영상 프레임 스크럽 동기화, 모바일은 200vh 섹션 sticky 100vh 비디오로 수직 스택. elevation set1/2/3 moving.mp4 사용 (`components/templates/BrandElevationSection.jsx`)
- LandingPage: Lumenstate 랜딩 페이지 전체 조합. TopSection(Hero + BrandValueSection) → BrandElevationSection → Product Showcase 섹션(풀블리드, 헤더 가운데 정렬) 순 수직 결합. useNavigate 기반 기본 `/product/:id` 라우팅, layoutIdPrefix='product-' 기본값으로 Shared Element 전이 즉시 사용 가능 (`stories/page/LandingPage.jsx`)
