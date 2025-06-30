// components/VoteDash_WelcomeSection.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { prettifyFirstName } from "@/utils/emailUtils";
import ElectionTypeModal from "./ElectionTypeModal";

export default function WelcomeSection() {
  const router = useRouter();
  const [name, setName] = useState<{ first: string; last: string; email?: string }>({ first: "", last: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orgId, setOrgId] = useState<string>('');

  useEffect(() => {
    async function fetchName() {
      setLoading(true);
      setError("");
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('Supabase user:', user, userError);
        if (userError) throw userError;
        if (user?.email) {
          const email = user.email.trim().toLowerCase();
          console.log('Querying for email:', email);
          const { data, error: profileError } = await supabase
            .from('voter_profiles')
            .select('first_name, last_name, email')
            .eq('email', email)
            .single();
          console.log('voter_profiles query result:', data, profileError);
          if (profileError) throw profileError;
          if (data && data.first_name && data.last_name) {
            setName({ first: data.first_name, last: data.last_name, email: data.email });
            setError("");
          } else {
            setName({ first: '', last: '', email: email });
            setError("No matching profile or missing name fields.");
          }
        } else {
          setName({ first: '', last: '', email: '' });
          setError("No user email found");
        }
      } catch (err: any) {
        setName({ first: '', last: '', email: '' });
        setError("Could not load voter name: " + (err?.message || err));
      } finally {
        setLoading(false);
      }
    }
    fetchName();
  }, []);

  const handleVoteNowClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectElectionType = (type: 'university' | 'organization') => {
    setIsModalOpen(false);
    if (type === 'university') {
      router.push('/UniversityElection');
    } else {
      router.push('/OrganizationElection');
    }
  };

  let welcomeText = "";
  if (loading) {
    welcomeText = "Loading...";
  } else if (name.first && name.last) {
    welcomeText = `Welcome, ${name.first} ${name.last}`;
  } else if (name.email) {
    welcomeText = `Welcome, ${name.email}`;
  } else {
    welcomeText = error || "Could not load voter name";
  }

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center text-center py-8 relative mt-10">
        <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold font-['Baloo_2'] mb-6">
          {welcomeText}
        </h1>
        
        {/* Redesigned VOTE NOW Button */}
        <div className="relative group">
          <button 
            onClick={handleVoteNowClick}
            className="relative bg-gradient-to-r from-red-900 to-stone-950 text-white text-xl md:text-2xl font-bold font-['Baloo_2'] py-4 px-12 rounded-lg border-4 border-orange-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-400/20 hover:border-orange-300 overflow-hidden"
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Button content */}
            <div className="relative flex items-center gap-3">
              <span className="inline-flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:animate-pulse">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="group-hover:text-orange-300 transition-colors duration-300">
                VOTE NOW
              </span>
            </div>
          </button>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-orange-400/30 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </div>
        
        {/* Subtitle */}
        <p className="text-orange-300 text-lg font-normal font-['Inter'] mt-4 opacity-80">
          Click to start your voting session
        </p>
      </div>

      <ElectionTypeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectElectionType={handleSelectElectionType}
      />
    </>
  );
}