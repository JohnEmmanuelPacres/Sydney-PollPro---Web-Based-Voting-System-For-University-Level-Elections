import React from 'react';

interface NavButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ children, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="text-white text-sm md:text-lg lg:text-xl font-medium font-['Inter'] leading-tight md:leading-loose transition-all duration-300 ease-in-out transform-gpu hover:text-yellow-400 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] hover:scale-105 cursor-pointer"
    >
      {children}
    </button>
  );
};

export default NavButton; 