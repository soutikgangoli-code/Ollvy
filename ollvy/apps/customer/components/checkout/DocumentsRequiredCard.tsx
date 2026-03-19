'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocumentsRequiredCardProps {
  documents: string[]
  className?: string
}

// Default document lists by service type (can be extended)
const DEFAULT_DOCUMENTS: Record<string, string[]> = {
  gst: [
    'PAN Card (Business or Proprietor)',
    'Aadhaar Card of Proprietor/Partners/Directors',
    'Address Proof of Business (Rent Agreement/Utility Bill)',
    'Bank Statement or Cancelled Cheque',
    'Photograph of Proprietor/Partners/Directors',
  ],
  company: [
    'PAN Card of all Directors',
    'Aadhaar Card of all Directors',
    'Address Proof of Registered Office',
    'Digital Signature Certificate (DSC)',
    'Passport-size Photographs',
  ],
  fssai: [
    'PAN Card of Business/Proprietor',
    'Aadhaar Card',
    'Address Proof of Food Business Premises',
    'Photograph of Proprietor',
    'Food Safety Management Plan (if applicable)',
  ],
  default: [
    'PAN Card',
    'Aadhaar Card',
    'Address Proof',
    'Photograph',
  ],
}

export function DocumentsRequiredCard({ documents, className }: DocumentsRequiredCardProps) {
  // Use provided documents or fallback to default
  const displayDocs = documents && documents.length > 0 ? documents : DEFAULT_DOCUMENTS.default

  return (
    <Card className={cn('border-border', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-base">
          <FileText className="h-5 w-5 text-muted-foreground" />
          Documents You&apos;ll Need
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Keep these ready for faster processing
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <ul className="space-y-3">
          {displayDocs.map((doc, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText className="h-3 w-3 text-muted-foreground" />
              </div>
              <span className="text-sm text-foreground">{doc}</span>
            </li>
          ))}
        </ul>

        {/* Delay warning */}
        <div className="flex gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
              Your timeline starts when all documents are uploaded
            </p>
            <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-0.5">
              Delayed documents = delayed completion
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
