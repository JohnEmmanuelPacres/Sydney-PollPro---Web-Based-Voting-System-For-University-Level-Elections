import React from "react";
import ActivityItem from "./VoteDash_ActivityItem";

type ActivityVariant = "1" | "4" | "5" | "6";

interface Activity {
  name: string;
  action: string;
  description: string;
  time: string;
  variant: ActivityVariant;
}

export default function RecentActivity() {
  const activities: Activity[] = [
    {
      name: "Sarah Johnson",
      action: "Vote",
      description: "voted in Student Government President election",
      time: "2 minutes ago",
      variant: "1"
    },
    {
      name: "Mike Chen",
      action: "Registration",
      description: "registered as a new voter",
      time: "5 minutes ago",
      variant: "4"
    },
    {
      name: "Emily Rodriguez",
      action: "Candidate",
      description: "submitted candidacy for Faculty Senate",
      time: "12 minutes ago",
      variant: "5"
    },
    {
      name: "David Kim",
      action: "Vote",
      description: "voted in Dormitory Council Elections",
      time: "18 minutes ago",
      variant: "1"
    },
    {
      name: "Admin User",
      action: "Admin",
      description: "created new election: Graduate Student Representative",
      time: "1 hour ago",
      variant: "6"
    }
  ];

  return (
    <div className="w-full bg-rose-950 rounded-lg shadow-md border border-yellow-400 p-6">
      <div className="border-b border-yellow-500 pb-6 mb-6">
        <h3 className="text-white text-2xl font-semibold font-['Geist'] mb-1">
          Recent Activity
        </h3>
        <p className="text-yellow-400 text-sm font-normal font-['Geist']">
          Latest actions across the voting system
        </p>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </div>
    </div>
  );
}