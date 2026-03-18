'use client'

import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ExternalLink } from 'lucide-react'

const LAST_REVIEWED = 'March 2025'

const SOURCES: [string, string][] = [
  ['Ministry of Corporate Affairs', 'https://www.mca.gov.in'],
  ['GST Council / GSTN Portal', 'https://www.gst.gov.in'],
  ['Income Tax India', 'https://www.incometax.gov.in'],
  ['EPFO - Employees Provident Fund Organisation', 'https://www.epfindia.gov.in'],
  ['ESIC - Employees State Insurance Corporation', 'https://www.esic.in'],
]

export function AccuracyStatement() {
  return (
    <section className="bg-background py-12">
      <div className="container">
        <Card className="border border-border bg-card max-w-[800px] mx-auto p-8">
          <h3 className="font-semibold text-base text-foreground">How we ensure accuracy</h3>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            Ollvy's service descriptions, penalty amounts, and compliance deadlines are sourced
            directly from official government portals. We do not rely on secondary sources. We
            update this information when regulations change.
          </p>

          <Tabs defaultValue="sources" className="mt-6">
            <TabsList>
              <TabsTrigger value="sources">Sources</TabsTrigger>
              <TabsTrigger value="history">Last Reviewed</TabsTrigger>
            </TabsList>

            <TabsContent value="sources" className="mt-4">
              <ul className="space-y-2">
                {SOURCES.map(([label, url]) => (
                  <li key={url} className="flex items-center gap-2 text-sm">
                    <ExternalLink size={11} className="text-muted-foreground shrink-0" />
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                      <span className="font-mono text-xs ml-2 opacity-60">{url}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <p className="text-sm text-muted-foreground">
                Content last reviewed: <strong className="text-foreground">{LAST_REVIEWED}</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">
                Update the{' '}
                <code className="bg-muted px-1 py-0.5 rounded text-xs">LAST_REVIEWED</code>{' '}
                constant in{' '}
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  constants/accuracy.ts
                </code>{' '}
                every time you manually verify the penalty amounts against the source portals.
              </p>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </section>
  )
}
