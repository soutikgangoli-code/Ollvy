'use client'

import { useEffect, useRef, useState } from 'react'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { Skeleton } from '@/components/ui/skeleton'
import type { ChatMessage } from '@/lib/types'
import { MessageSquare } from 'lucide-react'

interface ChatWindowProps {
  conversationId: string
  professionalName?: string
}

export function ChatWindow({ conversationId, professionalName }: ChatWindowProps) {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch initial messages and set up realtime subscription
  useEffect(() => {
    if (!conversationId) return

    const supabase = getClient()

    // Fetch messages
    const fetchMessages = async () => {
      setIsLoading(true)

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('[ChatWindow] Error fetching messages:', error)
      } else {
        setMessages(data || [])
      }
      setIsLoading(false)
    }

    fetchMessages()

    // Set up realtime subscription
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage
          setMessages((prev) => [...prev, newMessage])
        }
      )
      .subscribe()

    // Cleanup - unsubscribe before removing channel to prevent memory leak
    return () => {
      channel.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  // Send message handler
  const handleSend = async (content: string) => {
    if (!user?.id || !conversationId) return

    const supabase = getClient()

    const { data, error } = await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      sender_type: 'user',
      content,
      message_type: 'text',
    }).select()

    if (error) {
      console.error('[ChatWindow] Error sending message:', error)
      throw error
    }
  }

  // File upload handler
  const handleFileUpload = async (file: File) => {
    if (!user?.id || !conversationId) return

    const supabase = getClient()

    // Upload file to storage
    const filePath = `${conversationId}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      throw uploadError
    }

    // Insert message with file reference
    const { error: messageError } = await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      sender_type: 'user',
      content: `Shared a file: ${file.name}`,
      message_type: 'file',
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
    })

    if (messageError) {
      console.error('Error creating file message:', messageError)
      throw messageError
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="flex justify-start">
            <Skeleton className="h-16 w-48 rounded-2xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-12 w-40 rounded-2xl" />
          </div>
          <div className="flex justify-start">
            <Skeleton className="h-20 w-56 rounded-2xl" />
          </div>
        </div>
        <div className="border-t border-border p-4">
          <Skeleton className="h-11 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Messages container - subtle theme-aware background */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-muted bg-muted/30 dark:bg-muted/20"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="font-medium text-foreground mb-1">No messages yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Start a conversation with your assigned professional.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                professionalName={professionalName}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        onFileUpload={handleFileUpload}
      />
    </div>
  )
}
