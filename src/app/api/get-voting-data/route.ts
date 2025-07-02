import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCurrentSingaporeTimeISO } from '@/utils/dateUtils';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get the scope, election ID, orgId, and departmentOrg from query parameters
    const { searchParams } = new URL(request.url);
    const electionId = searchParams.get('electionId');
    const orgId = searchParams.get('orgId');
    const type = searchParams.get('scope');
    const departmentOrg = searchParams.get('department_org');
    console.log('[API] get-voting-data params:', { electionId, orgId, type, departmentOrg });

    let query = supabaseAdmin
      .from('elections')
      .select('*');

    // Priority: electionId > scope=university > departmentOrg > orgId > default university-level
    if (electionId) {
      query = query.eq('id', electionId);
    } else if (type === 'university') {
      query = query.eq('is_uni_level', true);
    } else if (type === 'organization' && departmentOrg) {
      query = query.eq('is_uni_level', false).eq('department_org', departmentOrg);
    } else if (orgId) {
      query = query.eq('org_id', orgId);
    } else {
      // Default to university-level elections
      query = query.eq('is_uni_level', true);
    }

    // Fetch active elections (current time between start_date and end_date)
    // Use UTC time for consistent comparison with stored election dates
    const currentTime = new Date().toISOString();
    console.log('Current UTC time for comparison:', currentTime);
    
    const { data: elections, error: electionsError } = await query
      .gte('end_date', currentTime) // end_date in the future (ongoing or upcoming)
      .order('start_date', { ascending: true });

    if (electionsError) {
      console.error('[API] get-voting-data electionsError:', electionsError.message);
      return NextResponse.json({ error: electionsError.message }, { status: 500 });
    }

    if (!elections || elections.length === 0) {
      return NextResponse.json({ elections: [] }, { status: 200 });
    }

    // For each election, fetch positions and candidates
    const detailedElections = await Promise.all(
      elections.map(async (election) => {
        // Fetch positions for this election
        const { data: positions, error: positionsError } = await supabaseAdmin
          .from('positions')
          .select('*')
          .eq('election_id', election.id)
          .order('title', { ascending: true });

        if (positionsError) {
          console.error('Error fetching positions:', positionsError);
          return { ...election, positions: [], candidates: [] };
        }

        // Fetch candidates for this election (only approved candidates)
        const { data: candidates, error: candidatesError } = await supabaseAdmin
          .from('candidates')
          .select('*')
          .eq('election_id', election.id)
          .eq('status', 'approved')
          .order('name', { ascending: true });

        if (candidatesError) {
          console.error('Error fetching candidates:', candidatesError);
          return { ...election, positions: positions || [], candidates: [] };
        }

        // Group candidates by position
        const candidatesByPosition = (candidates || []).reduce((acc, candidate) => {
          const positionId = candidate.position_id;
          if (!acc[positionId]) {
            acc[positionId] = [];
          }
          acc[positionId].push(candidate);
          return acc;
        }, {} as { [key: string]: any[] });

        return {
          ...election,
          positions: positions || [],
          candidates: candidates || [],
          candidatesByPosition
        };
      })
    );

    return NextResponse.json({ 
      elections: detailedElections,
      totalElections: detailedElections.length
    }, { status: 200 });

  } catch (error) {
    console.error('[API] get-voting-data CATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voting data', details: String(error) },
      { status: 500 }
    );
  }
} 