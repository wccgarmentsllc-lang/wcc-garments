export function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[5/6] bg-[var(--bg-subtle)]" />
      <div className="px-2 pb-1 pt-4">
        <div className="h-2.5 w-28 bg-[var(--bg-subtle)]" />
        <div className="mt-3 h-4 w-5/6 bg-[var(--bg-subtle)]" />
        <div className="mt-2 h-3 w-full bg-[var(--bg-subtle)]" />
        <div className="mt-4 h-3 w-2/3 bg-[var(--bg-subtle)]" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 2xl:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}
