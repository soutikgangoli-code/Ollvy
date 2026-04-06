'use client'

import type { LearnSectionTable as TableType } from '@/lib/guides/types/learn-section-table'

interface Props {
  table: TableType
}

/**
 * Wraps numbers (including currency, percentages, and numeric values) in font-mono spans
 */
function formatWithMonoNumbers(text: string): React.ReactNode {
  // Match: ₹ amounts, percentages, plain numbers with optional commas/decimals, and ranges like "7-10"
  const parts = text.split(/(₹[\d,]+(?:\.\d+)?(?:\s*(?:Cr|L|K|crore|lakh))?|\d+(?:,\d+)*(?:\.\d+)?%?(?:\s*(?:Cr|L|K|crore|lakh|days?|years?|months?))?|\d+-\d+)/gi)

  return parts.map((part, i) => {
    // Check if this part contains numbers
    if (/^₹?[\d,.-]+(?:\.\d+)?%?(?:\s*(?:Cr|L|K|crore|lakh|days?|years?|months?))?$/i.test(part) || /^\d+-\d+$/.test(part)) {
      return <span key={i} className="font-mono">{part}</span>
    }
    return part
  })
}

/**
 * Renders a comparison/reference table inside a LearnSection.
 *
 * Used for:
 * - GST threshold tables
 * - Pvt Ltd vs LLP comparison
 * - ITR form selection
 * - FSSAI licence tiers
 * - etc.
 */
export function LearnSectionTable({ table }: Props) {
  const { caption, headers, rows } = table

  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {caption && (
          <caption className="mb-2 text-left text-xs font-medium text-muted-foreground">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-border">
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left font-semibold text-foreground"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border last:border-b-0"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-3 py-2 text-muted-foreground"
                >
                  {formatWithMonoNumbers(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
