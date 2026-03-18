'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Download,
  Eye,
  FolderOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocumentGroup {
  orderId: string
  orderNumber: string
  serviceName: string
  documents: Array<{
    id: string
    name: string
    type: 'deliverable' | 'input'
    url: string
    uploadedAt: string
  }>
}

interface DocumentVaultSectionProps {
  documentGroups: DocumentGroup[]
  maxVisibleGroups?: number
}

export function DocumentVaultSection({
  documentGroups,
  maxVisibleGroups = 2,
}: DocumentVaultSectionProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [showAll, setShowAll] = useState(false)

  const toggleGroup = (orderId: string) => {
    setExpandedGroups(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const visibleGroups = showAll
    ? documentGroups
    : documentGroups.slice(0, maxVisibleGroups)

  const totalDocuments = documentGroups.reduce(
    (sum, group) => sum + group.documents.length,
    0
  )

  if (documentGroups.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="p-6 text-center">
          <FolderOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No documents yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Documents will appear here after your first order
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            Document Vault
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {totalDocuments} document{totalDocuments !== 1 ? 's' : ''}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {visibleGroups.map((group) => {
          const isExpanded = expandedGroups.includes(group.orderId)
          const deliverables = group.documents.filter(d => d.type === 'deliverable')

          return (
            <div key={group.orderId} className="border border-border rounded-lg">
              <button
                type="button"
                onClick={() => toggleGroup(group.orderId)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground text-sm">{group.serviceName}</p>
                  <p className="text-xs text-muted-foreground">
                    {group.orderNumber} - {group.documents.length} files
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 space-y-2">
                  {/* Deliverables first */}
                  {deliverables.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">Deliverables</p>
                      {deliverables.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-[hsl(var(--ollvy-green))] flex-shrink-0" />
                            <span className="text-sm text-foreground truncate">{doc.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                              <a href={doc.url} download>
                                <Download className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Link to full order */}
                  <Link href={`/orders/${group.orderId}`}>
                    <Button variant="ghost" size="sm" className="w-full gap-2 text-xs">
                      View all files
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )
        })}

        {/* Show more/less */}
        {documentGroups.length > maxVisibleGroups && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="w-full text-muted-foreground"
          >
            {showAll
              ? 'Show less'
              : `Show ${documentGroups.length - maxVisibleGroups} more order${documentGroups.length - maxVisibleGroups > 1 ? 's' : ''}`}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
