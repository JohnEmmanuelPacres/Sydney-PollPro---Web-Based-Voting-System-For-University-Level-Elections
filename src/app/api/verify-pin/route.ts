import { NextRequest, NextResponse } from 'next/server';

// In-memory temp PIN store (should use DB in production)
const temporaryPINs: Map<string, { pin: string; timestamp: number; type: string }> = (globalThis as any).temporaryPINs || new Map();
(globalThis as any).temporaryPINs = temporaryPINs;

export async function POST(request: NextRequest) {
  const { email, pin, type } = await request.json();
  if (!email || !pin || !type) {
    return NextResponse.json({ error: 'Email, PIN, and type are required' }, { status: 400 });
  }
  const stored = temporaryPINs.get(email);
  if (!stored || stored.pin !== pin) {
    return NextResponse.json({ error: 'Invalid or expired code.' }, { status: 400 });
  }
  if (stored.type !== type) {
    return NextResponse.json({ error: 'Code type mismatch.' }, { status: 400 });
  }
  // Optionally: check expiry (10 min)
  if (Date.now() - stored.timestamp > 10 * 60 * 1000) {
    temporaryPINs.delete(email);
    return NextResponse.json({ error: 'Code expired.' }, { status: 400 });
  }
  temporaryPINs.delete(email);
  return NextResponse.json({ success: true });
} 