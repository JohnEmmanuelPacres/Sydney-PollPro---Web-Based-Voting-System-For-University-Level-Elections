import React from 'react';
import NavButton from './NavButton';
import SignInButton from './SignInButton';

const AuthPageHeader: React.FC = () => {
  return (
    <header className="w-full h-24 md:h-32 left-0 top-0 absolute bg-red-900 shadow-[0px_5px_4px_0px_rgba(0,0,0,0.50)] overflow-hidden">
      <nav className="px-2 md:px-5 py-2 md:py-2.5 left-1/2 transform -translate-x-1/2 md:left-[1075px] md:transform-none top-[37px] absolute inline-flex justify-start items-center gap-4 md:gap-11">
        <NavButton href="/">Home</NavButton>
        <NavButton href="/Election_Results">Results</NavButton>
        <NavButton href="/dashboard">Updates</NavButton>
        <NavButton href="/dashboard">About</NavButton>
      </nav>
      

      <h1 className="left-[213px] top-[35px] absolute justify-center text-white text-3xl md:text-4xl lg:text-5xl font-normal font-['Abyssinica_SIL'] leading-tight md:leading-[67.50px]">
        UniVote
      </h1>
      <img 
        className="w-20 h-20 md:w-28 md:h-28 left-[38px] top-[7px] absolute" 
        src="/Website Logo.png" 
        alt="UniVote Logo" 
      />
    </header>
  );
};

export default AuthPageHeader; 