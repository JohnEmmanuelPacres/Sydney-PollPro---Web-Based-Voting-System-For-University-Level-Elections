"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Threads from './components/Threads';

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-full h-[1457px] relative bg-gradient-to-l from-yellow-600 to-red-800 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
    {/* Header */}
    <header className="w-full h-32 left-0 top-[-1px] absolute bg-red-900 shadow-[0px_5px_4px_0px_rgba(0,0,0,0.50)] overflow-hidden">
      <nav className="px-5 py-2.5 left-[641px] top-[35px] absolute inline-flex justify-start items-center gap-11">
        <button className="text-white text-xl font-medium font-['Inter'] leading-loose transition-all duration-300 ease-in-out transform-gpu hover:text-yellow-400 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] hover:scale-105 cursor-pointer">Home</button>
        <button className="text-white text-xl font-medium font-['Inter'] leading-loose transition-all duration-300 ease-in-out transform-gpu hover:text-yellow-400 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] hover:scale-105 cursor-pointer" onClick={() => router.push("/Election_Results")}>Results</button>
        <button className="text-white text-xl font-medium font-['Inter'] leading-loose transition-all duration-300 ease-in-out transform-gpu hover:text-yellow-400 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] hover:scale-105 cursor-pointer">Updates</button>
        <button className="text-white text-xl font-medium font-['Inter'] leading-loose transition-all duration-300 ease-in-out transform-gpu hover:text-yellow-400 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] hover:scale-105 cursor-pointer">About</button>
      </nav>
      <h1 className="left-[213px] top-[32px] absolute justify-center text-white text-5xl font-normal font-['Abyssinica_SIL'] leading-[67.50px]">UniVote</h1>
      <img className="w-28 h-28 left-[38px] top-[7px] absolute" src="/Website Logo.png" alt="UniVote Logo" />
      <Link href="/User_RegxLogin" className="w-32 px-6 py-3.5 left-[1180px] top-[32px] absolute bg-gradient-to-br from-stone-600 to-orange-300 rounded-[999px] shadow-[1px_2px_6px_0px_rgba(0,0,0,0.40)] shadow-[2px_4px_18px_0px_rgba(0,0,0,0.20)] shadow-[-1px_-2px_6px_0px_rgba(250,195,107,0.40)] shadow-[-2px_-4px_18px_0px_rgba(250,195,107,0.10)] outline outline-[3px] outline-offset-[-3px] outline-orange-300 inline-flex justify-center items-center gap-2 transition-all duration-300 ease-in-out hover:scale-105">
        <span className="justify-center text-white text-xl font-normal font-['Jaldi'] leading-loose">SIGN IN</span>
      </Link>
    </header>
  
    <h2 className="left-[266px] top-[222px] absolute justify-center text-white text-7xl font-normal font-['Baloo_2'] leading-[105px]">Secure Digital Voting Platform</h2>
    <p className="left-[146px] top-[409px] absolute justify-center text-stone-300 text-3xl font-normal font-['Baloo_2'] leading-10">Participate in university and departmental election transparently, securely, and accessibly.</p>
    <p className="left-[596px] top-[364px] absolute justify-center text-stone-300 text-3xl font-normal font-['Baloo_2'] leading-10">Your voice matters!</p>
  
    <section className="w-[1440px] px-20 left-0 top-[901px] absolute inline-flex flex-col justify-start items-start gap-2.5">
      <div className="self-stretch h-80 inline-flex justify-start items-start gap-6">
        <div className="px-7 py-14 bg-black/20 rounded-lg outline outline-4 outline-offset-[-4px] outline-orange-400 inline-flex flex-col justify-start items-start gap-1">
          <h3 className="w-80 justify-start text-stone-50 text-3xl font-['Baloo_2'] leading-10">Total Registered Voters</h3>
          <p className="w-80 h-20 text-center justify-start text-white text-5xl font-['Baloo_2'] leading-[81px]">2, 847</p>
          <p className="w-80 justify-center text-zinc-500 text-2xl font-normal font-['Inter'] leading-9">Active Student Voters</p>
        </div>
        <div className="px-7 py-14 bg-black/20 rounded-lg outline outline-4 outline-offset-[-4px] outline-orange-400 inline-flex flex-col justify-start items-start gap-1">
          <h3 className="w-80 justify-start text-stone-50 text-3xl font-['Baloo_2'] leading-10">Total Votes Cast</h3>
          <p className="w-80 h-20 text-center justify-start text-white text-5xl font-['Baloo_2'] leading-[81px]">847</p>
          <p className="w-80 justify-center text-zinc-500 text-2xl font-normal font-['Inter'] leading-9">Type of Election</p>
        </div>
        <div className="px-7 py-14 bg-black/20 rounded-lg outline outline-4 outline-offset-[-4px] outline-orange-400 inline-flex flex-col justify-start items-start gap-1">
          <h3 className="w-80 justify-start text-stone-50 text-3xl font-['Baloo_2'] leading-10">Avg. Participation</h3>
          <p className="w-80 h-20 text-center justify-start text-white text-5xl font-['Baloo_2'] leading-[81px]">25%</p>
          <p className="w-80 justify-center text-zinc-500 text-2xl font-normal font-['Inter'] leading-9">Student Engagement</p>
        </div>
      </div>
    </section>
  
    <h2 className="w-[703px] left-[38px] top-[749px] absolute justify-start text-white text-5xl font-semibold font-['Inter']">Current Election Stats</h2>
    
    <div className="w-[1440px] h-32 left-0 top-[543px] absolute bg-gradient-to-r from-red-900 to-stone-950 rounded-md shadow-[0px_7px_4px_0px_rgba(0,0,0,0.25)] outline outline-[3px] outline-offset-[-3px] outline-orange-400 overflow-hidden">
      <div style={{ width: '100%', height: '200px', position: 'relative', left: 30, bottom: 25 }}>
        <Threads
          amplitude={2}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>
      <p className="left-[22px] top-[66px] absolute justify-center text-white text-2xl font-normal font-['Baloo_Bhai_2'] leading-10">Session Status: </p>
      <p className="left-[22px] top-[25px] absolute justify-center text-white text-2xl font-normal font-['Baloo_Bhai_2'] leading-10">Voting Session:</p>
    </div>
  
    {/* Footer */}
    <footer className="w-full h-40 left-0 top-[1301px] absolute bg-red-900 shadow-[0px_-5px_4px_0px_rgba(0,0,0,0.50)] overflow-hidden">
      <div className="left-[312px] top-[39px] absolute inline-flex justify-center items-center gap-2.5" />
    </footer>
  </div>
  );
}