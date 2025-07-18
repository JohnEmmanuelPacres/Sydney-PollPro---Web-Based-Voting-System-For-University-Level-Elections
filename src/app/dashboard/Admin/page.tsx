'use client';

import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAdminOrg } from './AdminedOrgContext';
import AdminHeader from '../../components/AdminHeader';
import ReviewElectionPanel from '../../components/ReviewElections';
import CreateElectionSection from '../../components/CreateElectionSection';
import YearDropdown from '../../components/YearDropDown';
import SearchBar from '../../components/SearchBar';
import ElectionStatusBar from '../../components/ElectionStatusBar';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Election {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  allow_abstain: boolean;
  is_uni_level: boolean;
  org_id: string;
}

const AdminDashboardNoSession = () => {
  const [activeElection, setActiveElection] = useState<Election | null>(null);
  const [completedElections, setCompletedElections] = useState<Election[]>([]);
  const [filteredElections, setFilteredElections] = useState<Election[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [error, setError] = useState<string | null>(null);
  const [showResignDialog, setShowResignDialog] = useState(false);
  const [resignPassword, setResignPassword] = useState('');
  const [resignError, setResignError] = useState<string | null>(null);
  const [resignLoading, setResignLoading] = useState(false);
  const [showResignPassword, setShowResignPassword] = useState(false);
  const searchParams = useSearchParams();
  const { setAdministeredOrg, administeredOrg } = useAdminOrg();
  const router = useRouter();
  const paramAdminOrg = searchParams.get('administered_Org');
  const effectiveAdminOrg = paramAdminOrg || administeredOrg;
  
  useEffect(() => {
    if (paramAdminOrg) setAdministeredOrg(paramAdminOrg);

    const fetchOrgIdAndElection = async () => {
      try {
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('id')
          .eq('organization_name', effectiveAdminOrg || '')
          .single();

        if (orgError || !org) {
          setError('Organization not found. Administered org: ' + effectiveAdminOrg);
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
  }, [searchParams, setAdministeredOrg, administeredOrg]);

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
          (election.is_uni_level ?? false).toString().toLowerCase().includes(searchLower) ||
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

  const handleResign = async () => {
    setResignError(null);
    setResignLoading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user || !user.email) {
        setResignError('User not found.');
        setResignLoading(false);
        return;
      }
      // Re-authenticate
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: resignPassword,
      });
      if (signInError) {
        setResignError('Incorrect password. Please try again.');
        setResignLoading(false);
        return;
      }
      // Delete all posts by this admin first
      const { error: postsDeleteError } = await supabase
        .from('posts')
        .delete()
        .eq('admin_id', user.id);
      if (postsDeleteError) {
        console.error('Failed to delete posts for admin:', postsDeleteError);
        setResignError('Failed to delete posts for admin: ' + (postsDeleteError.message || JSON.stringify(postsDeleteError)));
        setResignLoading(false);
        return;
      }
      // Log values before delete
      console.log('Attempting to delete admin profile:', { email: user.email, effectiveAdminOrg });
      // Delete from admin_profiles
      const { error: profileError } = await supabase
        .from('admin_profiles')
        .delete()
        .eq('email', user.email)
        .eq('administered_org', effectiveAdminOrg);
      if (profileError) {
        console.error('Failed to remove admin profile:', profileError);
        setResignError('Failed to remove admin profile: ' + (profileError.message || JSON.stringify(profileError)));
        setResignLoading(false);
        return;
      }
      // Delete user account via API route
      const res = await fetch('/api/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResignError('Failed to delete user account: ' + (data.error || 'Unknown error'));
        setResignLoading(false);
        return;
      }
      setShowResignDialog(false);
      setResignPassword('');
      setResignLoading(false);
      // Redirect to login or home
      router.push('/User_RegxLogin');
    } catch (err) {
      console.error('Unexpected error in handleResign:', err);
      setResignError('Unexpected error. Please try again.');
      setResignLoading(false);
    }
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
            <div className="flex-1 overflow-y-auto pl-0 md:pl-4 pr-0 md:pr-2 space-y-4 flex flex-col items-center"
                 style={{ maxHeight: '600px', minHeight: '0', overflowY: filteredElections.length > 3 ? 'auto' : 'visible' }}
            >
              <ReviewElectionPanel 
                completedElections={filteredElections.slice(0, 3)} 
                totalCompletedElections={completedElections.length}
              />
              {filteredElections.length > 3 && (
                <div className="text-center w-full text-base text-gray-500 mt-2">Scroll to see more completed elections</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resign Feature Below Completed Elections */}
      <div className="w-full flex flex-col items-center justify-center mt-8 mb-8">
        <Button className="bg-red-800 hover:bg-red-900 text-white font-bold px-8 py-3 rounded-lg" onClick={() => setShowResignDialog(true)}>
          Resign as Admin
        </Button>
      </div>
      <Dialog open={showResignDialog} onOpenChange={setShowResignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-900">Confirm Resignation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-black">Are you sure you want to resign as admin for <span className="font-bold">{administeredOrg}</span>? This action is irreversible and will delete your admin account.</p>
            <p className="text-black">Please enter your password to confirm:</p>
            <div className="relative">
              <input
                type={showResignPassword ? 'text' : 'password'}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black pr-10"
                placeholder="Enter your password"
                value={resignPassword}
                onChange={e => setResignPassword(e.target.value)}
                disabled={resignLoading}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 focus:outline-none"
                onClick={() => setShowResignPassword(v => !v)}
                tabIndex={-1}
              >
                {showResignPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m2.1-2.1A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.22-1.125 4.575m-2.1 2.1A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c1.657 0 3.22.403 4.575 1.125m2.1 2.1A9.956 9.956 0 0121 12c0 1.657-.403 3.22-1.125 4.575m-2.1 2.1A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575" /></svg>
                )}
              </button>
            </div>
            {resignError && <div className="text-red-600 text-sm">{resignError}</div>}
            <div className="flex gap-3 mt-4">
              <Button onClick={handleResign} className="flex-1 bg-red-700 hover:bg-red-900 text-white" disabled={resignLoading || !resignPassword}>
                {resignLoading ? 'Resigning...' : 'Confirm Resignation'}
              </Button>
              <Button onClick={() => setShowResignDialog(false)} className="flex-1 bg-gray-300 text-black" type="button" disabled={resignLoading}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
