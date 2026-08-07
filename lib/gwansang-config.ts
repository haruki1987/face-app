// ─────────────────────────────────────────────────────────────
// 설정값 (미확정) — 나중에 이 CONFIG 한 곳만 고치면 되게 모아둔다.
// 실제 API 연동 시 값이 바뀔 수 있는 임시 기본값이다.
// ─────────────────────────────────────────────────────────────
export const CONFIG = {
  // 미확정: 허용 이미지 형식
  allowedTypes: ["image/jpeg", "image/png", "image/webp"] as const,
  // 미확정: 허용 형식을 사용자에게 보여줄 라벨
  allowedTypesLabel: "JPG, PNG, WEBP",
  // 미확정: 최대 파일 크기 (바이트)
  maxFileSizeBytes: 8 * 1024 * 1024, // 8MB
  // 미확정: 최대 파일 크기 라벨
  maxFileSizeLabel: "8MB",
  // 미확정: 분석 타임아웃(초)
  analysisTimeoutSec: 20,
} as const

// ─────────────────────────────────────────────────────────────
// 결과 카드용 목(mock) 데이터.
// 항목 개수가 3개든 5개든 레이아웃이 깨지지 않도록 배열로 순회 렌더링한다.
// 문구는 중립적이고 긍정적인 톤. 단정하지 않는다.
// ─────────────────────────────────────────────────────────────
export type ResultItem = {
  id: string
  title: string
  body: string
}

export type ResultData = {
  headline: string // 한 줄 총평
  items: ResultItem[] // 해석 항목 (소제목 + 본문 2~3줄)
  closing: string // 마무리 한 줄
}

export const MOCK_RESULT: ResultData = {
  headline: "오늘의 당신은 '차분한 봄볕' 같은 인상이에요",
  items: [
    {
      id: "eyes",
      title: "눈매",
      body: "가만히 상대를 바라보는 느낌을 주는 눈매예요. 이야기를 들을 때 마음이 놓인다는 말을 종종 들을지도 몰라요.",
    },
    {
      id: "nose",
      title: "콧대와 인중",
      body: "고집보다는 균형을 좋아하는 분위기가 느껴져요. 급하게 결정하기보다 한 박자 쉬어가는 여유가 어울리는 인상이에요.",
    },
    {
      id: "mouth",
      title: "입가",
      body: "웃을 때 분위기가 부드럽게 풀리는 입가예요. 말수가 많지 않아도 곁에 있으면 편안하다는 인상을 줄 수 있어요.",
    },
    {
      id: "forehead",
      title: "이마와 전체 균형",
      body: "생각을 정리한 뒤 움직이는 걸 좋아하는 결이 보여요. 새로운 일 앞에서도 크게 흔들리지 않는 담담함이 어울려요.",
    },
  ],
  closing: "물론 이건 그냥 재미로 보는 이야기예요. 오늘 하루 기분 좋게 지내면 그걸로 충분해요.",
}

// ─────────────────────────────────────────────────────────────
// 에러 4종. 각 메시지는 "무엇이 잘못됐는지 + 다음에 무엇을 하면 되는지".
// 기술 용어/에러 코드는 노출하지 않는다.
// ─────────────────────────────────────────────────────────────
export type ErrorKind = "face" | "server" | "result" | "quota"

export type ErrorInfo = {
  kind: ErrorKind
  title: string
  hint: string
  // 같은 사진으로 다시 시도해도 되는 성격인지 (문구 안내용)
  retrySamePhoto: boolean
}

export const ERROR_MESSAGES: Record<ErrorKind, ErrorInfo> = {
  face: {
    kind: "face",
    title: "얼굴을 또렷하게 찾지 못했어요.",
    hint: "한 사람의 얼굴이 정면으로 크게 나온 사진으로 다시 골라 주세요.",
    retrySamePhoto: false,
  },
  server: {
    kind: "server",
    title: "지금은 분석이 조금 밀려 있어요.",
    hint: "잠깐 생긴 문제예요. 같은 사진 그대로 다시 시도해 볼 수 있어요.",
    retrySamePhoto: true,
  },
  result: {
    kind: "result",
    title: "이번엔 결과를 예쁘게 정리하지 못했어요.",
    hint: "한 번 더 시도하면 잘 나올 수 있어요.",
    retrySamePhoto: true,
  },
  quota: {
    kind: "quota",
    title: "지금은 이용이 잠시 몰려 있어요.",
    hint: "조금 있다가 다시 시도해 주세요.",
    retrySamePhoto: true,
  },
}
