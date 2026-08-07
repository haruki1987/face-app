// 어느 화면에서든 "오락 목적"을 알려주는 작은 배지/문구.
export function FunBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary ${className}`}
    >
      <svg
        aria-hidden
        className="animate-twinkle"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l2.2 6.1L20.5 10l-6.3 1.9L12 18l-2.2-6.1L3.5 10l6.3-1.9L12 2z" />
      </svg>
      재미로 보는 오락 콘텐츠
    </span>
  )
}
