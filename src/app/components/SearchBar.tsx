'use client';
import React, { useState } from 'react';

interface SearchBarProps {
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange, placeholder = "Search elections..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If input is empty, clear the active search
    if (!value.trim()) {
      setActiveSearch('');
      onSearchChange('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActiveSearch(searchTerm);
      onSearchChange(searchTerm);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setActiveSearch('');
    onSearchChange('');
  };

  return (
    <div className="relative">
      {/* Search Bar Container */}
      <div className="absolute top-[696px] left-[665px] w-[470px] h-[34px] bg-[#fef2f2] rounded-[24px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex items-center px-4">
        {/* Search Icon */}
        <svg
          className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-black text-sm font-medium outline-none placeholder-gray-500"
        />

        {/* Clear Button */}
        {(searchTerm || activeSearch) && (
          <button
            onClick={handleClearSearch}
            className="ml-2 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar; 