"use client";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StatsCard from "./components/StatsCard";
import Threads from "./components/Threads";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-t from-yellow-950 to-red-950">
      <Header />
      
      <main className="flex-1 relative">
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col justify-center items-center px-4 md:px-8 lg:px-16 pt-20 pb-16">
          <div className="text-center max-w-6xl mx-auto z-10">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-normal font-['Baloo_2'] text-white leading-tight md:leading-[105px] mb-6">
              Secure Digital Voting Platform
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl font-normal font-['Baloo_2'] text-stone-300 leading-8 md:leading-10 mb-4">
              Participate in university and departmental election transparently, securely, and accessibly.
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl font-normal font-['Baloo_2'] text-stone-300 leading-8 md:leading-10">
              Your voice matters!
            </p>
          </div>
        </section>

        {/* Voting Session Status */}
        <section className="px-4 md:px-8 lg:px-16 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="relative h-32 bg-gradient-to-r from-red-900 to-stone-950 rounded-md shadow-[0px_7px_4px_0px_rgba(0,0,0,0.25)] outline outline-[3px] outline-offset-[-3px] outline-orange-400 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <Threads 
                  color={[1, 0.5, 0]} 
                  amplitude={0.5} 
                  distance={0.1} 
                  enableMouseInteraction={true}
                />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-center px-6">
                <p className="text-white text-lg md:text-xl lg:text-2xl font-normal font-['Baloo_Bhai_2'] leading-8 md:leading-10">
                  Voting Session: 
                </p>
                <p className="text-white text-lg md:text-xl lg:text-2xl font-normal font-['Baloo_Bhai_2'] leading-8 md:leading-10">
                  Session Status: 
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Election Stats */}
        <section className="px-4 md:px-8 lg:px-16 py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-['Inter'] text-white mb-8">
              Current Election Stats
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatsCard 
                title="Total Registered Voters"
                value="2,847"
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
          </div>
        </section>
      </main>
  
      <Footer />
    </div>
  );
} 