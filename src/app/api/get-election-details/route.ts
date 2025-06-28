import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { electionId } = await request.json();

    if (!electionId) {
      return NextResponse.json({ error: 'Missing electionId' }, { status: 400 });
    }

    console.log('Fetching election details for electionId:', electionId);

    // Fetch election data
    const { data: electionData, error: electionError } = await supabaseAdmin
      .from('elections')
      .select('*')
      .eq('id', electionId)
      .single();

    if (electionError) {
      console.error('Election fetch error:', electionError);
      return NextResponse.json({ error: 'Failed to fetch election: ' + electionError.message }, { status: 500 });
    }

    if (!electionData) {
      return NextResponse.json({ error: 'Election not found' }, { status: 404 });
    }

    console.log('Found election data:', electionData);

    // Fetch positions for this election
    const { data: positionsData, error: positionsError } = await supabaseAdmin
      .from('positions')
      .select('*')
      .eq('election_id', electionId);

    if (positionsError) {
      console.error('Positions fetch error:', positionsError);
      return NextResponse.json({ error: 'Failed to fetch positions: ' + positionsError.message }, { status: 500 });
    }

    // Fetch candidates for this election
    const { data: candidatesData, error: candidatesError } = await supabaseAdmin
      .from('candidates')
      .select('*')
      .eq('election_id', electionId);

    if (candidatesError) {
      console.error('Candidates fetch error:', candidatesError);
      return NextResponse.json({ error: 'Failed to fetch candidates: ' + candidatesError.message }, { status: 500 });
    }

    // Transform the data to match the frontend interface
    const transformedElection = {
      name: electionData.name || '',
      description: electionData.description || '',
      startDate: electionData.start_date ? new Date(electionData.start_date).toISOString().split('T')[0] : '',
      startTime: electionData.start_date ? new Date(electionData.start_date).toTimeString().slice(0, 5) : '',
      endDate: electionData.end_date ? new Date(electionData.end_date).toISOString().split('T')[0] : '',
      endTime: electionData.end_date ? new Date(electionData.end_date).toTimeString().slice(0, 5) : '',
      positions: positionsData?.map(pos => ({
        id: pos.id,
        title: pos.title,
        description: pos.description,
        maxCandidates: pos.max_candidates || 3,
        maxWinners: pos.max_winners || 1,
        isRequired: pos.is_required || false,
      })) || [],
      candidates: candidatesData?.map(cand => ({
        id: cand.id,
        name: cand.name,
        email: cand.email,
        positionId: cand.position_id,
        status: cand.status || 'pending',
        credentials: cand.detailed_achievements || '',
        course: cand.course_year ? cand.course_year.split(' - ')[0] : '',
        year: cand.course_year ? cand.course_year.split(' - ')[1] : '',
        platform: cand.platform || '',
      })) || [],
      settings: {
        isUniLevel: electionData.is_Uni_level || false,
        allowAbstain: electionData.allow_abstain !== false, // Default to true
        eligibleCourseYear: electionData.eligible_courseYear || [],
      },
    };

    console.log('Transformed election data:', transformedElection);

    return NextResponse.json({ 
      election: transformedElection,
      success: true 
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error fetching election details' 
    }, { status: 500 });
  }
} 