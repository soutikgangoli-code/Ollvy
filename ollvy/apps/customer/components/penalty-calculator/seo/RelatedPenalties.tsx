// components/penalty-calculator/seo/RelatedPenalties.tsx

import Link from 'next/link'
import { Card } from '@/components/ui/card'

interface RelatedPenaltiesProps {
  data: { title: string; slug: string; description: string }[]
}

export function RelatedPenalties({ data }: RelatedPenaltiesProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Related Tools</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {data.map((item, index) => (
          <Link
            key={index}
            href={`/tools/penalty-calculator/${item.slug}`}
            className="block"
          >
            <Card className="p-4 rounded-none hover:border-emerald-500 transition-colors h-full">
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
