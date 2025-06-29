import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface position{
  id: string;
  title: string;
  description: string;
  maxCandidates: number;
  maxWinners?: number;
  isRequired: boolean;
}
interface candidate {
  id: string;
  name: string;
  email: string;
  course: string;
  year: string;
  positionId: string;
  status: "pending" | "approved" | "disqualified";
  platform: string;
  credentials: string;
  picture_url?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { electionId, electionData } = await request.json();

    if (!electionId) {
      return NextResponse.json({ error: 'Missing electionId' }, { status: 400 });
    }

    if (!electionData) {
      return NextResponse.json({ error: 'Missing election data' }, { status: 400 });
    }

    console.log('Updating election:', electionId);

    // Update election data
    const { error: electionUpdateError } = await supabaseAdmin
      .from('elections')
      .update({
        name: electionData.name,
        description: electionData.description,
        start_date: `${electionData.startDate}T${electionData.startTime}:00`,
        end_date: `${electionData.endDate}T${electionData.endTime}:00`,
        is_uni_level: electionData.settings.isUniLevel,
        allow_abstain: electionData.settings.allowAbstain,
        eligible_courseYear: electionData.settings.eligibleCourseYear,
      })
      .eq('id', electionId);

    if (electionUpdateError) {
      console.error('Election update error:', electionUpdateError);
      return NextResponse.json({ error: 'Failed to update election: ' + electionUpdateError.message }, { status: 500 });
    }

    // Delete existing positions and candidates
    await supabaseAdmin.from('positions').delete().eq('election_id', electionId);
    await supabaseAdmin.from('candidates').delete().eq('election_id', electionId);

    // Insert updated positions and get new UUIDs
    let positionMap = new Map<string, string>();
    let dbPositions: { id: string }[] = [];
    if (electionData.positions && electionData.positions.length > 0) {
      const positionsToInsert = electionData.positions.map((pos: position) => ({
        // Do not send id, let DB generate
        election_id: electionId,
        title: pos.title,
        description: pos.description,
        max_candidates: pos.maxCandidates,
        max_winners: pos.maxWinners || 1,
        is_required: pos.isRequired,
      }));

      const { data: insertedPositions, error: positionsError } = await supabaseAdmin
        .from('positions')
        .insert(positionsToInsert)
        .select();

      if (positionsError) {
        console.error('Positions update error:', positionsError);
        return NextResponse.json({ error: 'Failed to update positions: ' + positionsError.message }, { status: 500 });
      }
      dbPositions = insertedPositions as { id: string }[];
      // Map frontend index to new UUID
      (electionData.positions as position[]).forEach((frontendPos: position, idx: number) => {
        positionMap.set(frontendPos.id, dbPositions[idx].id);
      });
    }

    // Insert updated candidates with correct position_id
    if (electionData.candidates && electionData.candidates.length > 0) {
      const candidatesToInsert = electionData.candidates.map((cand: candidate) => ({
        // Do not send id, let DB generate
        election_id: electionId,
        name: cand.name,
        email: cand.email,
        position_id: positionMap.get(cand.positionId) || null,
        status: cand.status,
        platform: cand.platform,
        detailed_achievements: cand.credentials,
        course_year: `${cand.course} - ${cand.year}`,
        picture_url: cand.picture_url || null,
      }));

      const { error: candidatesError } = await supabaseAdmin
        .from('candidates')
        .insert(candidatesToInsert);

      if (candidatesError) {
        console.error('Candidates update error:', candidatesError);
        return NextResponse.json({ error: 'Failed to update candidates: ' + candidatesError.message }, { status: 500 });
      }
    }

    console.log('Election updated successfully');

    return NextResponse.json({ 
      success: true,
      message: 'Election updated successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error updating election' 
    }, { status: 500 });
  }
} 