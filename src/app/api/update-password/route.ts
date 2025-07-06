import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    // Get user ID by email
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, {
      headers: {
        apiKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });
    const userData = await userRes.json();
    if (!Array.isArray(userData.users) || userData.users.length === 0) {
      return NextResponse.json({ error: 'Account does not exist.' }, { status: 404 });
    }
    const userId = userData.users[0].id;
    // Update password
    const patchUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${userId}`;
    const patchBody = JSON.stringify({ password });
    console.log('PATCH URL:', patchUrl);
    console.log('PATCH BODY:', patchBody);
    const updateRes = await fetch(patchUrl, {
      method: 'PATCH',
      headers: {
        apiKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: patchBody,
    });
    const rawText = await updateRes.text();
    console.log('PATCH STATUS:', updateRes.status);
    console.log('PATCH RAW RESPONSE:', rawText);
    let err = {};
    try {
      err = JSON.parse(rawText);
    } catch {}
    if (!updateRes.ok) {
      console.error('Supabase password update error:', err);
      const errorMsg = (err as any)?.msg || (typeof err === 'string' ? err : '') || 'Failed to update password.';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal server error.' }, { status: 500 });
  }
} 