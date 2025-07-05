'use client';

import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useSearchParams } from 'next/navigation';
import { useAdminOrg } from './AdminedOrgContext';
import AdminHeader from '../../components/AdminHeader';
import ReviewElectionPanel from '../../components/ReviewElections';
import CreateElectionSection from '../../components/CreateElectionSection';
import YearDropdown from '../../components/YearDropDown';
import SearchBar from '../../components/SearchBar';
import ElectionStatusBar from '../../components/ElectionStatusBar';
import Footer from '../../components/Footer';

interface Election {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  allow_abstain: boolean;
  is_Uni_level: boolean;
  org_id: string;
}

const AdminDashboardNoSession: NextPage = () => {
  const [activeElection, setActiveElection] = useState<Election | null>(null);
  const [completedElections, setCompletedElections] = useState<Election[]>([]);
  const [filteredElections, setFilteredElections] = useState<Election[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { setAdministeredOrg } = useAdminOrg();

  useEffect(() => {
	const administeredOrg = searchParams.get('administered_Org');
	if (administeredOrg) setAdministeredOrg(administeredOrg);

    const fetchOrgIdAndElection = async () => {
      try {
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('id')
          .eq('organization_name', administeredOrg || '')
          .single();

        if (orgError || !org) {
          setError('Organization not found. Administered org: ' + administeredOrg);
          return;
        }

        const res = await fetch('/api/get-elections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orgID: org.id }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch elections');
        }

        const { elections } = await res.json();
        const now = new Date();
        
        // Filter for active elections (upcoming or ongoing)
        const upcomingOrOngoing = elections.find((e: Election) => {
          const startDate = new Date(e.start_date);
          const endDate = new Date(e.end_date);
          return (startDate <= now && endDate >= now) || startDate > now;
        });

        // Filter for completed elections
        const completed = elections.filter((e: Election) => {
          const endDate = new Date(e.end_date);
          return endDate < now;
        });

        if(!completed) setCompletedElections([])

        setCompletedElections(completed);
        setFilteredElections(completed);

        if (upcomingOrOngoing) setActiveElection(upcomingOrOngoing);
      } catch (err: any) {
        console.error('Election loading error:', err);
      }
    };

    fetchOrgIdAndElection();
  }, [searchParams, setAdministeredOrg]);

  // Combined filtering function
  const applyFilters = (yearFilter: string, searchFilter: string) => {
    let filtered = completedElections;

    // Apply year filter based on scheduled date/time
    if (yearFilter !== 'All Years') {
      filtered = filtered.filter(election => {
        const startDate = new Date(election.start_date);
        const endDate = new Date(election.end_date);
        const startYear = startDate.getFullYear().toString();
        const endYear = endDate.getFullYear().toString();
        
        // Include elections that start or end in the selected year
        return startYear === yearFilter || endYear === yearFilter;
      });
    }

    // Apply search filter only if there's a search term
    if (searchFilter.trim()) {
      const searchLower = searchFilter.toLowerCase();
      filtered = filtered.filter(election => {
        return (
          election.name.toLowerCase().includes(searchLower) ||
          (election.description && election.description.toLowerCase().includes(searchLower)) ||
          (election.is_Uni_level ?? false).toString().toLowerCase().includes(searchLower) ||
          election.allow_abstain.toString().toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredElections(filtered);
  };

  // Handle year filter change
  const handleYearFilterChange = (year: string) => {
    setSelectedYear(year);
    applyFilters(year, searchTerm);
  };

  // Handle search filter change (now only triggered on Enter or clear)
  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    applyFilters(selectedYear, search);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#52100d] text-left text-[20px] text-[#fef2f2] font-inter">
      <AdminHeader />

      {/* Powered by Section */}
      <div className="w-full flex flex-col items-center justify-center text-center text-[32px] mt-32 md:mt-44 px-2">
        <div className="w-full font-black h-[55px]">Powered by:</div>
        <div
          className="w-full font-black text-[48px] md:text-[128px] mt-0 md:mt-[-24px] leading-none"
          style={{
            textShadow:
              '5px 0 0 #5d0404, 0 5px 0 #5d0404, -5px 0 0 #5d0404, 0 -5px 0 #5d0404',
          }}
        >
          Sydney Polls
        </div>
      </div>

      {/* Election Status or Create Election Section */}
      <div className="w-full flex flex-col items-center justify-center gap-4 mt-8 px-2">
        {activeElection ? (
          <div className="w-full max-w-4xl">
            <ElectionStatusBar election={activeElection} />
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            <CreateElectionSection />
          </div>
        )}
      </div>

      {/* Review Elections Section - Show if there are completed elections */}
      <div className="w-full flex flex-col items-center justify-center mt-12 px-2 mb-16">
        <div className="w-full flex justify-center text-[32px] md:text-[48px] font-semibold tracking-[-0.02em] mb-4">
          Review Elections
        </div>
        <div className="w-full flex justify-center">
          <div className="w-full max-w-4xl rounded-[20px] bg-[#fef2f2] border-[3px] border-[rgba(254,242,242,0.96)] flex flex-col px-2 md:px-6 py-6 text-[20px] md:text-[34px] text-black font-baloo overflow-hidden">
            {/* Search and Year Dropdown inside card */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2 mb-6">
              <div className="w-full md:w-3/4 max-w-2xl">
                <SearchBar onSearchChange={handleSearchChange} />
              </div>
              <div className="w-full md:w-1/4 max-w-xs flex justify-center md:justify-end">
                <YearDropdown completedElections={completedElections} onFilterChange={handleYearFilterChange} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pl-0 md:pl-4 pr-0 md:pr-2 space-y-4 flex flex-col items-center">
              <ReviewElectionPanel 
                completedElections={filteredElections} 
                totalCompletedElections={completedElections.length}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full flex justify-center mt-8 text-red-300 text-xl">
          {error}
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminDashboardNoSession;
