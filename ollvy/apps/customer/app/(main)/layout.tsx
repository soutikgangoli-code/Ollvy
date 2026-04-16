import { NavbarServer } from '@/components/landing/NavbarServer'
import { MainLayoutClient } from '@/components/layout/MainLayout'

export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MainLayoutClient navbar={<NavbarServer />}>
      {children}
    </MainLayoutClient>
  )
}
