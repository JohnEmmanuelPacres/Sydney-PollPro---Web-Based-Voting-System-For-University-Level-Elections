import React from 'react';
import { useRouter } from 'next/navigation';

interface NavButtonProps {
  children: React.ReactNode;
  href: string;
}

const NavButton: React.FC<NavButtonProps> = ({ children, href }) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className="text-white text-sm md:text-lg lg:text-xl font-medium font-['Inter'] leading-tight md:leading-loose transition-all duration-300 ease-in-out transform-gpu hover:text-yellow-400 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] hover:scale-105 cursor-pointer"
    >
      {children}
    </button>
  );
};

export default NavButton;