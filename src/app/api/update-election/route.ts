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

    // Do not delete or re-insert positions or candidates here. Only update election info.

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