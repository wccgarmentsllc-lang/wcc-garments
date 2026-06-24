import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-6">
      <span className="font-display text-[120px] font-bold leading-none text-[var(--text)] opacity-5 md:text-[200px]">
        404
      </span>
      <h1 className="mt-4 font-display text-3xl font-semibold text-[var(--text)]">
        Page Not Found
      </h1>
      <p className="mt-3 text-center text-sm text-[var(--text-muted)]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="btn-gold text-[10px]">
          Back to Home
        </Link>
        <Link href="/products" className="btn-solid text-[10px]">
          View Products
        </Link>
      </div>
    </div>
  )
}
