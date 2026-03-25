// components/penalty-calculator/seo/PenaltyBreakdownTable.tsx

interface PenaltyBreakdownTableProps {
  data: {
    title: string
    categories: {
      name: string
      rate: string
      cap: string
      notes?: string
    }[]
  }
}

export function PenaltyBreakdownTable({ data }: PenaltyBreakdownTableProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">{data.title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Rate</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Cap</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground hidden md:table-cell">Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.categories.map((category, index) => (
              <tr key={index} className="border-b border-border last:border-0">
                <td className="py-3 px-4 text-foreground font-medium">{category.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{category.rate}</td>
                <td className="py-3 px-4 text-muted-foreground">{category.cap}</td>
                <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">
                  {category.notes || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile notes - shown below table on small screens */}
      <div className="md:hidden space-y-2">
        {data.categories
          .filter(c => c.notes)
          .map((category, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{category.name}:</span>{' '}
              {category.notes}
            </p>
          ))}
      </div>
    </section>
  )
}
