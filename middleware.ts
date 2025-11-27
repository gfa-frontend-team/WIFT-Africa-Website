import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Since we use localStorage for tokens (not cookies), middleware can't check auth state
  // All auth checks are handled at the page level in useEffect hooks
  // This middleware is minimal and just allows routes through
  
  // Public routes: /, /login, /register, /verify-email, /forgot-password, /reset-password
  // Auth routes: /onboarding (requires auth, checked by page)
  // Protected routes: /in/* (requires auth + onboarding, checked by page)
  
  // Let all routes through - pages handle their own auth checks
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}
