export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin border-2 border-gold border-t-transparent" />
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--text-muted)]">
          Loading
        </span>
      </div>
    </div>
  )
}
