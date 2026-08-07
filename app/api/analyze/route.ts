import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI, Type } from "@google/genai"
import { CONFIG, type ErrorKind, type ResultData } from "@/lib/gwansang-config"

// ─────────────────────────────────────────────────────────────
// §4.4 5대 금지 표현 검증 후처리 키워드/패턴
// ─────────────────────────────────────────────────────────────
const FORBIDDEN_PATTERNS = [
  /과학적/i,
  /통계적/i,
  /실제로 그렇다/i,
  /못생/i,
  /잘생/i,
  /흉하/i,
  /추하/i,
  /동양인/i,
  /서양인/i,
  /나이가 많/i,
  /나이가 적/i,
  /질병/i,
  /수명/i,
  /사고/i,
  /사기/i,
  /불운/i,
  /점수/i,
  /등급/i,
  /순위/i,
]

function containsForbiddenContent(text: string): boolean {
  return FORBIDDEN_PATTERNS.some((pattern) => pattern.test(text))
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: { kind: "server" as ErrorKind, message: "서버 API 키가 설정되지 않았습니다." } },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: { kind: "format" as ErrorKind, message: "사진 파일이 첨부되지 않았습니다." } },
        { status: 400 }
      )
    }

    // 1. 이미지 형식 검증 (E-02)
    const isAllowedType = (CONFIG.allowedTypes as readonly string[]).includes(file.type)
    if (!isAllowedType) {
      return NextResponse.json(
        {
          success: false,
          error: {
            kind: "format" as ErrorKind,
            message: `지원하지 않는 이미지 형식입니다. (${CONFIG.allowedTypesLabel})`,
          },
        },
        { status: 400 }
      )
    }

    // 2. 이미지 용량 검증 (E-03)
    if (file.size > CONFIG.maxFileSizeBytes) {
      return NextResponse.json(
        {
          success: false,
          error: {
            kind: "size" as ErrorKind,
            message: `사진 용량이 상한(${CONFIG.maxFileSizeLabel})을 초과했습니다.`,
          },
        },
        { status: 400 }
      )
    }

    // 3. 메모리 상 이미지 전송 (F-06 / 5.2 제약 7 준수: 디스크 저장 없이 버퍼 변환 후 즉시 해제)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Data = buffer.toString("base64")

    const ai = new GoogleGenAI({ apiKey })

    // 타임아웃 15초 설정 (S-2 및 E-05 타임아웃 제약)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.analysisTimeoutSec * 1000)

    const promptText = `
당신은 사람들에게 즐거움과 부드러운 위안을 주는 친근한 '오늘의 관상' 분석가입니다.
전달된 이미지 속 얼굴을 관상학적 테마를 빌려 오락 목적으로 흥미롭고 따뜻하게 해석해 주세요.

[엄격한 제약사항 (PRD §4.4 금지 항목 - 반드시 준수)]
1. 외모 평가 및 비하 금지 (잘생김, 못생김, 부정적 외모 서술 절대 금지)
2. 인종, 성별, 나이 단정 금지 ("OO인 같다", "나이가 많아 보인다" 등 단정 금지)
3. 건강, 수명, 불행, 사고, 질병 관련 예언/언급 절대 금지
4. 점수, 등급, 순위 서술 금지 (관상 점수 등 수치화 금지)
5. "과학적으로", "통계적으로", "실제로 그렇다" 등 과학적/사실적 주장 금지
6. 말투는 중립적이고 긍정적이며 부드럽게 ("~한 분위기가 느껴져요", "~한 결이 보여요") 서술하세요.

[얼굴 검증 및 해석 출력 규칙]
- 사진에 1명의 정면 사람 얼굴이 명확히 보이는 경우:
  - hasValidFace: true
  - headline: 한 줄 총평 (예: "오늘의 당신은 '차분한 봄볕' 같은 인상이에요")
  - items: 부위별 해석 3~4개 배열 (눈매, 콧대와 인중, 입가, 이마와 전체 균형 등. id, title, body 포함)
  - closing: 부드럽고 따뜻한 마무리 한 줄
- 사진에 사람 얼굴이 없거나, 2명 이상의 얼굴이 있거나, 얼굴을 또렷하게 구별하기 힘든 경우:
  - hasValidFace: false
  - faceErrorReason: "no_face" 또는 "multiple_faces"
  - headline, items, closing은 빈 값/빈 배열로 지정하세요.
`

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { mimeType: file.type, data: base64Data } },
              { text: promptText },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hasValidFace: { type: Type.BOOLEAN },
              faceErrorReason: { type: Type.STRING },
              headline: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    body: { type: Type.STRING },
                  },
                  required: ["id", "title", "body"],
                },
              },
              closing: { type: Type.STRING },
            },
            required: ["hasValidFace", "headline", "items", "closing"],
          },
        },
      })

      clearTimeout(timeoutId)

      const responseText = response.text
      if (!responseText) {
        return NextResponse.json(
          { success: false, error: { kind: "result" as ErrorKind, message: "분석 결과를 생성하지 못했습니다." } },
          { status: 500 }
        )
      }

      const parsed = JSON.parse(responseText)

      // 4. 얼굴 미검출 / 다중 얼굴 검출 예외 (E-04)
      if (!parsed.hasValidFace) {
        return NextResponse.json(
          {
            success: false,
            error: {
              kind: "face" as ErrorKind,
              message: "얼굴을 또렷하게 찾지 못했어요. 한 사람의 얼굴이 정면으로 나온 사진으로 골라 주세요.",
            },
          },
          { status: 422 }
        )
      }

      // 5. 응답 필수 구조 검증 (E-06)
      if (!parsed.headline || !Array.isArray(parsed.items) || parsed.items.length === 0 || !parsed.closing) {
        return NextResponse.json(
          { success: false, error: { kind: "result" as ErrorKind, message: "정해진 구조와 다른 응답입니다." } },
          { status: 500 }
        )
      }

      // 6. §4.4 금지 표현 후처리 검증 (E-09)
      const fullText = `${parsed.headline} ${parsed.items.map((i: { title: string; body: string }) => `${i.title} ${i.body}`).join(" ")} ${parsed.closing}`
      if (containsForbiddenContent(fullText)) {
        return NextResponse.json(
          { success: false, error: { kind: "result" as ErrorKind, message: "부적절한 표현이 포함되어 결과를 표시할 수 없습니다." } },
          { status: 500 }
        )
      }

      const data: ResultData = {
        headline: parsed.headline,
        items: parsed.items,
        closing: parsed.closing,
      }

      return NextResponse.json({ success: true, data })
    } catch (apiError: any) {
      clearTimeout(timeoutId)

      if (apiError.name === "AbortError") {
        return NextResponse.json(
          { success: false, error: { kind: "server" as ErrorKind, message: "분석 시간이 초과되었습니다." } },
          { status: 504 }
        )
      }

      // 429 Rate Limit (E-07)
      if (apiError.status === 429 || apiError.message?.includes("quota") || apiError.message?.includes("429")) {
        return NextResponse.json(
          { success: false, error: { kind: "quota" as ErrorKind, message: "지금은 이용이 잠시 몰려 있습니다." } },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { success: false, error: { kind: "server" as ErrorKind, message: "분석 처리 중 일시적인 오류가 발생했습니다." } },
        { status: 500 }
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { kind: "server" as ErrorKind, message: "서버 처리 오류가 발생했습니다." } },
      { status: 500 }
    )
  }
}
