"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen relative bg-gradient-to-br from-yellow-600 via-orange-500 to-red-800 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
      <Header />

      {/* Hero Section */}
      <div className="w-full h-[809px] left-0 top-[128px] absolute overflow-hidden">
        <Image
          src="/hero-image.jpg"
          alt="Sydney Polls Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute left-1/2 top-[40%] transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-4 z-10">
          <h1 className="text-red-500 text-6xl md:text-9xl font-black font-['Inter'] mb-4 
                       drop-shadow-[0_8px_8px_rgba(0,0,0,0.6)] transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            Sydney Polls
          </h1>
          <p className="text-white text-xl md:text-3xl font-black font-['Inter'] 
                      drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            Empowering every vote, shaping every future.
          </p>
        </div>
      </div>

      {/* Enhanced 3D Team Section */}
      <div className="w-full relative pb-60" style={{ marginTop: '1050px' }}>
        {/* 3D Framed "Meet the team" title */}
        <div className="w-full text-center mb-32 relative flex justify-center">
          <div className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-red-600 p-8 md:p-12
                        shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_-8px_16px_rgba(0,0,0,0.3),inset_0_8px_16px_rgba(255,255,255,0.2)]
                        border-8 border-red-900 rounded-3xl
                        transform hover:scale-105 transition-all duration-300 cursor-pointer
                        hover:shadow-[0_25px_50px_rgba(0,0,0,0.5),inset_0_-10px_20px_rgba(0,0,0,0.4),inset_0_10px_20px_rgba(255,255,255,0.3)]
                        hover:bg-gradient-to-br hover:from-yellow-300 hover:via-orange-300 hover:to-red-500 hover:brightness-125
                        before:absolute before:inset-[-4px] before:bg-red-900 before:-z-10 before:rounded-[28px]
                        after:absolute after:inset-[-8px] after:bg-red-800 after:-z-20 after:rounded-[32px] after:blur-sm">
            <h2 className="text-6xl md:text-9xl font-black font-['Inter'] relative
                         bg-gradient-to-b from-red-200 via-red-300 to-red-500 bg-clip-text text-transparent
                         drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]
                         before:content-[attr(data-text)] before:absolute before:inset-0 
                         before:bg-gradient-to-t before:from-red-800 before:to-red-600 before:bg-clip-text before:text-transparent
                         before:translate-x-[2px] before:translate-y-[2px] before:-z-10
                         after:content-[attr(data-text)] after:absolute after:inset-0
                         after:bg-gradient-to-br after:from-red-900 after:to-black after:bg-clip-text after:text-transparent
                         after:translate-x-[4px] after:translate-y-[4px] after:-z-20
                         hover:drop-shadow-[0_0_30px_rgba(255,255,0,0.8)]"
                data-text="Meet the team">
              Meet the team
            </h2>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Team Member 1 - Enhanced 3D effects */}
          <div className="flex flex-col md:flex-row items-center justify-center mb-24 relative group">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-orange-600 to-orange-800 rounded-full 
                          shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-8px_-8px_20px_rgba(0,0,0,0.3),inset_8px_8px_20px_rgba(255,255,255,0.1)] 
                          flex items-center justify-center relative z-10 transform transition-all duration-300
                          hover:shadow-[25px_25px_50px_rgba(0,0,0,0.5),inset_-10px_-10px_25px_rgba(0,0,0,0.4),inset_10px_10px_25px_rgba(255,255,255,0.15)]
                          hover:scale-105 border-2 border-orange-400"
                 style={{ marginRight: '-192px' }}> 
              <span className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">Team Member 1</span>
            </div>
            <div className="w-full md:w-[963px] h-64 md:h-96 bg-gradient-to-r from-amber-300 to-amber-400 
                          shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-8px_-8px_20px_rgba(0,0,0,0.2),inset_8px_8px_20px_rgba(255,255,255,0.3)] 
                          flex items-center justify-center transform transition-all duration-300
                          hover:shadow-[25px_25px_50px_rgba(0,0,0,0.5),inset_-10px_-10px_25px_rgba(0,0,0,0.3),inset_10px_10px_25px_rgba(255,255,255,0.4)]
                          hover:scale-[1.02] border-2 border-amber-500">
              <h3 className="text-black text-2xl md:text-4xl font-black font-['Inter'] drop-shadow-md">Frontend Developer</h3>
            </div>
          </div>

          {/* Team Member 2 - Enhanced 3D effects */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-center mb-24 relative group">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-orange-600 to-orange-800 rounded-full 
                          shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-8px_-8px_20px_rgba(0,0,0,0.3),inset_8px_8px_20px_rgba(255,255,255,0.1)] 
                          flex items-center justify-center relative z-10 transform transition-all duration-300
                          hover:shadow-[25px_25px_50px_rgba(0,0,0,0.5),inset_-10px_-10px_25px_rgba(0,0,0,0.4),inset_10px_10px_25px_rgba(255,255,255,0.15)]
                          hover:scale-105 border-2 border-orange-400"
                 style={{ marginLeft: '-192px' }}> 
              <span className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">Team Member 2</span>
            </div>
            <div className="w-full md:w-[963px] h-64 md:h-96 bg-gradient-to-l from-amber-300 to-amber-400 
                          shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-8px_-8px_20px_rgba(0,0,0,0.2),inset_8px_8px_20px_rgba(255,255,255,0.3)] 
                          flex items-center justify-center transform transition-all duration-300
                          hover:shadow-[25px_25px_50px_rgba(0,0,0,0.5),inset_-10px_-10px_25px_rgba(0,0,0,0.3),inset_10px_10px_25px_rgba(255,255,255,0.4)]
                          hover:scale-[1.02] border-2 border-amber-500">
              <h3 className="text-black text-2xl md:text-4xl font-black font-['Inter'] drop-shadow-md">Frontend Developer</h3>
            </div>
          </div>

          {/* Team Member 3 - Enhanced 3D effects */}
          <div className="flex flex-col md:flex-row items-center justify-center mb-24 relative group">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-rose-700 to-rose-900 rounded-full 
                          shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-8px_-8px_20px_rgba(0,0,0,0.3),inset_8px_8px_20px_rgba(255,255,255,0.1)] 
                          flex items-center justify-center relative z-10 transform transition-all duration-300
                          hover:shadow-[25px_25px_50px_rgba(0,0,0,0.5),inset_-10px_-10px_25px_rgba(0,0,0,0.4),inset_10px_10px_25px_rgba(255,255,255,0.15)]
                          hover:scale-105 border-2 border-rose-400"
                 style={{ marginRight: '-192px' }}> 
              <span className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">Team Member 3</span>
            </div>
            <div className="w-full md:w-[963px] h-64 md:h-96 bg-gradient-to-r from-amber-300 to-amber-400 
                          shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-8px_-8px_20px_rgba(0,0,0,0.2),inset_8px_8px_20px_rgba(255,255,255,0.3)] 
                          flex items-center justify-center transform transition-all duration-300
                          hover:shadow-[25px_25px_50px_rgba(0,0,0,0.5),inset_-10px_-10px_25px_rgba(0,0,0,0.3),inset_10px_10px_25px_rgba(255,255,255,0.4)]
                          hover:scale-[1.02] border-2 border-amber-500">
              <h3 className="text-black text-2xl md:text-4xl font-black font-['Inter'] drop-shadow-md">Backend Developer</h3>
            </div>
          </div>

          {/* Team Member 4 - Enhanced 3D effects */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-center mb-32 relative group">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-rose-700 to-rose-900 rounded-full 
                          shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-8px_-8px_20px_rgba(0,0,0,0.3),inset_8px_8px_20px_rgba(255,255,255,0.1)] 
                          flex items-center justify-center relative z-10 transform transition-all duration-300
                          hover:shadow-[25px_25px_50px_rgba(0,0,0,0.5),inset_-10px_-10px_25px_rgba(0,0,0,0.4),inset_10px_10px_25px_rgba(255,255,255,0.15)]
                          hover:scale-105 border-2 border-rose-400"
                 style={{ marginLeft: '-192px' }}> 
              <span className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">Team Member 4</span>
            </div>
            <div className="w-full md:w-[963px] h-64 md:h-96 bg-gradient-to-l from-amber-300 to-amber-400 
                          shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-8px_-8px_20px_rgba(0,0,0,0.2),inset_8px_8px_20px_rgba(255,255,255,0.3)] 
                          flex items-center justify-center transform transition-all duration-300
                          hover:shadow-[25px_25px_50px_rgba(0,0,0,0.5),inset_-10px_-10px_25px_rgba(0,0,0,0.3),inset_10px_10px_25px_rgba(255,255,255,0.4)]
                          hover:scale-[1.02] border-2 border-amber-500">
              <h3 className="text-black text-2xl md:text-4xl font-black font-['Inter'] drop-shadow-md">Backend Developer</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced 3D Footer - Restored to original */}
      <footer className="w-full h-40 bg-[#7c0101] shadow-[0_-5px_4px_rgba(0,0,0,0.5)] absolute bottom-0">
        <div className="h-full flex items-center justify-center">
          <p className="text-white text-lg">© 2025 UniVote. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}