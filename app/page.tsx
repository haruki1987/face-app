"use client"

import { useEffect, useRef, useState } from "react"
import { ScreenShell } from "@/components/screen-shell"
import { ScreenConsent } from "@/components/screen-consent"
import { ScreenSelect } from "@/components/screen-select"
import { ScreenAnalyzing } from "@/components/screen-analyzing"
import { ScreenResult } from "@/components/screen-result"
import { ScreenError } from "@/components/screen-error"
import type { ErrorKind } from "@/lib/gwansang-config"

// A(고지·동의) → B(사진 선택) → C(분석 중) → D(결과) / 실패 시 E(에러)
type Step = "consent" | "select" | "analyzing" | "result" | "error"

export default function Page() {
  const [step, setStep] = useState<Step>("consent")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [errorKind] = useState<ErrorKind>("face")
  const objectUrlRef = useRef<string | null>(null)

  // 미리보기 objectURL 정리
  function setPreview(url: string | null) {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    objectUrlRef.current = url
    setPreviewUrl(url)
  }
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  function handlePick(_file: File, url: string) {
    setPreview(url)
  }

  // C: 분석 시작 → 잠시 대기 후 결과로 (UI 단계이므로 실제 호출 없이 타이머로 시뮬레이션)
  function startAnalysis() {
    setStep("analyzing")
  }
  useEffect(() => {
    if (step !== "analyzing") return
    const t = setTimeout(() => setStep("result"), 2200)
    return () => clearTimeout(t)
  }, [step])

  // D/E → B 로 복귀 (A 는 다시 거치지 않음)
  function backToSelect() {
    setStep("select")
  }

  return (
    <ScreenShell>
      {step === "consent" && <ScreenConsent onAgree={() => setStep("select")} />}
      {step === "select" && (
        <ScreenSelect previewUrl={previewUrl} onPick={handlePick} onStart={startAnalysis} />
      )}
      {step === "analyzing" && <ScreenAnalyzing />}
      {step === "result" && <ScreenResult onRestart={backToSelect} />}
      {step === "error" && <ScreenError kind={errorKind} onRetry={backToSelect} />}
    </ScreenShell>
  )
}
