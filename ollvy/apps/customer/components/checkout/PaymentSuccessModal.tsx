'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaymentSuccessModalProps {
  isOpen: boolean
  orderNumber: string
  serviceName: string
  orderId: string
  onClose: () => void
}

export function PaymentSuccessModal({
  isOpen,
  orderNumber,
  serviceName,
  orderId,
  onClose,
}: PaymentSuccessModalProps) {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleViewOrder = () => {
    onClose()
    router.push(`/orders/${orderId}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleViewOrder()}>
      <DialogContent className="sm:max-w-md border-border bg-card p-0 overflow-hidden">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti-modal"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.3}s`,
                  animationDuration: `${1.5 + Math.random() * 1}s`,
                }}
              >
                <Sparkles
                  className="h-4 w-4"
                  style={{
                    color: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'][
                      Math.floor(Math.random() * 5)
                    ],
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <div className="p-8 text-center">
          {/* Success Animation */}
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center animate-scale-in-modal mx-auto">
              <CheckCircle className="h-10 w-10 text-[hsl(var(--ollvy-green))]" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-[hsl(var(--ollvy-green))] rounded-full flex items-center justify-center animate-bounce-in-modal">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>

          {/* Success Text */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Payment Successful!
          </h2>
          <p className="text-muted-foreground mb-1">
            {serviceName}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Order #{orderNumber}
          </p>

          {/* What's Next */}
          <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-medium text-foreground mb-2">What happens next:</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center text-xs text-[hsl(var(--ollvy-green))] font-medium">1</span>
                Professional assigned within 24 hours
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">2</span>
                Upload required documents
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">3</span>
                Track progress in real-time
              </li>
            </ul>
          </div>

          {/* CTA */}
          <Button onClick={handleViewOrder} className="w-full gap-2" size="lg">
            View Order Details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Animation Styles */}
        <style jsx global>{`
          @keyframes confetti-modal {
            0% {
              transform: translateY(-20px) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(300px) rotate(720deg);
              opacity: 0;
            }
          }
          .animate-confetti-modal {
            animation: confetti-modal linear forwards;
          }
          @keyframes scale-in-modal {
            0% { transform: scale(0); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-scale-in-modal {
            animation: scale-in-modal 0.5s ease-out forwards;
          }
          @keyframes bounce-in-modal {
            0% { transform: scale(0); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
          }
          .animate-bounce-in-modal {
            animation: bounce-in-modal 0.5s ease-out 0.3s forwards;
            transform: scale(0);
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}
