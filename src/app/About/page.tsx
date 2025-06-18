"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen relative bg-gradient-to-l from-yellow-600 to-red-800 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
      {/* Header*/}
      <header className="w-full h-32 left-0 top-0 absolute bg-red-900 shadow-[0px_5px_4px_0px_rgba(0,0,0,0.50)] overflow-hidden">
        <nav className="px-5 py-2.5 left-[641px] top-[35px] absolute inline-flex justify-start items-center gap-11">
          <button className="text-white text-xl font-medium font-['Inter'] leading-loose transition-all duration-300 ease-in-out transform-gpu hover:text-yellow-400 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] hover:scale-105 cursor-pointer" onClick={() => router.push("/")}>Home</button>
          <button className="text-white text-xl font-medium font-['Inter'] leading-loose transition-all duration-300 ease-in-out transform-gpu hover:text-yellow-400 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] hover:scale-105 cursor-pointer" onClick={() => router.push("/Election_Results")}>Results</button>
          <button className="text-white text-xl font-medium font-['Inter'] leading-loose transition-all duration-300 ease-in-out transform-gpu hover:text-yellow-400 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] hover:scale-105 cursor-pointer">Updates</button>
          <button className="text-white text-xl font-medium font-['Inter'] leading-loose transition-all duration-300 ease-in-out transform-gpu hover:text-yellow-400 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] hover:scale-105 cursor-pointer">About</button>
        </nav>
        <h1 className="left-[213px] top-[32px] absolute justify-center text-white text-5xl font-normal font-['Abyssinica_SIL'] leading-[67.50px]">UniVote</h1>
        <Image 
          className="w-28 h-28 left-[38px] top-[7px] absolute" 
          src="/logo.png" 
          alt="UniVote Logo" 
          width={112}
          height={112}
          priority
        />
        <Link href="/User_RegxLogin" className="w-32 px-6 py-3.5 left-[1180px] top-[32px] absolute bg-gradient-to-br from-stone-600 to-orange-300 rounded-[999px] shadow-[1px_2px_6px_0px_rgba(0,0,0,0.40)] shadow-[2px_4px_18px_0px_rgba(0,0,0,0.20)] shadow-[-1px_-2px_6px_0px_rgba(250,195,107,0.40)] shadow-[-2px_-4px_18px_0px_rgba(250,195,107,0.10)] outline outline-[3px] outline-offset-[-3px] outline-orange-300 inline-flex justify-center items-center gap-2 transition-all duration-300 ease-in-out hover:scale-105">
          <span className="justify-center text-white text-xl font-normal font-['Jaldi'] leading-loose">SIGN IN</span>
        </Link>
      </header>

      {/* Hero Section*/}
      <div className="w-full h-[809px] left-0 top-[128px] absolute overflow-hidden">
        <Image
          src="/hero-image.png"
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
      <footer className="w-full h-40 bg-[#7c0101] shadow-[0_-5px_4px_rgba(0,0,0,0.5)] absolute bottom-0">
        <div className="h-full flex items-center justify-center">
          <p className="text-white text-lg">© 2025 UniVote. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}