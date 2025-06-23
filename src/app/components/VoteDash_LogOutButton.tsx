import React from 'react';

interface LogOutButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const LogOutButton: React.FC<LogOutButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-gradient-to-br from-stone-600 to-orange-300 rounded-full 
                 shadow-md hover:shadow-lg 
                 outline outline-2 outline-offset-[-3px] outline-orange-300 
                 flex justify-center items-center 
                 transition-all duration-300 ease-in-out 
                 hover:scale-105 active:scale-95
                 min-w-[8rem]"
    >
      <span className="text-white text-xl font-medium font-['Jaldi'] whitespace-nowrap">
        {children}
      </span>
    </button>
  );
};

export default LogOutButton;