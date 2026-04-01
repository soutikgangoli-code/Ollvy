import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabase, getUser } from '@/lib/supabase-server'
import { OrderPageClient } from './OrderPageClient'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id: orderId } = await params
  const user = await getUser()

  if (!user) {
    redirect(`/login?returnUrl=/orders/${orderId}`)
  }

  const supabase = await createServerSupabase()

  // Single RPC call - ALL data at once
  const { data, error } = await supabase.rpc('get_order_full_details', {
    p_order_id: orderId,
  })

  if (error) {
    console.error('Error fetching order details:', error)
    return (
      <div className="container py-20 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-foreground mb-4">Error Loading Order</h1>
        <p className="text-muted-foreground mb-8">
          There was an error loading the order details. Please try again.
        </p>
        <Link href="/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    )
  }

  if (!data?.order) {
    return (
      <div className="container py-20 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-foreground mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The order you're looking for doesn't exist or you don't have access to it.
        </p>
        <Link href="/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    )
  }

  return <OrderPageClient initialData={data} />
}
