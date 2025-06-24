import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon?: string;
}

export default function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <div className="w-full max-w-sm h-64 p-6 bg-black/20 rounded-lg border-4 border-orange-400 flex flex-col justify-between items-start transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-400/20">
      {icon && (
        <div className="text-3xl mb-2">
          {icon}
        </div>
      )}
      <h3 className="text-white text-2xl font-bold font-['Baloo_2']">
        {title}
      </h3>
      <div className="w-full text-center my-4">
        <p className="text-white text-5xl font-bold font-['Baloo_2']">
          {value}
        </p>
      </div>
      <p className="text-zinc-400 text-xl font-normal font-['Inter']">
        {description}
      </p>
    </div>
  );
}