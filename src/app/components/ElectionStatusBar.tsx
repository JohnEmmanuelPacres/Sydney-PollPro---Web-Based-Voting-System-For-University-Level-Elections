import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminOrg } from '../dashboard/Admin/AdminedOrgContext';

interface ElectionStatusBarProps {
  election: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    is_Uni_level: boolean;
    allow_abstain: boolean;
  };
  onClick?: () => void;
}

const ElectionStatusBar: React.FC<ElectionStatusBarProps> = ({ election }) => {
  const router = useRouter();
  const { administeredOrg } = useAdminOrg();
  const [showPrompt, setShowPrompt] = useState(false);
  
  // Get current time in local timezone (same as election dates)
  const getCurrentLocalTime = () => {
    return new Date();
  };

  // The dates are stored as the admin intended, so we use them as-is
  const convertToDisplayFormat = (dateString: string) => {
    const date = new Date(dateString);
    return date;
  };

  const now = getCurrentLocalTime();
  const start = convertToDisplayFormat(election.start_date);
  const end = convertToDisplayFormat(election.end_date);

  const status =
    now < start ? 'Upcoming' :
    now >= start && now <= end ? 'Ongoing' : 'Ended';

  const statusColor =
    status === 'Upcoming' ? 'bg-[#c2410c]' :
    status === 'Ongoing' ? 'bg-green-600' :
    'bg-gray-500';

  const borderColor =
    status === 'Upcoming' ? 'border-[#c2410c]' :
    status === 'Ongoing' ? 'border-green-600' :
    'border-gray-500';

  const isClickable = status === 'Upcoming';

  const handleClick = () => {
    if (status === 'Ongoing') {
      setShowPrompt(true);
      // Hide the prompt after 3 seconds
      setTimeout(() => setShowPrompt(false), 3000);
      return;
    }
    
    if (status === 'Upcoming') {
      router.push(`/dashboard/Admin/UpdateElectionPage?electionId=${election.id}&administered_Org=${encodeURIComponent(administeredOrg || '')}`);
    }
  };

  // Format dates for display in Singapore timezone
  const formatDateForDisplay = (utcDateString: string) => {
    const singaporeDate = convertToDisplayFormat(utcDateString);
    return singaporeDate.toLocaleString('en-SG', {
      timeZone: 'Asia/Singapore',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`absolute top-[438px] left-[50%] transform -translate-x-1/2 text-[26px] leading-[150%] text-center w-[85%] rounded-xl shadow-md bg-[#fef2f2] border-4 p-6 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 text-black transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c2410c] focus:ring-opacity-50 ${
          isClickable 
            ? `hover:bg-[#f5f5f5] hover:scale-105 hover:${borderColor}` 
            : 'opacity-75 cursor-not-allowed hover:bg-[#fef2f2]'
        }`}
        disabled={!isClickable}
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
          <span className={`px-3 py-1 text-sm rounded-full text-white ${statusColor}`}>
            {status}
          </span>
          <span className="text-sm">
            Abstain Votes: {election.allow_abstain ? 'Allowed' : 'Not Allowed'}
          </span>
          {!isClickable && (
            <span className="text-xs text-red-600 font-medium">
              {status === 'Ongoing' ? 'Cannot edit during voting' : 'Election ended'}
            </span>
          )}
        </div>
      </button>

      {/* Prompt for ongoing elections */}
      {showPrompt && (
        <div className="absolute top-[520px] left-[50%] transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md text-center">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Election is currently ongoing. Editing is prohibited during voting period.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionStatusBar;
