// app/api/create-elections/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { convertLocalToSingaporeTime } from '@/utils/dateUtils';

// Add these interfaces to match your frontend
interface Position {
  id: string;
  title: string;
  description: string;
  maxCandidates: number;
  maxWinners?: number;
  isRequired: boolean;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  course_Year: string;
  positionId: string;
  status: "pending" | "approved" | "disqualified";
  platform: string;
  detailed_achievements: string;
  picture_url?: string;
}

// Use the Supabase service role key for server-side operations (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key (must be set in your environment variables)
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received payload in /api/create-elections:', JSON.stringify(body, null, 2));
    const { electionData, orgID } = body;

    // Convert dates to Singapore timezone with +08:00 offset
    const startDateSingapore = `${electionData.startDate}T${electionData.startTime}:00+08:00`;
    const endDateSingapore = `${electionData.endDate}T${electionData.endTime}:00+08:00`;

    console.log('Original dates:', {
      start: `${electionData.startDate}T${electionData.startTime}:00`,
      end: `${electionData.endDate}T${electionData.endTime}:00`
    });
    console.log('Singapore timezone dates:', {
      start: startDateSingapore,
      end: endDateSingapore
    });

    // 1. Create election
    const { data: election, error: electionError } = await supabaseAdmin
      .from('elections')
      .insert({
        name: electionData.name,
        description: electionData.description,
        start_date: startDateSingapore,
        end_date: endDateSingapore,
        is_uni_level: electionData.settings.isUniLevel,
        allow_abstain: electionData.settings.allowAbstain,
        eligible_courseYear: electionData.settings.eligibleCourseYear, // Fixed column name
        org_id: orgID
      })
      .select()
      .single();
    console.log('Election insert result:', election, electionError);
    if (electionError) throw electionError;

    // 2. Create positions with explicit typing
    const positionsToInsert = electionData.positions.map((position: Position) => ({
      title: position.title,
      description: position.description,
      max_candidates: position.maxCandidates,
      max_winners: position.maxWinners || 1, // Default to 1 winner if not specified
      is_required: position.isRequired,
      election_id: election.id
    }));

    const { data: dbPositions, error: positionsError } = await supabaseAdmin
      .from('positions')
      .insert(positionsToInsert)
      .select();
    console.log('Positions insert result:', dbPositions, positionsError);
    if (positionsError) throw positionsError;

    // 3. Create position ID mapping
    const positionMap = new Map<string, string>();
    electionData.positions.forEach((frontendPos: Position, index: number) => {
      positionMap.set(frontendPos.id, dbPositions[index].id);
    });

    // 4. Create candidates with explicit typing
    const candidatesToInsert = electionData.candidates.map((candidate: Candidate) => {
      const dbPositionId = positionMap.get(candidate.positionId);
      if (!dbPositionId) throw new Error(`Missing position ID for candidate ${candidate.name}`);

      return {
        name: candidate.name,
        email: candidate.email,
        course_year: candidate.course_Year,
        position_id: dbPositionId,
        election_id: election.id,
        status: candidate.status,
        platform: candidate.platform,
        detailed_achievements: candidate.detailed_achievements,
        picture_url: candidate.picture_url || null,
      };
    });

    const { error: candidatesError } = await supabaseAdmin
      .from('candidates')
      .insert(candidatesToInsert);
    console.log('Candidates insert result:', candidatesError);
    if (candidatesError) throw candidatesError;

    return NextResponse.json({ 
      success: true,
      electionId: election.id 
    }, { status: 201 });

  } catch (error) {
    console.error('Error in /api/create-elections:', error);
    return NextResponse.json(
      { error: 'Failed to create election', details: String(error) },
      { status: 500 }
    );
  }
}