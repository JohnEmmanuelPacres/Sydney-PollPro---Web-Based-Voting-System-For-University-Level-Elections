import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
      <div className="w-full h-[1457px] relative bg-gradient-to-l from-yellow-600 to-red-800 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
        {/* Header */}
        <div className="w-full h-32 left-0 top-[-1px] absolute bg-red-900 shadow-[0px_5px_4px_0px_rgba(0,0,0,0.50)] overflow-hidden">
          <div className="px-5 py-2.5 left-[641px] top-[47px] absolute inline-flex justify-start items-center gap-11">
            <div className="w-14 h-7 relative">
              <div className="left-0 top-0 absolute justify-center text-white text-xl font-medium font-['Inter'] leading-loose">Home</div>
            </div>
            <div className="w-16 h-7 relative">
              <div className="left-0 top-0 absolute justify-center text-white text-xl font-medium font-['Inter'] leading-loose">Results</div>
            </div>
            <div data-property-1="Updates" className="w-20 h-7 relative">
              <div className="left-0 top-0 absolute justify-center text-white text-xl font-medium font-['Inter'] leading-loose">Updates</div>
            </div>
            <div data-property-1="About" className="w-14 h-7 relative">
              <div className="left-0 top-0 absolute justify-center text-rose-50 text-xl font-medium font-['Inter'] leading-loose">About</div>
            </div>
          </div>
          <div className="left-[213px] top-[35px] absolute justify-center text-white text-5xl font-normal font-['Abyssinica_SIL'] leading-[67.50px]">UniVote</div>
          <img className="w-28 h-28 left-[38px] top-[7px] absolute" src="/Website Logo.png" />
          <Link href="/User_RegxLogin" className="w-32 px-6 py-3.5 left-[1230px] top-[41px] absolute bg-gradient-to-br from-stone-600 to-orange-300 rounded-[999px] shadow-[1px_2px_6px_0px_rgba(0,0,0,0.40)] shadow-[2px_4px_18px_0px_rgba(0,0,0,0.20)] shadow-[-1px_-2px_6px_0px_rgba(250,195,107,0.40)] shadow-[-2px_-4px_18px_0px_rgba(250,195,107,0.10)] outline outline-[3px] outline-offset-[-3px] outline-orange-300 inline-flex justify-center items-center gap-2 transition-all duration-300 ease-in-out hover:scale-105">
            <div className="justify-center text-white text-xl font-normal font-['Jaldi'] leading-loose">SIGN IN</div>
          </Link>
        </div>
        <div className="left-[266px] top-[222px] absolute justify-center text-white text-7xl font-normal font-['Baloo_2'] leading-[105px]">Secure Digital Voting Platform</div>
        <div className="left-[146px] top-[409px] absolute justify-center text-stone-300 text-3xl font-normal font-['Baloo_2'] leading-10">Participate in university and departmental election transparently, securely, and accessibly.</div>
        <div className="left-[596px] top-[364px] absolute justify-center text-stone-300 text-3xl font-normal font-['Baloo_2'] leading-10">Your voice matters!</div>
        <div className="w-[1440px] px-20 left-0 top-[901px] absolute inline-flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch h-80 inline-flex justify-start items-start gap-6">
            <div className="px-7 py-14 bg-black/20 rounded-lg outline outline-4 outline-offset-[-4px] outline-orange-400 inline-flex flex-col justify-start items-start gap-1">
              <div className="w-80 justify-start text-stone-50 text-3xl font-['Baloo_2'] leading-10">Total Registered Voters</div>
              <div className="w-80 h-20 text-center justify-start text-white text-5xl font-['Baloo_2'] leading-[81px]">2, 847</div>
              <div className="w-80 justify-center text-zinc-500 text-2xl font-normal font-['Inter'] leading-9">Active Student Voters</div>
            </div>
            <div className="px-7 py-14 bg-black/20 rounded-lg outline outline-4 outline-offset-[-4px] outline-orange-400 inline-flex flex-col justify-start items-start gap-1">
              <div className="w-80 justify-start text-stone-50 text-3xl font-['Baloo_2'] leading-10">Total Votes Cast</div>
              <div className="w-80 h-20 text-center justify-start text-white text-5xl font-['Baloo_2'] leading-[81px]">847</div>
              <div className="w-80 justify-center text-zinc-500 text-2xl font-normal font-['Inter'] leading-9">Type of Election</div>
            </div>
            <div className="px-7 py-14 bg-black/20 rounded-lg outline outline-4 outline-offset-[-4px] outline-orange-400 inline-flex flex-col justify-start items-start gap-1">
              <div className="w-80 justify-start text-stone-50 text-3xl font-['Baloo_2'] leading-10">Avg. Participation</div>
              <div className="w-80 h-20 text-center justify-start text-white text-5xl font-['Baloo_2'] leading-[81px]">25%</div>
              <div className="w-80 justify-center text-zinc-500 text-2xl font-normal font-['Inter'] leading-9">Student Engagement</div>
            </div>
          </div>
        </div>
        <div className="w-[703px] left-[38px] top-[749px] absolute justify-start text-white text-5xl font-semibold font-['Inter']">Current Election Stats</div>
        <div className="w-[1520px] h-32 left-0 top-[543px] absolute bg-gradient-to-r from-red-900 to-stone-950 rounded-md shadow-[0px_7px_4px_0px_rgba(0,0,0,0.25)] outline outline-[3px] outline-offset-[-3px] outline-orange-400 overflow-hidden">
          <div className="left-[22px] top-[66px] absolute justify-center text-white text-2xl font-normal font-['Baloo_Bhai_2'] leading-10">Session Status: </div>
          <div className="left-[22px] top-[25px] absolute justify-center text-white text-2xl font-normal font-['Baloo_Bhai_2'] leading-10">Voting Session: </div>
        </div>
        {/* Footer */}
        <div className="w-full h-40 left-0 top-[1301px] absolute bg-red-900 shadow-[0px_-5px_4px_0px_rgba(0,0,0,0.50)] overflow-hidden">
          <div className="left-[312px] top-[39px] absolute inline-flex justify-center items-center gap-2.5">
            <div className="w-14 h-7 relative" />
          </div>
        </div>
      </div>
  );
}
