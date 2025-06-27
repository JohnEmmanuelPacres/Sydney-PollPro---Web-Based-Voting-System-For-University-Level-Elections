'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NavButton from './NavButton';
import { supabase } from '@/utils/supabaseClient';
import { useAdminOrg } from '../dashboard/Admin/AdminedOrgContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { administeredOrg } = useAdminOrg();

  const handleLogout = async () => {
      try {
        await supabase.auth.signOut();
        router.push('/User_RegxLogin');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

  return (
    <header className="w-full h-24 md:h-32 fixed top-0 z-50 bg-[#5C1110] shadow-[0px_5px_4px_0px_rgba(0,0,0,0.50)]">
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


        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex flex-grow justify-center items-center">
          <nav className="px-2 md:px-5 py-2 md:py-2.5 left-1/2 transform -translate-x-1/2 md:left-[900px] md:transform-none top-[37px] absolute inline-flex justify-start items-center gap-4 md:gap-11">
            <NavButton href={`/dashboard/Admin?administered_Org=${administeredOrg}`}>Home</NavButton>
            <NavButton href="/Candidates">Candidates</NavButton>
            <NavButton href="/Election_Results">Results</NavButton>
            <NavButton href="/Updates">Update</NavButton>
            <button
              onClick={handleLogout}
              className="w-24 md:w-32 px-3 md:px-6 py-2.5 md:py-3.5 bg-gradient-to-br from-stone-600 to-orange-300 rounded-[999px] shadow-[1px_2px_6px_0px_rgba(0,0,0,0.40)] shadow-[2px_4px_18px_0px_rgba(0,0,0,0.20)] shadow-[-1px_-2px_6px_0px_rgba(250,195,107,0.40)] shadow-[-2px_-4px_18px_0px_rgba(250,195,107,0.10)] outline outline-[3px] outline-offset-[-3px] outline-orange-300 inline-flex justify-center items-center gap-2 transition-all duration-300 ease-in-out hover:scale-105"
            >
              <span className="justify-center text-white text-sm font-bold font-['Jaldi Bold'] leading-tight">
                LOG OUT
              </span>
            </button>
          </nav>
        </div>

        {/* Mobile Menu Button - Right Side */}
        <div className="md:hidden flex items-center gap-4">
          <MobileSignInButton href="/User_RegxLogin">SIGN IN</MobileSignInButton>
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
        <div className="md:hidden absolute top-24 left-0 right-0 bg-red-800 shadow-lg">
          <div className="flex flex-col space-y-4 p-6">
            <MobileNavButton href={`/dashboard/Admin?administered_Org=${administeredOrg}`} onClick={() => setIsMenuOpen(false)}>Home</MobileNavButton>
            <MobileNavButton href="/Candidates" onClick={() => setIsMenuOpen(false)}>Candidates</MobileNavButton>
            <MobileNavButton href="/Election_Results" onClick={() => setIsMenuOpen(false)}>Results</MobileNavButton>
            <MobileNavButton href="/Updates" onClick={() => setIsMenuOpen(false)}>Updates</MobileNavButton>
            <MobileNavButton href="/About" onClick={() => setIsMenuOpen(false)}>About</MobileNavButton>
          </div>
        </div>
      )}
    </header>
  );
};

// Mobile NavButton component
const MobileNavButton: React.FC<{ href: string; children: React.ReactNode; onClick: () => void }> = ({ 
  href, 
  children, 
  onClick 
}) => {
  const router = useRouter();
  
  return (
    <button
      onClick={() => {
        router.push(href);
        onClick();
      }}
      className="text-white text-lg font-medium font-['Inter'] w-full text-left px-4 py-3 transition-all duration-300 ease-in-out hover:text-yellow-400 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]"
    >
      {children}
    </button>
  );
};

// Mobile SignInButton
const MobileSignInButton: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link 
    href={href} 
    className="w-24 px-3 py-2 bg-gradient-to-br from-stone-600 to-orange-300 rounded-[999px] shadow-[1px_2px_6px_0px_rgba(0,0,0,0.40)] shadow-[2px_4px_18px_0px_rgba(0,0,0,0.20)] shadow-[-1px_-2px_6px_0px_rgba(250,195,107,0.40)] shadow-[-2px_-4px_18px_0px_rgba(250,195,107,0.10)] outline outline-[3px] outline-offset-[-3px] outline-orange-300 inline-flex justify-center items-center gap-2 transition-all duration-300 ease-in-out hover:scale-105"
  >
    <span className="justify-center text-white text-sm font-normal font-['Jaldi'] leading-tight">
      {children}
    </span>
  </Link>
);

export default Header;