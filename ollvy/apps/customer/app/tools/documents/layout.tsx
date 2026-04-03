// Server Component - Each page handles its own container/header
export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
