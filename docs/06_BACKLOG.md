# 06_BACKLOG — 관상 분석 앱 백로그 및 작업 분해 문서

> **최종수정일**: 2026-08-07  
> **상태**: **최신화 완료 (TSK-304 SNS 공유 백로그 추가)**  
> **관련 문서**: [PRD.md](file:///c:/face-app/docs/PRD.md), [DEVELOPMENT_PLAN.md](file:///c:/face-app/docs/DEVELOPMENT_PLAN.md)

---

## 1. 백로그 항목 및 현황 표

| ID | 스프린트 | 기능/요구사항 | 사용자 스토리 / 예외 ID | 작업 내용 | 상태 |
|---|---|---|---|---|---|
| **TSK-001** | Sprint 0 | 환경 구축 | — | Next.js App Router 프로젝트 구성, Tailwind CSS, OKLCH 테마 설정 | ✅ 완료 |
| **TSK-002** | Sprint 0 | 명세서 작성 | Hand-off 1~5 | `01_PRD`, `02_UI-SPEC`, `03_ANALYSIS-SPEC`, `04_API-SPEC`, `05_DEV-PLAN`, `06_BACKLOG` 작성 | ✅ 완료 |
| **TSK-101** | Sprint 1 | 상태 머신 | — | 단일 페이지 5가지 상태(A~E) 전이 구조 구축 (`app/page.tsx`) | ✅ 완료 |
| **TSK-102** | Sprint 1 | 공통 셸 & 브랜딩 | — | `ScreenShell` 밤하늘 무드 배경, `BrandMark` 모바일 뷰어 레이아웃 | ✅ 완료 |
| **TSK-103** | Sprint 1 | 고지·동의 UI | US-01, F-01, E-01 | 3종 고지 노출, 체크박스 해제 시 동의 버튼 비활성화 (`ScreenConsent`) | ✅ 완료 |
| **TSK-104** | Sprint 1 | 사진 선택 & 미리보기 | US-02, F-02 | 기기 사진 선택, `URL.createObjectURL` 미리보기, 사진 교체 (`ScreenSelect`) | ✅ 완료 |
| **TSK-105** | Sprint 1 | 클라이언트 유효성 검증 | E-02, E-03 | JPG/PNG/WEBP 외 형식 차단(E-02), 8MB 용량 초과 메시지(E-03) | ✅ 완료 |
| **TSK-106** | Sprint 1 | 분석 중 로딩 UI | US-03, C 상태 | 핑/스피너 애니메이션, 수정구슬 이모지, 소요시간 안내 (`ScreenAnalyzing`) | ✅ 완료 |
| **TSK-107** | Sprint 1 | 결과 카드 렌더링 | US-04, F-04 | 총평, 항목별 관상 해석 카드, `FunBadge` 오락 고지 노출 (`ScreenResult`) | ✅ 완료 |
| **TSK-108** | Sprint 1 | 에러 대응 UI | US-05, E-04~E-07 | `ERROR_MESSAGES` 4종 안내 및 다른 사진으로 다시 하기 (`ScreenError`) | ✅ 완료 |
| **TSK-109** | Sprint 1 | 다시하기 & 이탈 처리 | US-06, F-05, E-08 | D/E 상태에서 1-Click 조작으로 B 상태 복귀, 새로고침 시 초기화 | ✅ 완료 |
| **TSK-201** | Sprint 2 | Backend API Proxy | F-03, 5.2-6 | `/api/analyze` Route Handler 작성 및 서버 환경변수로 API Key 숨김 | ✅ 완료 |
| **TSK-202** | Sprint 2 | AI Vision 연동 | F-03, `03-SPEC` | Gemini 3.6 Flash 모델 연동 및 Structured Outputs JSON 스키마 응답 설정 | ✅ 완료 |
| **TSK-203** | Sprint 2 | 사진 미저장 연동 | F-06, 5.2-7 | 이미지 Buffer 수신 후 메모리상 AI 전달, 전송 직후 버퍼 즉시 폐기 | ✅ 완료 |
| **TSK-204** | Sprint 2 | 백엔드 예외 연동 | E-04, E-05, E-07, E-09 | 얼굴 미검출(E-04), 15초 타임아웃(E-05), 할당량 초과(E-07), 금지표현 후처리(E-09) | ✅ 완료 |
| **TSK-301** | Sprint 3 | 결과 카드 연동 | F-04 | 실제 AI JSON 수신 데이터 기반 관상 결과 카드 렌더링 | ✅ 완료 |
| **TSK-302** | Sprint 3 | 금지 표현 후처리 | E-09, S-4 | §4.4 5대 금지 표현 후처리 regex/키워드 검사 및 위반 시 E 상태 전이 | ✅ 완료 |
| **TSK-303** | Sprint 3 | QA & E2E 검증 | S-1~S-4 | 모바일 실기기 응답시간 15초 이내(S-2) 및 금지표현 30개 표본 검증(S-4) | ⏳ 진행 예정 |
| **TSK-304** | Sprint 3 | SNS 공유 & 다운로드 | US-07, F-07 | Web Share API를 통한 모바일 SNS 공유 팝업, Canvas 이미지 저장, 링크 복사 | ✅ 완료 |

---

## 2. 작업 상태 범례 (Status Legend)

- ✅ **완료**: 소스코드에 정상 반영 및 동작 검증 완료
- ⏳ **대기 / 진행 예정**: 명세 완료 후 구현 대기 상태
