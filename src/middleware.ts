import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected API routes (add more as needed)
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

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // --- Security Headers ---
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'none';");

  // --- (Optional) API Route Session Protection ---
  // If you want to protect API routes, check for a session token (e.g., Supabase's 'sb-access-token')
  if (protectedApiRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    const accessToken = request.cookies.get('sb-access-token')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Optionally, verify the token here (e.g., with Supabase client/server SDK)
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|public|static).*)', // Apply to all routes except static assets
  ],
}; 