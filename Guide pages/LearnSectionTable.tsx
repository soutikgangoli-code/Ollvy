// components/learn/LearnSectionTable.tsx
// Renders a comparison table in guide pages
// Designed for Google featured snippet extraction

interface LearnSectionTableProps {
  caption?: string
  headers: string[]
  rows: string[][]
}

export function LearnSectionTable({ caption, headers, rows }: LearnSectionTableProps) {
  return (
    <div className="my-6 w-full overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm border-collapse">
        {caption && (
          <caption className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border bg-muted/30">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 text-foreground align-top ${ci === 0 ? 'font-medium' : 'text-muted-foreground'}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
