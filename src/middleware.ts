import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/write-blog(.*)',
  '/dashboard(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  const response = NextResponse.next();
  
  // Try getting role from metadata claims
  const authState = await auth();
  const claims = authState.sessionClaims as any;
  const role = claims?.publicMetadata?.role || claims?.metadata?.role || claims?.role;

  const cookieDomain = process.env.NODE_ENV === 'production' ? '.goalsfloors.com' : undefined;
  const authorizedRoles = ['accountant', 'admin', 'administrator', 'superadmin', 'team'];

  if (role && authorizedRoles.includes(role)) {
    response.cookies.set('gf_session_role', role, {
      domain: cookieDomain,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
  } else {
    if (request.cookies.has('gf_session_role')) {
      response.cookies.delete({
        name: 'gf_session_role',
        domain: cookieDomain,
        path: '/'
      });
    }
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};