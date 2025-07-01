"use client";
import { NextPage } from 'next';
import Header from '../components/Header';
import VoterHeader from '../components/VoteDash_Header';
import Footer from '../components/Footer';
import ElectionResultsDisplay from '../components/ElectionResultsDisplay';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { usePathname, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

const Results: NextPage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Check if user is signed in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsSignedIn(!!user);
    };
    checkUser();
  }, []);

  // Only show VoteDash_Header if user is signed in AND on dashboard or coming from dashboard
  const isVoterDashboard = isSignedIn && (
    pathname.startsWith('/Voterdashboard') ||
    searchParams.get('from') === 'dashboard'
  );

  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Animate title on mount
    gsap.set(titleRef.current, { y: -50, opacity: 0 });

    const tl = gsap.timeline();
    tl.to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-t from-yellow-900 to-red-900 text-white font-inter">
      {/* Header */}
      {isVoterDashboard ? <VoterHeader /> : <Header />}

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8">
        <h1 
          ref={titleRef}
          className="mt-24 md:mt-32 lg:mt-40 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-center md:text-left mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          Election Results
        </h1>

        <div className="mt-12 md:mt-16 lg:mt-20 flex flex-col items-center gap-6 md:gap-8 lg:gap-10 pb-20 md:pb-24 lg:pb-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl">
            <ElectionResultsDisplay 
              electionId={searchParams.get('election_id') || undefined}
              type={(searchParams.get('type') as 'university' | 'organization') || 'university'}
              department_org={searchParams.get('department_org') || undefined}
              isLive={true}
              showRefreshButton={true}
              className="text-white"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Results;