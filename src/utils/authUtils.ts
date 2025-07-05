import { NextRequest } from 'next/server';

/**
 * Extract user information from middleware headers
 * This function should be used in API routes to get the authenticated user info
 */
export function getUserFromHeaders(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  const userEmail = request.headers.get('x-user-email');
  const userMetadata = request.headers.get('x-user-metadata');

  if (!userId) {
    return null;
  }

  return {
    id: userId,
    email: userEmail,
    metadata: userMetadata ? JSON.parse(userMetadata) : null
  };
}

/**
 * Check if the request has valid authentication headers
 */
export function isAuthenticated(request: NextRequest): boolean {
  return !!request.headers.get('x-user-id');
}

/**
 * Get user ID from headers with error handling
 */
export function getUserIdFromHeaders(request: NextRequest): string | null {
  const user = getUserFromHeaders(request);
  return user?.id || null;
}

/**
 * Get user email from headers with error handling
 */
export function getUserEmailFromHeaders(request: NextRequest): string | null {
  const user = getUserFromHeaders(request);
  return user?.email || null;
} 