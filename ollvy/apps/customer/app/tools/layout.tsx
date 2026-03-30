import { NavbarServer } from '@/components/landing/NavbarServer'
import { Footer } from '@/components/landing/Footer'

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <NavbarServer />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}
