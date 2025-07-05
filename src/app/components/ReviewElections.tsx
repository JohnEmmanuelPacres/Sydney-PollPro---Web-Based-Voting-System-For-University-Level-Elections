import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from '@/utils/supabaseClient';
import { useAdminOrg } from '../dashboard/Admin/AdminedOrgContext';

interface CompletedElection {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  allow_abstain: boolean;
  is_Uni_level: boolean;
  org_id: string;
}

interface ReviewElectionPanelProps {
  completedElections: CompletedElection[];
  totalCompletedElections?: number;
}

const ReviewElectionPanel: React.FC<ReviewElectionPanelProps> = ({ completedElections, totalCompletedElections = 0 }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const administeredOrg = searchParams.get("administered_Org"); 

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-SG', {
      timeZone: 'Asia/Singapore',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleElectionClick = (election: CompletedElection) => {
    // Navigate to election results page
    const params = new URLSearchParams({
      election_id: election.id,
      scope: election.is_Uni_level ? 'university' : 'organization'
    });
    window.open(`/dashboard/Admin/ElectionSummaryPage?administered_Org=${administeredOrg}&${params.toString()}`, '_blank');
  };

  if (loading) {
    return (
      <div className="w-full h-[180px] flex items-center justify-center text-gray-500">
        Loading completed elections...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[180px] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (completedElections.length === 0) {
    // If there are no completed elections at all
    if (totalCompletedElections === 0) {
      return (
        <div className="w-full h-[180px] flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">No completed elections found</div>
            <div className="text-sm">There are currently no completed elections to review.</div>
          </div>
        </div>
      );
    }
    
    // If there are elections but search returned no results
    return (
      <div className="w-full h-[180px] flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">No results found</div>
          <div className="text-sm">Try adjusting your search terms or year filter.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-4 px-2 pb-2">
      {completedElections.map((election) => (
        <button
          key={election.id}
          onClick={() => handleElectionClick(election)}
          className="max-w-3xl w-full mx-auto text-center rounded-xl shadow-md bg-[#fef2f2] border-4 border-gray-500 p-6 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 text-black transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 hover:bg-[#f5f5f5] hover:scale-[1.02] transform-gpu"
          style={{ transformOrigin: 'center' }}
        >
          <div className="text-left">
            <h2 className="text-xl font-bold">{election.name}</h2>
            <p className="text-sm">
              {formatDateForDisplay(election.start_date)} &mdash; {formatDateForDisplay(election.end_date)}
            </p>
            <p className="text-sm text-gray-700">
              {election.is_Uni_level ? 'University Level Election' : 'Department/Organization Election'}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1">
            <span className="px-3 py-1 text-sm rounded-full text-white bg-gray-500">
              COMPLETED
            </span>
            <span className="text-sm">
              Abstain Votes: {election.allow_abstain ? 'Allowed' : 'Not Allowed'}
            </span>
            <span className="text-xs text-gray-600 font-medium">
              Click to view details
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ReviewElectionPanel;
