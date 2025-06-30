'use client';

import VoteNow from '@/app/components/VoteNow';
import { useSearchParams } from 'next/navigation';

export default function UniversityElectionPage() {
  const searchParams = useSearchParams();
  const orgId = searchParams.get('orgId') || 'default-org-id';
  
  return <VoteNow />;
} 