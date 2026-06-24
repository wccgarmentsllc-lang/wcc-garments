export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24">
      <div className="mx-auto max-w-[1560px] px-6 lg:px-12">
        <div className="py-10">
          <div className="h-4 w-80 animate-pulse bg-[var(--bg-subtle)]" />
        </div>
        <div className="border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-7 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="aspect-[1/1] animate-pulse bg-[var(--bg-subtle)]" />
              <div className="mt-4 grid grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="aspect-square animate-pulse bg-[var(--bg-subtle)]" />
                ))}
              </div>
            </div>
            <div className="space-y-4 lg:col-span-6">
              <div className="h-6 w-24 animate-pulse bg-[var(--bg-subtle)]" />
              <div className="h-11 w-5/6 animate-pulse bg-[var(--bg-subtle)]" />
              <div className="h-24 w-full animate-pulse bg-[var(--bg-subtle)]" />
              <div className="h-40 w-full animate-pulse bg-[var(--bg-subtle)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
