import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import NavButton from './NavButton';
import LogOutButton from './VoteDash_LogOutButton';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const AdminHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const useParams = useSearchParams();
  const email = useParams.get('email');
  const administeredOrg = useParams.get('administered_Org'); //ayaw ni hilabta

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/User_RegxLogin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const MobileNavButton = ({ 
    href, 
    children 
  }: { 
    href: string; 
    children: React.ReactNode 
  }) => {
    return (
      <button
        onClick={() => {
          router.push(href);
          setIsMenuOpen(false);
        }}
        className="text-white text-base sm:text-lg md:text-xl font-medium font-['Inter'] w-full text-left px-3 py-2 sm:px-4 sm:py-3 transition-all duration-300 ease-in-out hover:text-yellow-400 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]"
      >
        {children}
      </button>
    );
  };

  return (
    <header className="w-full h-20 md:h-28 lg:h-32 fixed top-0 z-50 bg-red-950 shadow-[0px_5px_4px_0px_rgba(0,0,0,0.50)]">
      <div className="container mx-auto h-full px-2 md:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo and Title - Left Side */}
        <div className="flex items-center flex-shrink-0 gap-2 md:gap-4 lg:gap-6">
          <img 
            className="w-14 h-14 md:w-20 md:h-20 lg:w-28 lg:h-28 cursor-pointer" 
            src="/Website Logo.png" 
            alt="UniVote Logo" 
            onClick={() => router.push('/')} 
          />
          <h1 
            className="text-white text-2xl md:text-3xl lg:text-5xl font-normal font-['Abyssinica_SIL'] ml-2 md:ml-4 cursor-pointer whitespace-nowrap"
            onClick={() => router.push('/')}
          >
            UniVote
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-grow justify-center items-center gap-6 lg:gap-11">
          <nav className="px-2 md:px-5 py-2 md:py-2.5 left-1/2 transform -translate-x-1/2 md:left-[900px] md:transform-none top-[37px] absolute inline-flex justify-start items-center gap-3 md:gap-6 lg:gap-11">
            <NavButton href={`/dashboard/Admin?email=${encodeURIComponent(email || '')}${`&administered_Org=${encodeURIComponent(administeredOrg || '')}`}`}>Home</NavButton>
            <NavButton href={`/Candidates?administered_Org=${encodeURIComponent(administeredOrg || '')}`}>Candidates</NavButton>
            <NavButton href={`/Election_Results?administered_Org=${encodeURIComponent(administeredOrg || '')}`}>Results</NavButton>
            <NavButton href={`/dashboard/Admin/AdminUpdate_Section?administered_Org=${encodeURIComponent(administeredOrg || '')}`}>Updates</NavButton>
          </nav>
        </div>

        {/* Desktop Logout Button */}
        <div className="hidden md:block">
          <LogOutButton onClick={handleLogout}>LOGOUT</LogOutButton>
        </div>

        {/* Mobile/Tablet Menu Button */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 md:top-28 left-0 right-0 bg-red-800 shadow-lg z-40">
          <div className="flex flex-col space-y-2 sm:space-y-4 p-4 sm:p-6">
            <MobileNavButton href={`/dashboard/Admin?email=${encodeURIComponent(email || '')}${`&administered_Org=${encodeURIComponent(administeredOrg || '')}`}`}>Home</MobileNavButton>
            <MobileNavButton href={`/Candidates?administered_Org=${encodeURIComponent(administeredOrg || '')}`}>Candidates</MobileNavButton>
            <MobileNavButton href={`/Election_Results?administered_Org=${encodeURIComponent(administeredOrg || '')}`}>Results</MobileNavButton>
            <MobileNavButton href={`/dashboard/Admin/AdminUpdate_Section?administered_Org=${encodeURIComponent(administeredOrg || '')}`}>Updates</MobileNavButton>
            <div className="mt-2 sm:mt-4">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 sm:px-6 sm:py-3.5 bg-gradient-to-br from-stone-600 to-orange-300 rounded-full shadow-lg text-white text-lg sm:text-xl font-normal font-['Jaldi'] cursor-pointer transition-all duration-300 hover:from-orange-400 hover:to-orange-500 hover:scale-105 hover:shadow-xl text-center"
              >
                LOG OUT
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;