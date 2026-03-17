'use client'

import { useState, ReactNode } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  X,
  FileText,
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

interface DocumentChecklistContentProps {
  categories: DocumentCategory[]
  ctaTitle: string
  ctaDescription: string
  ctaButtonText: string
  ctaButtonHref: string
}

// Document Detail Panel - shown on the right side
function DocumentDetailPanel({ doc, onClose }: { doc: SelectedDocument; onClose: () => void }) {
  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-4 border-b border-border bg-muted/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg border border-primary/30 bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            {doc.icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{doc.name}</h3>
            <p className="text-xs text-muted-foreground">{doc.categoryName}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Badges */}
        <div className="flex items-center gap-2">
          {doc.required && (
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
              Required
            </span>
          )}
          {doc.ollvyProvides && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              Ollvy handles this
            </span>
          )}
          {!doc.required && !doc.ollvyProvides && (
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">
              Optional
            </span>
          )}
        </div>

        {/* Sample Image */}
        {doc.sampleImage && (
          <div className="rounded-lg border border-border overflow-hidden bg-muted/30">
            <img
              src={doc.sampleImage}
              alt={`Sample ${doc.name}`}
              className="w-full h-auto max-h-40 object-contain"
            />
            <p className="text-[10px] text-center text-muted-foreground py-1.5 border-t border-border">
              Sample document for reference
            </p>
          </div>
        )}

        {/* What is it */}
        {doc.whatIsIt && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              What is this?
            </h4>
            <p className="text-sm text-foreground leading-relaxed">{doc.whatIsIt}</p>
          </div>
        )}

        {/* How to get */}
        {doc.howToGet && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              How to get it
            </h4>
            <p className="text-sm text-foreground leading-relaxed">{doc.howToGet}</p>
          </div>
        )}

        {/* Usual Issues */}
        {doc.usualIssues && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-600" />
              <div>
                <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Common issues</h4>
                <p className="text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed">{doc.usualIssues}</p>
              </div>
            </div>
          </div>
        )}

        {/* Requirements */}
        {doc.details && doc.details.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              What we check
            </h4>
            <ul className="space-y-2">
              {doc.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-primary" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export function DocumentChecklistContent({
  categories,
  ctaTitle,
  ctaDescription,
  ctaButtonText,
  ctaButtonHref,
}: DocumentChecklistContentProps) {
  // Auto-select first document on initial load
  const [selectedDoc, setSelectedDoc] = useState<SelectedDocument | null>(() => {
    if (categories.length > 0 && categories[0].items.length > 0) {
      const firstItem = categories[0].items[0]
      return { ...firstItem, categoryName: categories[0].category }
    }
    return null
  })

  const totalRequired = categories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => item.required).length,
    0
  )

  const totalOllvyProvides = categories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => item.ollvyProvides).length,
    0
  )

  return (
    <>
      {/* Stats */}
      <div className="flex items-center justify-center gap-6 mb-8">
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

      {/* Main Content - Side by Side Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Side - Document List */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.category}>
              <div className="mb-3">
                <h2 className="text-base font-semibold text-foreground">{category.category}</h2>
                {category.categoryNote && (
                  <p className="text-sm text-muted-foreground">{category.categoryNote}</p>
                )}
              </div>

              <div className="space-y-2">
                {category.items.map((item, index) => {
                  const isSelected = selectedDoc?.name === item.name && selectedDoc?.categoryName === category.category
                  return (
                    <Card
                      key={index}
                      className={cn(
                        'p-3 cursor-pointer transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                          : item.ollvyProvides
                            ? 'bg-primary/5 border-primary/20 hover:border-primary/50'
                            : 'hover:border-primary/50'
                      )}
                      onClick={() => setSelectedDoc({ ...item, categoryName: category.category })}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-1.5 rounded-md shrink-0",
                          isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-medium text-foreground">{item.name}</h3>
                            {item.required && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-medium">
                                Required
                              </span>
                            )}
                            {item.ollvyProvides && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                                Ollvy
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.note}</p>
                        </div>
                        <ChevronRight className={cn(
                          "h-4 w-4 shrink-0",
                          isSelected ? "text-primary" : "text-muted-foreground/40"
                        )} />
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500/60"></span>
              Required
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-primary/60"></span>
              Ollvy provides
            </div>
          </div>
        </div>

        {/* Right Side - Document Details */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {selectedDoc ? (
            <DocumentDetailPanel
              doc={selectedDoc}
              onClose={() => setSelectedDoc(null)}
            />
          ) : (
            <Card className="p-8 text-center border-dashed">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-muted">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Select a document</h3>
              <p className="text-sm text-muted-foreground">
                Click on any document in the list to see detailed information about what it is, how to get it, and common issues.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <Card className="mt-12 p-8 text-center border-primary/20 bg-primary/5">
        <h3 className="text-xl font-semibold text-foreground">{ctaTitle}</h3>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">{ctaDescription}</p>
        <Button className="mt-6" size="lg" asChild>
          <Link href={ctaButtonHref}>{ctaButtonText}</Link>
        </Button>
      </Card>
    </>
  )
}
