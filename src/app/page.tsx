"use client";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StatsCard from "./components/StatsCard";
import Threads from "./components/Threads";

export default function Home() {
  return (
    <div className="w-full min-h-screen relative bg-gradient-to-l from-yellow-600 to-red-800 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-x-hidden">
      <Header />
  
      <h2 className="left-[266px] top-[222px] absolute justify-center text-white text-4xl md:text-5xl lg:text-7xl font-normal font-['Baloo_2'] leading-tight md:leading-[105px] z-10">
        Secure Digital Voting Platform
      </h2>
      <p className="left-[146px] top-[409px] absolute justify-center text-stone-300 text-xl md:text-2xl lg:text-3xl font-normal font-['Baloo_2'] leading-8 md:leading-10 z-10">
        Participate in university and departmental election transparently, securely, and accessibly.
      </p>
      <p className="left-[596px] top-[364px] absolute justify-center text-stone-300 text-xl md:text-2xl lg:text-3xl font-normal font-['Baloo_2'] leading-8 md:leading-10 z-10">
        Your voice matters!
      </p>
  
      <section className="w-full md:w-[1440px] px-4 md:px-20 left-0 top-[901px] absolute inline-flex flex-col justify-start items-start gap-2.5 z-10">
        <div className="self-stretch h-auto md:h-80 inline-flex flex-col md:flex-row justify-start items-start gap-4 md:gap-6 text-stone-300">
          <StatsCard 
            title="Total Registered Voters"
            value="2, 847"
            subtitle="Active Student Voters"
          />
          <StatsCard 
            title="Total Votes Cast"
            value="847"
            subtitle="Type of Election"
          />
          <StatsCard 
            title="Avg. Participation"
            value="25%"
            subtitle="Student Engagement"
          />
        </div>
      </section>
  
      <h2 className="w-full md:w-[703px] left-[38px] top-[749px] absolute justify-start text-white text-3xl md:text-4xl lg:text-5xl font-semibold font-['Inter'] z-10">
        Current Election Stats
      </h2>
      
      <div className="w-full md:w-[1520px] h-32 left-0 top-[543px] absolute bg-gradient-to-r from-red-900 to-stone-950 rounded-md shadow-[0px_7px_4px_0px_rgba(0,0,0,0.25)] outline outline-[3px] outline-offset-[-3px] outline-orange-400 overflow-hidden z-10">
        <div className="absolute inset-0 z-0">
          <Threads 
            color={[1, 0.5, 0]} 
            amplitude={0.5} 
            distance={0.1} 
            enableMouseInteraction={true}
          />
        </div>
        <p className="left-[22px] top-[66px] absolute justify-center text-white text-lg md:text-xl lg:text-2xl font-normal font-['Baloo_Bhai_2'] leading-8 md:leading-10 z-10">
          Session Status: 
        </p>
        <p className="left-[22px] top-[25px] absolute justify-center text-white text-lg md:text-xl lg:text-2xl font-normal font-['Baloo_Bhai_2'] leading-8 md:leading-10 z-10">
          Voting Session: 
        </p>
      </div>
  
      <Footer />
    </div>
  );
} 