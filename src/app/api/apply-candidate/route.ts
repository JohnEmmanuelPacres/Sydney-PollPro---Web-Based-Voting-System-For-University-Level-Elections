import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { electionId, positionId, fullName, credentials, platform, pictureUrl, userId, qualifications_url } = await request.json();
    if (!electionId || !positionId || !fullName || !userId) {
      return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
    }

    // Fetch user's email and course_year from voter_profiles
    const { data: profile, error: profileError } = await supabase
      .from('voter_profiles')
      .select('email, course_year')
      .eq('id', userId)
      .single();
    if (profileError || !profile) {
      return NextResponse.json({ success: false, error: 'User profile not found.' }, { status: 404 });
    }
    const email = profile.email;
    const courseYear = profile.course_year || '';

    // Check if user already applied for this election and position
    const { data: existing, error: existingError } = await supabase
      .from('candidates')
      .select('id')
      .eq('election_id', electionId)
      .eq('position_id', positionId)
      .eq('email', email)
      .maybeSingle();
    if (existing && existing.id) {
      return NextResponse.json({ success: false, error: 'You have already applied for this position in this election.' }, { status: 409 });
    }

    // Insert new candidate with status 'pending'
    const { error: insertError } = await supabase
      .from('candidates')
      .insert([{
        election_id: electionId,
        position_id: positionId,
        name: fullName,
        email,
        course_year: courseYear,
        detailed_achievements: credentials,
        platform,
        picture_url: pictureUrl || null,
        qualifications_url: qualifications_url || null,
        status: 'pending',
      }]);
    if (insertError) {
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
} 