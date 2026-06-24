import { ProductGridSkeleton } from '@/components/products/ProductSkeleton'

export default function DivisionCategoryLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="border-b border-[var(--border)] bg-[var(--bg-surface)] pt-28 pb-14 md:pt-36 md:pb-16">
        <div className="mx-auto max-w-[1560px] px-6 lg:px-12">
          <div className="h-3 w-48 animate-pulse bg-[var(--bg-subtle)]" />
          <div className="mt-8 h-4 w-32 animate-pulse bg-[var(--bg-subtle)]" />
          <div className="mt-4 h-12 w-3/4 animate-pulse bg-[var(--bg-subtle)]" />
          <div className="mt-3 h-4 w-2/3 animate-pulse bg-[var(--bg-subtle)]" />
          <div className="mt-10 h-14 w-80 animate-pulse bg-[var(--bg-subtle)]" />
          <div className="mt-8 flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-24 animate-pulse bg-[var(--bg-subtle)]" />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1560px] px-6 py-12 lg:px-12">
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  )
}
