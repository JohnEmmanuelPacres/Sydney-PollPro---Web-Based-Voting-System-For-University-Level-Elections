import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to parse course_year string
function parseCourseYear(courseYearString: string | null): { course: string; year: string } {
  if (!courseYearString || typeof courseYearString !== 'string') {
    return { course: '', year: '' };
  }

  const trimmed = courseYearString.trim();
  
  // Handle the format "BS Civil Engineering - 1st Year"
  if (trimmed.includes(' - ')) {
    const parts = trimmed.split(' - ');
    if (parts.length >= 2) {
      return {
        course: parts[0].trim(),
        year: parts[1].trim()
      };
    }
  }
  
  // Handle alternative formats like "BS Civil Engineering-1st Year" (no spaces around dash)
  if (trimmed.includes('-')) {
    const parts = trimmed.split('-');
    if (parts.length >= 2) {
      return {
        course: parts[0].trim(),
        year: parts[1].trim()
      };
    }
  }
  
  // If no separator found, treat the whole string as course
  return {
    course: trimmed,
    year: ''
  };
}

// Test function to validate parsing logic (you can call this in development)
function testCourseYearParsing() {
  const testCases = [
    'BS Civil Engineering - 1st Year',
    'BS Computer Science - 2nd Year',
    'BS Architecture - 5th Year',
    'BS Civil Engineering-1st Year', // No spaces around dash
    'BS Computer Science', // No year
    '', // Empty string
    null, // Null value
    'BS Engineering - 3rd Year - Extra Part', // Multiple dashes
  ];

  console.log('Testing course_year parsing:');
  testCases.forEach(testCase => {
    const result = parseCourseYear(testCase);
    console.log(`Input: "${testCase}" -> Course: "${result.course}", Year: "${result.year}"`);
  });
}

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

    // Validate and transform candidates data
    const transformedCandidates = candidatesData?.map(cand => {
      try {
        // Use the helper function to parse course_year
        const { course, year } = parseCourseYear(cand.course_year);
        
        // Log for debugging
        console.log(`Candidate ${cand.name}: course_year="${cand.course_year}" -> course="${course}", year="${year}"`);
        
        return {
          id: cand.id,
          name: cand.name || '',
          email: cand.email || '',
          positionId: cand.position_id,
          status: cand.status || 'pending',
          credentials: cand.detailed_achievements || '',
          course: course,
          year: year,
          platform: cand.platform || '',
        };
      } catch (error) {
        console.error(`Error processing candidate ${cand.id}:`, error);
        // Return a fallback candidate object if parsing fails
        return {
          id: cand.id,
          name: cand.name || '',
          email: cand.email || '',
          positionId: cand.position_id,
          status: cand.status || 'pending',
          credentials: cand.detailed_achievements || '',
          course: cand.course_year || '', // Use original value as fallback
          year: '',
          platform: cand.platform || '',
        };
      }
    }) || [];

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
      candidates: transformedCandidates,
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