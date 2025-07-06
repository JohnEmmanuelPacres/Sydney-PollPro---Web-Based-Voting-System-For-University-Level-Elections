// app/api/create-elections/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
  isAbstain?: boolean;
}

// Use the Supabase service role key for server-side operations (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key (must be set in your environment variables)
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('🚀 /api/create-elections: Received payload:', JSON.stringify(body, null, 2));
    const { electionData, orgID } = body;

    console.log('🔍 Processing election data:', {
      name: electionData.name,
      positionsCount: electionData.positions?.length || 0,
      candidatesCount: electionData.candidates?.length || 0,
      settings: electionData.settings
    });

    // Create ISO strings from the admin's input
    // The admin inputs the intended Singapore time, so we store it directly
    const createDateTimeISO = (dateStr: string, timeStr: string) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hour, minute] = timeStr.split(':').map(Number);
      
      // Create date object with the admin's intended time
      const date = new Date(year, month - 1, day, hour, minute, 0);
      
      // Return as ISO string - this will be stored as the exact time the admin intended
      return date.toISOString();
    };

    const startDateISO = createDateTimeISO(electionData.startDate, electionData.startTime);
    const endDateISO = createDateTimeISO(electionData.endDate, electionData.endTime);

    console.log('📅 Date processing:', {
      original: {
        start: `${electionData.startDate}T${electionData.startTime}:00`,
        end: `${electionData.endDate}T${electionData.endTime}:00`
      },
      iso: {
        start: startDateISO,
        end: endDateISO
      }
    });

    // 1. Create election
    console.log('🏛️ Creating election...');
    const { data: election, error: electionError } = await supabaseAdmin
      .from('elections')
      .insert({
        name: electionData.name,
        description: electionData.description,
        start_date: startDateISO,
        end_date: endDateISO,
        is_uni_level: electionData.settings.isUniLevel,
        allow_abstain: electionData.settings.allowAbstain,
        org_id: orgID,
        department_org: electionData.department_org
      })
      .select()
      .single();
    console.log('✅ Election insert result:', { election, error: electionError });
    if (electionError) throw electionError;

    // 2. Create positions with explicit typing
    console.log('📋 Creating positions...');
    const positionsToInsert = electionData.positions.map((position: Position) => ({
      title: position.title,
      description: position.description,
      max_candidates: position.maxCandidates,
      max_winners: position.maxWinners || 1, // Default to 1 winner if not specified
      is_required: position.isRequired,
      election_id: election.id
    }));

    console.log('📋 Positions to insert:', positionsToInsert);

    const { data: dbPositions, error: positionsError } = await supabaseAdmin
      .from('positions')
      .insert(positionsToInsert)
      .select();
    console.log('✅ Positions insert result:', { dbPositions, error: positionsError });
    if (positionsError) throw positionsError;

    // 3. Create position ID mapping
    console.log('🔗 Creating position ID mapping...');
    const positionMap = new Map<string, string>();
    electionData.positions.forEach((frontendPos: Position, index: number) => {
      positionMap.set(frontendPos.id, dbPositions[index].id);
      console.log(`  ${frontendPos.title}: ${frontendPos.id} -> ${dbPositions[index].id}`);
    });

    // 4. Create candidates with explicit typing
    console.log('👥 Processing candidates...');
    console.log('📊 Candidate breakdown:', {
      total: electionData.candidates?.length || 0,
      regular: electionData.candidates?.filter((c: any) => !c.isAbstain).length || 0,
      abstain: electionData.candidates?.filter((c: any) => c.isAbstain).length || 0
    });

    const candidatesToInsert = electionData.candidates.map((candidate: Candidate) => {
      const dbPositionId = positionMap.get(candidate.positionId);
      if (!dbPositionId) {
        console.error(`❌ Missing position ID for candidate ${candidate.name}`);
        console.error('Available positions:', Array.from(positionMap.entries()));
        throw new Error(`Missing position ID for candidate ${candidate.name}`);
      }

      const candidateData = {
        name: candidate.name,
        email: candidate.email,
        course_year: candidate.course_Year,
        position_id: dbPositionId,
        election_id: election.id,
        status: candidate.status,
        platform: candidate.platform,
        detailed_achievements: candidate.detailed_achievements,
        picture_url: candidate.picture_url || null,
        is_abstain: candidate.isAbstain || false,
      };

      console.log(`📝 Mapping candidate ${candidate.name}:`, {
        original: {
          name: candidate.name,
          email: candidate.email,
          course_Year: candidate.course_Year,
          positionId: candidate.positionId,
          isAbstain: candidate.isAbstain
        },
        mapped: candidateData
      });

      return candidateData;
    });

    console.log('📋 Final candidates to insert:', candidatesToInsert);

    const { error: candidatesError } = await supabaseAdmin
      .from('candidates')
      .insert(candidatesToInsert);
    console.log('✅ Candidates insert result:', { error: candidatesError });
    if (candidatesError) {
      console.error('❌ Candidate insertion failed:', candidatesError);
      throw candidatesError;
    }

    console.log('🎉 Election creation completed successfully!');
    return NextResponse.json({ 
      success: true,
      electionId: election.id 
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error in /api/create-elections:', error);
    return NextResponse.json(
      { error: 'Failed to create election', details: String(error) },
      { status: 500 }
    );
  }
}