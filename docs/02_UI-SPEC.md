# 02_UI-SPEC — 관상 분석 앱 UI/UX 명세서

> **최종수정일**: 2026-08-07  
> **상태**: **최신화 완료 (SNS 공유 및 이미지 저장 사양 추가)**  
> **관련 소스 파일**: [app/globals.css](file:///c:/face-app/app/globals.css), [components/screen-shell.tsx](file:///c:/face-app/components/screen-shell.tsx), [components/screen-consent.tsx](file:///c:/face-app/components/screen-consent.tsx), [components/screen-select.tsx](file:///c:/face-app/components/screen-select.tsx), [components/screen-analyzing.tsx](file:///c:/face-app/components/screen-analyzing.tsx), [components/screen-result.tsx](file:///c:/face-app/components/screen-result.tsx), [components/screen-error.tsx](file:///c:/face-app/components/screen-error.tsx), [components/fun-notice.tsx](file:///c:/face-app/components/fun-notice.tsx)

---

## 1. 디자인 시스템 & 레이아웃 사양

### 1.1 레이아웃 셸 (`ScreenShell`)
- **컨테이너**: 모바일 웹 세로 환경 최적화 (`max-w-md mx-auto min-h-[100dvh] px-5 pt-8 pb-6`)
- **비주얼 배경**: 신비로운 오락 분위기의 다크 래디얼 그라디언트 + 밤하늘 별빛 애니메이션 (`starry` 클래스 + OKLCH 시안/자색 톤)
- **공통 브랜드 래퍼 (`BrandMark`)**:
  - 로고: floating 애니메이션이 적용된 Moon Glyph (`<MoonGlyph />`)
  - 타이틀: `오늘의 관상` (Display 폰트)
  - 서브타이틀: `재미로 보는 얼굴 이야기`

### 1.2 재미/오락 배지 (`FunBadge`)
- 모든 주요 카드 및 안내 타이틀 상단에 `재미로 보는 오락 콘텐츠` 배지를 노출하여 오락물 목적을 전달

---

## 2. 5가지 화면 상태별 명세

### 2.1 State A: 고지·동의 (`ScreenConsent`)
- **진입 사유**: 최초 접속 시 (미동의 상태)
- **주요 구성**:
  1. 헤더 (`BrandMark`) 및 오락 배지 (`FunBadge`)
  2. 메인 헤드라인: `사진 한 장으로 보는 오늘의 얼굴 이야기`
  3. 3가지 고지 카드 리스트:
     - ✦ 결과는 오락·재미를 위한 이야기예요. 과학적 근거는 없어요.
     - 🛡️ 올린 사진은 저장하지 않아요. 분석이 끝나면 바로 사라져요.
     - 💖 다른 사람의 사진은 그 사람의 동의 없이 올리지 말아 주세요.
  4. 하단 동의 영역:
     - 동의 체크박스 (`checkbox`): **기본 선택 해제(Unchecked)** 상태
     - 시작 버튼 (`Button`): 동의 체크박스 해제 시 `disabled` 비활성화

### 2.2 State B: 사진 선택 및 미리보기 (`ScreenSelect`)
- **진입 사유**: State A 동의 완료 후 또는 State D/E에서 "다시 하기" 선택 시
- **주요 구성**:
  1. 사진 업로드 영역 (`aspect-[4/5] w-full border-2 border-dashed border-border`):
     - 선택 전: `탭해서 기기 사진 한 장을 골라 주세요` 문구 및 달 아이콘
     - 선택 후: `URL.createObjectURL`을 통한 즉시 미리보기 렌더링 (`object-cover`)
  2. "다른 사진으로 바꾸기" 버튼 (사진 선택 완료 시 노출)
  3. 인라인 에러 알림 메시지 (E-02, E-03 예외 발생 시):
     - 형식 비호환: `이 사진은 열 수 없었어요. JPG, PNG, WEBP 형식의 온전한 이미지를 골라 주세요.`
     - 용량 초과: `사진 용량이 너무 커요. 8MB 이하의 사진으로 골라 주세요.`
  4. 하단 안내: `고른 사진은 이 기기 안에서만 보여요. 어디에도 올라가지 않아요.`
  5. 분석 시작 버튼: 사진 미선택 시 `disabled` 비활성화

### 2.3 State C: 분석 중 (`ScreenAnalyzing`)
- **진입 사유**: State B에서 "분석 시작" 버튼 클릭 시
- **주요 구성**:
  1. 중앙 로딩 비주얼:
     - 핑 파동 애니메이션 (`animate-ping bg-primary/20`)
     - 점선 링 스피너 애니메이션 (`animate-[spin_6s_linear_infinite]`)
     - 부유하는 수정구슬 이모지 (`🔮 animate-float-slow`)
  2. 타이틀: `얼굴을 찬찬히 살펴보는 중…` (Accessibility: `role="status" aria-live="polite"`)
  3. 안내문: `보통 몇 초면 끝나요. 길어도 약 20초 안에는 준비돼요. 잠시만 기다려 주세요.`
  4. 하단 3점 점멸 애니메이션 (`animate-twinkle`)

### 2.4 State D: 결과 카드 & SNS 공유 (`ScreenResult`)
- **진입 사유**: 분석 성공 시 (Backend JSON 수신)
- **주요 구성 (단일 캡처 카드 & 공유 액션 영역)**:
  1. **카드 래퍼 (캡처 대상)**: `rounded-3xl border border-primary/25 bg-card p-6 shadow-2xl`
     - 헤더: `오늘의 관상` 타이틀 + `FunBadge`
     - 한 줄 총평 (`headline`): 예) `"오늘의 당신은 '차분한 봄볕' 같은 인상이에요"`
     - 부위별 해석 카드 리스트 (`items` - 순회 렌더링): 소제목(`title`) + 해석 본문(`body`)
     - 마무리 한 줄 (`closing`)
     - 캡처 하단 경고 문구: `🎲 이 결과는 재미로 보는 오락 콘텐츠이며 과학적 근거가 없어요.`
  2. **공유 및 다운로드 버튼 그룹**:
     - `[📤 SNS로 공유하기]`: `navigator.share`를 통한 카카오톡, 인스타그램, 트위터(X) 등 네이티브 공유 팝업 호출 (결과 카드 PNG 이미지 + 안내 텍스트)
     - `[💾 카드 이미지 저장]`: 결과 카드를 PNG 파일(`gwansang_result.png`)로 기기 앨범/PC 다운로드 저장 (`html2canvas` / Canvas)
     - `[🔗 링크 복사]`: 클립보드에 서비스 URL 복사 (복사 완료 토스트 알림)
  3. **하단 "다시 하기" 버튼**: Click 시 State B로 1회 복귀

