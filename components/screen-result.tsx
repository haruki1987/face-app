import { FunBadge } from "@/components/fun-notice"
import { MOCK_RESULT } from "@/lib/gwansang-config"

// 결과 카드. 항목은 배열로 순회 렌더링 → 3개든 5개든 레이아웃이 깨지지 않는다.
// 목표: 세로 스크롤 1회 안에 결과 전체가 들어오고, 한 장 캡처로 완결돼 보이게.
export function ScreenResult({ onRestart }: { onRestart: () => void }) {
  const { headline, items, closing } = MOCK_RESULT

  return (
    <div className="flex flex-1 flex-col">
      {/* 캡처 대상 카드 */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/25 bg-card p-6 shadow-2xl">
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

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={onRestart}
          className="h-14 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-lg transition active:scale-[0.99]"
        >
          다시 하기
        </button>
      </div>
    </div>
  )
}
