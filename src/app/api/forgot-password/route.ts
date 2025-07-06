import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.endsWith('@cit.edu')) {
      return NextResponse.json(
        { error: 'Please provide a valid CIT email address' },
        { status: 400 }
      );
    }

    // Check if user exists in voter_profiles
    const { data: voterProfile, error: voterError } = await supabase
      .from('voter_profiles')
      .select('email')
      .eq('email', email)
      .single();

    // Check if user exists in admin_profiles
    const { data: adminProfile, error: adminError } = await supabase
      .from('admin_profiles')
      .select('email')
      .eq('email', email)
      .single();

    // If user doesn't exist in either table
    if ((voterError && voterError.code === 'PGRST116') && (adminError && adminError.code === 'PGRST116')) {
      return NextResponse.json(
        { error: 'Account not found. Please check your email address or create a new account.' },
        { status: 404 }
      );
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the verification code in a temporary table or use the existing send-pin logic
    // For now, we'll use the existing send-pin endpoint logic
    const response = await fetch(`${request.nextUrl.origin}/api/send-pin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email,
        courseYear: '', // We don't need these for password reset
        department_org: ''
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to send verification code' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Verification code sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 