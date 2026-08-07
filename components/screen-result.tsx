"use client"

import { useRef, useState } from "react"
import { domToBlob, domToPng } from "modern-screenshot"
import { FunBadge } from "@/components/fun-notice"
import { MOCK_RESULT, type ResultData } from "@/lib/gwansang-config"

export function ScreenResult({
  resultData,
  onRestart,
}: {
  resultData?: ResultData | null
  onRestart: () => void
}) {
  const cardRef = useRef<HTMLElement>(null)
  const { headline, items, closing } = resultData || MOCK_RESULT

  const [isSharing, setIsSharing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  // 1. modern-screenshot 기반 캡처 Blob 생성 (OKLCH, Tailwind 4 호환)
  async function generateCardBlob(): Promise<Blob | null> {
    if (!cardRef.current) return null
    try {
      return await domToBlob(cardRef.current, {
        scale: 2,
      })
    } catch (err) {
      console.error("DOM to Blob failed:", err)
      return null
    }
  }

  // 2. modern-screenshot 기반 PNG DataURL 생성
  async function generateCardPng(): Promise<string | null> {
    if (!cardRef.current) return null
    try {
      return await domToPng(cardRef.current, {
        scale: 2,
      })
    } catch (err) {
      console.error("DOM to PNG failed:", err)
      return null
    }
  }

  // 3. [📤 SNS 공유하기] - Web Share API 연동
  async function handleShare() {
    setIsSharing(true)
    try {
      const blob = await generateCardBlob()
      if (!blob) {
        showToast("카드 캡처 생성에 실패했습니다.")
        setIsSharing(false)
        return
      }

      const file = new File([blob], "gwansang_result.png", { type: "image/png" })
      const shareData: ShareData = {
        title: "오늘의 관상",
        text: "사진 한 장으로 보는 재미있는 내 관상 결과 이야기! ✨",
        files: [file],
      }

      // 모바일 Web Share API 파일 공유 지원 체크
      if (typeof navigator !== "undefined" && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData)
        } catch (shareErr: any) {
          if (shareErr.name !== "AbortError") {
            showToast("공유 중 오류가 발생했습니다.")
          }
        }
      } else {
        // 미지원 브라우저 Fallback: 이미지 다운로드 및 링크 복사
        await handleDownload()
        await handleCopyLink("결과 이미지가 저장되었습니다! 링크도 함께 복사되었어요.")
      }
    } catch (err) {
      showToast("공유 기능을 실행할 수 없습니다.")
    } finally {
      setIsSharing(false)
    }
  }

  // 4. [💾 카드 이미지 저장] - PNG 이미지 다운로드
  async function handleDownload() {
    setIsDownloading(true)
    try {
      const dataUrl = await generateCardPng()
      if (!dataUrl) {
        showToast("이미지 캡처 생성에 실패했습니다.")
        setIsDownloading(false)
        return
      }

      const link = document.createElement("a")
      link.href = dataUrl
      link.download = "gwansang_result.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showToast("결과 카드가 앨범/다운로드에 저장되었습니다!")
    } catch (err) {
      showToast("이미지 저장에 실패했습니다.")
    } finally {
      setIsDownloading(false)
    }
  }

  // 5. [🔗 링크 복사] - 클립보드 복사
  async function handleCopyLink(customMsg?: string) {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        showToast(customMsg || "서비스 링크가 클립보드에 복사되었어요!")
      } else {
        showToast("클립보드 복사를 지원하지 않는 브라우저입니다.")
      }
    } catch (err) {
      showToast("링크 복사에 실패했습니다.")
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* 캡처 대상 카드 */}
      <section
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl border border-primary/25 bg-card p-6 shadow-2xl"
      >
        <div aria-hidden className="starry pointer-events-none absolute inset-0 opacity-60" />

        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg text-primary">오늘의 관상</p>
            <FunBadge />
          </div>

          <h1 className="mt-4 text-balance font-display text-2xl leading-snug text-foreground">
            {headline}
          </h1>

          <ul className="mt-5 flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.id} className="rounded-2xl bg-secondary/60 p-4">
                <div className="flex items-center gap-2">
                  <span aria-hidden className="text-primary">
                    ✦
                  </span>
                  <h2 className="font-display text-base text-foreground">{item.title}</h2>
                </div>
                <p className="mt-1.5 text-pretty text-sm leading-relaxed text-card-foreground">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-pretty text-center text-sm leading-relaxed text-muted-foreground">
            {closing}
          </p>

          <p className="mt-4 border-t border-border pt-3 text-center text-xs text-muted-foreground">
            🎲 이 결과는 재미로 보는 오락 콘텐츠이며 과학적 근거가 없어요.
          </p>
        </div>
      </section>

      {/* 토스트 알림 메시지 */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 rounded-2xl border border-primary/30 bg-primary/15 px-4 py-3 text-center text-sm text-foreground shadow-lg animate-in fade-in slide-in-from-bottom-2"
        >
          {toastMessage}
        </div>
      )}

      {/* 공유 & 액션 버튼 그룹 */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          disabled={isSharing}
          onClick={handleShare}
          className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-base font-semibold text-primary-foreground shadow-lg transition active:scale-[0.99] disabled:opacity-50"
        >
          <ShareIcon />
          <span>{isSharing ? "카드 캡처 중..." : "SNS로 결과 공유하기"}</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isDownloading}
            onClick={handleDownload}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card/80 px-3 text-sm font-medium text-foreground transition active:scale-[0.98] disabled:opacity-50"
          >
            <DownloadIcon />
            <span>{isDownloading ? "저장 중..." : "이미지 저장"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleCopyLink()}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card/80 px-3 text-sm font-medium text-foreground transition active:scale-[0.98]"
          >
            <LinkIcon />
            <span>링크 복사</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-2xl border border-border/60 bg-secondary/50 px-4 text-base font-medium text-secondary-foreground transition active:scale-[0.99]"
        >
          <span>다시 하기</span>
        </button>
      </div>
    </div>
  )
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
