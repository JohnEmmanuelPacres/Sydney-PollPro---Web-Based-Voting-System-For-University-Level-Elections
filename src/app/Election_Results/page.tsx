"use client";
import { NextPage } from 'next';
import Header from '../components/Header';
import VoterHeader from '../components/VoteDash_Header';
import AdminHeader from '../components/AdminHeader';
import Footer from '../components/Footer';
import ElectionResultsDisplay from '../components/ElectionResultsDisplay';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { usePathname, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

const Results: NextPage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const departmentOrg = searchParams.get('department_org');
  const administeredOrg = searchParams.get('administered_Org');
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
  const isVoterDashboard = isSignedIn;

  const titleRef = useRef<HTMLHeadingElement>(null);
  const [type, setElectionType] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [electionID, setRelevantElectionID] = useState<string>();
  const [isLive, setIsLive] = useState(false);

  // Header selection logic
  let headerComponent = <Header />;
  if (administeredOrg) {
    headerComponent = <AdminHeader />;
  } else if (isVoterDashboard || (isSignedIn && departmentOrg)) {
    headerComponent = <VoterHeader />;
  }

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

    const fetchElectionScope = async () => {
      try {
        let type = 'university';
        if (departmentOrg || administeredOrg) {
          const typeRes = await fetch(`/api/get-relevant-elections?department_org=${encodeURIComponent(departmentOrg ?? '')}&administered_Org=${encodeURIComponent(administeredOrg ?? '')}`);
          if(!typeRes){
            setError("API Error");
            console.log(`Error: ${error}`);
          }
          const typeData = await typeRes.json();
          if (typeData && typeData.type && typeData.election) {
            type = typeData.type;
            setElectionType(type);
            setRelevantElectionID(typeData.election.id);
            // Determine if the election is ongoing
            const now = new Date();
            const start = new Date(typeData.election.start_date);
            const end = new Date(typeData.election.end_date);
            setIsLive(now >= start && now <= end);
          } else{
            setError("Error fetching election scope/type.")
            console.log(`Error: ${error}`);
            setIsLive(false);
          }
        } else {
          setIsLive(false);
        }
      } catch (err) {
        setError('Failed to load candidates.');
        console.log(`Error: ${error}`);
        setIsLive(false);
      }
    };
    fetchElectionScope();

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#52100D] text-white font-inter">
      {/* Header */}
      {headerComponent}

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8">
        <h1 
          ref={titleRef}
          className="mt-24 md:mt-32 lg:mt-40 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-10"
        >
          Election Results
        </h1>

        <div className="mt-12 md:mt-16 lg:mt-20 flex flex-col items-center gap-6 md:gap-8 lg:gap-10 pb-20 md:pb-24 lg:pb-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl">
            <ElectionResultsDisplay 
              electionId={electionID || undefined}
              type={type} 
              department_org={departmentOrg || undefined}
              isLive={isLive}
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