# API Authentication Guide for Supabase Client-Side Auth

## Overview

This guide explains how to properly implement authentication in your API routes when using Supabase's client-side authentication with localStorage.

## Current Authentication Setup

Your application uses Supabase's client-side authentication where:
- Sessions are stored in `localStorage`
- Authentication is handled on the client-side
- API routes need to verify sessions using the Supabase client

## How to Implement Authentication in API Routes

### 1. Basic Authentication Pattern

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

### 2. Enhanced Authentication with User Profile Check

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
    const userEmail = session.user.email;

    // Check if user has required profile
    const { data: userProfile, error: profileError } = await supabase
      .from('voter_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Your API logic here
    // ...

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### 3. Admin-Only API Routes

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

### 4. Role-Based Access Control

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
    const userType = session.user.user_metadata?.user_type;

    // Check user type from metadata
    if (userType !== 'admin' && userType !== 'admin-voter') {
      return NextResponse.json({ error: 'Access denied - Admin privileges required' }, { status: 403 });
    }

    // Your API logic here
    // ...

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Protected API Routes

The following routes should implement authentication:

### Voter Routes (require voter session)
- `/api/check-vote-status`
- `/api/submit-votes`
- `/api/get-voting-data`
- `/api/get-relevant-elections`

### Admin Routes (require admin session)
- `/api/create-elections`
- `/api/add-candidate`
- `/api/add-position`
- `/api/update-candidate-status`
- `/api/update-election`
- `/api/delete-candidate`
- `/api/delete-post`
- `/api/create-post`
- `/api/get-admin-posts`

### Mixed Routes (require any authenticated session)
- `/api/get-elections`
- `/api/get-election-details`
- `/api/get-vote-counts`
- `/api/count-votes`
- `/api/global-stats`

### Public Routes (no authentication required)
- `/api/check-email`
- `/api/send-pin`

## Error Handling Best Practices

### 1. Consistent Error Responses

```typescript
// Authentication errors
return NextResponse.json({ error: 'Unauthorized - No valid session' }, { status: 401 });
return NextResponse.json({ error: 'Access denied - Admin privileges required' }, { status: 403 });

// Validation errors
return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

// Not found errors
return NextResponse.json({ error: 'Resource not found' }, { status: 404 });

// Server errors
return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
```

### 2. Logging for Debugging

```typescript
try {
  // Your API logic
} catch (error) {
  console.error(`[${new Date().toISOString()}] API Error in ${request.nextUrl.pathname}:`, error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
```

## Security Considerations

### 1. Input Validation
Always validate and sanitize input data:

```typescript
const { electionId, votes } = await request.json();

if (!electionId || !votes) {
  return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
}

// Validate UUID format
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!uuidRegex.test(electionId)) {
  return NextResponse.json({ error: 'Invalid election ID format' }, { status: 400 });
}
```

### 2. Rate Limiting
Consider implementing rate limiting for sensitive operations:

```typescript
// Basic rate limiting example
const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
const rateLimitKey = `rate_limit:${clientIP}:${request.nextUrl.pathname}`;

// Check rate limit (implement with Redis or similar)
// ...
```

### 3. CORS and Headers
The middleware already sets security headers, but you can add additional ones:

```typescript
const response = NextResponse.json(data);
response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
return response;
```

## Testing Authentication

### 1. Test with Valid Session
```javascript
// In browser console or test
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

### 2. Test without Session
```javascript
// Sign out to test unauthorized access
await supabase.auth.signOut();
```

### 3. Test Admin Access
```javascript
// Check user metadata
const { data: { user } } = await supabase.auth.getUser();
console.log('User type:', user.user_metadata?.user_type);
```

## Common Issues and Solutions

### 1. "No valid session" errors
- Check if user is logged in
- Verify localStorage has session data
- Check if session has expired

### 2. "Admin privileges required" errors
- Verify user has admin profile in database
- Check user metadata for correct user_type
- Ensure admin profile is properly created

### 3. CORS errors
- Middleware handles CORS headers
- Check if request includes proper headers
- Verify request origin

## Migration Checklist

For each API route, ensure you have:

- [ ] Session validation with `supabase.auth.getSession()`
- [ ] Proper error handling and status codes
- [ ] Input validation for all parameters
- [ ] Role-based access control where needed
- [ ] Logging for debugging
- [ ] Consistent error response format

## Example: Complete API Route

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    // 1. Validate session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized - No valid session' }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Validate input
    const { electionId, votes } = await request.json();

    if (!electionId || !votes) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 3. Check user permissions
    const { data: userProfile, error: profileError } = await supabase
      .from('voter_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // 4. Business logic
    // ... your API logic here

    // 5. Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Operation completed successfully' 
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] API Error in ${request.nextUrl.pathname}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

This approach ensures your API routes work correctly with your existing Supabase client-side authentication while maintaining security and proper error handling. 