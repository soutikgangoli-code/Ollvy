'use client'

import { useState, ReactNode } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  CheckCircle2,
  ChevronRight,
  X,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DocumentItem {
  icon: ReactNode
  name: string
  note: string
  details?: string[]
  required?: boolean
  ollvyProvides?: boolean
  whatIsIt?: string
  howToGet?: string
  usualIssues?: string
  sampleImage?: string
}

export interface DocumentCategory {
  category: string
  categoryNote?: string
  items: DocumentItem[]
}

interface SelectedDocument extends DocumentItem {
  categoryName: string
}

interface DocumentChecklistPageProps {
  title: string
  subtitle: string
  description: string
  categories: DocumentCategory[]
  ctaTitle: string
  ctaDescription: string
  ctaButtonText: string
  ctaButtonHref: string
}

export function DocumentChecklistPage({
  title,
  subtitle,
  description,
  categories,
  ctaTitle,
  ctaDescription,
  ctaButtonText,
  ctaButtonHref,
}: DocumentChecklistPageProps) {
  const [selectedDoc, setSelectedDoc] = useState<SelectedDocument | null>(null)

  const totalRequired = categories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => item.required).length,
    0
  )

  const totalOllvyProvides = categories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => item.ollvyProvides).length,
    0
  )

  return (
    <div className="py-24">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            DOCUMENT CHECKLIST
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            {description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{totalRequired}</p>
              <p className="text-sm text-muted-foreground">Required Documents</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalOllvyProvides}</p>
              <p className="text-sm text-muted-foreground">Ollvy Provides</p>
            </div>
          </div>
        </div>

        {/* Document Categories */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.category}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">{category.category}</h2>
                {category.categoryNote && (
                  <p className="text-sm text-muted-foreground">{category.categoryNote}</p>
                )}
              </div>

              <div className="space-y-3">
                {category.items.map((item, index) => (
                  <Card
                    key={index}
                    className={cn(
                      'p-4 cursor-pointer transition-all hover:border-primary/50',
                      item.ollvyProvides && 'bg-primary/5 border-primary/20'
                    )}
                    onClick={() => setSelectedDoc({ ...item, categoryName: category.category })}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{item.name}</h3>
                          {item.required && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-ollvy-red/10 text-ollvy-red font-medium">
                              Required
                            </span>
                          )}
                          {item.ollvyProvides && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                              Ollvy Provides
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="mt-12 p-8 text-center border-primary/20 bg-primary/5">
          <h3 className="text-xl font-semibold text-foreground">{ctaTitle}</h3>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">{ctaDescription}</p>
          <Button className="mt-6" size="lg" asChild>
            <Link href={ctaButtonHref}>{ctaButtonText}</Link>
          </Button>
        </Card>

        {/* Document Detail Dialog */}
        <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                {selectedDoc && (
                  <div className="p-2 rounded-lg bg-muted">{selectedDoc.icon}</div>
                )}
                <div>
                  <DialogTitle>{selectedDoc?.name}</DialogTitle>
                  <p className="text-sm text-muted-foreground">{selectedDoc?.categoryName}</p>
                </div>
              </div>
            </DialogHeader>

            {selectedDoc && (
              <div className="space-y-6 mt-4">
                {/* Tags */}
                <div className="flex gap-2">
                  {selectedDoc.required && (
                    <span className="text-xs px-2 py-1 rounded-full bg-ollvy-red/10 text-ollvy-red font-medium">
                      Required
                    </span>
                  )}
                  {selectedDoc.ollvyProvides && (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      Ollvy Provides
                    </span>
                  )}
                </div>

                {/* What Is It */}
                {selectedDoc.whatIsIt && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">What is this?</h4>
                    <p className="text-sm text-muted-foreground">{selectedDoc.whatIsIt}</p>
                  </div>
                )}

                {/* How To Get */}
                {selectedDoc.howToGet && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">How to get it</h4>
                    <p className="text-sm text-muted-foreground">{selectedDoc.howToGet}</p>
                  </div>
                )}

                {/* Usual Issues */}
                {selectedDoc.usualIssues && (
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <h4 className="font-semibold text-yellow-600">Common Issues</h4>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {selectedDoc.usualIssues}
                    </p>
                  </div>
                )}

                {/* Details */}
                {selectedDoc.details && selectedDoc.details.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Requirements</h4>
                    <ul className="space-y-2">
                      {selectedDoc.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
