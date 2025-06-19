"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from "../components/Footer";
import Header from '../components/Header';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen relative bg-gradient-to-l from-yellow-600 to-red-800 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
      {/* Header */}
      <Header />

      {/* Hero Section*/}
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
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-4">
          <h1 className="text-red-500 text-6xl md:text-9xl font-black font-['Inter'] mb-4">Sydney Polls</h1>
          <p className="text-black text-xl md:text-3xl font-black font-['Inter']">Empowering every vote, shaping every future.</p>
        </div>
      </div>

      {/* Team Section */}
      <div className="w-full relative mt-[809px] pb-40">
        <div className="w-full text-center pt-16">
          <h2 className="text-red-300 text-6xl md:text-9xl font-black font-['Inter'] mb-16">Meet the team</h2>
        </div>

        <div className="container mx-auto px-4">
          {/* First Team Member */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-orange-700 rounded-full shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
              {/* Placeholder for team member image */}
              <span className="text-white text-2xl">Team Member 1</span>
            </div>
            <div className="w-full md:w-[963px] h-64 md:h-96 bg-amber-300 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
              <h3 className="text-black text-2xl md:text-4xl font-black font-['Inter']">Frontend Developer</h3>
            </div>
          </div>

          {/* Second Team Member */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-8 mb-16">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-orange-700 rounded-full shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
              <span className="text-white text-2xl">Team Member 2</span>
            </div>
            <div className="w-full md:w-[963px] h-64 md:h-96 bg-amber-300 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
              <h3 className="text-black text-2xl md:text-4xl font-black font-['Inter']">Frontend Developer</h3>
            </div>
          </div>

          {/* Third Team Member */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-rose-800 rounded-full shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
              <span className="text-white text-2xl">Team Member 3</span>
            </div>
            <div className="w-full md:w-[963px] h-64 md:h-96 bg-amber-300 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
              <h3 className="text-black text-2xl md:text-4xl font-black font-['Inter']">Backend Developer</h3>
            </div>
          </div>

          {/* Fourth Team Member */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-8">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-rose-800 rounded-full shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
              <span className="text-white text-2xl">Team Member 4</span>
            </div>
            <div className="w-full md:w-[963px] h-64 md:h-96 bg-amber-300 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
              <h3 className="text-black text-2xl md:text-4xl font-black font-['Inter']">Backend Developer</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}