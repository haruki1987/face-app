import type React from "react"

// 모바일 세로 화면 기준의 공통 셸. 별 배경으로 오락물 무드를 준다.
export function ScreenShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-[radial-gradient(120%_70%_at_50%_-10%,oklch(0.56_0.09_320)_0%,transparent_55%)]">
      <div aria-hidden className="starry pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 pb-6 pt-8">
        {children}
      </div>
    </main>
  )
}

// 브랜드 헤더 (달 마크 + 이름)
export function BrandMark({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="animate-float-slow relative flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
        <MoonGlyph />
      </div>
      <div className="leading-tight">
        <p className="font-display text-lg text-primary">오늘의 관상</p>
        <p className="text-xs text-muted-foreground">{subtitle ?? "재미로 보는 얼굴 이야기"}</p>
      </div>
    </div>
  )
}

function MoonGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"
        fill="currentColor"
      />
      <circle cx="14.5" cy="7.5" r="0.9" fill="currentColor" opacity="0.5" />
    </svg>
  )
}
