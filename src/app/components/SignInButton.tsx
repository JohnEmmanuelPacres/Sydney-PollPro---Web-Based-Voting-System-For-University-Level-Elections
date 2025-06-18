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
      className="w-24 md:w-32 px-3 md:px-6 py-2.5 md:py-3.5 left-[500px] top-[-5px] absolute bg-gradient-to-br from-stone-600 to-orange-300 rounded-[999px] shadow-[1px_2px_6px_0px_rgba(0,0,0,0.40)] shadow-[2px_4px_18px_0px_rgba(0,0,0,0.20)] shadow-[-1px_-2px_6px_0px_rgba(250,195,107,0.40)] shadow-[-2px_-4px_18px_0px_rgba(250,195,107,0.10)] outline outline-[3px] outline-offset-[-3px] outline-orange-300 inline-flex justify-center items-center gap-2 transition-all duration-300 ease-in-out hover:scale-105"
    >
      <span className="justify-center text-white text-sm md:text-lg lg:text-xl font-normal font-['Jaldi'] leading-tight md:leading-loose">
        {children}
      </span>
    </Link>
  );
};

export default SignInButton; 