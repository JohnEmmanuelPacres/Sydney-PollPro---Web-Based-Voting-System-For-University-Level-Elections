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
      className = "px-8 py-6 bg-gradient-to-br from-stone-600 to-orange-300 rounded-full shadow-lg text-white text-xl font-normal font-['Jaldi'] cursor-pointer transition-all duration-300 hover:from-orange-400 hover:to-orange-500 hover:scale-105 hover:shadow-xl min-w-[200px]"
    >
      <span className="justify-center text-white text-base md:text-lg lg:text-xl font-normal font-semibold font-['Inter'] leading-tight md:leading-loose">
        {children}
      </span>
    </Link>
  );
};

export default SignInButton; 