'use client'

import { DIVISIONS } from '@/lib/constants'

interface ProductFilterProps {
  activeDivision: string
  onDivisionChange: (division: string) => void
}

export function ProductFilter({ activeDivision, onDivisionChange }: ProductFilterProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      <button
        onClick={() => onDivisionChange('')}
        className={`border px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-all duration-300 ${
          activeDivision === ''
            ? 'border-gold bg-gold/10 text-gold'
            : 'border-[var(--border)] text-[var(--text-muted)] hover:border-gold/40 hover:text-[var(--text)]'
        }`}
      >
        All Products
      </button>
      {DIVISIONS.map((div) => (
        <button
          key={div.slug}
          onClick={() => onDivisionChange(div.slug)}
          className={`border px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-all duration-300 ${
            activeDivision === div.slug
              ? 'border-gold bg-gold/10 text-gold'
              : 'border-[var(--border)] text-[var(--text-muted)] hover:border-gold/40 hover:text-[var(--text)]'
          }`}
        >
          {div.name}
        </button>
      ))}
    </div>
  )
}