### 2.5 State E: 에러 (`ScreenError`)
- **진입 사유**: 예외 처리 E-04 ~ E-07 및 E-09 발생 시
- **주요 구성**:
  1. 상단 브랜딩 (`BrandMark subtitle="잠깐만요"`)
  2. 중앙 안개 이모지 (`🌫️`) 및 에러 타입별 알림 (`ERROR_MESSAGES`):
     - `face`: `얼굴을 또렷하게 찾지 못했어요.` / `한 사람의 얼굴이 정면으로 크게 나온 사진으로 다시 골라 주세요.`
     - `server`: `지금은 분석이 조금 밀려 있어요.` / `잠깐 생긴 문제예요. 같은 사진 그대로 다시 시도해 볼 수 있어요.`
     - `result`: `이번엔 결과를 예쁘게 정리하지 못했어요.` / `한 번 더 시도하면 잘 나올 수 있어요.`
     - `quota`: `지금은 이용이 잠시 몰려 있어요.` / `조금 있다가 다시 시도해 주세요.`
  3. 하단 "다른 사진으로 다시 하기" 버튼 (Click 시 State B 복귀)

---

## 3. 웹 접근성 (Accessibility) 사양

- 모든 아이콘 및 장식 요소에는 `aria-hidden="true"` 부여
- 로딩 상태(State C)에는 `role="status" aria-live="polite"` 지정
- 인라인 에러 및 에러 화면(State E)에는 `role="alert"` 지정
- 대화형 버튼은 상태에 따라 `disabled` 속성을 명확히 반영하여 오작동 방지
