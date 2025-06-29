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
        applyFilters('All Years', '');

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
    <div className="relative w-full min-h-[1717px] bg-[#52100d] text-left text-[20px] text-[#fef2f2] font-inter overflow-hidden">
      <AdminHeader />

      {/* Powered by Section */}
      <div className="absolute top-[184px] left-[269px] w-[827px] flex flex-col items-center justify-center text-center text-[32px]">
        <div className="w-full font-black h-[55px]">Powered by:</div>
        <div
          className="w-full font-black text-[128px] mt-[-24px] leading-none"
          style={{
            textShadow:
              '5px 0 0 #5d0404, 0 5px 0 #5d0404, -5px 0 0 #5d0404, 0 -5px 0 #5d0404',
          }}
        >
          Sydney Polls
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-[400px] left-1/2 transform -translate-x-1/2 text-red-300 text-xl">
          {error}
        </div>
      )}

      {/* Review Elections Section - Show if there are completed elections */}
      {completedElections.length > 0 ? (
        <>
          {/* Review Elections Title */}
          <div className="absolute top-[650px] left-1/2 -translate-x-[calc(1130px/2)] text-[48px] font-semibold tracking-[-0.02em] w-[390px]">
            Review Elections
          </div>

          {/* Review Elections Panel - Scrollable Container */}
          <div className="absolute top-[750px] left-[100px] w-[1165px] h-[666px] rounded-[20px] bg-[#fef2f2] border-[3px] border-[rgba(254,242,242,0.96)] flex flex-col px-[20px] py-6 text-[34px] text-black font-baloo overflow-hidden">
            <div className="flex-1 overflow-y-auto pl-4 pr-2 space-y-4">
              <ReviewElectionPanel 
                completedElections={filteredElections} 
                totalCompletedElections={completedElections.length}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* No Completed Elections Message */}
          <div className="absolute top-[650px] left-1/2 -translate-x-[calc(1130px/2)] text-[48px] font-semibold tracking-[-0.02em] w-[390px]">
            Review Elections
          </div>
          
          <div className="absolute top-[750px] left-[100px] w-[1165px] h-[666px] rounded-[20px] bg-[#fef2f2] border-[3px] border-[rgba(254,242,242,0.96)] flex flex-col items-center justify-center px-[14px] pb-4 gap-4 text-[34px] text-black font-baloo">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="text-[64px] text-gray-400 mb-4">
                📊
              </div>
              <div className="text-[32px] font-semibold text-gray-600">
                No Completed Elections Yet
              </div>
              <div className="text-[20px] text-gray-500 max-w-[600px] leading-relaxed">
                There are currently no completed elections to review. 
                Once elections are finished, they will appear here for your review and analysis.
              </div>
              <div className="text-[16px] text-gray-400 mt-4">
                Create and manage elections to get started!
              </div>
            </div>
          </div>
        </>
      )}

      {/* Year Dropdown */}
      <YearDropdown 
        completedElections={completedElections}
        onFilterChange={handleYearFilterChange}
      />

      {/* Search Bar */}
      <SearchBar onSearchChange={handleSearchChange} />

      {/* Bottom Bar */}
      <div className="absolute w-full top-[1561px] left-0 h-[156px] bg-[#5c1110] shadow-[0_-5px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="absolute top-[39px] left-[312px] flex flex-row items-center justify-center">
          <div className="w-[57px] h-[30px] relative" />
        </div>
      </div>

      {/* Create or Status Section */}
      {activeElection ? (
        <ElectionStatusBar election={activeElection}/>
      ) : (
        <CreateElectionSection />
      )}
    </div>
  );
};

export default AdminDashboardNoSession;
