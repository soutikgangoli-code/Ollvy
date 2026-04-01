'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { getClient } from '@/lib/supabase'
import { ChatInput } from './ChatInput'
import { MessageBubble } from './MessageBubble'
import { formatDateTime } from '@/lib/utils'

interface AdminUser {
  id: string              // admin_users.id
  auth_user_id: string    // maps to Supabase auth UUID
  name: string
}

interface AdminChatWindowProps {
  conversationId: string
  adminUser: AdminUser
}

interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string | null
  sender_type: 'user' | 'professional' | 'system'
  content: string
  sent_at: string
  created_at: string
  file_url?: string
  file_name?: string
  file_path?: string
  file_size?: number
  message_type: 'text' | 'file' | 'system'
}

export function AdminChatWindow({ conversationId, adminUser }: AdminChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = getClient()

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setMessages(data)
      setTimeout(scrollToBottom, 100)
    }
    setLoading(false)
  }, [conversationId, supabase])

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel(`admin-chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage])
          setTimeout(scrollToBottom, 100)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [conversationId, fetchMessages, supabase])

  const handleSendMessage = async (content: string) => {
    setSending(true)
    const { error } = await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      sender_id: adminUser.auth_user_id,
      sender_type: 'professional',   // admin sends as professional
      content,
      message_type: 'text',
    })
    if (error) console.error('Send error:', error)
    setSending(false)
  }

  const handleFileUpload = async (file: File) => {
    setSending(true)
    const filePath = `${conversationId}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      setSending(false)
      return
    }

    // Store the storage path (not public URL) for signed URL generation later
    // Format: bucket/path - the storage helper will parse this
    const storagePath = `documents/${filePath}`

    const { error } = await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      sender_id: adminUser.auth_user_id,
      sender_type: 'professional',
      content: `Shared a file: ${file.name}`,
      message_type: 'file',
      file_url: storagePath,
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
    })
    if (error) console.error('Message insert error:', error)
    setSending(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading chat...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No messages yet. Start the conversation.
          </p>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="shrink-0">
        <ChatInput
          onSend={handleSendMessage}
          onFileUpload={handleFileUpload}
          disabled={sending}
        />
      </div>
    </div>
  )
}
