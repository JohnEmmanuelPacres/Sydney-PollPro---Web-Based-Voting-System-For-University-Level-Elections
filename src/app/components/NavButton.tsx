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
      className="text-white text-xl font-medium font-['Inter'] cursor-pointer transition-all duration-300 hover:text-orange-300 relative group"
    >
      {children}
      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-300 transition-all duration-300 group-hover:w-full"></span>
    </button>
  );
};

export default NavButton;