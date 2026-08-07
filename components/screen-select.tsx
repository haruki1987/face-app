"use client"

import { useRef, useState } from "react"
import { BrandMark } from "@/components/screen-shell"
import { FunBadge } from "@/components/fun-notice"
import { CONFIG } from "@/lib/gwansang-config"

type InlineError =
  | { kind: "format" } // (가) 지원 안 하는 형식/손상
  | { kind: "size" } // (나) 크기 초과
  | null

export function ScreenSelect({
  previewUrl,
  onPick,
  onStart,
}: {
  previewUrl: string | null
  onPick: (file: File, url: string) => void
  onStart: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<InlineError>(null)

  function handleFiles(files: FileList | null) {
    setError(null)
    const file = files?.[0]
    if (!file) return

    // (가) 형식 검사 — 손상 이미지도 여기서 함께 안내
    const typeOk = (CONFIG.allowedTypes as readonly string[]).includes(file.type)
    if (!typeOk) {
      setError({ kind: "format" })
      resetInput()
      return
    }
    // (나) 크기 검사
    if (file.size > CONFIG.maxFileSizeBytes) {
      setError({ kind: "size" })
      resetInput()
      return
    }

    const url = URL.createObjectURL(file) // 브라우저 안에서만 미리보기 (업로드 없음)
    onPick(file, url)
  }

  function resetInput() {
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="flex flex-1 flex-col">
      <BrandMark subtitle="사진을 골라 주세요" />

      <div className="mt-8 text-center">
        <FunBadge />
        <h1 className="mt-3 text-balance font-display text-2xl leading-snug text-foreground">
          얼굴이 잘 보이는 사진 한 장을 골라 주세요
        </h1>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={CONFIG.allowedTypes.join(",")}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-6 flex aspect-[4/5] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-border bg-card/50 text-muted-foreground transition active:scale-[0.99]"
        aria-label={previewUrl ? "사진 다시 고르기" : "사진 고르기"}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl || "/placeholder.svg"} alt="선택한 사진 미리보기" className="size-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-3 px-6 text-center">
            <span aria-hidden className="text-4xl">
              🌙
            </span>
            <span className="text-sm leading-relaxed">
              탭해서 기기 사진 한 장을 골라 주세요
            </span>
          </span>
        )}
      </button>

      {previewUrl && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 self-center rounded-full border border-border px-4 py-2 text-sm text-foreground transition active:scale-[0.98]"
        >
          다른 사진으로 바꾸기
        </button>
      )}

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm leading-relaxed text-foreground"
        >
          {error.kind === "format" ? (
            <>
              이 사진은 열 수 없었어요. {CONFIG.allowedTypesLabel} 형식의 온전한 이미지를 골라 주세요.
            </>
          ) : (
            <>사진 용량이 너무 커요. {CONFIG.maxFileSizeLabel} 이하의 사진으로 골라 주세요.</>
          )}
        </p>
      )}

      <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
        고른 사진은 이 기기 안에서만 보여요. 어디에도 올라가지 않아요.
      </p>

      <div className="mt-auto pt-6">
        <button
          type="button"
          disabled={!previewUrl}
          onClick={onStart}
          className="h-14 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-lg transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          분석 시작
        </button>
      </div>
    </div>
  )
}
