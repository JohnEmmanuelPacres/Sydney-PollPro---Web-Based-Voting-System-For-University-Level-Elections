'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // If no session, redirect to login
          router.push('/User_RegxLogin');
          return;
        }

        // Set email from session or URL parameter
        setEmail(session.user.email || searchParams.get('email'));
        setIsLoading(false);
      } catch (error) {
        console.error('Session check error:', error);
        router.push('/User_RegxLogin');
      }
    };

    checkSession();
  }, [router, searchParams]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/User_RegxLogin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '2rem' }}>
      <h1>Welcome Voter</h1>
      <p className="text-xl mt-4">{email}</p>
      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg"
      >
        Logout
      </button>
    </div>
  );
} 