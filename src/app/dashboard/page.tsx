'use client';
import { useSearchParams } from 'next/navigation';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '2rem' }}>
      <h1>Welcome Voter</h1>
      <p>{email ? email : 'No email found'}</p>
    </div>
  );
} 