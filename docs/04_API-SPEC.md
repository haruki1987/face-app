# 04_API-SPEC — 백엔드 API 명세서

> **최종수정일**: 2026-08-07  
> **상태**: **최신화 완료**  
> **관련 소스 파일**: `app/api/analyze/route.ts` (구현 예정)

---

## 1. 엔드포인트 개요

| 항목 | 내용 |
|---|---|
| **Endpoint** | `POST /api/analyze` |
| **인증** | 서버 내부 환경변수 관리 (클라이언트 API Key 전달/노출 금지 - 5.2 제약 6 준수) |
| **요청 데이터** | `multipart/form-data` (파일 업로드) 또는 `application/json` (Base64) |
| **타임아웃** | 12~20초 (`CONFIG.analysisTimeoutSec`) |
| **개인정보 준수** | 입력 이미지 및 응답 결과를 디스크/DB에 저장하지 않으며 메모리 버퍼 상에서 처리 후 즉시 폐기 (F-06 준수) |

---

## 2. 요청 명세 (Request Specification)

### Headers
```http
Content-Type: multipart/form-data
```

### Body Parameters
| 파라미터명 | 타입 | 필수 여부 | 설명 |
|---|---|---|---|
| `file` | File (Binary) | 필수 | 사용자가 선택한 얼굴 사진 이미지 (Max 8MB, JPG/PNG/WEBP) |

---

## 3. 응답 명세 (Response Specification)

### 3.1 성공 응답 (200 OK)
- **Content-Type**: `application/json`
- **Body**: `ResultData` 스키마

```json
{
  "success": true,
  "data": {
    "headline": "오늘의 당신은 '차분한 봄볕' 같은 인상이에요",
    "items": [
      {
        "id": "eyes",
        "title": "눈매",
        "body": "가만히 상대를 바라보는 느낌을 주는 눈매예요. 이야기를 들을 때 마음이 놓인다는 말을 종종 들을지도 몰라요."
      },
      {
        "id": "nose",
        "title": "콧대와 인중",
        "body": "고집보다는 균형을 좋아하는 분위기가 느껴져요."
      }
    ],
    "closing": "물론 이건 그냥 재미로 보는 이야기예요. 오늘 하루 기분 좋게 지내면 그걸로 충분해요."
  }
}
```

### 3.2 에러 응답 (Error Standard Format)

| HTTP Code | Error Kind | 매핑 예외 ID | 설명 및 대응 |
|---|---|---|---|
| `400 Bad Request` | `format` | **E-02** | 지원하지 않는 MIME 타입이거나 손상된 이미지 파일 |
| `400 Bad Request` | `size` | **E-03** | 이미지 파일 용량이 8MB 초과 |
| `422 Unprocessable Entity` | `face` | **E-04** | 이미지 내 얼굴이 검출되지 않거나 2명 이상 다중 검출된 경우 |
| `504 Gateway Timeout` | `server` | **E-05** | AI 분석 엔진 20초 타임아웃 초과 또는 통신 장애 |
| `500 Internal Server Error` | `result` | **E-06 / E-09** | JSON 결과 스키마 검증 실패 또는 금지 표현 감지 |
| `429 Too Many Requests` | `quota` | **E-07** | AI 엔진 일일 사용 한도 초과 |

#### 에러 응답 JSON 예시:
```json
{
  "success": false,
  "error": {
    "kind": "face",
    "message": "얼굴을 또렷하게 찾지 못했어요."
  }
}
```

---

## 4. 보안 및 예외 처리 정책

1. **API Key 보호**:
   - `OPENAI_API_KEY` 또는 `GEMINI_API_KEY`는 서버의 `.env.local`에 저장하며, Next.js Server Action 또는 Route Handler 내에서만 접근합니다.
2. **메모리 버퍼 처리**:
   - 클라이언트에서 업로드한 이미지 Buffer는 AI SDK(Vision Model) 호출 후 즉시 가비지 컬렉션(GC)되도록 유도하며 파일 시스템(`fs.writeFile` 등) 접근을 일절 금지합니다.
