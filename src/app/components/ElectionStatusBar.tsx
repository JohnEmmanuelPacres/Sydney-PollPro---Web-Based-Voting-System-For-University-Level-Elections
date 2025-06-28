import React from 'react';
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

  
}

const ElectionStatusBar: React.FC<ElectionStatusBarProps> = ({ election }) => {
  const router = useRouter();
  const { administeredOrg } = useAdminOrg();
  const now = new Date();
  const start = new Date(election.start_date);
  const end = new Date(election.end_date);

  const status =
    now < start ? 'Upcoming' :
    now >= start && now <= end ? 'Ongoing' : 'Ended';

  const statusColor =
    status === 'Upcoming' ? 'bg-yellow-500' :
    status === 'Ongoing' ? 'bg-green-600' :
    'bg-gray-500';

  return (
    <button
      onClick={() => router.push(`/dashboard/Admin/UpdateElectionPage?electionId=${election.id}&administered_Org=${encodeURIComponent(administeredOrg || '')}`)}
      className="absolute top-[438px] left-[50%] transform -translate-x-1/2 text-[26px] leading-[150%] text-center w-[80%] rounded-xl shadow-md bg-[#fef2f2] border-2 border-[#c2410c] p-6 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 text-black hover:bg-[#f5f5f5] hover:border-[#ea580c] transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c2410c] focus:ring-opacity-50"
    >
      <div>
        <h2 className="text-xl font-bold">{election.name}</h2>
        <p className="text-sm">
          {new Date(election.start_date).toLocaleString()} &mdash; {new Date(election.end_date).toLocaleString()}
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
      </div>
    </button>
  );
};

export default ElectionStatusBar;
