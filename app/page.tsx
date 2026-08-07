"use client"

import { useEffect, useRef, useState } from "react"
import { ScreenShell } from "@/components/screen-shell"
import { ScreenConsent } from "@/components/screen-consent"
import { ScreenSelect } from "@/components/screen-select"
import { ScreenAnalyzing } from "@/components/screen-analyzing"
import { ScreenResult } from "@/components/screen-result"
import { ScreenError } from "@/components/screen-error"
import type { ErrorKind, ResultData } from "@/lib/gwansang-config"

// A(고지·동의) → B(사진 선택) → C(분석 중) → D(결과) / 실패 시 E(에러)
type Step = "consent" | "select" | "analyzing" | "result" | "error"

export default function Page() {
  const [step, setStep] = useState<Step>("consent")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultData, setResultData] = useState<ResultData | null>(null)
  const [errorKind, setErrorKind] = useState<ErrorKind>("server")
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

  function handlePick(file: File, url: string) {
    setSelectedFile(file)
    setPreview(url)
  }

  // C: 분석 시작 → 백엔드 API 연동
  async function startAnalysis() {
    if (!selectedFile) return
    setStep("analyzing")

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      const json = await res.json()

      if (json.success && json.data) {
        setResultData(json.data)
        setStep("result")
      } else {
        const kind: ErrorKind = json.error?.kind || "server"
        setErrorKind(kind)
        setStep("error")
      }
    } catch (error) {
      setErrorKind("server")
      setStep("error")
    }
  }

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
      {step === "result" && <ScreenResult resultData={resultData} onRestart={backToSelect} />}
      {step === "error" && <ScreenError kind={errorKind} onRetry={backToSelect} />}
    </ScreenShell>
  )
}

