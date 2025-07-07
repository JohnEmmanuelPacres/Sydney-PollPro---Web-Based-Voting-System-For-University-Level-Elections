"use client";
import { NextPage } from 'next';
import Header from '../components/Header';
import VoterHeader from '../components/VoteDash_Header';
import AdminHeader from '../components/AdminHeader';
import Footer from '../components/Footer';
import ElectionResultsDisplay from '../components/ElectionResultsDisplay';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useSearchParams, usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

const Results: NextPage = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
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
  const [Org, setOrg] = useState<string>();
  const [filterScope, setFilterScope] = useState<'university' | 'organization'>('university');
  const hasQueryParams = Array.from(searchParams.entries()).length > 0;

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
        let type = filterScope;
        if (filterScope === 'organization' && (departmentOrg || administeredOrg)) {
          const typeRes = await fetch(`/api/get-relevant-elections?department_org=${encodeURIComponent(departmentOrg ?? '')}&administered_Org=${encodeURIComponent(administeredOrg ?? '')}`);
          if (!typeRes) {
            setError("API Error");
            console.error('API Error: No response from /api/get-relevant-elections');
            return;
          }
          const typeData = await typeRes.json();
          if (typeData && typeData.type && typeData.election && typeData.Org) {
            type = typeData.type;
            const ID = typeData.election.id;
            const Org = typeData.Org;
            setRelevantElectionID(ID);
            setElectionType(type);
            setOrg(Org);
            // Determine if the election is ongoing
            const now = new Date();
            const start = new Date(typeData.election.start_date);
            const end = new Date(typeData.election.end_date);
            setIsLive(now >= start && now <= end);
            setError(null);
          } else {
            setError("Error fetching organization election scope/type.");
            setElectionType('organization');
            setIsLive(false);
            setRelevantElectionID(undefined);
            setOrg(undefined);
            console.error('Error: typeData missing expected fields', typeData);
          }
        } else if (filterScope === 'university') {
          setElectionType('university');
          setIsLive(false);
          setRelevantElectionID(undefined);
          setOrg(undefined);
          setError(null);
        }
      } catch (err) {
        setError('Failed to load candidates.');
        setElectionType(filterScope);
        setIsLive(false);
        setRelevantElectionID(undefined);
        setOrg(undefined);
        console.error('Error fetching election scope:', err);
      }
    };
    fetchElectionScope();

    return () => {
      tl.kill();
    };
  }, [filterScope, departmentOrg, administeredOrg]);

  // Add a derived loading state for when props are not ready
  const propsReady = type || (electionID || Org);

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

        {/* Filter Dropdown */}
        {hasQueryParams && (
          <div className="flex justify-center mt-8">
            <select
              className="bg-white text-black rounded px-4 py-2 text-lg font-medium shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
              value={filterScope}
              onChange={e => setFilterScope(e.target.value as 'university' | 'organization')}
            >
              <option value="university">University Results</option>
              <option value="organization">Organization Results</option>
            </select>
          </div>
        )}

        <div className="mt-12 md:mt-16 lg:mt-20 flex flex-col items-center gap-6 md:gap-8 lg:gap-10 pb-20 md:pb-24 lg:pb-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl">
            {error && (
              <div className="text-red-400 text-center mb-4">{error}</div>
            )}
            {!propsReady ? (
              <div className="flex items-center justify-center min-h-[300px]">
              <div className="flex items-center gap-4"> {/* Add this wrapper */}
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <div className="text-white text-xl">Loading election results...</div>
              </div>
            </div>
            ) : (
              <ElectionResultsDisplay 
                electionId={electionID || undefined}
                type={type} 
                department_org={Org || undefined}
                isLive={isLive}
                showRefreshButton={true}
                className="text-white"
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Results;