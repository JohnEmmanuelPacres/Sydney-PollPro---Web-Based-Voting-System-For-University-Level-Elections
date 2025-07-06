import React from 'react';
import Link from 'next/link';

interface SignInButtonProps {
  href: string;
  children: React.ReactNode;
}

const SignInButton: React.FC<SignInButtonProps> = ({ href, children }) => {
  return (
    <Link 
      href={href}
      className="inline-flex items-center justify-center px-4 py-4 min-w-[150px] rounded-full shadow-lg bg-gradient-to-br from-stone-600 to-orange-300 text-white text-lg md:text-xl font-semibold transition-all duration-300 hover:from-orange-400 hover:to-orange-500 hover:scale-105 hover:shadow-xl leading-tight"
    >
      {children}
    </Link>

  );
};

export default SignInButton; 