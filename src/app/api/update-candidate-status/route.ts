import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { candidateId, status } = await request.json();
    
    console.log('🔍 update-candidate-status called with:', { candidateId, status });
    
    if (!candidateId || !status) {
      console.error('❌ Missing candidateId or status');
      return NextResponse.json({ error: 'Missing candidateId or status' }, { status: 400 });
    }

    // Validate UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(candidateId);
    if (!isUUID) {
      console.error('❌ Invalid candidateId format:', candidateId);
      return NextResponse.json({ error: 'Invalid candidateId format' }, { status: 400 });
    }

    // Validate status
    if (!['pending', 'approved', 'disqualified'].includes(status)) {
      console.error('❌ Invalid status:', status);
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    console.log('✅ Validating candidate exists...');
    
    // Check if candidate exists
    const { data: existingCandidate, error: fetchError } = await supabaseAdmin
      .from('candidates')
      .select('id, name, status')
      .eq('id', candidateId)
      .single();

    if (fetchError || !existingCandidate) {
      console.error('❌ Candidate not found:', candidateId);
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    console.log('✅ Found candidate:', existingCandidate.name, 'current status:', existingCandidate.status);

    // Update the candidate status
    const { error } = await supabaseAdmin
      .from('candidates')
      .update({ status })
      .eq('id', candidateId);

    if (error) {
      console.error('❌ Database update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('✅ Candidate status updated successfully');
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Unexpected error in update-candidate-status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 