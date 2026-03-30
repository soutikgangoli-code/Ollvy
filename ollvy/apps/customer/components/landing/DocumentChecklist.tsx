'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ChevronDown,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

// Import comprehensive document data from centralized source (used by tools pages)
import {
  pvtLtdDocuments,
  llpDocuments,
  partnershipDocuments,
  gstDocuments,
  individualITRDocuments,
  businessITRDocuments,
  trademarkDocuments,
} from '@/lib/data/document-checklists'
import { DocumentCategory, DocumentItem } from '@/components/tools/DocumentChecklistContent'

// Selected document for the detail panel
interface SelectedDocument extends DocumentItem {
  categoryName: string
}

// Use comprehensive document data from centralized source (same as tools pages)
// This ensures consistency between service pages, checkout, and tools
const DOCUMENT_DATA: Record<string, DocumentCategory[]> = {
  pvt_ltd: pvtLtdDocuments,
  llp: llpDocuments,
  sole_proprietor: gstDocuments, // Sole proprietors typically need GST-style docs
  partnership: partnershipDocuments,
  individual_itr: individualITRDocuments,
  trademark: trademarkDocuments,
  business_itr: businessITRDocuments,
}

// Service slug to document data mapping
// Maps service URLs to comprehensive document checklists from tools
const SERVICE_DOCUMENT_DATA: Record<string, DocumentCategory[]> = {
  // Incorporation services
  'pvt-ltd-incorporation': pvtLtdDocuments,
  'llp-incorporation': llpDocuments,
  'partnership-firm-registration': partnershipDocuments,

  // Tax & Compliance services
  'gst-registration': gstDocuments,
  'individual-itr': individualITRDocuments,
  'business-itr': businessITRDocuments,

  // IP services
  'trademark-registration': trademarkDocuments,

  // These services use related document sets as fallback
  'mca-annual-filing': pvtLtdDocuments, // Company docs needed for MCA filing
  'director-kyc': pvtLtdDocuments, // Director docs for KYC
  'gst-monthly-filing': gstDocuments, // GST docs for monthly compliance
  'gst-annual-return': gstDocuments,
  'tds-monthly-compliance': businessITRDocuments,
  'payroll-management': businessITRDocuments,
  'fssai-license': gstDocuments, // Basic business docs similar to GST
  'iec-code': gstDocuments, // Import-export uses similar KYC docs
}

const TAB_LABELS: Record<string, string> = {
  pvt_ltd: 'Private Limited',
  llp: 'LLP',
  sole_proprietor: 'Sole Proprietor',
  partnership: 'Partnership',
  individual_itr: 'Individual ITR',
  trademark: 'Trademark',
  business_itr: 'Business ITR',
}

// Helper to get preview items (first category, limited items) for card display
function getPreviewDocuments(categories: DocumentCategory[]): DocumentItem[] {
  // Get first 4-5 required items from the first two categories
  const previewItems: DocumentItem[] = []
  for (const category of categories) {
    for (const item of category.items) {
      if (previewItems.length >= 5) break
      if (item.required !== false || previewItems.length < 4) {
        previewItems.push(item)
      }
    }
    if (previewItems.length >= 5) break
  }
  return previewItems.slice(0, 5)
}

