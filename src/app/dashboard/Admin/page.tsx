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
        const now = new Date().toISOString();
        const upcomingOrOngoing = elections.find((e: Election) =>
          e.start_date <= now && e.end_date >= now || e.start_date > now
        );

        if (upcomingOrOngoing) setActiveElection(upcomingOrOngoing);
      } catch (err: any) {
        console.error('Election loading error:', err);
        setError('Failed to load elections. Please try again later.');
      }
    };

    fetchOrgIdAndElection();
  }, [searchParams, setAdministeredOrg]);

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

      {/* Review Elections Title */}
      <div className="absolute top-[650px] left-1/2 -translate-x-[calc(1130px/2)] text-[48px] font-semibold tracking-[-0.02em] w-[390px]">
        Review Elections
      </div>

      {/* Review Elections Panel */}
      <div className="absolute top-[750px] left-[100px] w-[1165px] h-[666px] rounded-[20px] bg-[#fef2f2] border-[3px] border-[rgba(254,242,242,0.96)] flex flex-col items-center justify-center px-[14px] pb-4 gap-4 text-[34px] text-black font-baloo">
        <ReviewElectionPanel />
        <ReviewElectionPanel />
        <ReviewElectionPanel />
      </div>

      {/* Year Dropdown */}
      <YearDropdown />

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

      {/* Decorative Bar */}
      <div className="absolute top-[696px] left-[665px] w-[470px] h-[34px] bg-[#fef2f2] rounded-[24px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]" />
    </div>
  );
};

export default AdminDashboardNoSession;
