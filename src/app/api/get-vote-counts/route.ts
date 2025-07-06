import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const electionId = searchParams.get('election_id');
    const type = searchParams.get('scope'); // 'university' or 'organization'
    const department_org = searchParams.get('department_org');
    const accessLevel = searchParams.get('access_level'); // 'voter', 'admin', 'public'
    const showLiveResults = searchParams.get('live') === 'true';
    const administeredOrg = searchParams.get('administered_Org'); // Fix: correct parameter name
    
    console.log('🔍 get-vote-counts API called with params:', {
      electionId,
      type,
      department_org,
      accessLevel,
      showLiveResults,
      administeredOrg
    });
    
    // Use a single currentTime variable as a Date object
    const currentTime = new Date();
    const currentTimeISO = currentTime.toISOString();

    let electionQuery = supabaseAdmin
      .from('elections')
      .select('id, start_date, end_date, is_uni_level')
      .order('start_date', { ascending: false });
      
    if(electionId){
      electionQuery = electionQuery.eq('id', electionId);
    } else if (type === 'university') {
      electionQuery = electionQuery.eq('is_uni_level', true);
    } else if (type === 'organization' && department_org) {
      electionQuery = electionQuery.eq('is_uni_level', false).eq('department_org', department_org);
    }else{
      console.log("failed to detect params");
      throw new Error ('Failed to detect params.');
    }

    // Fetch active elections first
    let { data: elections, error: electionError } = await electionQuery
      .lte('start_date', currentTimeISO)
      .gte('end_date', currentTimeISO);

    // If no active elections, fetch recently completed elections (within 5 days after end_date)
    if ((!elections || elections.length === 0) && !electionError) {
      const fiveDaysAgo = new Date(currentTime.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString();
      
      // Create a fresh query for completed elections
      let completedQuery = supabaseAdmin
        .from('elections')
        .select('id, start_date, end_date, is_uni_level')
        .order('end_date', { ascending: false });
      
      // Apply the same filters as the original query
      if(electionId){
        completedQuery = completedQuery.eq('id', electionId);
      } else if (type === 'university') {
        completedQuery = completedQuery.eq('is_uni_level', true);
      } else if (type === 'organization' && department_org) {
        completedQuery = completedQuery.eq('is_uni_level', false).eq('department_org', department_org);
      }
      
      const completedResult = await completedQuery
        .lt('end_date', currentTimeISO)
        .gte('end_date', fiveDaysAgo);
      elections = completedResult.data;
      electionError = completedResult.error;
    }

    if (electionError || !elections || elections.length === 0) {
      console.log('❌ No elections found');
      return NextResponse.json({ 
        success: false, 
        error: 'No elections found' 
      }, { status: 404 });
    }
    
    const targetElectionId = elections[0].id;
    console.log('✅ Found election:', targetElectionId);

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

    console.log('📋 Found positions:', positions?.length || 0);

    // Get all candidates for this election
    const { data: candidates, error: candidatesError } = await supabaseAdmin
      .from('candidates')
      .select('id, name, course_year, picture_url, position_id, status, is_abstain')
      .eq('election_id', targetElectionId)
      .eq('status', 'approved')
      .order('name', { ascending: true });

    if (candidatesError) {
      console.error('Error fetching candidates:', candidatesError);
      return NextResponse.json({ error: candidatesError.message }, { status: 500 });
    }

    console.log('👥 Found candidates:', {
      total: candidates?.length || 0,
      regular: candidates?.filter(c => !c.is_abstain).length || 0,
      abstain: candidates?.filter(c => c.is_abstain).length || 0
    });

    // Check if request is from admin (fixed logic)
    const isAdmin = accessLevel === 'admin' || administeredOrg !== null;
    console.log('🔐 Admin check:', { accessLevel, administeredOrg, isAdmin });

    // Filter candidates based on admin status
    const filteredCandidates = isAdmin ? candidates : candidates?.filter(c => !c.is_abstain);
    console.log('📊 Filtered candidates:', {
      total: filteredCandidates?.length || 0,
      regular: filteredCandidates?.filter(c => !c.is_abstain).length || 0,
      abstain: filteredCandidates?.filter(c => c.is_abstain).length || 0
    });

    // Get vote counts for all candidates in this election
    const { data: votes, error: votesError } = await supabaseAdmin
      .from('votes')
      .select('candidate_id')
      .eq('election_id', targetElectionId);

    if (votesError) {
      console.error('Error fetching votes:', votesError);
      return NextResponse.json({ error: votesError.message }, { status: 500 });
    }

    console.log('🗳️ Found votes:', votes?.length || 0);

    // Count votes for each candidate
    const voteCounts: { [key: string]: number } = {};
    votes?.forEach(vote => {
      voteCounts[vote.candidate_id] = (voteCounts[vote.candidate_id] || 0) + 1;
    });

    console.log('📊 Vote counts:', voteCounts);

    // Group candidates by position and add vote counts
    const results = positions?.map(position => {
      const positionCandidates = filteredCandidates?.filter(candidate => 
        candidate.position_id === position.id
      ).map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        course_year: candidate.course_year,
        picture_url: candidate.picture_url,
        positionId: candidate.position_id, // Add this for consistency
        is_abstain: candidate.is_abstain, // Add this field
        votes: voteCounts[candidate.id] || 0
      })) || [];

      console.log(`📋 Position "${position.title}" candidates:`, {
        total: positionCandidates.length,
        regular: positionCandidates.filter(c => !c.is_abstain).length,
        abstain: positionCandidates.filter(c => c.is_abstain).length
      });

      return {
        position: position.title,
        candidates: positionCandidates
      };
    }) || [];

    // Get election details for additional context
    const { data: electionDetails, error: electionDetailsError } = await supabaseAdmin
      .from('elections')
      .select('name, description, start_date, end_date, is_uni_level')
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

    console.log('✅ Returning results:', {
      totalPositions: results.length,
      electionStatus,
      isLive: electionStatus === 'active' && showLiveResults
    });

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
    console.error('❌ Error in get-vote-counts API:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 