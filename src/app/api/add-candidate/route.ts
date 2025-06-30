import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { electionId, name, email, positionId, status, credentials, course, year, platform, picture_url } = await request.json();
    if (!electionId || !name || !email || !positionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const { data, error } = await supabaseAdmin
      .from('candidates')
      .insert({
        election_id: electionId,
        name,
        email,
        position_id: positionId,
        status: status || 'pending',
        detailed_achievements: credentials || '',
        course_year: course && year ? `${course} - ${year}` : '',
        platform: platform || '',
        picture_url: picture_url || null,
      })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, candidate: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
} 