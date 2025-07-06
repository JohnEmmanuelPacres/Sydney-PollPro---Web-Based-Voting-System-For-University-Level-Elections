import React from "react";

interface ElectionCardProps {
  id: number;
  title: string;
  description: string;
  status: string;
  endDate: string;
  candidates: string;
  participation: string;
  participationWidth: string;
  viewed: boolean;
  expanded: boolean;
  onViewStatus: () => void;
}

export default function ElectionCard({
  title,
  description,
  status,
  endDate,
  candidates,
  participation,
  participationWidth,
  viewed,
  expanded,
  onViewStatus,
}: ElectionCardProps) {
  const statusClass = status === "Active" 
    ? "bg-yellow-500 text-red-900" 
    : "bg-red-600 text-gray-200";

  const buttonBaseClass = "flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-all";
  const viewButtonClass = viewed 
    ? "bg-yellow-400 border-yellow-900 text-red-900 hover:bg-yellow-300"
    : "bg-white border-yellow-900 text-red-800 hover:bg-yellow-500";

  return (
    <div className={`w-full p-4 bg-red-600/20 rounded-lg border border-yellow-900 space-y-3 transition-all duration-200 ${expanded ? "ring-2 ring-yellow-400" : ""}`}>
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h4 className="text-white text-base font-semibold">{title}</h4>
          <p className="text-yellow-400 text-sm">{description}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
          {status}
        </span>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* End Date */}
        <div className="flex items-center gap-2">
          <CalendarIcon />
          <span className="text-white text-sm">{endDate}</span>
        </div>

        {/* Candidates */}
        <div className="flex items-center gap-2">
          <UsersIcon />
          <span className="text-white text-sm">{candidates}</span>
        </div>

        {/* Participation */}
        <div className="md:col-span-1 space-y-1">
          <div className="flex justify-between">
            <span className="text-white text-sm">Participation</span>
            <span className="text-red-300 text-sm">{participation}</span>
          </div>
          <div className="w-full h-2 bg-yellow-700 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-red-400 rounded-full ${participationWidth}`}
            />
          </div>
        </div>
      </div>

      {/* Expanded Content (visible when expanded) */}
      {expanded && (
        <div className="pt-2 animate-fadeIn">
          <div className="p-3 bg-red-900/30 rounded-lg border border-yellow-900/50">
            <h5 className="text-yellow-300 text-sm font-semibold mb-2">Election Details</h5>
            <ul className="text-white text-sm space-y-1">
              <li className="flex justify-between">
                <span>Voting Method:</span>
                <span>Online Ballot</span>
              </li>
              <li className="flex justify-between">
                <span>Eligibility:</span>
                <span>All registered students</span>
              </li>
              <li className="flex justify-between">
                <span>Current Leader:</span>
                <span>John Doe (42%)</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button 
          onClick={onViewStatus}
          className={`${buttonBaseClass} ${viewButtonClass}`}
          aria-label={`${expanded ? "Hide" : "View"} details for ${title}`}
        >
          <ViewIcon />
          {expanded ? "Hide Details" : viewed ? "View Again" : "View Status"}
        </button>
      </div>
    </div>
  );
}

// Simple SVG Icons (replace with your actual icons)
const CalendarIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ViewIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);