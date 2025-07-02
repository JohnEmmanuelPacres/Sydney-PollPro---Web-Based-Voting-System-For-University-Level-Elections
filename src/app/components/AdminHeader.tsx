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
  const departmentOrg = useParams.get('department_org');

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
        className="text-white text-lg font-medium font-['Inter'] w-full text-left px-4 py-3 transition-all duration-300 ease-in-out hover:text-yellow-400 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]"
      >
        {children}
      </button>
    );
  };

  const MobileLogOutButton = () => (
    <button
      onClick={handleLogout}
      className="w-full px-6 py-3.5 bg-gradient-to-br from-stone-600 to-orange-300 rounded-full shadow-lg text-white text-xl font-normal font-['Jaldi'] cursor-pointer transition-all duration-300 hover:from-orange-400 hover:to-orange-500 hover:scale-105 hover:shadow-xl text-center"
    >
      LOG OUT
    </button>
  );

  return (
    <header className="w-full h-24 md:h-32 fixed top-0 z-50 bg-red-950 shadow-[0px_5px_4px_0px_rgba(0,0,0,0.50)]">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo and Title - Left Side */}
        <div className="flex items-center flex-shrink-0">
          <img 
            className="w-20 h-20 md:w-28 md:h-28 cursor-pointer" 
            src="/Website Logo.png" 
            alt="UniVote Logo" 
            onClick={() => router.push('/')}
          />
          <h1 
            className="text-white text-3xl md:text-4xl lg:text-5xl font-normal font-['Abyssinica_SIL'] ml-4 cursor-pointer"
            onClick={() => router.push('/')}
          >
            UniVote
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-grow justify-center items-center gap-11">
          <nav className="px-2 md:px-5 py-2 md:py-2.5 left-1/2 transform -translate-x-1/2 md:left-[900px] md:transform-none top-[37px] absolute inline-flex justify-start items-center gap-4 md:gap-11">
            <NavButton href={`/Voterdashboard?email=${encodeURIComponent(email || '')}${`&department_org=${encodeURIComponent(departmentOrg || '')}`}`}>Home</NavButton>
            <NavButton href={`/Candidates?department_org=${encodeURIComponent(departmentOrg || '')}`}>Candidates</NavButton>
            <NavButton href={`/Election_Results?department_org=${encodeURIComponent(departmentOrg || '')}`}>Results</NavButton>
            <NavButton href="/Update_Section">Updates</NavButton>
          </nav>
        </div>

        {/* Desktop Logout Button */}
        <div className="hidden md:block">
          <LogOutButton onClick={handleLogout}>LOGOUT</LogOutButton>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 ml-auto md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-24 left-0 right-0 bg-red-800 shadow-lg z-40">
          <div className="flex flex-col space-y-4 p-6">
            <NavButton href={`/Voterdashboard?email=${encodeURIComponent(email || '')}${`&department_org=${encodeURIComponent(departmentOrg || '')}`}`}>Home</NavButton>
            <MobileNavButton href={`/Candidates?department_org=${encodeURIComponent(departmentOrg || '')}`}>Candidates</MobileNavButton>
            <MobileNavButton href={`/Election_Results?department_org=${encodeURIComponent(departmentOrg || '')}`}>Results</MobileNavButton>
            <MobileNavButton href="/Update_Section">Updates</MobileNavButton>
            <div className="px-4 py-3">
              <LogOutButton onClick={handleLogout}>Log Out</LogOutButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;