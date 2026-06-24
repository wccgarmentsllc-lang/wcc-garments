import { ProductGridSkeleton } from '@/components/products/ProductSkeleton'

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="border-b border-[var(--border)] bg-[var(--bg-surface)] pt-32 pb-14">
        <div className="mx-auto max-w-[1560px] px-6 lg:px-12">
          <div className="h-4 w-32 animate-pulse bg-[var(--bg-subtle)]" />
          <div className="mt-7 h-12 w-3/4 animate-pulse bg-[var(--bg-subtle)]" />
          <div className="mt-3 h-4 w-2/3 animate-pulse bg-[var(--bg-subtle)]" />
          <div className="mt-8 h-14 w-full animate-pulse bg-[var(--bg-subtle)]" />
        </div>
      </div>
      <div className="mx-auto max-w-[1560px] px-6 py-12 lg:px-12">
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  )
}
