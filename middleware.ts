import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;

  // Define authenticated paths
  const authenticatedPaths = ['/dashboard', '/sessions'];
  const path = request.nextUrl.pathname;
  
  // Check if current path requires authentication
  const isAuthPath = authenticatedPaths.some((authPath) => path.startsWith(authPath));

  // Check if the user is trying to access auth pages while already logged in
  const isAuthPage = path === '/login' || path === '/signup' || path === '/forgot-password';

  if (isAuthPath && !isAuthenticated) {
    // Redirect to login if accessing protected route without authentication
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && isAuthenticated) {
    // Redirect to dashboard if accessing auth pages while already logged in
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Match specific routes for the middleware
export const config = {
  matcher: ['/dashboard/:path*', '/sessions/:path*', '/login', '/signup', '/forgot-password'],
}; 