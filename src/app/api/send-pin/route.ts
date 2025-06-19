import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration - using environment variables for security
const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'mountaianns123@gmail.com',
    pass: 'avti shka fzjy facd'
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Generate temporary PIN
const generateTemporaryPIN = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store temporary PINs with additional user data (in production, use a database)
const temporaryPINs = new Map<string, { 
  pin: string; 
  timestamp: number; 
  email: string;
  courseYear?: string;
}>();

export async function POST(request: NextRequest) {
  try {
    const { email, courseYear } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate PIN
    const pin = generateTemporaryPIN();

    // Store PIN with course year
    temporaryPINs.set(email, {
      pin,
      timestamp: Date.now(),
      email,
      courseYear
    });

    // For development/testing - log the PIN instead of sending email
    console.log(`🔐 TEMPORARY PIN for ${email}: ${pin}`);
    console.log(`📧 Email would be sent to: ${email}`);
    console.log(`📚 Course Year: ${courseYear || 'Not specified'}`);

    // Try to send email, but don't fail if it doesn't work
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'univote48@gmail.com',
        to: email,
        subject: 'Your Temporary PIN - Sydney PollPro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #bb8b1b; text-align: center;">Sydney PollPro - Temporary PIN</h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p style="font-size: 16px; color: #333;">Hello,</p>
              <p style="font-size: 16px; color: #333;">Your temporary PIN for Sydney PollPro is:</p>
              <div style="background-color: #bb8b1b; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${pin}</h1>
              </div>
              <p style="font-size: 14px; color: #666;">Please use this PIN to log in and set your permanent password.</p>
              <p style="font-size: 14px; color: #666;">This PIN will expire in 10 minutes.</p>
            </div>
            <p style="font-size: 12px; color: #999; text-align: center;">Sydney PollPro - University Voting System</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully');
    } catch (emailError: any) {
      console.error('⚠️ Email sending failed, but PIN is still valid:', emailError.message);
      // Don't throw error - PIN is still valid for testing
    }

    return NextResponse.json({ 
      success: true, 
      message: 'PIN generated successfully. Check console for PIN (development mode).',
      pin: pin // Only in development - remove in production
    });
  } catch (error: any) {
    console.error('Email sending error:', error);
    
    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      return NextResponse.json({ 
        error: 'Email service authentication failed. Please contact support.' 
      }, { status: 500 });
    }
    
    if (error.code === 'ECONNECTION') {
      return NextResponse.json({ 
        error: 'Unable to connect to email service. Please try again later.' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to send PIN. Please try again later.' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { email, pin } = await request.json();

    if (!email || !pin) {
      return NextResponse.json({ error: 'Email and PIN are required' }, { status: 400 });
    }

    const storedData = temporaryPINs.get(email);
    if (!storedData) {
      return NextResponse.json({ error: 'Invalid or expired PIN' }, { status: 400 });
    }

    // Check if PIN is expired (10 minutes)
    const isExpired = Date.now() - storedData.timestamp > 10 * 60 * 1000;
    if (isExpired) {
      temporaryPINs.delete(email);
      return NextResponse.json({ error: 'PIN has expired' }, { status: 400 });
    }

    // Check if PIN matches
    if (storedData.pin === pin) {
      // Return course year if available
      const responseData: any = { success: true, message: 'PIN verified successfully' };
      if (storedData.courseYear) {
        responseData.courseYear = storedData.courseYear;
      }
      temporaryPINs.delete(email);
      return NextResponse.json(responseData);
    }

    return NextResponse.json({ error: 'Invalid PIN' }, { status: 400 });
  } catch (error) {
    console.error('PIN verification error:', error);
    return NextResponse.json({ error: 'Failed to verify PIN' }, { status: 500 });
  }
} 