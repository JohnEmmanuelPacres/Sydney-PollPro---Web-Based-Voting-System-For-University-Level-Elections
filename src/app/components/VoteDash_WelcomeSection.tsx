// components/VoteDash_WelcomeSection.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { prettifyFirstName } from "@/utils/emailUtils";

export default function WelcomeSection() {
  const [name, setName] = useState({ first: "", last: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchName() {
      setLoading(true);
      setError("");
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (user?.email) {
          const { data, error: profileError } = await supabase
            .from('voter_profiles')
            .select('first_name, last_name')
            .eq('email', user.email)
            .single();
          if (profileError) throw profileError;
          if (data) {
            setName({ first: data.first_name, last: data.last_name });
          }
        }
      } catch (err: any) {
        setError("Could not load voter name");
      } finally {
        setLoading(false);
      }
    }
    fetchName();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-8 relative mt-10">
      <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold font-['Baloo_2'] mb-6">
        {loading ? "Loading..." : error ? error : `Welcome, ${prettifyFirstName(name.first)} ${name.last}`}
      </h1>
      <button 
        className="bg-green-800 hover:bg-green-700 text-white text-lg font-semibold py-3 px-8 rounded-md flex items-center gap-2 transition-colors duration-300"
      >
        <span className="inline-flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12L12 8M12 8L8 4M12 8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        VOTE NOW
      </button>
    </div>
  );
}