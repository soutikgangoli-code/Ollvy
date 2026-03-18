'use client'

import { useState, ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  X,
  FileText,
  ArrowRight,
  Download,
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
  pageTitle?: string
  pageSubtitle?: string
}

// Document Detail Panel - shown on the right side
function DocumentDetailPanel({ doc, onClose }: { doc: SelectedDocument; onClose: () => void }) {
  return (
    <div className="h-full flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 text-muted-foreground">
            {doc.icon}
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">{doc.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{doc.categoryName}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Badges */}
        <div className="flex items-center gap-2">
          {doc.required && (
            <span className="text-[10px] font-mono px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              REQUIRED
            </span>
          )}
          {doc.ollvyProvides && (
            <span className="text-[10px] font-mono px-2 py-1 bg-muted text-muted-foreground border border-border">
              OLLVY HANDLES
            </span>
          )}
          {!doc.required && !doc.ollvyProvides && (
            <span className="text-[10px] font-mono px-2 py-1 bg-muted text-muted-foreground border border-border">
              OPTIONAL
            </span>
          )}
        </div>

        {/* Sample Image */}
        {doc.sampleImage && (
          <div className="rounded-lg border border-border overflow-hidden bg-muted">
            <img
              src={doc.sampleImage}
              alt={`Sample ${doc.name}`}
              className="w-full h-auto max-h-40 object-contain"
            />
            <p className="font-mono text-[10px] text-center text-muted-foreground py-2 border-t border-border">
              Sample document for reference
            </p>
          </div>
        )}

        {/* What is it */}
        {doc.whatIsIt && (
          <div>
            <h4 className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
              What is this?
            </h4>
            <p className="text-sm text-foreground/90 leading-relaxed">{doc.whatIsIt}</p>
          </div>
        )}

        {/* How to get */}
        {doc.howToGet && (
          <div>
            <h4 className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
              How to get it
            </h4>
            <p className="text-sm text-foreground/90 leading-relaxed">{doc.howToGet}</p>
          </div>
        )}

        {/* Usual Issues */}
        {doc.usualIssues && (
          <div className="p-4 rounded-lg bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 dark:border-amber-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-500" />
              <div>
                <h4 className="font-mono text-[10px] text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">Common Issues</h4>
                <p className="text-xs text-amber-800/90 dark:text-amber-200/80 leading-relaxed">{doc.usualIssues}</p>
              </div>
            </div>
          </div>
        )}

        {/* Requirements */}
        {doc.details && doc.details.length > 0 && (
          <div>
            <h4 className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-3">
              Requirements
            </h4>
            <ul className="space-y-2">
              {doc.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                  <span className="font-mono text-[10px] text-muted-foreground mt-1 w-4">{String(i + 1).padStart(2, '0')}</span>
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
  pageTitle = 'Documents Required',
  pageSubtitle,
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

  const totalDocs = categories.reduce((acc, cat) => acc + cat.items.length, 0)

  // Export all document names
  const handleExportAll = () => {
    const lines: string[] = []
    categories.forEach((category) => {
      lines.push(`\n${category.category.toUpperCase()}`)
      if (category.categoryNote) {
        lines.push(`(${category.categoryNote})`)
      }
      lines.push('')
      category.items.forEach((item, index) => {
        const status = item.required ? '[Required]' : item.ollvyProvides ? '[Ollvy Handles]' : '[Optional]'
        lines.push(`${index + 1}. ${item.name} ${status}`)
        lines.push(`   ${item.note}`)
      })
    })

    const content = `DOCUMENT CHECKLIST\n${pageTitle}\n${'='.repeat(40)}${lines.join('\n')}\n\n---\nGenerated from Ollvy.com`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `document-checklist-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {/* Stats + Export */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-8">
        <div>
          <p className="font-mono text-3xl font-semibold text-foreground tabular-nums">{totalDocs}</p>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Total Documents</p>
        </div>
        <div className="h-10 w-px bg-border/50" />
        <div>
          <p className="font-mono text-3xl font-semibold text-emerald-400 tabular-nums">{totalRequired}</p>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Required</p>
        </div>
        <div className="h-10 w-px bg-border/50" />
        <div>
          <p className="font-mono text-3xl font-semibold text-muted-foreground tabular-nums">{totalOllvyProvides}</p>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Ollvy Handles</p>
        </div>
        </div>

        {/* Export Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportAll}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export List
        </Button>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-8">
        {/* Left Side - Document List */}
        <div className="space-y-8">
          {categories.map((category, catIndex) => (
            <div key={category.category}>
              <div className="mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {String(catIndex + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                    {category.category}
                  </h2>
                </div>
                {category.categoryNote && (
                  <p className="text-xs text-muted-foreground mt-1 ml-7">{category.categoryNote}</p>
                )}
              </div>

              <div className="space-y-2">
                {category.items.map((item, index) => {
                  const isSelected = selectedDoc?.name === item.name && selectedDoc?.categoryName === category.category
                  return (
                    <div
                      key={index}
                      className={cn(
                        'p-4 cursor-pointer transition-all rounded-xl border',
                        isSelected
                          ? 'border-border bg-muted'
                          : 'border-border/50 bg-card hover:border-border hover:bg-muted/50'
                      )}
                      onClick={() => setSelectedDoc({ ...item, categoryName: category.category })}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border",
                          isSelected
                            ? "bg-background border-border text-foreground"
                            : "bg-muted border-border/50 text-muted-foreground"
                        )}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-medium text-foreground">{item.name}</h3>
                            {item.required && (
                              <span className="font-mono text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                REQ
                              </span>
                            )}
                            {item.ollvyProvides && (
                              <span className="font-mono text-[9px] px-1.5 py-0.5 bg-muted text-muted-foreground border border-border">
                                OLLVY
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
                        </div>
                        <ChevronRight className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isSelected ? "text-foreground" : "text-muted-foreground/30"
                        )} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-6 text-xs pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">REQ</span>
              <span className="text-muted-foreground">Required document</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] px-1.5 py-0.5 bg-muted text-muted-foreground border border-border">OLLVY</span>
              <span className="text-muted-foreground">We handle this</span>
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
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-xl bg-muted border border-border flex items-center justify-center">
                  <FileText className="h-7 w-7 text-muted-foreground" />
                </div>
              </div>
              <h3 className="font-mono text-sm font-medium text-foreground mb-2">Select a document</h3>
              <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                Click any document to see detailed requirements and common issues
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 rounded-xl border border-border bg-card p-10 text-center">
        <h3 className="text-xl font-semibold text-foreground">{ctaTitle}</h3>
        <p className="text-sm text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
          {ctaDescription}
        </p>
        <Button className="mt-6 h-12 px-8" size="lg" asChild>
          <Link href={ctaButtonHref}>
            {ctaButtonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </>
  )
}
