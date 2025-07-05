"use client";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StatsCard from "./components/StatsCard";
import Threads from "./components/Threads";
import { useEffect, useState } from "react";
import SignInButton from './components/ParticipiateNowButton';
import { useRouter, usePathname } from 'next/navigation';

export default function Home() {
  const [votersCount, setVotersCount] = useState<string | null>(null);
  const [votesCount, setVotesCount] = useState<string | null>(null);
  const [participation, setParticipation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentElection, setCurrentElection] = useState<any>(null);
  const [electionLoading, setElectionLoading] = useState(true);
  const pathname = usePathname();

  const isLoginPage = pathname === '/User_RegxLogin' || pathname === '/User_RegxLogin/LoginAdmin';

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      // Fetch latest university-level election
      const uniRes = await fetch('/api/get-voting-data?scope=university');
      const uniData = await uniRes.json();
      const latestElection = uniData?.elections && uniData.elections.length > 0 ? uniData.elections[0] : null;
      setCurrentElection(latestElection);
      setElectionLoading(false);
      if (latestElection) {
        // Fetch stats for the latest university-level election
        const statsRes = await fetch(`/api/global-stats?electionId=${latestElection.id}`);
        const statsData = await statsRes.json();
        setVotersCount(statsData.voters !== undefined ? statsData.voters.toLocaleString() : 'N/A');
        setVotesCount(statsData.votes !== undefined ? statsData.votes.toLocaleString() : 'N/A');
        setParticipation(statsData.participation !== undefined ? `${statsData.participation}%` : 'N/A');
      } else {
        // Fallback: show global stats
        const res = await fetch('/api/global-stats');
        const data = await res.json();
        setVotersCount(data.voters !== undefined ? data.voters.toLocaleString() : 'N/A');
        setVotesCount(data.votes !== undefined ? data.votes.toLocaleString() : 'N/A');
        setParticipation(data.participation !== undefined ? `${data.participation}%` : 'N/A');
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  // Helper function to determine election status
  const getElectionStatus = (election: any) => {
    if (!election) return null;
    
    const now = new Date();
    const startDate = new Date(election.start_date);
    const endDate = new Date(election.end_date);
    
    if (now >= startDate && now <= endDate) {
      return 'ongoing';
    } else if (now < startDate) {
      return 'upcoming';
    } else {
      return 'completed';
    }
  };

  const electionStatus = getElectionStatus(currentElection);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-t from-yellow-950 to-red-950">
      <Header />
      <div className="absolute inset-0 z-0">
        <Threads 
          color={[1, 0.5, 0]} 
          amplitude={3} 
          distance={0.1} 
          enableMouseInteraction={true}
        />
      </div>
      <main className="flex-1 relative mt-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col justify-center items-center px-4 md:px-8 lg:px-16 pt-20 pb-16">
          <div className="text-center max-w-6xl mx-auto z-10">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-normal font-['Baloo_2'] text-white leading-tight md:leading-[105px] mb-6">
              Secure Digital Voting Platform
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl font-normal font-['Baloo_2'] text-stone-300 leading-8 md:leading-8 mb-4">
              Participate in university-wide or organization level elections transparently, securely, and accessibly.
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl font-normal font-['Baloo_2'] text-stone-300 leading-8 md:leading-8">
              Your roar matters!
            </p>
          </div>
          <div className="mt-10">
            <p className="text-xl md:text-2xl lg:text-3xl font-normal font-['Baloo_2'] text-stone-300 leading-8 md:leading-10">
              Join the polls now WildCats!
            </p>
          </div>
          {!isLoginPage && (
            <div className="mt-8">
              <SignInButton href="/User_RegxLogin">
                PARTICIPATE NOW
              </SignInButton>
            </div>
          )}
        </section>

        {/* Voting Session Status */}
        <section className="px-4 md:px-8 lg:px-16 py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-['Inter'] text-white mb-8">
              Current University-Wide Election
            </h2>
            <div className="relative h-32 bg-gradient-to-r from-red-900 to-stone-950 rounded-md shadow-[0px_7px_4px_0px_rgba(0,0,0,0.25)] outline outline-[3px] outline-offset-[-3px] outline-orange-400 overflow-hidden">
              <div className="relative z-10 h-full flex flex-col justify-center px-6">
                {electionLoading ? (
                  <p className="text-white text-lg md:text-xl lg:text-2xl font-normal font-['Baloo_Bhai_2'] leading-8 md:leading-10">
                    Loading election data...
                  </p>
                ) : currentElection ? (
                  <>
                    <p className="text-white text-lg md:text-xl lg:text-2xl font-normal font-['Baloo_Bhai_2'] leading-8 md:leading-10">
                      Election: {currentElection.name}
                    </p>
                    <p className="text-white text-lg md:text-xl lg:text-2xl font-normal font-['Baloo_Bhai_2'] leading-8 md:leading-10">
                      Status: <span className={`ml-4 inline-block px-4 py-2 rounded-full text-base font-medium ${
                        electionStatus === 'ongoing' ? 'bg-green-700/30' : 
                        electionStatus === 'upcoming' ? 'bg-yellow-700/30' : 
                        'bg-red-700/30 text-red-200'
                      }`}>
                        {electionStatus === 'ongoing' ? 'Ongoing' : electionStatus === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="text-white text-lg md:text-xl lg:text-2xl font-normal font-['Baloo_Bhai_2'] leading-8 md:leading-10">
                    No current university-wide election
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Election Stats */}
        <section className="px-4 md:px-8 lg:px-16 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatsCard 
                title="Total Registered Voters"
                value={loading ? 'Loading...' : votersCount ?? 'N/A'}
                subtitle="Active Student Voters"
              />
              <StatsCard 
                title="Total Votes Cast"
                value={loading ? 'Loading...' : votesCount ?? 'N/A'}
                subtitle="Type of Election"
              />
              <StatsCard 
                title="Avg. Participation"
                value={loading ? 'Loading...' : participation ?? 'N/A'}
                subtitle="Student Engagement"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 