import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { email, verificationCode } = await request.json();

    if (!email || !verificationCode) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // Use the existing send-pin endpoint to verify the code
    // The send-pin endpoint with PUT method handles PIN verification
    const response = await fetch(`${request.nextUrl.origin}/api/send-pin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        pin: verificationCode 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Invalid verification code' },
        { status: 400 }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      { 
        message: 'Verification code verified successfully',
        userData: data // Include any user data that might be needed
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Verify reset code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 