import { supabaseServer } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { redirect } from 'next/navigation'
import { ChatsListClient } from '@/components/admin/ChatsListClient'

export const metadata = { robots: 'noindex, nofollow' }

export default async function AdminChatsPage() {
  const adminUser = await getAdminUser()

  // Only super_admin can access this page
  if (adminUser.role !== 'super_admin') {
    redirect('/admin/queue')
  }

  if (!supabaseServer) redirect('/admin/login')

  // Fetch all conversations with order and user details
  const { data: conversations, error } = await supabaseServer
    .from('orders')
    .select(`
      id,
      order_number,
      chat_conversation_id,
      service_packages (name),
      users (business_name)
    `)
    .not('chat_conversation_id', 'is', null)
    .order('paid_at', { ascending: false })

  if (error) {
    console.error('Error fetching conversations:', error)
  }

  // Fetch message counts and last message dates for each conversation
  const conversationIds = (conversations || [])
    .map(c => c.chat_conversation_id)
    .filter(Boolean) as string[]

  let messageStats: Record<string, { count: number; lastMessageAt: string | null }> = {}

  if (conversationIds.length > 0) {
    // Get message counts
    const { data: messageCounts } = await supabaseServer
      .from('chat_messages')
      .select('conversation_id')
      .in('conversation_id', conversationIds)

    // Get last message dates
    const { data: lastMessages } = await supabaseServer
      .from('chat_messages')
      .select('conversation_id, created_at')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: false })

    // Build stats map
    for (const convId of conversationIds) {
      const count = (messageCounts || []).filter(m => m.conversation_id === convId).length
      const lastMsg = (lastMessages || []).find(m => m.conversation_id === convId)
      messageStats[convId] = {
        count,
        lastMessageAt: lastMsg?.created_at || null,
      }
    }
  }

  // Format the data for the client
  const formattedConversations = (conversations || []).map(conv => ({
    orderId: conv.id,
    orderNumber: conv.order_number,
    conversationId: conv.chat_conversation_id,
    serviceName: (conv.service_packages as any)?.name || 'Unknown Service',
    customerName: (conv.users as any)?.business_name || 'Unknown Customer',
    businessName: (conv.users as any)?.business_name || null,
    messageCount: messageStats[conv.chat_conversation_id!]?.count || 0,
    lastMessageAt: messageStats[conv.chat_conversation_id!]?.lastMessageAt || null,
  }))

  // Sort by last message date (most recent first)
  formattedConversations.sort((a, b) => {
    if (!a.lastMessageAt && !b.lastMessageAt) return 0
    if (!a.lastMessageAt) return 1
    if (!b.lastMessageAt) return -1
    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  })

  return <ChatsListClient conversations={formattedConversations} />
}
