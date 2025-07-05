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

// Helper to create ISO string from admin's input (same as create-elections)
function createDateTimeISO(dateStr: string, timeStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  
  // Create date object with the admin's intended time
  const date = new Date(year, month - 1, day, hour, minute, 0);
  
  // Return as ISO string - this will be stored as the exact time the admin intended
  return date.toISOString();
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
        start_date: createDateTimeISO(electionData.startDate, electionData.startTime),
        end_date: createDateTimeISO(electionData.endDate, electionData.endTime),
        is_uni_level: electionData.settings.isUniLevel,
        allow_abstain: electionData.settings.allowAbstain,
        eligible_courseYear: electionData.settings.eligibleCourseYear,
      })
      .eq('id', electionId);

    if (electionUpdateError) {
      console.error('Election update error:', electionUpdateError);
      return NextResponse.json({ error: 'Failed to update election: ' + electionUpdateError.message }, { status: 500 });
    }

    // Update positions if provided
    if (electionData.positions && Array.isArray(electionData.positions)) {
      console.log('Updating positions...');
      
      // Get existing positions for this election
      const { data: existingPositions, error: fetchPositionsError } = await supabaseAdmin
        .from('positions')
        .select('id, title')
        .eq('election_id', electionId);

      if (fetchPositionsError) {
        console.error('Error fetching existing positions:', fetchPositionsError);
        return NextResponse.json({ error: 'Failed to fetch existing positions: ' + fetchPositionsError.message }, { status: 500 });
      }

      const existingPositionIds = existingPositions?.map(p => p.id) || [];
      const updatedPositionIds: string[] = [];

      // Update or create positions
      for (const position of electionData.positions) {
        if (position.id) {
          // Update existing position
          const { error: updatePositionError } = await supabaseAdmin
            .from('positions')
            .update({
              title: position.title,
              description: position.description,
              max_candidates: position.maxCandidates,
              max_winners: position.maxWinners || 1,
              is_required: position.isRequired,
            })
            .eq('id', position.id)
            .eq('election_id', electionId);

          if (updatePositionError) {
            console.error('Error updating position:', updatePositionError);
            return NextResponse.json({ error: 'Failed to update position: ' + updatePositionError.message }, { status: 500 });
          }
          updatedPositionIds.push(position.id);
        } else {
          // Create new position
          const { data: newPosition, error: createPositionError } = await supabaseAdmin
            .from('positions')
            .insert({
              title: position.title,
              description: position.description,
              max_candidates: position.maxCandidates,
              max_winners: position.maxWinners || 1,
              is_required: position.isRequired,
              election_id: electionId,
            })
            .select('id')
            .single();

          if (createPositionError) {
            console.error('Error creating position:', createPositionError);
            return NextResponse.json({ error: 'Failed to create position: ' + createPositionError.message }, { status: 500 });
          }
          updatedPositionIds.push(newPosition.id);
        }
      }

      // Delete positions that are no longer in the updated list
      const positionsToDelete = existingPositionIds.filter(id => !updatedPositionIds.includes(id));
      if (positionsToDelete.length > 0) {
        // First delete candidates for these positions
        const { error: deleteCandidatesError } = await supabaseAdmin
          .from('candidates')
          .delete()
          .in('position_id', positionsToDelete);

        if (deleteCandidatesError) {
          console.error('Error deleting candidates for removed positions:', deleteCandidatesError);
          return NextResponse.json({ error: 'Failed to delete candidates: ' + deleteCandidatesError.message }, { status: 500 });
        }

        // Then delete the positions
        const { error: deletePositionsError } = await supabaseAdmin
          .from('positions')
          .delete()
          .in('id', positionsToDelete);

        if (deletePositionsError) {
          console.error('Error deleting positions:', deletePositionsError);
          return NextResponse.json({ error: 'Failed to delete positions: ' + deletePositionsError.message }, { status: 500 });
        }
      }
    }

    // Update candidates if provided
    if (electionData.candidates && Array.isArray(electionData.candidates)) {
      console.log('Updating candidates...');
      
      // Get existing candidates for this election
      const { data: existingCandidates, error: fetchCandidatesError } = await supabaseAdmin
        .from('candidates')
        .select('id, name, position_id')
        .eq('election_id', electionId);

      if (fetchCandidatesError) {
        console.error('Error fetching existing candidates:', fetchCandidatesError);
        return NextResponse.json({ error: 'Failed to fetch existing candidates: ' + fetchCandidatesError.message }, { status: 500 });
      }

      const existingCandidateIds = existingCandidates?.map(c => c.id) || [];
      const updatedCandidateIds: string[] = [];

      // Update or create candidates
      for (const candidate of electionData.candidates) {
        if (candidate.id) {
          // Update existing candidate
          const { error: updateCandidateError } = await supabaseAdmin
            .from('candidates')
            .update({
              name: candidate.name,
              email: candidate.email,
              course: candidate.course,
              year: candidate.year,
              position_id: candidate.positionId,
              status: candidate.status,
              platform: candidate.platform,
              credentials: candidate.credentials,
              picture_url: candidate.picture_url,
            })
            .eq('id', candidate.id)
            .eq('election_id', electionId);

          if (updateCandidateError) {
            console.error('Error updating candidate:', updateCandidateError);
            return NextResponse.json({ error: 'Failed to update candidate: ' + updateCandidateError.message }, { status: 500 });
          }
          updatedCandidateIds.push(candidate.id);
        } else {
          // Create new candidate
          const { data: newCandidate, error: createCandidateError } = await supabaseAdmin
            .from('candidates')
            .insert({
              name: candidate.name,
              email: candidate.email,
              course: candidate.course,
              year: candidate.year,
              position_id: candidate.positionId,
              status: candidate.status || 'pending',
              platform: candidate.platform,
              credentials: candidate.credentials,
              picture_url: candidate.picture_url,
              election_id: electionId,
            })
            .select('id')
            .single();

          if (createCandidateError) {
            console.error('Error creating candidate:', createCandidateError);
            return NextResponse.json({ error: 'Failed to create candidate: ' + createCandidateError.message }, { status: 500 });
          }
          updatedCandidateIds.push(newCandidate.id);
        }
      }

      // Delete candidates that are no longer in the updated list
      const candidatesToDelete = existingCandidateIds.filter(id => !updatedCandidateIds.includes(id));
      if (candidatesToDelete.length > 0) {
        const { error: deleteCandidatesError } = await supabaseAdmin
          .from('candidates')
          .delete()
          .in('id', candidatesToDelete);

        if (deleteCandidatesError) {
          console.error('Error deleting candidates:', deleteCandidatesError);
          return NextResponse.json({ error: 'Failed to delete candidates: ' + deleteCandidatesError.message }, { status: 500 });
        }
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