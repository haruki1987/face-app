import { BrandMark } from "@/components/screen-shell"
import { CONFIG } from "@/lib/gwansang-config"

// 대기 화면. 사용자가 할 수 있는 조작은 없다.
export function ScreenAnalyzing() {
  return (
    <div className="flex flex-1 flex-col">
      <BrandMark subtitle="관상을 살펴보는 중" />

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative flex size-32 items-center justify-center" aria-hidden>
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <span className="absolute inset-3 rounded-full border-2 border-dashed border-primary/50 animate-[spin_6s_linear_infinite]" />
          <span className="animate-float-slow text-5xl">🔮</span>
        </div>

        <p className="mt-8 font-display text-2xl text-foreground" role="status" aria-live="polite">
          얼굴을 찬찬히 살펴보는 중…
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          보통 몇 초면 끝나요. 길어도 약 {CONFIG.analysisTimeoutSec}초 안에는 준비돼요.
          <br />
          잠시만 기다려 주세요.
        </p>

        <div className="mt-8 flex gap-2" aria-hidden>
          <Dot delay="0s" />
          <Dot delay="0.2s" />
          <Dot delay="0.4s" />
        </div>
      </div>
    </div>
  )
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="animate-twinkle size-2.5 rounded-full bg-primary"
      style={{ animationDelay: delay }}
    />
  )
}
