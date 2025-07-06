import React from "react";

interface ActivityItemProps {
  name: string;
  action: string;
  description: string;
  time: string;
  variant: "1" | "4" | "5" | "6";
}

export default function ActivityItem({
  name,
  action,
  description,
  time,
  variant
}: ActivityItemProps) {
  const variantClasses = {
    "1": "bg-red-600 text-white", // Vote
    "4": "bg-yellow-500 text-red-900", // Registration
    "5": "rounded-full outline outline-1 outline-yellow-400 text-yellow-400 bg-transparent", // Candidate
    "6": "bg-red-700 text-white" // Admin
  };

  // Improved avatar component
  const renderAvatar = () => {
    const initials = name.split(' ').map(part => part[0]).join('').toUpperCase();
    return (
      <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center text-red-900 font-medium text-xs">
        {initials}
      </div>
    );
  };

  return (
    <div className="flex items-start gap-4">
      {renderAvatar()}
      <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent overflow */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap"> {/* Added flex-wrap */}
            <span className="text-white text-sm font-medium truncate">{name}</span>
            <span 
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${variantClasses[variant]}`}
            >
              {action}
            </span>
          </div>
          <p className="text-yellow-400 text-sm">{description}</p>
          <p className="text-orange-300 text-xs">{time}</p>
        </div>
      </div>
    </div>
  );
}