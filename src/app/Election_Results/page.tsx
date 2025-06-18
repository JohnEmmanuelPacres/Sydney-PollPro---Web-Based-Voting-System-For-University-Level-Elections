"use client";
import type { NextPage } from 'next';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Results: NextPage = () => {
  const router = useRouter(); 
  return (
    <div className="w-full relative shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-t from-[#8b0000] to-[#b38308] h-[1649px] overflow-hidden text-left text-[20px] text-white font-inter">
      {/* Hidden background image layer */}
      <div className="absolute top-0 left-0 w-[1440px] h-[720px] overflow-hidden bg-cover bg-no-repeat bg-top hidden">
      </div>

      {/* Hidden header layer */}
      <div className="absolute w-full top-0 right-0 left-0 h-[164px] overflow-hidden hidden">
        <div className="absolute top-[56px] right-[80px] flex flex-row items-center justify-end gap-[48px]">
          <div className="relative leading-[150%] font-medium">Page</div>
          <div className="relative leading-[150%] font-medium">Page</div>
          <div className="relative leading-[150%] font-medium">Page</div>
          <div className="shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[8px] bg-black flex flex-row items-center justify-center px-6 py-[14px] text-[16px]">
            <div className="relative leading-[150%] font-medium">Button</div>
          </div>
        </div>
        <div className="absolute top-[67px] left-[80px] leading-[150%] font-medium">Site name</div>
      </div>

      {/* Main header */}
      <header className="w-full h-32 left-0 top-[-1px] absolute bg-red-900 shadow-[0px_5px_4px_0px_rgba(0,0,0,0.50)] overflow-hidden">
      <nav className="px-5 py-2.5 left-[641px] top-[35px] absolute inline-flex justify-start items-center gap-11">
        <button className="text-white text-xl font-medium font-['Inter'] leading-loose transition-all duration-300 ease-in-out transform-gpu hover:text-yellow-400 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] hover:scale-105 cursor-pointer" onClick={() => router.push("/")}>Home</button>
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

      {/* Results section */}
      <div className="absolute top-[294px] left-0 w-[1440px] h-[825px] flex flex-col items-center justify-start px-[83px] py-[29px] gap-[32px] text-[32px] font-jaldi">
        {/* Presidential Polls */}
        <div className="self-stretch h-[487px] flex flex-col items-start justify-start">
          <div className="self-stretch rounded-[8px] bg-black/20 border-[4px] border-[#d49d47] h-[487px] flex flex-col items-start justify-start px-[30px] py-[24px] gap-[4px]">
            <div className="w-[554px] flex flex-row items-center justify-start text-[40px] text-[#fff9f9] font-['Baloo_2']">
              <div className="relative leading-[150%] font-medium">Presedential Polls</div>
            </div>
            {/* Candidate 1 */}
            <div className="w-[1210px] bg-transparent overflow-hidden flex flex-col items-start justify-start px-[17px] py-[6px] gap-[4px]">
              <div className="h-[33px] flex flex-row items-center justify-center py-[10px]">
                <b className="relative leading-[150%]">Harlie Khurt Canas</b>
              </div>
              <div className="h-[32px] flex flex-row items-center justify-center py-[10px] text-[21px]">
                <b className="relative leading-[150%]">1,708 votes</b>
              </div>
              <div className="w-full rounded-[8px] bg-white border border-[#d49d47] h-[17px] flex flex-row items-center justify-start px-[3px]">
                <div className="w-[476px] relative rounded-[25px] bg-[#7c0101] h-[12px]" />
              </div>
            </div>
            {/* Candidate 2 */}
            <div className="w-[1210px] bg-transparent overflow-hidden flex flex-col items-start justify-start px-[17px] py-[6px] gap-[4px]">
              <div className="h-[33px] flex flex-row items-center justify-center py-[10px]">
                <b className="relative leading-[150%]">Chucky Korbin Ebesa</b>
              </div>
              <div className="h-[32px] flex flex-row items-center justify-center py-[10px] text-[21px]">
                <b className="relative leading-[150%]">1,708 votes</b>
              </div>
              <div className="w-full rounded-[8px] bg-white border border-[#d49d47] h-[17px] flex flex-row items-center justify-start px-[3px]">
                <div className="w-[476px] relative rounded-[25px] bg-[#7c0101] h-[12px]" />
              </div>
            </div>
            {/* Candidate 3 */}
            <div className="w-[1210px] bg-transparent overflow-hidden flex flex-col items-start justify-start px-[17px] py-[6px] gap-[4px]">
              <div className="h-[33px] flex flex-row items-center justify-center py-[10px]">
                <b className="relative leading-[150%]">Sean Richard Tadiamon</b>
              </div>
              <div className="h-[32px] flex flex-row items-center justify-center py-[10px] text-[21px]">
                <b className="relative leading-[150%]">1,708 votes</b>
              </div>
              <div className="w-full rounded-[8px] bg-white border border-[#d49d47] h-[17px] flex flex-row items-center justify-start px-[3px]">
                <div className="w-[476px] relative rounded-[25px] bg-[#7c0101] h-[12px]" />
              </div>
            </div>
            <div className="w-[349px] relative text-[24px] leading-[150%] font-inter text-[#828282] flex items-center">
              Active Student Voters
            </div>
          </div>
        </div>
        {/* Vice Presidential Polls */}
        <div className="self-stretch h-[487px] flex flex-col items-start justify-start">
          <div className="self-stretch rounded-[8px] bg-black/20 border-[4px] border-[#d49d47] h-[487px] flex flex-col items-start justify-start px-[30px] py-[24px] gap-[4px]">
            <div className="w-[554px] flex flex-row items-center justify-start text-[40px] text-[#fff9f9] font-['Baloo_2']">
              <div className="relative leading-[150%] font-medium">Vice Presedential Polls</div>
            </div>
            {/* Candidate 1 */}
            <div className="w-[1210px] bg-transparent overflow-hidden flex flex-col items-start justify-start px-[17px] py-[6px] gap-[4px]">
              <div className="h-[33px] flex flex-row items-center justify-center py-[10px]">
                <b className="relative leading-[150%]">Candidate’s Name</b>
              </div>
              <div className="h-[32px] flex flex-row items-center justify-center py-[10px] text-[21px]">
                <b className="relative leading-[150%]">1,708 votes</b>
              </div>
              <div className="w-full rounded-[8px] bg-white border border-[#d49d47] h-[17px] flex flex-row items-center justify-start px-[3px]">
                <div className="w-[476px] relative rounded-[25px] bg-[#7c0101] h-[12px]" />
              </div>
            </div>
            {/* Candidate 2 */}
            <div className="w-[1210px] bg-transparent overflow-hidden flex flex-col items-start justify-start px-[17px] py-[6px] gap-[4px]">
              <div className="h-[33px] flex flex-row items-center justify-center py-[10px]">
                <b className="relative leading-[150%]">Candidate’s Name</b>
              </div>
              <div className="h-[32px] flex flex-row items-center justify-center py-[10px] text-[21px]">
                <b className="relative leading-[150%]">1,708 votes</b>
              </div>
              <div className="w-full rounded-[8px] bg-white border border-[#d49d47] h-[17px] flex flex-row items-center justify-start px-[3px]">
                <div className="w-[476px] relative rounded-[25px] bg-[#7c0101] h-[12px]" />
              </div>
            </div>
            {/* Candidate 3 */}
            <div className="w-[1210px] bg-transparent overflow-hidden flex flex-col items-start justify-start px-[17px] py-[6px] gap-[4px]">
              <div className="h-[33px] flex flex-row items-center justify-center py-[10px]">
                <b className="relative leading-[150%]">Candidate’s Name</b>
              </div>
              <div className="h-[32px] flex flex-row items-center justify-center py-[10px] text-[21px]">
                <b className="relative leading-[150%]">1,708 votes</b>
              </div>
              <div className="w-full rounded-[8px] bg-white border border-[#d49d47] h-[17px] flex flex-row items-center justify-start px-[3px]">
                <div className="w-[476px] relative rounded-[25px] bg-[#7c0101] h-[12px]" />
              </div>
            </div>
            <div className="w-[349px] relative text-[24px] leading-[150%] font-inter text-[#828282] flex items-center">
              Active Student Voters
            </div>
          </div>
        </div>
      </div>

      {/* Election Results Title */}
      <div className="absolute top-[198px] left-1/2 -translate-x-[682px] text-[48px] font-semibold tracking-[-0.02em] inline-block w-[703px]">
        Election Results
      </div>

      {/* Footer */}
      <div className="absolute w-full top-[1493px] right-0 left-0 shadow-[0_-5px_4px_rgba(0,0,0,0.5)] bg-[#7c0101] h-[156px] overflow-hidden">
        <div className="absolute top-[39px] left-[312px] flex flex-row items-center justify-center">
          <div className="w-[57px] relative h-[30px]" />
        </div>
      </div>
    </div>
  );
};

export default Results;