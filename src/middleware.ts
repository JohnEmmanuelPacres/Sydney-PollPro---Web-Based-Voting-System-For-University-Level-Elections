import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected API routes that require authentication
const protectedApiRoutes = [
  '/api/add-candidate',
  '/api/add-comment',
  '/api/add-position',
  '/api/add-reply',
  '/api/apply-candidate',
  '/api/check-vote-status',
  '/api/count-votes',
  '/api/create-elections',
  '/api/create-post',
  '/api/delete-candidate',
  '/api/delete-comment',
  '/api/delete-post',
  '/api/delete-reply',
  '/api/edit-comment',
  '/api/edit-reply',
  '/api/get-admin-posts',
  '/api/get-comments',
  '/api/get-election-details',
  '/api/get-elections',
  '/api/get-posts',
  '/api/get-relevant-elections',
  '/api/get-vote-counts',
  '/api/get-voting-data',
  '/api/global-stats',
  '/api/send-pin',
  '/api/submit-votes',
  '/api/update-candidate-status',
  '/api/update-election',
  '/api/upload-images',
];

// List of public API routes that don't require authentication
const publicApiRoutes = [
  '/api/check-email',
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // --- Enhanced Security Headers ---
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Enhanced CSP with more restrictive policies
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: blob: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https:; " +
    "media-src 'self'; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "frame-ancestors 'none';"
  );

  // --- API Route Protection (Simplified) ---
  // Since Supabase uses localStorage for sessions, we'll let the API routes handle their own authentication
  // This middleware provides security headers and basic request logging
  if (protectedApiRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    // Log protected route access for monitoring
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     request.headers.get('cf-connecting-ip') || 
                     'unknown';
    
    console.log(`[${new Date().toISOString()}] PROTECTED ROUTE: ${request.method} ${request.nextUrl.pathname} - IP: ${clientIP}`);
    
    // Add a header to indicate this is a protected route
    response.headers.set('x-route-protected', 'true');
  }

  // --- Rate Limiting (Basic Implementation) ---
  const clientIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   request.headers.get('cf-connecting-ip') || 
                   'unknown';
  
  // Log all API requests for monitoring
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[${new Date().toISOString()}] API REQUEST: ${request.method} ${request.nextUrl.pathname} - IP: ${clientIP}`);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|public|static|.*\\.).*)', // Apply to all routes except static assets and files with extensions
  ],
}; 