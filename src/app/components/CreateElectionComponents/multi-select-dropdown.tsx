"use client"
import { useState, useRef, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface OrganizationOption {
  name: string;
  category: string;
}

interface MultiSelectDropdownProps {
  options: OrganizationOption[];
  categories: string[];
  selectedOptions: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelectDropdown({
  options,
  categories,
  selectedOptions,
  onSelectionChange,
  placeholder = "Select options",
  label,
  className = "",
  disabled = false
}: MultiSelectDropdownProps) {
  // Ensure selectedOptions is always an array
  const safeSelectedOptions = selectedOptions || [];
  
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter options by category and search
  const filteredOptions = useMemo(() => {
    return options.filter(option => {
      const matchesCategory = selectedCategory === "All" || option.category === selectedCategory;
      const matchesSearch = option.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, options]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
        setHighlightedIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  // Keyboard navigation
  const handleDropdownKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!dropdownOpen) return
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0))
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1))
      e.preventDefault()
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      const option = filteredOptions[highlightedIndex]
      toggleOption(option)
      e.preventDefault()
    } else if (e.key === 'Escape') {
      setDropdownOpen(false)
      setHighlightedIndex(-1)
      e.preventDefault()
    }
  }

  const toggleOption = (option: OrganizationOption) => {
    const isSelected = safeSelectedOptions.includes(option.name)
    if (isSelected) {
      onSelectionChange(safeSelectedOptions.filter(item => item !== option.name))
    } else {
      onSelectionChange([...safeSelectedOptions, option.name])
    }
  }

  const removeOption = (option: string) => {
    onSelectionChange(safeSelectedOptions.filter(item => item !== option))
  }

  const inputClasses = "w-full h-[50px] rounded-[10px] bg-white border border-[#bcbec0] px-4 sm:px-6 text-base text-black"

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <div className="text-lg sm:text-xl mb-2 sm:mb-4 text-red-900">{label}</div>
      )}
      
      {/* Selected options display */}
      {safeSelectedOptions.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {safeSelectedOptions.map((option) => (
            <Badge
              key={option}
              variant="secondary"
              className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            >
              {option}
              <button
                onClick={() => removeOption(option)}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Dropdown trigger */}
      <motion.div
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        tabIndex={disabled ? -1 : 0}
        className={`${inputClasses} flex items-center justify-between cursor-pointer pr-3 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={() => !disabled && setDropdownOpen((open) => !open)}
        onKeyDown={disabled ? undefined : handleDropdownKeyDown}
        aria-haspopup="listbox"
        aria-expanded={dropdownOpen}
        aria-label="Select eligible organizations"
        aria-disabled={disabled}
      >
        <span className={`truncate ${safeSelectedOptions.length > 0 ? 'text-black' : 'text-gray-400'}`}>
          {safeSelectedOptions.length > 0 
            ? `${safeSelectedOptions.length} selected` 
            : placeholder
          }
        </span>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#bb8b1b] ml-2">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>

      {/* Dropdown content */}
      {dropdownOpen && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-0 mt-1 w-full bg-white border border-[#bcbec0] rounded-[10px] shadow-lg z-50 max-h-96 overflow-hidden"
          role="listbox"
        >
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search programs..."
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          
          {/* Category filter */}
          <div className="p-2 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
            {categories.map(category => (
              <button
                key={category}
                className={`mx-1 px-3 py-1 rounded-full text-sm ${
                  selectedCategory === category 
                    ? 'bg-[#bb8b1b] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Options list */}
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => (
                <motion.div
                  key={option.name}
                  whileHover={{ scale: 1.02 }}
                  className={`px-4 sm:px-6 py-2 cursor-pointer text-sm sm:text-base text-black hover:bg-[#fac36b] hover:text-white transition-colors ${
                    safeSelectedOptions.includes(option.name) ? 'bg-[#fac36b] text-white' : ''
                  } ${highlightedIndex === idx ? 'bg-[#bb8b1b] text-white' : ''}`}
                  onClick={() => toggleOption(option)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  role="option"
                  aria-selected={safeSelectedOptions.includes(option.name)}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.name}</span>
                    {safeSelectedOptions.includes(option.name) && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500 text-center">
                No programs found matching your search
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
} 