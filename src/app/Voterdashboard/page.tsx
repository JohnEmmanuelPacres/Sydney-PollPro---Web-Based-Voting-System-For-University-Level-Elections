'use client';
import React from "react";
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

export default function VotingDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/User_RegxLogin');
  };

  return (
    <div className="w-full min-h-screen relative bg-gradient-to-l from-yellow-600 to-red-950 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-y-auto overflow-x-hidden">
  <div className="w-[1440px] px-20 left-0 top-[901px] absolute inline-flex flex-col justify-start items-start gap-2.5">
    <div className="self-stretch h-80 inline-flex justify-start items-start gap-6">
      <div className="w-96 h-64 px-7 py-14 bg-black/20 rounded-lg outline outline-4 outline-offset-[-4px] outline-orange-400 inline-flex flex-col justify-start items-start gap-1 mx-auto">
        <div className="self-stretch justify-start text-stone-50 text-3xl font-['Baloo_2'] leading-10">Total Registered Voters</div>
        <div className="self-stretch h-20 text-center justify-start text-white text-5xl font-['Baloo_2'] leading-[81px]">2, 847</div>
        <div className="self-stretch justify-center text-zinc-500 text-2xl font-normal font-['Inter'] leading-9">Active Student Voters</div>
      </div>
      <div className="w-96 h-64 px-7 py-14 bg-black/20 rounded-lg outline outline-4 outline-offset-[-4px] outline-orange-400 inline-flex flex-col justify-start items-start gap-1">
        <div className="self-stretch justify-start text-stone-50 text-3xl font-['Baloo_2'] leading-10">Total Votes Cast</div>
        <div className="self-stretch h-20 text-center justify-start text-white text-5xl font-['Baloo_2'] leading-[81px]">847</div>
        <div className="self-stretch justify-center text-zinc-500 text-2xl font-normal font-['Inter'] leading-9">Type of Election</div>
      </div>
      <div className="w-96 h-64 px-7 py-14 bg-black/20 rounded-lg outline outline-4 outline-offset-[-4px] outline-orange-400 inline-flex flex-col justify-start items-start gap-1">
        <div className="self-stretch justify-start text-stone-50 text-3xl font-['Baloo_2'] leading-10">Avg. Participation</div>
        <div className="self-stretch h-20 text-center justify-start text-white text-5xl font-['Baloo_2'] leading-[81px]">25%</div>
        <div className="self-stretch justify-center text-zinc-500 text-2xl font-normal font-['Inter'] leading-9">Student Engagement</div>
      </div>
    </div>
  </div>
  <div className="w-[703px] left-[38px] top-[749px] absolute justify-start text-white text-5xl font-semibold font-['Inter']">Current Election Stats</div>
  <div className="w-[703px] left-[39px] top-[1299px] absolute justify-start text-white text-5xl font-semibold font-['Inter']">Realtime Updates</div>
  <div className="w-screen h-32 left-0 top-[543px] absolute bg-gradient-to-r from-red-900 to-stone-950 rounded-md shadow-[0px_7px_4px_0px_rgba(0,0,0,0.25)] outline outline-[3px] outline-offset-[-3px] outline-orange-400 overflow-hidden">
    <div className="left-[22px] top-[66px] absolute justify-center text-white text-2xl font-normal font-['Baloo_Bhai_2'] leading-10">Session Status: </div>
    <div className="left-[22px] top-[25px] absolute justify-center text-white text-2xl font-normal font-['Baloo_Bhai_2'] leading-10">Voting Session: </div>
  </div>
  <div className="w-full h-40 left-0 top-[2331px] absolute bg-rose-950 shadow-[0px_-5px_4px_0px_rgba(0,0,0,0.50)] overflow-hidden">
    <div className="left-[312px] top-[39px] absolute inline-flex justify-center items-center gap-2.5">
      <div className="w-14 h-7 relative" />
    </div>
  </div>
  <div className="w-[908px] h-28 left-[288px] top-[234px] absolute text-center justify-center text-white text-7xl font-normal font-['Baloo_2'] leading-[105px]">Welcome, VoterName</div>
  <div data-hover={false} data-variant="2" className="h-11 px-8 py-2 left-[646px] top-[364px] absolute bg-green-800 rounded-md inline-flex justify-center items-center gap-2">
    <div className="w-6 h-4 pr-2 inline-flex flex-col justify-start items-start">
      <div className="w-4 h-4 flex flex-col justify-center items-center overflow-hidden">
        <div data-variant="7" className="w-4 flex-1 relative">
          <div className="w-1 h-[2.67px] left-[6px] top-[6.67px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-grey-95" />
          <div className="w-2.5 h-2.5 left-[3.33px] top-[3.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-grey-95" />
          <div className="w-3.5 h-0 left-[1.33px] top-[12.67px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-grey-95" />
        </div>
      </div>
    </div>
    <div className="text-center justify-center text-color-grey-95 text-lg font-semibold font-['Geist'] leading-7">VOTE NOW</div>
  </div>
  <div className="w-full min-h-screen left-[27px] top-[1386px] absolute bg-gradient-to-b from-red-900 outline outline-[6px] outline-yellow-700" />
  <div className="w-full h-32 left-[4px] top-0 absolute bg-rose-950 shadow-[0px_5px_4px_0px_rgba(0,0,0,0.50)] overflow-hidden">
    <div className="absolute left-1/2 top-[47px] w-[637px] px-5 py-2.5 flex justify-start items-center gap-11 -translate-x-1/2">
      <div className="w-14 h-7 relative">
        <div className="w-14 h-7 flex items-center justify-center text-white text-xl font-medium font-['Inter'] leading-loose">Home</div>
      </div>
      <div className="w-28 h-9 relative">
        <div className="w-28 h-9 flex items-center justify-center text-white text-xl font-medium font-['Inter'] leading-loose">Candidates</div>
      </div>
      <div className="w-16 h-7 relative">
        <div className="w-16 h-7 flex items-center justify-center text-white text-xl font-medium font-['Inter'] leading-loose">Results</div>
      </div>
      <div data-property-1="Updates" className="w-20 h-7 relative">
        <div className="w-20 h-7 flex items-center justify-center text-white text-xl font-medium font-['Inter'] leading-loose">Updates</div>
      </div>
    </div>
    <div className="left-[213px] top-[35px] absolute justify-center text-white text-5xl font-normal font-['Abyssinica_SIL'] leading-[67.50px]">UniVote</div>
    <img className="w-28 h-28 left-[38px] top-[7px] absolute" src="/Website Logo.png" />
    <button
      onClick={handleLogout}
      data-property-1="SIGN IN BUTTON"
      className="w-32 px-6 py-3.5 left-[1085px] top-[47px] absolute bg-gradient-to-br from-stone-600 to-orange-300 rounded-[999px] shadow-[1px_2px_6px_0px_rgba(0,0,0,0.40)] shadow-[2px_4px_18px_0px_rgba(0,0,0,0.20)] shadow-[-1px_-2px_6px_0px_rgba(250,195,107,0.40)] shadow-[-2px_-4px_18px_0px_rgba(250,195,107,0.10)] outline outline-[3px] outline-offset-[-3px] outline-orange-300 inline-flex justify-center items-center gap-2 transition-all duration-300 ease-in-out hover:scale-105"
    >
      <div className="w-20 h-7 flex items-center justify-center text-white text-xl font-normal font-['Jaldi'] leading-loose bg-transparent glow-hover">LOGOUT</div>
    </button>
  </div>
  <div className="w-[783px] h-[733px] p-px left-[37px] top-[1395px] absolute bg-red-950/60 rounded-lg shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.10)] shadow-md outline outline-1 outline-offset-[-1px] outline-color-yellow-64 inline-flex flex-col justify-start items-start overflow-hidden">
    <div className="self-stretch px-6 py-6 border-b border-color-yellow-77 flex flex-col justify-start items-start">
      <div className="self-stretch flex flex-col justify-start items-start">
        <div className="self-stretch justify-center text-white text-2xl font-semibold font-['Geist'] leading-normal">Active Elections</div>
      </div>
      <div className="self-stretch pt-1.5 flex flex-col justify-start items-start">
        <div className="self-stretch flex flex-col justify-start items-start">
          <div className="self-stretch justify-center text-lime-300 text-sm font-normal font-['Geist'] leading-tight">Currently running elections and their status</div>
        </div>
      </div>
    </div>
    <div className="self-stretch px-6 pt-4 pb-6 flex flex-col justify-start items-start gap-4">
      <div className="self-stretch p-4 bg-red-600/20 rounded-lg outline outline-1 outline-offset-[-1px] outline-color-yellow-64 flex flex-col justify-start items-start gap-3">
        <div className="self-stretch inline-flex justify-between items-start">
          <div className="inline-flex flex-col justify-start items-start gap-1">
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="justify-center text-white text-base font-semibold font-['Geist'] leading-normal">Student Government President</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="justify-center text-yellow-400 text-sm font-normal font-['Geist'] leading-tight">Annual election for student body president</div>
            </div>
          </div>
          <div data-hover={false} data-variant="4" className="px-2.5 py-[3px] bg-yellow-500 rounded-full flex justify-start items-center">
            <div className="justify-center text-color-red-35 text-xs font-semibold font-['Geist'] leading-none">Active</div>
          </div>
        </div>
        <div className="w-[690px] inline-flex justify-center items-start gap-px">
          <div className="w-48 self-stretch flex justify-start items-center gap-2">
            <div data-variant="12" className="w-4 h-4 relative">
              <div className="w-0 h-[2.67px] left-[5.33px] top-[1.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-0 h-[2.67px] left-[10.67px] top-[1.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-3 h-3 left-[2px] top-[2.67px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-3 h-0 left-[2px] top-[6.67px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
            </div>
            <div className="inline-flex flex-col justify-start items-start">
              <div className="justify-center text-white text-sm font-normal font-['Geist'] leading-tight">Ends June 30, 2025</div>
            </div>
          </div>
          <div className="w-48 self-stretch flex justify-start items-center gap-2">
            <div data-variant="13" className="w-4 h-4 relative">
              <div className="w-2.5 h-1 left-[1.33px] top-[10px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-1.5 h-1.5 left-[3.33px] top-[2px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-0.5 h-1 left-[12.67px] top-[10.09px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-0.5 h-[5.17px] left-[10.67px] top-[2.09px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
            </div>
            <div className="inline-flex flex-col justify-start items-start">
              <div className="justify-center text-white text-sm font-normal font-['Geist'] leading-tight">3 candidates</div>
            </div>
          </div>
          <div className="w-64 self-stretch inline-flex flex-col justify-start items-start gap-px">
            <div className="self-stretch inline-flex justify-start items-start gap-80">
              <div className="self-stretch inline-flex flex-col justify-start items-start">
                <div className="justify-center text-white text-sm font-normal font-['Geist'] leading-tight">Participation</div>
              </div>
              <div className="self-stretch inline-flex flex-col justify-start items-start">
                <div className="justify-center text-color-red-42 text-sm font-normal font-['Geist'] leading-tight">41%</div>
              </div>
            </div>
            <div className="self-stretch h-2 relative bg-color-yellow-77 rounded-full overflow-hidden">
              <div className="w-72 h-2 left-[-241.92px] top-0 absolute bg-color-red-45" />
            </div>
          </div>
        </div>
        <div className="self-stretch inline-flex justify-start items-start gap-2">
          <div data-hover={false} data-variant="3" className="h-9 px-3 py-px bg-stone-50 rounded-md outline outline-1 outline-offset-[-1px] outline-yellow-400 flex justify-center items-center gap-2">
            <div className="w-6 h-4 pr-2 inline-flex flex-col justify-start items-start">
              <div className="w-4 h-4 flex flex-col justify-center items-center overflow-hidden">
                <div data-variant="15" className="w-4 flex-1 relative">
                  <div className="w-3.5 h-2.5 left-[1.33px] top-[3.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-51" />
                  <div className="w-1 h-1 left-[6px] top-[6px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-51" />
                </div>
              </div>
            </div>
            <div className="text-center justify-center text-color-red-51 text-sm font-medium font-['Geist'] leading-tight">View Status</div>
          </div>
          <div data-hover={false} data-variant="4" className="h-9 px-3 py-px bg-stone-50 rounded-md outline outline-1 outline-offset-[-1px] outline-yellow-400 flex justify-center items-center gap-2">
            <div className="w-6 h-4 pr-2 inline-flex flex-col justify-start items-start">
              <div className="w-4 h-4 flex flex-col justify-center items-center overflow-hidden">
                <div data-variant="17" className="w-4 flex-1 relative">
                  <div className="w-3 h-3.5 left-[1.99px] top-[1.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-51" />
                  <div className="w-1 h-1 left-[6px] top-[6px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-51" />
                </div>
              </div>
            </div>
            <div className="text-center justify-center text-color-red-51 text-sm font-medium font-['Geist'] leading-tight">Manage</div>
          </div>
        </div>
      </div>
      <div className="self-stretch p-4 bg-red-600/20 rounded-lg outline outline-1 outline-offset-[-1px] outline-color-yellow-64 flex flex-col justify-start items-start gap-3">
        <div className="self-stretch inline-flex justify-between items-start">
          <div className="inline-flex flex-col justify-start items-start gap-1">
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="justify-center text-white text-base font-semibold font-['Geist'] leading-normal">Faculty Senate Representative</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="justify-center text-yellow-400 text-sm font-normal font-['Geist'] leading-tight">Computer Science Department representative</div>
            </div>
          </div>
          <div data-hover={false} data-variant="4" className="px-2.5 py-[3px] bg-yellow-500 rounded-full flex justify-start items-center">
            <div className="justify-center text-color-red-35 text-xs font-semibold font-['Geist'] leading-none">Active</div>
          </div>
        </div>
        <div className="w-[690px] inline-flex justify-center items-start gap-px">
          <div className="w-48 self-stretch flex justify-start items-center gap-2">
            <div data-variant="12" className="w-4 h-4 relative">
              <div className="w-0 h-[2.67px] left-[5.33px] top-[1.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-0 h-[2.67px] left-[10.67px] top-[1.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-3 h-3 left-[2px] top-[2.67px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-3 h-0 left-[2px] top-[6.67px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
            </div>
            <div className="inline-flex flex-col justify-start items-start">
              <div className="justify-center text-white text-sm font-normal font-['Geist'] leading-tight">Ends July 1, 2025</div>
            </div>
          </div>
          <div className="w-48 self-stretch flex justify-start items-center gap-2">
            <div data-variant="13" className="w-4 h-4 relative">
              <div className="w-2.5 h-1 left-[1.33px] top-[10px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-1.5 h-1.5 left-[3.33px] top-[2px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-0.5 h-1 left-[12.67px] top-[10.09px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-0.5 h-[5.17px] left-[10.67px] top-[2.09px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
            </div>
            <div className="inline-flex flex-col justify-start items-start">
              <div className="justify-center text-white text-sm font-normal font-['Geist'] leading-tight">3 candidates</div>
            </div>
          </div>
          <div className="w-64 self-stretch inline-flex flex-col justify-start items-start gap-px">
            <div className="self-stretch inline-flex justify-start items-start gap-80">
              <div className="self-stretch inline-flex flex-col justify-start items-start">
                <div className="justify-center text-white text-sm font-normal font-['Geist'] leading-tight">Participation</div>
              </div>
              <div className="self-stretch inline-flex flex-col justify-start items-start">
                <div className="justify-center text-color-red-42 text-sm font-normal font-['Geist'] leading-tight">41%</div>
              </div>
            </div>
            <div className="self-stretch h-2 relative bg-color-yellow-77 rounded-full overflow-hidden">
              <div className="w-96 h-2 left-[-241.92px] top-0 absolute bg-color-red-45" />
            </div>
          </div>
        </div>
        <div className="self-stretch inline-flex justify-start items-start gap-2">
          <div data-hover={false} data-variant="3" className="h-9 px-3 py-px bg-stone-50 rounded-md outline outline-1 outline-offset-[-1px] outline-yellow-400 flex justify-center items-center gap-2">
            <div className="w-6 h-4 pr-2 inline-flex flex-col justify-start items-start">
              <div className="w-4 h-4 flex flex-col justify-center items-center overflow-hidden">
                <div data-variant="15" className="w-4 flex-1 relative">
                  <div className="w-3.5 h-2.5 left-[1.33px] top-[3.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-51" />
                  <div className="w-1 h-1 left-[6px] top-[6px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-51" />
                </div>
              </div>
            </div>
            <div className="text-center justify-center text-color-red-51 text-sm font-medium font-['Geist'] leading-tight">View Status</div>
          </div>
          <div data-hover={false} data-variant="4" className="h-9 px-3 py-px bg-stone-50 rounded-md outline outline-1 outline-offset-[-1px] outline-yellow-400 flex justify-center items-center gap-2">
            <div className="w-6 h-4 pr-2 inline-flex flex-col justify-start items-start">
              <div className="w-4 h-4 flex flex-col justify-center items-center overflow-hidden">
                <div data-variant="17" className="w-4 flex-1 relative">
                  <div className="w-3 h-3.5 left-[1.99px] top-[1.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-51" />
                  <div className="w-1 h-1 left-[6px] top-[6px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-51" />
                </div>
              </div>
            </div>
            <div className="text-center justify-center text-color-red-51 text-sm font-medium font-['Geist'] leading-tight">Manage</div>
          </div>
        </div>
      </div>
      <div className="self-stretch p-4 bg-red-600/20 rounded-lg outline outline-1 outline-offset-[-1px] outline-color-yellow-64 flex flex-col justify-start items-start gap-3">
        <div className="self-stretch inline-flex justify-between items-start">
          <div className="inline-flex flex-col justify-start items-start gap-1">
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="justify-center text-white text-base font-semibold font-['Geist'] leading-normal">Dormitory Council Elections</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="justify-center text-yellow-400 text-sm font-normal font-['Geist'] leading-tight">Representatives for residence halls</div>
            </div>
          </div>
          <div data-hover={false} data-variant="1" className="px-2.5 py-[3px] bg-red-600 rounded-full flex justify-start items-center">
            <div className="justify-center text-color-grey-95 text-xs font-semibold font-['Geist'] leading-none">Ending Soon</div>
          </div>
        </div>
        <div className="w-[690px] inline-flex justify-center items-start gap-px">
          <div className="w-48 self-stretch flex justify-start items-center gap-2">
            <div data-variant="12" className="w-4 h-4 relative">
              <div className="w-0 h-[2.67px] left-[5.33px] top-[1.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-0 h-[2.67px] left-[10.67px] top-[1.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-3 h-3 left-[2px] top-[2.67px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-3 h-0 left-[2px] top-[6.67px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
            </div>
            <div className="inline-flex flex-col justify-start items-start">
              <div className="justify-center text-white text-sm font-normal font-['Geist'] leading-tight">Ends June 27, 2025</div>
            </div>
          </div>
          <div className="w-48 self-stretch flex justify-start items-center gap-2">
            <div data-variant="13" className="w-4 h-4 relative">
              <div className="w-2.5 h-1 left-[1.33px] top-[10px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-1.5 h-1.5 left-[3.33px] top-[2px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-0.5 h-1 left-[12.67px] top-[10.09px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
              <div className="w-0.5 h-[5.17px] left-[10.67px] top-[2.09px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-60" />
            </div>
            <div className="inline-flex flex-col justify-start items-start">
              <div className="justify-center text-white text-sm font-normal font-['Geist'] leading-tight">3 candidates</div>
            </div>
          </div>
          <div className="w-64 self-stretch inline-flex flex-col justify-start items-start gap-px">
            <div className="self-stretch inline-flex justify-start items-start gap-80">
              <div className="self-stretch inline-flex flex-col justify-start items-start">
                <div className="justify-center text-white text-sm font-normal font-['Geist'] leading-tight">Participation</div>
              </div>
              <div className="self-stretch inline-flex flex-col justify-start items-start">
                <div className="justify-center text-color-red-42 text-sm font-normal font-['Geist'] leading-tight">41%</div>
              </div>
            </div>
            <div className="self-stretch h-2 relative bg-color-yellow-77 rounded-full overflow-hidden">
              <div className="w-[493px] h-2 left-[-241.92px] top-0 absolute bg-color-red-45" />
            </div>
          </div>
        </div>
        <div className="self-stretch inline-flex justify-start items-start gap-2">
          <div data-hover={false} data-variant="3" className="h-9 px-3 py-px bg-stone-50 rounded-md outline outline-1 outline-offset-[-1px] outline-yellow-400 flex justify-center items-center gap-2">
            <div className="w-6 h-4 pr-2 inline-flex flex-col justify-start items-start">
              <div className="w-4 h-4 flex flex-col justify-center items-center overflow-hidden">
                <div data-variant="15" className="w-4 flex-1 relative">
                  <div className="w-3.5 h-2.5 left-[1.33px] top-[3.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-51" />
                  <div className="w-1 h-1 left-[6px] top-[6px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-51" />
                </div>
              </div>
            </div>
            <div className="text-center justify-center text-color-red-51 text-sm font-medium font-['Geist'] leading-tight">View Status</div>
          </div>
          <div data-hover={false} data-variant="4" className="h-9 px-3 py-px bg-stone-50 rounded-md outline outline-1 outline-offset-[-1px] outline-yellow-400 flex justify-center items-center gap-2">
            <div className="w-6 h-4 pr-2 inline-flex flex-col justify-start items-start">
              <div className="w-4 h-4 flex flex-col justify-center items-center overflow-hidden">
                <div data-variant="17" className="w-4 flex-1 relative">
                  <div className="w-3 h-3.5 left-[1.99px] top-[1.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-51" />
                  <div className="w-1 h-1 left-[6px] top-[6px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-color-red-51" />
                </div>
              </div>
            </div>
            <div className="text-center justify-center text-color-red-51 text-sm font-medium font-['Geist'] leading-tight">Manage</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="w-[573px] h-[734px] px-px pt-px pb-6 left-[832px] top-[1395px] absolute bg-rose-950 rounded-lg shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.10)] shadow-md outline outline-1 outline-offset-[-1px] outline-color-yellow-64 inline-flex flex-col justify-start items-center gap-4 overflow-hidden">
    <div className="self-stretch px-6 py-6 border-b border-color-yellow-77 flex flex-col justify-start items-start">
      <div className="self-stretch flex flex-col justify-start items-start">
        <div className="self-stretch justify-center text-white text-2xl font-semibold font-['Geist'] leading-normal">Recent Activity</div>
      </div>
      <div className="self-stretch pt-1.5 flex flex-col justify-start items-start">
        <div className="self-stretch flex flex-col justify-start items-start">
          <div className="self-stretch justify-center text-yellow-400 text-sm font-normal font-['Geist'] leading-tight">Latest actions across the voting system</div>
        </div>
      </div>
    </div>
    <div className="w-[640.30px] flex flex-col justify-start items-start gap-4">
      <div className="self-stretch inline-flex justify-start items-start">
        <div className="w-8 h-8 bg-color-yellow-47 rounded-full flex justify-center items-start overflow-hidden">
          <div className="flex-1 self-stretch max-w-8 inline-flex flex-col justify-start items-start overflow-hidden">
            <div className="w-8 h-8 flex flex-col justify-center items-center overflow-hidden">
              <div data-variant="18" className="w-8 h-8 relative overflow-hidden">
                <div className="w-8 h-8 left-0 top-0 absolute bg-color-grey-92" />
                <div className="w-2 h-2 left-[12.38px] top-[12.35px] absolute bg-color-grey-98" />
                <div className="w-2 h-2 left-[12.38px] top-[12.35px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-color-grey-79" />
                <div className="w-2.5 h-0 left-[10.80px] top-[15.96px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-stone-300/0" />
                <div className="w-0 h-2.5 left-[15.99px] top-[10.77px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-stone-300/0" />
                <div className="w-2.5 h-2.5 left-[10.78px] top-[10.80px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-color-grey-79-0%/0" />
                <div className="w-[3.03px] h-[3.03px] left-[14.50px] top-[14.48px] absolute bg-color-white-solid" />
                <div className="w-px h-px left-[15.50px] top-[15.48px] absolute bg-color-black-solid" />
                <div className="w-px h-px left-[15.50px] top-[15.55px] absolute bg-color-grey-40" />
                <div className="w-[3.03px] h-[3.03px] left-[14.50px] top-[14.48px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-color-grey-79" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 pl-4 inline-flex flex-col justify-start items-start">
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="inline-flex flex-col justify-start items-start">
                <div className="justify-center text-white text-sm font-medium font-['Geist'] leading-tight">Sarah Johnson</div>
              </div>
              <div data-hover={false} data-variant="1" className="px-2.5 py-[3px] bg-red-600 rounded-full flex justify-start items-center">
                <div className="justify-center text-color-grey-95 text-xs font-semibold font-['Geist'] leading-none">Vote</div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-yellow-400 text-sm font-normal font-['Geist'] leading-tight">voted in Student Government President election</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-color-orange-40 text-xs font-normal font-['Geist'] leading-none">2 minutes ago</div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-start">
        <div className="w-8 h-8 bg-color-yellow-47 rounded-full flex justify-center items-start overflow-hidden">
          <div className="flex-1 self-stretch max-w-8 inline-flex flex-col justify-start items-start overflow-hidden">
            <div className="w-8 h-8 flex flex-col justify-center items-center overflow-hidden">
              <div data-variant="18" className="w-8 h-8 relative overflow-hidden">
                <div className="w-8 h-8 left-0 top-0 absolute bg-color-grey-92" />
                <div className="w-2 h-2 left-[12.38px] top-[12.35px] absolute bg-color-grey-98" />
                <div className="w-2 h-2 left-[12.38px] top-[12.35px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-color-grey-79" />
                <div className="w-2.5 h-0 left-[10.80px] top-[15.96px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-stone-300/0" />
                <div className="w-0 h-2.5 left-[15.99px] top-[10.77px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-stone-300/0" />
                <div className="w-2.5 h-2.5 left-[10.78px] top-[10.80px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-color-grey-79-0%/0" />
                <div className="w-[3.03px] h-[3.03px] left-[14.50px] top-[14.48px] absolute bg-color-white-solid" />
                <div className="w-px h-px left-[15.50px] top-[15.48px] absolute bg-color-black-solid" />
                <div className="w-px h-px left-[15.50px] top-[15.55px] absolute bg-color-grey-40" />
                <div className="w-[3.03px] h-[3.03px] left-[14.50px] top-[14.48px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-color-grey-79" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 pl-4 inline-flex flex-col justify-start items-start">
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="inline-flex flex-col justify-start items-start">
                <div className="justify-center text-white text-sm font-medium font-['Geist'] leading-tight">Mike Chen</div>
              </div>
              <div data-hover={false} data-variant="4" className="px-2.5 py-[3px] bg-yellow-500 rounded-full flex justify-start items-center">
                <div className="justify-center text-color-red-35 text-xs font-semibold font-['Geist'] leading-none">Registration</div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-yellow-400 text-sm font-normal font-['Geist'] leading-tight">registered as a new voter</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-color-orange-40 text-xs font-normal font-['Geist'] leading-none">5 minutes ago</div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-start">
        <div className="w-8 h-8 bg-color-yellow-47 rounded-full flex justify-center items-start overflow-hidden">
          <div className="flex-1 self-stretch max-w-8 inline-flex flex-col justify-start items-start overflow-hidden">
            <div className="w-8 h-8 flex flex-col justify-center items-center overflow-hidden">
              <div data-variant="18" className="w-8 h-8 relative overflow-hidden">
                <div className="w-8 h-8 left-0 top-0 absolute bg-color-grey-92" />
                <div className="w-2 h-2 left-[12.38px] top-[12.35px] absolute bg-color-grey-98" />
                <div className="w-2 h-2 left-[12.38px] top-[12.35px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-color-grey-79" />
                <div className="w-2.5 h-0 left-[10.80px] top-[15.96px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-stone-300/0" />
                <div className="w-0 h-2.5 left-[15.99px] top-[10.77px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-stone-300/0" />
                <div className="w-2.5 h-2.5 left-[10.78px] top-[10.80px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-color-grey-79-0%/0" />
                <div className="w-[3.03px] h-[3.03px] left-[14.50px] top-[14.48px] absolute bg-color-white-solid" />
                <div className="w-px h-px left-[15.50px] top-[15.48px] absolute bg-color-black-solid" />
                <div className="w-px h-px left-[15.50px] top-[15.55px] absolute bg-color-grey-40" />
                <div className="w-[3.03px] h-[3.03px] left-[14.50px] top-[14.48px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-color-grey-79" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 pl-4 inline-flex flex-col justify-start items-start">
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="inline-flex flex-col justify-start items-start">
                <div className="justify-center text-white text-sm font-medium font-['Geist'] leading-tight">Emily Rodriguez</div>
              </div>
              <div data-hover={false} data-variant="5" className="px-2.5 py-[3px] rounded-full outline outline-1 outline-offset-[-1px] outline-yellow-400 flex justify-start items-center">
                <div className="justify-center text-color-red-51 text-xs font-semibold font-['Geist'] leading-none">Candidate</div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-yellow-400 text-sm font-normal font-['Geist'] leading-tight">submitted candidacy for Faculty Senate</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-color-orange-40 text-xs font-normal font-['Geist'] leading-none">12 minutes ago</div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-start">
        <div className="w-8 h-8 bg-color-yellow-47 rounded-full flex justify-center items-start overflow-hidden">
          <div className="flex-1 self-stretch max-w-8 inline-flex flex-col justify-start items-start overflow-hidden">
            <div className="w-8 h-8 flex flex-col justify-center items-center overflow-hidden">
              <div data-variant="18" className="w-8 h-8 relative overflow-hidden">
                <div className="w-8 h-8 left-0 top-0 absolute bg-color-grey-92" />
                <div className="w-2 h-2 left-[12.38px] top-[12.35px] absolute bg-color-grey-98" />
                <div className="w-2 h-2 left-[12.38px] top-[12.35px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-color-grey-79" />
                <div className="w-2.5 h-0 left-[10.80px] top-[15.96px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-stone-300/0" />
                <div className="w-0 h-2.5 left-[15.99px] top-[10.77px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-stone-300/0" />
                <div className="w-2.5 h-2.5 left-[10.78px] top-[10.80px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-color-grey-79-0%/0" />
                <div className="w-[3.03px] h-[3.03px] left-[14.50px] top-[14.48px] absolute bg-color-white-solid" />
                <div className="w-px h-px left-[15.50px] top-[15.48px] absolute bg-color-black-solid" />
                <div className="w-px h-px left-[15.50px] top-[15.55px] absolute bg-color-grey-40" />
                <div className="w-[3.03px] h-[3.03px] left-[14.50px] top-[14.48px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-color-grey-79" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 pl-4 inline-flex flex-col justify-start items-start">
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="inline-flex flex-col justify-start items-start">
                <div className="justify-center text-white text-sm font-medium font-['Geist'] leading-tight">David Kim</div>
              </div>
              <div data-hover={false} data-variant="1" className="px-2.5 py-[3px] bg-red-600 rounded-full flex justify-start items-center">
                <div className="justify-center text-color-grey-95 text-xs font-semibold font-['Geist'] leading-none">Vote</div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-yellow-400 text-sm font-normal font-['Geist'] leading-tight">voted in Dormitory Council Elections</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-color-orange-40 text-xs font-normal font-['Geist'] leading-none">18 minutes ago</div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-start">
        <div className="w-8 h-8 bg-color-yellow-47 rounded-full flex justify-center items-start overflow-hidden">
          <div className="flex-1 self-stretch max-w-8 inline-flex flex-col justify-start items-start overflow-hidden">
            <div className="w-8 h-8 flex flex-col justify-center items-center overflow-hidden">
              <div data-variant="18" className="w-8 h-8 relative overflow-hidden">
                <div className="w-8 h-8 left-0 top-0 absolute bg-color-grey-92" />
                <div className="w-2 h-2 left-[12.38px] top-[12.35px] absolute bg-color-grey-98" />
                <div className="w-2 h-2 left-[12.38px] top-[12.35px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-color-grey-79" />
                <div className="w-2.5 h-0 left-[10.80px] top-[15.96px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-stone-300/0" />
                <div className="w-0 h-2.5 left-[15.99px] top-[10.77px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-stone-300/0" />
                <div className="w-2.5 h-2.5 left-[10.78px] top-[10.80px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-color-grey-79-0%/0" />
                <div className="w-[3.03px] h-[3.03px] left-[14.50px] top-[14.48px] absolute bg-color-white-solid" />
                <div className="w-px h-px left-[15.50px] top-[15.48px] absolute bg-color-black-solid" />
                <div className="w-px h-px left-[15.50px] top-[15.55px] absolute bg-color-grey-40" />
                <div className="w-[3.03px] h-[3.03px] left-[14.50px] top-[14.48px] absolute outline outline-[0.06px] outline-offset-[-0.03px] outline-color-grey-79" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 pl-4 inline-flex flex-col justify-start items-start">
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="inline-flex flex-col justify-start items-start">
                <div className="justify-center text-white text-sm font-medium font-['Geist'] leading-tight">Admin User</div>
              </div>
              <div data-hover={false} data-variant="6" className="px-2.5 py-[3px] bg-red-700 rounded-full flex justify-start items-center">
                <div className="justify-center text-color-grey-95 text-xs font-semibold font-['Geist'] leading-none">Admin</div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-yellow-400 text-sm font-normal font-['Geist'] leading-tight">created new election: Graduate Student Representative</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-color-orange-40 text-xs font-normal font-['Geist'] leading-none">1 hour ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
  
  
  