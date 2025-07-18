import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration - secure via env in real projects
const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'mountaianns123@gmail.com',
    pass: 'avti shka fzjy facd',
  },
};

const transporter = nodemailer.createTransport(emailConfig);

// In-memory temp PIN store
const temporaryPINs = new Map<string, {
  pin: string;
  timestamp: number;
  email: string;
  courseYear?: string;
  department_org?: string;
  administered_Org?: string;
}>();

const generateTemporaryPIN = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

export async function POST(request: NextRequest) {
  try {
    const { email, courseYear = undefined, department_org = undefined, administered_Org = undefined } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate and store the PIN
    const pin = generateTemporaryPIN();

    temporaryPINs.set(email, {
      pin,
      timestamp: Date.now(),
      email,
      ...(courseYear && { courseYear }),
      ...(department_org && { department_org }),
      ...(administered_Org && { administered_Org }),
    });

    console.log(`🔐 Generated PIN for ${email}: ${pin}`);
    console.log(`📚 Course Year: ${courseYear || 'None'}`);
    console.log(`🏢 Department/Organizations: ${department_org || 'None'}`);

    // 3. Send Email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'univote48@gmail.com',
        to: email,
        subject: 'Your Temporary PIN - Sydney PollPro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #bb8b1b; text-align: center;">Sydney PollPro - Temporary PIN</h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p>Hello,</p>
              <p>Your temporary PIN is:</p>
              <div style="background-color: #bb8b1b; color: white; padding: 15px; border-radius: 8px; text-align: center;">
                <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${pin}</h1>
              </div>
              <p>This PIN will expire in 10 minutes.</p>
            </div>
            <p style="text-align: center; font-size: 12px;">Sydney PollPro - University Voting System</p>
          </div>
        `,
      });

      console.log('✅ Email sent successfully');
    } catch (emailError: any) {
      console.error('⚠️ Email sending failed:', emailError.message);
    }

    return NextResponse.json({
      success: true,
      message: 'PIN generated successfully',
      pin: process.env.NODE_ENV === 'development' ? pin : undefined,
      department_org,
      administered_Org,
    });

  } catch (error: any) {
    console.error('Error in PIN generation:', error);
    return NextResponse.json({
      error: error.message || 'Failed to process request',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
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

    const isExpired = Date.now() - storedData.timestamp > 10 * 60 * 1000;
    if (isExpired) {
      temporaryPINs.delete(email);
      return NextResponse.json({ error: 'PIN has expired' }, { status: 400 });
    }

    if (storedData.pin !== pin) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 400 });
    }

    console.log("PUT department_org:", storedData.department_org);

    const responseData: any = {
      success: true,
      message: 'PIN verified successfully'
    };

    if (storedData.department_org) {
      responseData.department_org = storedData.department_org;
    }

    if (storedData.courseYear) {
      responseData.courseYear = storedData.courseYear;
    }

    if (storedData.administered_Org) {
      responseData.administered_Org = storedData.administered_Org;
    }

    temporaryPINs.delete(email);
    console.log('🧠 Sending to client:', responseData);
    console.log("✅ Returning from memory:", storedData.department_org);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('PIN verification error:', error);
    return NextResponse.json({ error: 'Failed to verify PIN' }, { status: 500 });
  }
}
