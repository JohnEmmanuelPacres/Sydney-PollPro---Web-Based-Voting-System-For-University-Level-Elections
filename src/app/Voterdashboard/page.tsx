// app/dashboard/page.tsx
'use client';
import VoterHeader from "../components/VoteDash_Header";
import WelcomeSection from "../components/VoteDash_WelcomeSection";
import StatsSection from "../components/VoteDash_StatSection";
import SessionStatusBar from "../components/VoteDash_SessionStatusBar";
import CurrentElections from "../components/VoteDash_CurrentElections";
import RecentActivity from "../components/VoteDash_RecentActivity";

export default function VotingDashboard() {
  
  return (
    <div className="min-h-screen bg-gradient-to-t from-yellow-950 to-red-950">
      <VoterHeader />
      
      <main className="pt-24 pb-8 px-4 space-y-8">
        <WelcomeSection />
        <StatsSection />
        <SessionStatusBar />
        
        <div className="bg-gradient-to-b from-red-900 border-6 border-yellow-700 rounded-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CurrentElections />
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
}