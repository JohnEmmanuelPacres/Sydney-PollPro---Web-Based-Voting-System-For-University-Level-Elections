'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import NavButton from './NavButton';
import SignInButton from './SignInButton';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage =
    pathname === '/User_RegxLogin' ||
    pathname === '/User_RegxLogin/LoginAdmin';

  return (
    <header className="w-full h-24 md:h-32 fixed top-0 z-50 bg-red-950 shadow-[0px_5px_4px_0px_rgba(0,0,0,0.50)]">
      <div className="w-full max-w-screen-xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo and Title - Left Side */}
        <div className="flex items-center flex-shrink-0 gap-4">
          <img
            className="w-20 h-20 md:w-28 md:h-28 cursor-pointer shrink-0"
            src="/Website Logo.png"
            alt="UniVote Logo"
            onClick={() => router.push('/')}
          />
          <h1
            className="text-white text-3xl md:text-4xl lg:text-5xl font-normal font-['Abyssinica_SIL'] cursor-pointer"
            onClick={() => router.push('/')}
          >
            UniVote
          </h1>
        </div>

        {/* Desktop Navigation - Right Side */}
        <div className="hidden md:flex items-center gap-11">
          <nav className="flex items-center gap-4 md:gap-11">
            <NavButton href="/">Home</NavButton>
            <NavButton href="/Election_Results">Results</NavButton>
            <NavButton href="/Update_Section">Updates</NavButton>
            <NavButton href="/About">About</NavButton>
            {!isLoginPage && (
              <SignInButton href="/User_RegxLogin">SIGN IN</SignInButton>
            )}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-24 left-0 right-0 bg-red-800 shadow-lg">
          <div className="flex flex-col space-y-4 p-6">
            <MobileNavButton href="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </MobileNavButton>
            <MobileNavButton
              href="/Election_Results"
              onClick={() => setIsMenuOpen(false)}
            >
              Results
            </MobileNavButton>
            <MobileNavButton
              href="/Update_Section"
              onClick={() => setIsMenuOpen(false)}
            >
              Updates
            </MobileNavButton>
            <MobileNavButton
              href="/About"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </MobileNavButton>
            {!isLoginPage && (
              <div className="pt-2">
                <MobileSignInButton href="/User_RegxLogin">
                  SIGN IN
                </MobileSignInButton>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// Mobile NavButton Component
const MobileNavButton: React.FC<{
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}> = ({ href, children, onClick }) => {
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

// Mobile Sign In Button
const MobileSignInButton: React.FC<{
  href: string;
  children: React.ReactNode;
}> = ({ href, children }) => (
  <Link
    href={href}
    className="px-6 py-3.5 bg-gradient-to-br from-stone-600 to-orange-300 rounded-full shadow-lg text-white text-xl font-normal font-['Jaldi'] cursor-pointer transition-all duration-300 hover:from-orange-400 hover:to-orange-500 hover:scale-105 hover:shadow-xl inline-flex justify-center items-center gap-2"
  >
    <span className="text-white text-sm font-normal font-['Jaldi'] leading-tight">
      {children}
    </span>
  </Link>
);

export default Header;
