import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // List of reserved routes that should NOT be treated as usernames
  const reservedRoutes = [
    '/feed',
    '/members',
    '/opportunities',
    '/events',
    '/resources',
    '/messages',
    '/notifications',
    '/connections',
    '/settings',
    '/me',
    '/profile',
    '/verification',
    '/login',
    '/register',
    '/verify-email',
    '/onboarding',
    '/landing',
    '/api',
    '/_next',
    '/favicon.ico',
  ]

  // Check if pathname starts with any reserved route
  const isReservedRoute = reservedRoutes.some(route => pathname.startsWith(route))

  // If it's a single-segment path (like /username) and not reserved, treat as profile
  if (!isReservedRoute && pathname.match(/^\/[\w-]+$/)) {
    const newPath = pathname.replace(/^\//, '/profile/')
    const response = NextResponse.rewrite(new URL(newPath, request.url))
    
    // Pass original path for client-side use
    response.headers.set('x-original-path', pathname)
    response.headers.set('x-profile-route', 'true')
    return response
  }

  // Handle /username/edit pattern (must come before single-segment check)
  if (pathname.match(/^\/[\w-]+\/edit$/)) {
    // Check if it's not a reserved route with /edit
    const baseRoute = pathname.replace('/edit', '')
    const isReservedBase = reservedRoutes.some(route => baseRoute.startsWith(route))
    
    if (!isReservedBase) {
      const newPath = pathname.replace(/^\//, '/profile/')
      const response = NextResponse.rewrite(new URL(newPath, request.url))
      
      response.headers.set('x-original-path', pathname)
      return response
    }
  }

  // Since we use localStorage for tokens (not cookies), middleware can't check auth state
  // All auth checks are handled at the page level in useEffect hooks
  
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
