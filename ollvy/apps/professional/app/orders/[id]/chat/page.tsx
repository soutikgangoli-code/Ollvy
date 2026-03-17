'use client'

// P09 Chat Screen - Professional Side
// Subscribe to chat_messages via Supabase Realtime on mount
// Message list (newest at bottom, auto-scroll)
// Text input + send button
// Document request button (calls request-document)
// Shows user's business info at top

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { callFunction } from '@/lib/api'

interface Message {
  id: string
  sender_id: string | null
  sender_type: 'user' | 'professional' | 'system'
  content: string
  file_url: string | null
  file_name: string | null
  message_type: string
  sent_at: string
}

interface Order {
  id: string
  order_number: string
  chat_conversation_id: string
  status: string
  user: {
    business_type: string | null
    city: string | null
  } | null
  service_packages: {
    name: string
  } | null
}

export default function ProfessionalChatPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [order, setOrder] = useState<Order | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [professionalId, setProfessionalId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Document request modal
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestMessage, setRequestMessage] = useState('')
  const [requestDueDate, setRequestDueDate] = useState('')
  const [isRequestingDoc, setIsRequestingDoc] = useState(false)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      // Get professional ID
      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('auth_user_id', session.user.id)
        .single()

      if (!professional) {
        router.push('/login')
        return
      }

      setProfessionalId(professional.id)

      // Fetch order with conversation
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          chat_conversation_id,
          status,
          user:users(business_type, city),
          service_packages(name)
        `)
        .eq('id', orderId)
        .eq('professional_id', professional.id)
        .single()

      if (orderError || !orderData) {
        router.push('/orders')
        return
      }

      // Transform Supabase data (arrays to single objects)
      const transformedOrder: Order = {
        ...orderData,
        user: Array.isArray(orderData.user) ? orderData.user[0] || null : orderData.user,
        service_packages: Array.isArray(orderData.service_packages) ? orderData.service_packages[0] || null : orderData.service_packages,
      }
      setOrder(transformedOrder)

      if (orderData.chat_conversation_id) {
        // Fetch messages
        const { data: messagesData } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', orderData.chat_conversation_id)
          .order('sent_at', { ascending: true })

        setMessages(messagesData || [])

        // Clear unread notifications
        await supabase
          .from('notifications')
          .update({ read_at: new Date().toISOString() })
          .eq('professional_id', professional.id)
          .like('type', '%chat%')
          .is('read_at', null)
      }

      setLoading(false)
    }

    fetchData()
  }, [orderId, router])

  // Set up realtime subscription
  useEffect(() => {
    if (!order?.chat_conversation_id) return

    const supabase = createClient()
    const channel = supabase
      .channel(`chat:${order.chat_conversation_id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${order.chat_conversation_id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.find((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [order?.chat_conversation_id])

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const sendMessage = async () => {
    if (!newMessage.trim() || !order?.chat_conversation_id || !professionalId) return

    setSending(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: insertError } = await supabase.from('chat_messages').insert({
        conversation_id: order.chat_conversation_id,
        sender_id: professionalId,
        sender_type: 'professional',
        content: newMessage.trim(),
        message_type: 'text',
      })

      if (insertError) throw insertError
      setNewMessage('')
    } catch (err) {
      setError('Failed to send message')
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !order?.chat_conversation_id || !professionalId) return

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${orderId}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          contentType: file.type,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

      // Send message with file
      const { error: msgError } = await supabase.from('chat_messages').insert({
        conversation_id: order.chat_conversation_id,
        sender_id: professionalId,
        sender_type: 'professional',
        content: `Shared a file: ${file.name}`,
        file_url: urlData.publicUrl,
        file_name: file.name,
        message_type: 'file',
      })

      if (msgError) throw msgError
    } catch (err) {
      setError('Failed to upload file')
      console.error(err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRequestDocument = async () => {
    if (!requestMessage.trim()) {
      setError('Please enter a message describing the document needed')
      return
    }

    setIsRequestingDoc(true)
    setError(null)

    const { error: apiError } = await callFunction('request-document', {
      order_id: orderId,
      message: requestMessage.trim(),
      due_date: requestDueDate || null,
    })

    setIsRequestingDoc(false)

    if (apiError) {
      setError(apiError)
      return
    }

    setShowRequestModal(false)
    setRequestMessage('')
    setRequestDueDate('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const shouldShowDate = (index: number) => {
    if (index === 0) return true
    return formatDate(messages[index].sent_at) !== formatDate(messages[index - 1].sent_at)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
      </div>
    )
  }

  if (!order?.chat_conversation_id) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-muted-text">Chat not available for this order.</p>
        <Link href={`/orders/${orderId}`} className="text-navy hover:underline mt-4">
          Back to order
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href={`/orders/${orderId}`} className="text-muted-text hover:text-body-text">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-semibold mr-3">
              {order.user?.business_type?.charAt(0) || 'C'}
            </div>
            <div>
              <p className="font-medium text-body-text">
                {order.user?.business_type || 'Client'}
              </p>
              <p className="text-sm text-muted-text">
                {order.service_packages?.name} • {order.user?.city || 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* Document request button */}
        {['in_progress', 'assigned', 'pending_assignment'].includes(order.status) && (
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber/10 text-amber-700 rounded-lg hover:bg-amber/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Request Document
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-text">Start a conversation with the client</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={msg.id}>
              {shouldShowDate(index) && (
                <div className="flex justify-center my-4">
                  <span className="text-xs text-muted-text bg-gray-200 px-3 py-1 rounded-full">
                    {formatDate(msg.sent_at)}
                  </span>
                </div>
              )}

              {msg.sender_type === 'system' ? (
                <div className="flex justify-center my-2">
                  <div className="bg-amber/10 text-amber-800 px-4 py-2 rounded-lg max-w-[90%] text-center text-sm">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className={`flex ${msg.sender_type === 'professional' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                      msg.sender_type === 'professional'
                        ? 'bg-navy text-white rounded-br-sm'
                        : 'bg-white text-body-text rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    {msg.file_url && (
                      <a
                        href={msg.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 mt-2 p-2 rounded ${
                          msg.sender_type === 'professional'
                            ? 'bg-white/10 hover:bg-white/20'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm truncate">{msg.file_name || 'Attachment'}</span>
                      </a>
                    )}
                    <p className={`text-xs mt-1 ${
                      msg.sender_type === 'professional' ? 'text-white/70' : 'text-muted-text'
                    }`}>
                      {formatTime(msg.sent_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-border p-4">
        <div className="flex items-end gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="p-2 text-muted-text hover:text-navy transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            )}
          </button>

          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none rounded-full border border-border px-4 py-2 focus:outline-none focus:border-navy transition-colors"
            style={{ maxHeight: '120px' }}
          />

          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className={`p-2 rounded-full transition-colors ${
              newMessage.trim() && !sending
                ? 'bg-navy text-white hover:bg-navy-light'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {sending ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-20 right-4 bg-red text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-2">×</button>
        </div>
      )}

      {/* Document Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-body-text mb-4">Request Document</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-body-text mb-1">
                  What document do you need?
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Describe the document you need from the client..."
                  rows={3}
                  className="w-full rounded-lg border border-border px-4 py-2 text-body-text focus:outline-none focus:border-navy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-body-text mb-1">
                  Due date (optional)
                </label>
                <input
                  type="date"
                  value={requestDueDate}
                  onChange={(e) => setRequestDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-border px-4 py-2 text-body-text focus:outline-none focus:border-navy"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 py-2 rounded-lg font-medium border border-border text-body-text hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestDocument}
                disabled={isRequestingDoc || !requestMessage.trim()}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  isRequestingDoc || !requestMessage.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-navy text-white hover:bg-navy-light'
                }`}
              >
                {isRequestingDoc ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
