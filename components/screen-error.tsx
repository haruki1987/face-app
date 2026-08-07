import { BrandMark } from "@/components/screen-shell"
import { ERROR_MESSAGES, type ErrorKind } from "@/lib/gwansang-config"

// 에러 화면. 4종을 각각 다른 메시지로 보여준다. 빈/멈춘 화면은 절대 없다.
export function ScreenError({ kind, onRetry }: { kind: ErrorKind; onRetry: () => void }) {
  const info = ERROR_MESSAGES[kind]

  return (
    <div className="flex flex-1 flex-col">
      <BrandMark subtitle="잠깐만요" />

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <span aria-hidden className="animate-float-slow text-6xl">
          🌫️
        </span>

        <p role="alert" className="mt-6 text-balance font-display text-2xl leading-snug text-foreground">
          {info.title}
        </p>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{info.hint}</p>
      </div>

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={onRetry}
          className="h-14 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-lg transition active:scale-[0.99]"
        >
          다른 사진으로 다시 하기
        </button>
      </div>
    </div>
  )
}
