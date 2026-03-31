'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'An error occurred during sign in'

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>

        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Sign In Failed
        </h1>

        <p className="text-muted-foreground mb-8">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <p className="text-sm text-muted-foreground">
            If this problem persists, please contact{' '}
            <a
              href="mailto:support@ollvy.com"
              className="text-foreground underline hover:no-underline"
            >
              support@ollvy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Sign In Failed
          </h1>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
