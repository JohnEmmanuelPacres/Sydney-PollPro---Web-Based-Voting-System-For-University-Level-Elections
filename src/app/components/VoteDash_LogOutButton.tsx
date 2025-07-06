import React from 'react';

interface LogOutButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const LogOutButton: React.FC<LogOutButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3.5 bg-gradient-to-br from-stone-600 to-orange-300 rounded-full shadow-lg text-white text-xl font-normal font-['Jaldi'] cursor-pointer transition-all duration-300 hover:from-orange-400 hover:to-orange-500 hover:scale-105 hover:shadow-xl"
    >
      <span className="text-white text-xl font-medium font-['Jaldi'] whitespace-nowrap">
        {children}
      </span>
    </button>
  );
};

export default LogOutButton;