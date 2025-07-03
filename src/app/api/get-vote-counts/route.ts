import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    //const electionId = searchParams.get('election_id');
    const type = searchParams.get('scope'); // 'university' or 'organization'
    const department_org = searchParams.get('department_org');
    const accessLevel = searchParams.get('access_level'); // 'voter', 'admin', 'public'
    const showLiveResults = searchParams.get('live') === 'true';
    // Use a single currentTime variable as a Date object
    const currentTime = new Date();
    const currentTimeISO = currentTime.toISOString();
    let electionQuery = supabaseAdmin
      .from('elections')
      .select('id, start_date, end_date, is_uni_level')
      .order('start_date', { ascending: false });

    if (type === 'university') {
      electionQuery = electionQuery.eq('is_uni_level', true);
    } else if (type === 'organization' && department_org) {
      electionQuery = electionQuery.eq('is_uni_level', false).eq('department_org', department_org);
    }

    // Fetch active elections first
    let { data: elections, error: electionError } = await electionQuery
      .lte('start_date', currentTimeISO)
      .gte('end_date', currentTimeISO);

    // If no active elections, fetch recently completed elections (within 5 days after end_date)
    if ((!elections || elections.length === 0) && !electionError) {
      const fiveDaysAgo = new Date(currentTime.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString();
      const completedQuery = electionQuery
        .lt('end_date', currentTimeISO)
        .gte('end_date', fiveDaysAgo)
        .order('end_date', { ascending: false });
      const completedResult = await completedQuery;
      elections = completedResult.data;
      electionError = completedResult.error;
    }

    if (electionError || !elections || elections.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No elections found' 
      }, { status: 404 });
    }
    
    const targetElectionId = elections[0].id;

    // Get all positions for this election
    const { data: positions, error: positionsError } = await supabaseAdmin
      .from('positions')
      .select('id, title, description')
      .eq('election_id', targetElectionId)
      .order('title', { ascending: true });

    if (positionsError) {
      console.error('Error fetching positions:', positionsError);
      return NextResponse.json({ error: positionsError.message }, { status: 500 });
    }

    // Get all candidates for this election
    const { data: candidates, error: candidatesError } = await supabaseAdmin
      .from('candidates')
      .select('id, name, course_year, picture_url, position_id, status')
      .eq('election_id', targetElectionId)
      .eq('status', 'approved')
      .order('name', { ascending: true });

    if (candidatesError) {
      console.error('Error fetching candidates:', candidatesError);
      return NextResponse.json({ error: candidatesError.message }, { status: 500 });
    }

    // Get vote counts for all candidates in this election
    const { data: votes, error: votesError } = await supabaseAdmin
      .from('votes')
      .select('candidate_id')
      .eq('election_id', targetElectionId);

    if (votesError) {
      console.error('Error fetching votes:', votesError);
      return NextResponse.json({ error: votesError.message }, { status: 500 });
    }

    // Count votes for each candidate
    const voteCounts: { [key: string]: number } = {};
    votes?.forEach(vote => {
      voteCounts[vote.candidate_id] = (voteCounts[vote.candidate_id] || 0) + 1;
    });

    // Group candidates by position and add vote counts
    const results = positions?.map(position => {
      const positionCandidates = candidates?.filter(candidate => 
        candidate.position_id === position.id
      ).map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        course_year: candidate.course_year,
        picture_url: candidate.picture_url,
        votes: voteCounts[candidate.id] || 0
      })) || [];

      return {
        position: position.title,
        candidates: positionCandidates
      };
    }) || [];

    // Get election details for additional context
    const { data: electionDetails, error: electionDetailsError } = await supabaseAdmin
      .from('elections')
      .select('name, start_date, end_date, is_uni_level')
      .eq('id', targetElectionId)
      .single();

    const startDate = new Date(electionDetails?.start_date || '');
    const endDate = new Date(electionDetails?.end_date || '');
    
    let electionStatus = 'completed';
    if (currentTime < startDate) {
      electionStatus = 'upcoming';
    } else if (currentTime >= startDate && currentTime <= endDate) {
      electionStatus = 'active';
    }

    return NextResponse.json({ 
      success: true, 
      results,
      totalPositions: results.length,
      electionId: targetElectionId,
      electionDetails: electionDetails,
      electionStatus,
      isLive: electionStatus === 'active' && showLiveResults
    });

  } catch (error) {
    console.error('Error in get-vote-counts API:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 