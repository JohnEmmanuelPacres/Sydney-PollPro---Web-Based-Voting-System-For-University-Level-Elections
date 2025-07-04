'use client';

import VoteNow from '@/app/components/VoteNow';
import { useSearchParams } from 'next/navigation';

export default function UniversityElectionPage() {
  const searchParams = useSearchParams();
  const electionId = searchParams.get('election_id');

  if (!electionId) return <div className="text-white text-xl">No election selected.</div>;

  return <VoteNow electionId={electionId} />;
} 