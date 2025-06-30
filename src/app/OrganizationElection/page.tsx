"use client";

import VoteNow from '@/app/components/VoteNow';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function OrganizationElectionPage() {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [departmentOrg, setDepartmentOrg] = useState<string | null>(null);
  const [courseYear, setCourseYear] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVoterProfile() {
      setLoading(true);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('Supabase user:', user, userError);
        if (!user?.email) throw new Error('No user email found');
        const { data: profile, error } = await supabase
          .from('voter_profiles')
          .select('*')
          .eq('email', user.email)
          .single();
        console.log('Fetched profile:', profile, 'Error:', error);
        if (profile) {
          console.log('department_org raw:', profile.department_org, 'trimmed:', profile.department_org?.trim());
        }
        setDepartmentOrg(profile?.department_org ? profile.department_org.trim() : null);
        setCourseYear(profile?.course_year || null);
        setOrgId(profile?.org_id || null);
        console.log('Set values:', {
          departmentOrg: profile?.department_org,
          courseYear: profile?.course_year,
          orgId: profile?.org_id
        });
      } catch (err) {
        setOrgId(null);
        setDepartmentOrg(null);
        setCourseYear(null);
        console.error('Error fetching voter profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchVoterProfile();
  }, []);

  if (loading) return <div className="text-white text-xl">Loading organization election...</div>;
  if (!departmentOrg) return <div className="text-white text-xl">Could not load your organization election. Please contact support.</div>;

  return <VoteNow department_org={departmentOrg || undefined} />;
} 