import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { candidateId, candidateData } = await request.json();

    if (!candidateId) {
      return NextResponse.json({ error: 'Missing candidateId' }, { status: 400 });
    }

    if (!candidateData) {
      return NextResponse.json({ error: 'Missing candidate data' }, { status: 400 });
    }

    console.log('Updating candidate:', candidateId);

    // Update candidate data
    const { error: candidateUpdateError } = await supabaseAdmin
      .from('candidates')
      .update({
        name: candidateData.name,
        email: candidateData.email,
        position_id: candidateData.positionId,
        course: candidateData.course,
        year: candidateData.year,
        platform: candidateData.platform,
        status: candidateData.status,
        credentials: candidateData.credentials,
        picture_url: candidateData.picture_url,
        qualifications_url: candidateData.qualifications_url,
      })
      .eq('id', candidateId);

    if (candidateUpdateError) {
      console.error('Candidate update error:', candidateUpdateError);
      return NextResponse.json({ error: 'Failed to update candidate: ' + candidateUpdateError.message }, { status: 500 });
    }

    console.log('Candidate updated successfully');

    return NextResponse.json({ 
      success: true,
      message: 'Candidate updated successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error updating candidate' 
    }, { status: 500 });
  }
} 