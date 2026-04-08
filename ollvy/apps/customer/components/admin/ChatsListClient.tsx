'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'

interface Conversation {
  orderId: string
  orderNumber: string
  conversationId: string
  serviceName: string
  customerName: string
  businessName: string | null
  messageCount: number
  lastMessageAt: string | null
}

interface ChatsListClientProps {
  conversations: Conversation[]
}

export function ChatsListClient({ conversations }: ChatsListClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations

    const query = searchQuery.toLowerCase()
    return conversations.filter(conv =>
      conv.orderNumber.toLowerCase().includes(query) ||
      conv.customerName.toLowerCase().includes(query) ||
      (conv.businessName && conv.businessName.toLowerCase().includes(query)) ||
      conv.serviceName.toLowerCase().includes(query)
    )
  }, [conversations, searchQuery])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">All Chats</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View all customer conversations across the platform
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by customer name, order number, or service..."
          className="w-full"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{conversations.length} total conversations</span>
        {searchQuery && (
          <span>- {filteredConversations.length} matching</span>
        )}
      </div>

      {/* Conversations List */}
      {filteredConversations.length === 0 ? (
        <Card className="overflow-hidden">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? 'No conversations match your search.' : 'No conversations found.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredConversations.map((conv) => (
            <Link
              key={conv.orderId}
              href={`/admin/orders/${conv.orderId}`}
              className="block"
            >
              <Card className="overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="py-4 px-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-medium">
                          {conv.orderNumber}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {conv.serviceName}
                        </Badge>
                      </div>
                      <div className="mt-1">
                        <span className="text-sm text-foreground">
                          {conv.customerName}
                        </span>
                        {conv.businessName && conv.businessName !== conv.customerName && (
                          <span className="text-sm text-muted-foreground ml-2">
                            ({conv.businessName})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="text-sm text-muted-foreground">
                        {conv.messageCount} {conv.messageCount === 1 ? 'message' : 'messages'}
                      </div>
                      {conv.lastMessageAt && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {formatRelativeTime(conv.lastMessageAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
