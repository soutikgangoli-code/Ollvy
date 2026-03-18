'use client'

import { cn } from '@/lib/utils'

interface FilterChip {
  id: string
  label: string
}

interface FilterChipsProps {
  filters: FilterChip[]
  selected: string[]
  onChange: (selected: string[]) => void
  allowMultiple?: boolean
}

export function FilterChips({
  filters,
  selected,
  onChange,
  allowMultiple = false,
}: FilterChipsProps) {
  const handleClick = (id: string) => {
    if (id === 'all') {
      onChange([])
      return
    }

    if (allowMultiple) {
      if (selected.includes(id)) {
        onChange(selected.filter((s) => s !== id))
      } else {
        onChange([...selected, id])
      }
    } else {
      onChange(selected.includes(id) ? [] : [id])
    }
  }

  const isSelected = (id: string) => {
    if (id === 'all') return selected.length === 0
    return selected.includes(id)
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible md:flex-wrap">
      <button
        onClick={() => handleClick('all')}
        className={cn(
          'inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0',
          isSelected('all')
            ? 'bg-foreground text-background border-foreground'
            : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
        )}
      >
        All
      </button>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => handleClick(filter.id)}
          className={cn(
            'inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0',
            isSelected(filter.id)
              ? 'bg-foreground text-background border-foreground'
              : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
