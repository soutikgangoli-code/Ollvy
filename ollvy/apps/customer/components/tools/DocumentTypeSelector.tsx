'use client'

import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Sorted by popularity with SEO-friendly H1 titles
export const documentTypes = [
  { href: '/tools/documents/private-limited-company', label: 'Private Limited Company', h1: 'How to Register a Private Limited Company', shortForm: 'PVT-LTD', docCount: 12 },
  { href: '/tools/documents/llp', label: 'LLP Registration', h1: 'How to Register an LLP in India', shortForm: 'LLP', docCount: 10 },
  { href: '/tools/documents/partnership', label: 'Partnership Firm', h1: 'How to Register a Partnership Firm', shortForm: 'PARTNER', docCount: 8 },
  { href: '/tools/documents/sole-proprietor', label: 'Sole Proprietorship', h1: 'How to Register a Sole Proprietorship', shortForm: 'PROP', docCount: 6 },
  { href: '/tools/documents/gst-registration', label: 'GST Registration', h1: 'How to Register for GST in India', shortForm: 'GST', docCount: 9 },
  { href: '/tools/documents/individual-itr', label: 'Personal ITR Filing', h1: 'How to File ITR for Salaried Individuals', shortForm: 'ITR-1', docCount: 7 },
  { href: '/tools/documents/business-itr', label: 'Business ITR Filing', h1: 'How to File ITR for Business', shortForm: 'ITR-3', docCount: 11 },
  { href: '/tools/documents/trademark', label: 'Trademark Registration', h1: 'How to Register a Trademark in India', shortForm: 'TM', docCount: 5 },
]

interface DocumentTypeSelectorProps {
  currentHref: string
  currentLabel: string
}

export function DocumentTypeSelector({ currentHref, currentLabel }: DocumentTypeSelectorProps) {
  const router = useRouter()

  const handleChange = (value: string) => {
    router.push(value)
  }

  return (
    <Select value={currentHref} onValueChange={handleChange}>
      <SelectTrigger className="w-[360px] h-11 bg-card border-border text-sm">
        <SelectValue>
          <span className="text-muted-foreground">Switch guide:</span>{' '}
          <span className="text-foreground">{currentLabel}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[400px] min-w-[360px]">
        {documentTypes.map((type) => (
          <SelectItem
            key={type.href}
            value={type.href}
            className="py-3 cursor-pointer"
          >
            <div className="flex items-center justify-between gap-4 w-full">
              <span>{type.label}</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {type.shortForm}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
