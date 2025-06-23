import React from "react";

interface ElectionCardProps {
  title: string;
  description: string;
  status: string;
  endDate: string;
  candidates: string;
  participation: string;
  participationWidth: string;
}

export default function ElectionCard({
  title,
  description,
  status,
  endDate,
  candidates,
  participation,
  participationWidth
}: ElectionCardProps) {
  const statusClass = status === "Active" 
    ? "bg-yellow-500 text-red-900" 
    : "bg-red-600 text-gray-200";

  return (
    <div className="w-full p-4 bg-red-600/20 rounded-lg border border-yellow-400 space-y-3">
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

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button className="flex items-center gap-2 px-3 py-2 bg-white rounded-md border border-yellow-400 text-red-800 text-sm font-medium">
          <ViewIcon />
          View Status
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-white rounded-md border border-yellow-400 text-red-800 text-sm font-medium">
          <ManageIcon />
          Manage
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

const ManageIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);