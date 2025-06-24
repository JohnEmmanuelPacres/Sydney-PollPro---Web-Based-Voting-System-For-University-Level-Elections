'use client';
import { useState } from 'react';

const YearDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('Year');
  const years = ['2023', '2024', '2025', '2026', '2027'];

  return (
    <div className="relative">
      {/* Button container with absolute position */}
      <div className="absolute top-[696px] left-[1159px] w-[106px] h-[34px] bg-[#fdf1f1] rounded-[6px] border border-[#00000020] shadow-sm flex items-center justify-start px-[14px]">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full h-full text-black text-sm font-bold"
        >
          <span>Year</span>
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
        <ul className="absolute top-[734px] left-[1159px] w-[106px] bg-[#fdf1f1] border border-[#ddd] rounded-lg shadow z-10 text-black">
          {years.map((year) => (
            <li
              key={year}
              onClick={() => {
                setSelectedYear(year);
                setOpen(false);
              }}
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
