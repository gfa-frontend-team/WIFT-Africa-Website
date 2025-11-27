// Auth layout - No header/footer for login, register, onboarding
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
