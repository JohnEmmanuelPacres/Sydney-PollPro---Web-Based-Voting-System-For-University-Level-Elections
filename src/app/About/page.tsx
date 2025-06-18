"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen relative bg-gradient-to-l from-yellow-600 to-red-800 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
      <Header />

      {/* Hero Section - Keep existing changes that worked */}
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
        <div className="absolute left-1/2 top-[40%] transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-4">
          <h1 className="text-red-500 text-6xl md:text-9xl font-black font-['Inter'] mb-4">Sydney Polls</h1>
          <p className="text-black text-xl md:text-3xl font-black font-['Inter']">Empowering every vote, shaping every future.</p>
        </div>
      </div>

      {/* Team Section - Fixed positioning to be below hero image */}
      <div className="w-full relative pb-60" style={{ marginTop: '937px' }}> {/* Changed from 750px to 937px (128px header + 809px hero) */}
        <div className="w-full text-center mb-16">
          <h2 className="text-red-300 text-6xl md:text-9xl font-black font-['Inter']">
            Meet the team
          </h2>
        </div>

        <div className="container mx-auto px-4">
          {/* Team Member 1 - Fixed 50% overlap */}
          <div className="flex flex-col md:flex-row items-center justify-center mb-16 relative">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-orange-700 rounded-full shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center justify-center relative z-10"
                 style={{ marginRight: '-192px' }}> {/* 50% of 384px (w-96) = 192px */}
              <span className="text-white text-2xl">Team Member 1</span>
            </div>
            <div className="w-full md:w-[963px] h-64 md:h-96 bg-amber-300 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
              <h3 className="text-black text-2xl md:text-4xl font-black font-['Inter']">Frontend Developer</h3>
            </div>
          </div>

          {/* Team Member 2 - Fixed 50% overlap on reverse side */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-center mb-16 relative">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-orange-700 rounded-full shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center justify-center relative z-10"
                 style={{ marginLeft: '-192px' }}> {/* 50% overlap on left side */}
              <span className="text-white text-2xl">Team Member 2</span>
            </div>
            <div className="w-full md:w-[963px] h-64 md:h-96 bg-amber-300 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
              <h3 className="text-black text-2xl md:text-4xl font-black font-['Inter']">Frontend Developer</h3>
            </div>
          </div>

          {/* Team Member 3 - Fixed 50% overlap */}
          <div className="flex flex-col md:flex-row items-center justify-center mb-16 relative">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-rose-800 rounded-full shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center justify-center relative z-10"
                 style={{ marginRight: '-192px' }}> {/* 50% overlap */}
              <span className="text-white text-2xl">Team Member 3</span>
            </div>
            <div className="w-full md:w-[963px] h-64 md:h-96 bg-amber-300 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
              <h3 className="text-black text-2xl md:text-4xl font-black font-['Inter']">Backend Developer</h3>
            </div>
          </div>

          {/* Team Member 4 - Fixed 50% overlap on reverse side */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-center mb-32 relative">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-rose-800 rounded-full shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center justify-center relative z-10"
                 style={{ marginLeft: '-192px' }}> {/* 50% overlap on left side */}
              <span className="text-white text-2xl">Team Member 4</span>
            </div>
            <div className="w-full md:w-[963px] h-64 md:h-96 bg-amber-300 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
              <h3 className="text-black text-2xl md:text-4xl font-black font-['Inter']">Backend Developer</h3>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full h-40 bg-[#7c0101] shadow-[0_-5px_4px_rgba(0,0,0,0.5)] absolute bottom-0">
        <div className="h-full flex items-center justify-center">
          <p className="text-white text-lg">© 2025 UniVote. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}