'use client'
import { useEffect, useState } from 'react'
import { getClient } from '@/lib/supabase'
import { formatDateTime } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import type { OrderActivityLog as ActivityLogEntry } from '@/lib/types'

interface OrderActivityLogProps {
  orderId: string
  initialEntries?: ActivityLogEntry[]
}

export function OrderActivityLog({ orderId, initialEntries }: OrderActivityLogProps) {
  const [entries, setEntries] = useState<ActivityLogEntry[]>(initialEntries || [])
  const [expanded, setExpanded] = useState(false)
  const supabase = getClient()

  useEffect(() => {
    // Only fetch if no initial entries were provided (fallback)
    if (!initialEntries || initialEntries.length === 0) {
      supabase
        .from('order_activity_log')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false })
        .then(({ data }) => setEntries((data as ActivityLogEntry[]) || []))
    }

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`activity-${orderId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'order_activity_log',
        filter: `order_id=eq.${orderId}`,
      }, (payload) => {
        setEntries(prev => [payload.new as ActivityLogEntry, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [orderId, supabase, initialEntries])

  const preview = entries.slice(0, 5)
  const rest = entries.slice(5)

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
        Activity Log
        <span className="text-xs text-muted-foreground font-normal">
          ({entries.length} entries)
        </span>
      </h3>

      <div className="space-y-3">
        {preview.map(entry => (
          <ActivityEntry key={entry.id} entry={entry} />
        ))}
      </div>

      {rest.length > 0 && (
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="mt-2 text-xs">
              {expanded ? 'Show less' : `View ${rest.length} more entries`}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-3 mt-3">
              {rest.map(entry => (
                <ActivityEntry key={entry.id} entry={entry} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {entries.length === 0 && (
        <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
      )}
    </div>
  )
}

function ActivityEntry({ entry }: { entry: ActivityLogEntry }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-foreground leading-snug">{entry.description}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatDateTime(entry.created_at)}
        </p>
      </div>
    </div>
  )
}
