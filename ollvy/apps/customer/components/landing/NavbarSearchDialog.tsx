'use client'

import { Search, ArrowRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { fuzzyMatchAny } from '@/lib/fuzzy-match'
import type { NavbarServiceData } from '@/lib/data/services'

interface NavbarSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  services: NavbarServiceData[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onServiceClick: (slug: string) => void
}

export default function NavbarSearchDialog({
  open,
  onOpenChange,
  services,
  searchQuery,
  onSearchChange,
  onServiceClick,
}: NavbarSearchDialogProps) {
  const filteredServices = searchQuery.trim()
    ? services.filter((s) => fuzzyMatchAny(searchQuery, [s.name, s.short_description]))
    : services

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="sr-only">Search Services</DialogTitle>
          <div className="relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search GST, incorporation, ITR..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-7 border-0 shadow-none focus-visible:ring-0 text-base"
              autoFocus
            />
          </div>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredServices.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              {searchQuery ? `No services found for "${searchQuery}"` : 'No active services found'}
            </div>
          ) : (
            <div className="py-2">
              <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {searchQuery ? `${filteredServices.length} results` : `${filteredServices.length} Services`}
              </div>
              {filteredServices.map((service) => (
                <button
                  key={service.slug}
                  onClick={() => onServiceClick(service.slug)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">
                      {service.name}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {service.short_description}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {service.order_type === 'recurring' ? 'Monthly' : 'One-time'}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="px-4 py-2 border-t bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>Press Enter to select</span>
          <span>ESC to close</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