// Compact list for preview cards - modern minimal style
function DocumentPreviewList({ documents }: { documents: DocumentItem[] }) {
  return (
    <ul className="space-y-1.5">
      {documents.map((doc, i) => (
        <li key={i} className="flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors -mx-2">
          <div className="w-6 h-6 rounded-md bg-muted/60 flex items-center justify-center shrink-0 text-muted-foreground">
            {doc.icon}
          </div>
          <span className="text-sm text-foreground flex-1 truncate">{doc.name}</span>
          {doc.ollvyProvides && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium shrink-0">
              Ollvy
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

// Full detailed list for dialog with click-to-select
function DocumentFullList({
  categories,
  selectedDoc,
  onSelectDoc
}: {
  categories: DocumentCategory[]
  selectedDoc: SelectedDocument | null
  onSelectDoc: (doc: SelectedDocument | null) => void
}) {
  return (
    <div className="space-y-6">
      {categories.map((category, catIndex) => (
        <div key={catIndex}>
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-foreground">{category.category}</h4>
            {category.categoryNote && (
              <p className="text-xs text-muted-foreground">{category.categoryNote}</p>
            )}
          </div>
          <ul className="space-y-2">
            {category.items.map((doc, docIndex) => {
              const isSelected = selectedDoc?.name === doc.name && selectedDoc?.categoryName === category.category
              return (
                <li
                  key={docIndex}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      : 'border-border bg-card/50 hover:border-muted-foreground/30 hover:bg-card'
                  }`}
                  onClick={() => onSelectDoc({ ...doc, categoryName: category.category })}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground'
                    }`}>
                      {doc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-foreground">{doc.name}</p>
                        {doc.required && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-medium">
                            Required
                          </span>
                        )}
                        {doc.ollvyProvides && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                            Ollvy provides
                          </span>
                        )}
                      </div>
                      {doc.note && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{doc.note}</p>
                      )}
                    </div>
                    <ChevronRight size={14} className={`shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground/40'}`} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Document detail panel shown on the right
function DocumentDetailPanel({ doc, onClose }: { doc: SelectedDocument; onClose: () => void }) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-border">
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
      <div className="flex-1 overflow-y-auto py-4 space-y-5">
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
            <Image
              src={doc.sampleImage}
              alt={`Sample ${doc.name}`}
              width={400}
              height={160}
              className="w-full h-auto object-contain"
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
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div>
                <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">Common issues</h4>
                <p className="text-xs text-amber-900/80 dark:text-amber-100/80 leading-relaxed">{doc.usualIssues}</p>
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

interface DocumentChecklistProps {
  defaultTab?: string
  showSectionHeader?: boolean
  customHeading?: string
  /** When provided, shows service-specific documents instead of business-type tabs */
  serviceSlug?: string
  /** Service name to display in heading */
  serviceName?: string
}

export function DocumentChecklist({
  defaultTab = 'pvt_ltd',
  showSectionHeader = true,
  customHeading,
  serviceSlug,
  serviceName,
}: DocumentChecklistProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [selectedDoc, setSelectedDoc] = useState<SelectedDocument | null>(null)

  // Check if we have service-specific documents
  const hasServiceDocs = serviceSlug && SERVICE_DOCUMENT_DATA[serviceSlug]
  const serviceDocuments = hasServiceDocs ? SERVICE_DOCUMENT_DATA[serviceSlug] : null

  // Reset selected doc when dialog closes or tab changes
  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setSelectedDoc(null)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setSelectedDoc(null)
  }

  // Service-specific mode (no tabs, shows documents for this service only)
  if (hasServiceDocs && serviceDocuments) {
    const totalDocs = serviceDocuments.reduce((acc, cat) => acc + cat.items.length, 0)
    const displayName = serviceName || serviceSlug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

    return (
      <section className={showSectionHeader ? "bg-card py-24" : ""}>
        <div className={showSectionHeader ? "container" : ""}>
          {showSectionHeader && (
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                DOCUMENTS REQUIRED
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                {customHeading || `What you'll need for ${displayName}`}
              </h2>
              <p className="text-base text-muted-foreground max-w-[480px] mx-auto mt-4">
                Gather these documents before starting. Click any to see exactly what we need.
              </p>
            </div>
          )}
          {!showSectionHeader && customHeading && (
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-12">
              {customHeading}
            </h2>
          )}

          {/* Direct Card (no tabs) */}
          <div className={showSectionHeader ? "max-w-[640px] mx-auto" : ""}>
            <Card className="border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Required Documents</span>
                <span className="text-sm text-muted-foreground">{totalDocs} total</span>
              </div>
              <DocumentPreviewList documents={getPreviewDocuments(serviceDocuments)} />

              <div className="mt-4 pt-4 border-t border-border flex justify-center">
                <button
                  className="px-4 py-2 rounded-lg bg-[hsl(var(--ollvy-green))] text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors hover:bg-[hsl(142_71%_40%)]"
                  onClick={() => setDialogOpen(true)}
                >
                  View complete checklist
                  <ChevronDown size={14} />
                </button>
              </div>
            </Card>
          </div>

          {/* Dialog for service-specific docs */}
          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogContent className={`max-h-[85vh] overflow-hidden flex flex-col transition-all duration-300 ${
              selectedDoc ? 'max-w-[1000px]' : 'max-w-[680px]'
            }`}>
              <DialogHeader className="shrink-0">
                <DialogTitle>Document Checklist - {displayName}</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedDoc
                    ? 'Click any document to learn what it is and how to get it.'
                    : 'Everything you need to have ready. Click any document for details.'
                  }
                </p>
              </DialogHeader>

              <div className="mt-4 flex-1 overflow-hidden flex gap-4">
                {/* Document List - Left Side */}
                <div className={`overflow-y-auto pr-2 -mr-2 transition-all duration-300 ${
                  selectedDoc ? 'w-1/2 border-r border-border pr-4' : 'w-full'
                }`}>
                  <DocumentFullList
                    categories={serviceDocuments}
                    selectedDoc={selectedDoc}
                    onSelectDoc={setSelectedDoc}
                  />
                </div>

                {/* Document Detail - Right Side */}
                {selectedDoc && (
                  <div className="w-1/2 pl-2 animate-in slide-in-from-right-4 duration-200">
                    <DocumentDetailPanel
                      doc={selectedDoc}
                      onClose={() => setSelectedDoc(null)}
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 mt-4 shrink-0">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500/60"></span>
                    Required
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary/60"></span>
                    Ollvy handles
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    )
  }

  // Default mode with business-type tabs (homepage)
  return (
    <section className="bg-card py-24">
      <div className="container">
        {showSectionHeader && (
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              BEFORE YOU BOOK
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              {customHeading || "What you'll need"}
            </h2>
            <p className="text-base text-muted-foreground max-w-[480px] mx-auto mt-4">
              Gather these before you start. Click any document to see exactly what we need.
            </p>
          </div>
        )}
        {!showSectionHeader && customHeading && (
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-12">
            {customHeading}
          </h2>
        )}

        {/* Tabs + Card Container */}
        <div className="max-w-[640px] mx-auto">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <div className="overflow-x-auto pb-1">
              <TabsList className="h-auto p-1 gap-1 w-full flex-wrap justify-center bg-transparent">
                <TabsTrigger value="pvt_ltd" className="font-mono text-xs h-7 px-2.5 text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-sm transition-all duration-150">Pvt Ltd</TabsTrigger>
                <TabsTrigger value="llp" className="font-mono text-xs h-7 px-2.5 text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-sm transition-all duration-150">LLP</TabsTrigger>
                <TabsTrigger value="sole_proprietor" className="font-mono text-xs h-7 px-2.5 text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-sm transition-all duration-150">Sole Prop</TabsTrigger>
                <TabsTrigger value="partnership" className="font-mono text-xs h-7 px-2.5 text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-sm transition-all duration-150">Partnership</TabsTrigger>
                <TabsTrigger value="individual_itr" className="font-mono text-xs h-7 px-2.5 text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-sm transition-all duration-150">Personal ITR</TabsTrigger>
                <TabsTrigger value="trademark" className="font-mono text-xs h-7 px-2.5 text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-sm transition-all duration-150">Trademark</TabsTrigger>
                <TabsTrigger value="business_itr" className="font-mono text-xs h-7 px-2.5 text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-sm transition-all duration-150">Biz ITR</TabsTrigger>
              </TabsList>
            </div>

            {Object.keys(DOCUMENT_DATA).map((tabKey) => (
              <TabsContent key={tabKey} value={tabKey} className="animate-in fade-in-0 duration-150">
                <Card className="border border-border bg-card p-6 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Key Documents</span>
                    <span className="text-sm text-muted-foreground">{DOCUMENT_DATA[tabKey].reduce((acc, cat) => acc + cat.items.length, 0)} total</span>
                  </div>
                  <DocumentPreviewList documents={getPreviewDocuments(DOCUMENT_DATA[tabKey])} />

                  <div className="mt-4 pt-4 border-t border-border flex justify-center">
                    <button
                      className="px-4 py-2 rounded-lg bg-[hsl(var(--ollvy-green))] text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors hover:bg-[hsl(142_71%_40%)]"
                      onClick={() => setDialogOpen(true)}
                    >
                      View complete checklist
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Dialog */}
        <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
          <DialogContent className={`max-h-[85vh] overflow-hidden flex flex-col transition-all duration-300 ${
            selectedDoc ? 'max-w-[1000px]' : 'max-w-[680px]'
          }`}>
            <DialogHeader className="shrink-0">
              <DialogTitle>Complete Document Checklist - {TAB_LABELS[activeTab]}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {selectedDoc
                  ? 'Click any document to learn what it is and how to get it.'
                  : 'Everything you need to have ready. Click any document for details.'
                }
              </p>
            </DialogHeader>

            <div className="mt-4 flex-1 overflow-hidden flex gap-4">
              {/* Document List - Left Side */}
              <div className={`overflow-y-auto pr-2 -mr-2 transition-all duration-300 ${
                selectedDoc ? 'w-1/2 border-r border-border pr-4' : 'w-full'
              }`}>
                <DocumentFullList
                  categories={DOCUMENT_DATA[activeTab]}
                  selectedDoc={selectedDoc}
                  onSelectDoc={setSelectedDoc}
                />
              </div>

              {/* Document Detail - Right Side */}
              {selectedDoc && (
                <div className="w-1/2 pl-2 animate-in slide-in-from-right-4 duration-200">
                  <DocumentDetailPanel
                    doc={selectedDoc}
                    onClose={() => setSelectedDoc(null)}
                  />
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4 mt-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500/60"></span>
                    Required
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary/60"></span>
                    Ollvy handles
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/services?utm_source=homepage&utm_medium=landing&utm_content=document_checklist">Book this service</Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
