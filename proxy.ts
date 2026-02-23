import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isVercelDomain } from './lib/vercel';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host');
  const isVercel = isVercelDomain(host);  

  // const isOfficialDomain = !isVercel && !host?.includes('localhost')

  // console.log(isOfficialDomain,"isOfficialDomain")

  // // 1. LIST OF LOCKED ROUTES (Only restricted on Official Domain)
  // const lockedOnProduction = ["/messages","/resources","/chapters","/events","/opportunities"]

  // // If on Official Domain and trying to access a locked route, send to landing
  // if (isOfficialDomain && lockedOnProduction.some(route => pathname.startsWith(route))) {
  //   return NextResponse.redirect(new URL('/feed', request.url))
  // }

  // -

  // List of reserved routes that should NOT be treated as usernames
  const reservedRoutes = [
    '/feed',
    '/members',
    '/opportunities',
    '/events',
    '/resources',
    '/messages',
    '/jobs',
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
    '/search',
    '/chapters',
    '/chapter',
    '/_next',
    '/favicon.ico',
    '/saved-posts',
    '/about',
    '/privacy',
    '/terms',
    '/forgot-password',
    '/reset-password',
  ]

  // Check if pathname starts with any reserved route
  const isReservedRoute = reservedRoutes.some(route => pathname.startsWith(route))

  // If it's a single-segment path (like /username) and not reserved, treat as profile
  // Rewrite it to /in/username so the app/in/[username] page handles it
  if (!isReservedRoute && pathname.match(/^\/[\w-]+$/)) {
    const newPath = pathname.replace(/^\//, '/in/')
    const response = NextResponse.rewrite(new URL(newPath, request.url))

    // Pass original path for client-side use
    response.headers.set('x-original-path', pathname)
    response.headers.set('x-profile-route', 'true')
    return response
  }

  // Handle /username/edit pattern
  if (pathname.match(/^\/[\w-]+\/edit$/)) {
    // Check if it's not a reserved route with /edit
    const baseRoute = pathname.replace('/edit', '')
    const isReservedBase = reservedRoutes.some(route => baseRoute.startsWith(route))

    if (!isReservedBase) {
      const newPath = pathname.replace(/^\//, '/in/')
      const response = NextResponse.rewrite(new URL(newPath, request.url))

      response.headers.set('x-original-path', pathname)
      return response
    }
  }
  // // 1. Define routes you want to "lock" completely for now
  // const lockedRoutes = ["/messages","/resources","/chapters"];
  
  // // 2. Check if the user is trying to access a locked route
  // const isLocked = lockedRoutes.some(route => pathname.startsWith(route));

  // if (!isVercel && isLocked) {
  //   // Redirect them to landing or a "coming soon" page
  //   return NextResponse.redirect(new URL('/feed', request.url));
  // }

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
