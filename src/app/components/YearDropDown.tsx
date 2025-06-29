'use client';
import { useState, useEffect } from 'react';

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

interface YearDropdownProps {
  completedElections: CompletedElection[];
  onFilterChange: (year: string) => void;
}

const YearDropdown: React.FC<YearDropdownProps> = ({ completedElections, onFilterChange }) => {
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  // Extract unique years from completed elections (both start and end dates)
  useEffect(() => {
    const years = new Set<string>();
    completedElections.forEach(election => {
      const startYear = new Date(election.start_date).getFullYear().toString();
      const endYear = new Date(election.end_date).getFullYear().toString();
      years.add(startYear);
      years.add(endYear);
    });
    
    const sortedYears = Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
    setAvailableYears(['All Years', ...sortedYears]);
  }, [completedElections]);

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setOpen(false);
    onFilterChange(year);
  };

  return (
    <div className="relative">
      {/* Button container with absolute position */}
      <div className="absolute top-[696px] left-[1159px] w-[106px] h-[34px] bg-[#fdf1f1] rounded-[6px] border border-[#00000020] shadow-sm flex items-center justify-start px-[14px]">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full h-full text-black text-sm font-bold"
        >
          <span>{selectedYear}</span>
          <svg
            className="w-[10px] h-[10px] ml-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* Dropdown list */}
      {open && (
        <ul className="absolute top-[734px] left-[1159px] w-[106px] bg-[#fdf1f1] border border-[#ddd] rounded-lg shadow z-10 text-black max-h-[200px] overflow-y-auto">
          {availableYears.map((year) => (
            <li
              key={year}
              onClick={() => handleYearSelect(year)}
              className="px-3 py-1 text-sm hover:bg-[#e8dcdc] cursor-pointer"
            >
              {year}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default YearDropdown;
