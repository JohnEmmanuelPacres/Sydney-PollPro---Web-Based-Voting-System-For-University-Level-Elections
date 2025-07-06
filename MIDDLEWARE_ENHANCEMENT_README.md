# Enhanced Middleware Documentation

## Overview

The middleware has been enhanced with improved security headers and request monitoring while maintaining compatibility with your existing Supabase client-side authentication system.

## Key Features

### 1. Security Headers
- **Comprehensive security headers**: Protects against common web vulnerabilities
- **Content Security Policy**: Restricts resource loading to trusted sources
- **X-Frame-Options**: Prevents clickjacking attacks
- **Additional security headers**: DNS prefetch control, download options, cross-domain policies

### 2. Request Monitoring
- **API request logging**: Logs all API requests with timestamps and IP addresses
- **Protected route tracking**: Special logging for routes that require authentication
- **Security monitoring**: Foundation for future rate limiting and security features

### 3. Protected API Routes
The following API routes are identified as protected and require authentication (handled by individual API routes):
- `/api/add-candidate`
- `/api/add-comment`
- `/api/add-position`
- `/api/add-reply`
- `/api/apply-candidate`
- `/api/check-vote-status`
- `/api/count-votes`
- `/api/create-elections`
- `/api/create-post`
- `/api/delete-candidate`
- `/api/delete-comment`
- `/api/delete-post`
- `/api/delete-reply`
- `/api/edit-comment`
- `/api/edit-reply`
- `/api/get-admin-posts`
- `/api/get-comments`
- `/api/get-election-details`
- `/api/get-elections`
- `/api/get-posts`
- `/api/get-relevant-elections`
- `/api/get-vote-counts`
- `/api/get-voting-data`
- `/api/global-stats`
- `/api/send-pin`
- `/api/submit-votes`
- `/api/update-candidate-status`
- `/api/update-election`
- `/api/upload-images`

### 4. Public API Routes
The following routes remain public and don't require authentication:
- `/api/check-email`

## How to Use in API Routes

### Authentication Pattern
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized - No valid session' }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Your API logic here
    // ...

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Admin-Only Routes
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized - No valid session' }, { status: 401 });
    }

    const userId = session.user.id;

    // Check if user is an admin
    const { data: adminProfile, error: adminError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (adminError || !adminProfile) {
      return NextResponse.json({ error: 'Access denied - Admin privileges required' }, { status: 403 });
    }

    // Your admin-only API logic here
    // ...

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Authentication Best Practices

### 1. Session Validation
Always validate the session at the beginning of your API route:
```typescript
const { data: { session }, error: sessionError } = await supabase.auth.getSession();

if (sessionError || !session) {
  return NextResponse.json({ error: 'Unauthorized - No valid session' }, { status: 401 });
}
```

### 2. Role-Based Access Control
Check user roles and permissions as needed:
```typescript
// For admin routes
const { data: adminProfile, error: adminError } = await supabase
  .from('admin_profiles')
  .select('*')
  .eq('id', userId)
  .single();

if (adminError || !adminProfile) {
  return NextResponse.json({ error: 'Access denied - Admin privileges required' }, { status: 403 });
}
```

### 3. Input Validation
Always validate and sanitize input data:
```typescript
const { electionId, votes } = await request.json();

if (!electionId || !votes) {
  return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
}
```

## Environment Variables Required

Make sure these environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Note**: The middleware no longer requires the service role key since it doesn't handle authentication directly.

## Security Benefits

1. **Comprehensive Security Headers**: Protects against common web vulnerabilities
2. **Request Monitoring**: Logs all API requests for security monitoring
3. **Compatible Authentication**: Works with your existing Supabase client-side auth
4. **Foundation for Enhancement**: Ready for future rate limiting and advanced security features
5. **Consistent Security**: All routes get the same security headers automatically

## Error Handling

The middleware provides request logging for monitoring:
- API request logs with timestamps and IP addresses
- Protected route access tracking
- Foundation for future error handling and rate limiting

## Performance Considerations

- Security headers are applied consistently across all routes
- Request logging is lightweight and doesn't impact performance
- No additional database calls in middleware
- API routes handle their own authentication efficiently

## Future Enhancements

1. **Rate Limiting**: Implement Redis-based rate limiting using the current logging foundation
2. **Advanced Monitoring**: Enhanced request tracking and analytics
3. **Audit Logging**: Log authentication events for security monitoring
4. **IP Whitelisting**: Allow certain IPs to bypass authentication for development
5. **Real-time Alerts**: Security alerts for suspicious activity

## Migration Guide

To ensure your API routes work properly:

1. Follow the authentication patterns in the `API_AUTHENTICATION_GUIDE.md`
2. Use `supabase.auth.getSession()` for session validation
3. Implement proper error handling and status codes
4. Test the routes to ensure they work with your existing authentication flow

## Troubleshooting

### Common Issues

1. **401 Unauthorized errors**: Check if user is logged in and session is valid
2. **CSP violations**: Adjust Content Security Policy headers if needed
3. **Missing logs**: Check if middleware is running and logging requests
4. **API route issues**: Follow the authentication patterns in `API_AUTHENTICATION_GUIDE.md`

### Debug Mode

Check the console for middleware logs:
```
[2024-01-01T12:00:00.000Z] API REQUEST: GET /api/check-vote-status - IP: 192.168.1.1
[2024-01-01T12:00:00.000Z] PROTECTED ROUTE: POST /api/submit-votes - IP: 192.168.1.1
``` 