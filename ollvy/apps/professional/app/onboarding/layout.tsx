export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-navy">Ollvy</h1>
          <p className="text-muted-text mt-1">Professional Onboarding</p>
        </div>
        {children}
      </div>
    </div>
  )
}
