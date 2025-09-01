import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Skip middleware for API routes, static files, and auth routes
  if (
    path.startsWith('/api') ||
    path.startsWith('/_next') ||
    path.startsWith('/favicon.ico') ||
    path.startsWith('/auth')
  ) {
    return NextResponse.next()
  }

  // Check for NextAuth session
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Get cookies for custom Graphy authentication
  const authToken = request.cookies.get('auth_token')
  const graphyJWT = request.cookies.get('graphy_jwt')

  // Check if user is authenticated through either method
  const isAuthenticated = token || (authToken && graphyJWT)

  // Protected routes that require authentication
  const protectedRoutes = ['/courses/active', '/courses/all-courses', '/user']
  
  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (!isAuthenticated) {
      // Redirect to home page if not authenticated
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // If user has auth token but no JWT, they need to re-authenticate
  if (authToken && !graphyJWT) {
    // Clear the auth token and redirect to login
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.delete('auth_token')
    return response
  }

  // If user has both tokens, validate them via API (this will be handled by the API routes)
  if (authToken && graphyJWT) {
    // JWT validation will be handled by the API routes
    // This middleware just ensures both tokens exist
  }

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
     * - auth (authentication routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
}
