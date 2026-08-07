"use client"

import { useState } from "react"
import { BrandMark } from "@/components/screen-shell"
import { FunBadge } from "@/components/fun-notice"

const NOTICES = [
  {
    icon: SparkleIcon,
    text: "결과는 오락·재미를 위한 이야기예요. 과학적 근거는 없어요.",
  },
  {
    icon: ShieldIcon,
    text: "올린 사진은 저장하지 않아요. 분석이 끝나면 바로 사라져요.",
  },
  {
    icon: HeartIcon,
    text: "다른 사람의 사진은 그 사람의 동의 없이 올리지 말아 주세요.",
  },
]

export function ScreenConsent({ onAgree }: { onAgree: () => void }) {
  const [checked, setChecked] = useState(false) // 기본은 반드시 해제 상태

  return (
    <div className="flex flex-1 flex-col">
      <BrandMark />

      <div className="mt-10 flex flex-col items-center text-center">
        <FunBadge />
        <h1 className="mt-4 text-balance font-display text-3xl leading-snug text-foreground">
          사진 한 장으로 보는
          <br />
          오늘의 얼굴 이야기
        </h1>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
          진지하게 믿기보다는, 가볍게 웃으며 즐겨 주세요.
          <br />
          시작하기 전에 아래 세 가지만 확인해 주세요.
        </p>
      </div>

      <ul className="mt-8 flex flex-col gap-3">
        {NOTICES.map((n) => {
          const Icon = n.icon
          return (
            <li
              key={n.text}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-4"
            >
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
              >
                <Icon />
              </span>
              <p className="text-pretty text-sm leading-relaxed text-card-foreground">{n.text}</p>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto pt-8">
        <label className="mb-4 flex cursor-pointer items-center gap-3 rounded-2xl bg-secondary px-4 py-3.5 text-secondary-foreground">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="size-5 shrink-0 accent-primary"
          />
          <span className="text-sm font-medium">위 내용을 모두 확인했고, 동의해요</span>
        </label>

        <button
          type="button"
          disabled={!checked}
          onClick={onAgree}
          className="h-14 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-lg transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          동의하고 시작하기
        </button>
      </div>
    </div>
  )
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l1.8 4.9L18.7 9l-4.9 1.8L12 15.7 10.2 10.8 5.3 9l4.9-1.1L12 3z"
        fill="currentColor"
      />
      <circle cx="18" cy="17" r="1.5" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l7 2.5v5c0 4.3-2.9 7.6-7 8.5-4.1-.9-7-4.2-7-8.5v-5L12 3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20s-6.5-4.2-8.5-8.2C2.2 9 3.5 6 6.4 6c1.9 0 3 1.1 3.6 2.1C10.6 7.1 11.7 6 13.6 6c2.9 0 4.2 3 3 5.8C15.5 15.8 12 20 12 20z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}
