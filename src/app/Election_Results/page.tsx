"use client";
import { NextPage } from 'next';
import Header from '../components/Header';
import PollCard from '../components/PollCard';
import Footer from '../components/Footer';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Results: NextPage = () => {
  const pollsData = [
    {
      position: 'Presidential',
      candidates: [
        { name: 'Harlie Khurt Canas', votes: 1708 },
        { name: 'Chucky Korbin Ebesa', votes: 1400 },
        { name: 'Sean Richard Tadiamon', votes: 1300 },
      ],
    },
    {
      position: 'Vice Presidential',
      candidates: [
        { name: 'Candidate A', votes: 1500 },
        { name: 'Candidate B', votes: 1200 },
        { name: 'Candidate C', votes: 1000 },
      ],
    },
  ];

  const pollCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Store refs without returning anything
  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    pollCardsRef.current[index] = el;
  };

  useEffect(() => {
    // Set initial state for all elements to prevent flash
    gsap.set(pollCardsRef.current, { x: 0, opacity: 0 });
    gsap.set(titleRef.current, { y: -50, opacity: 0 });

    // Create timeline for smoother sequencing
    const tl = gsap.timeline();

    // Animate title first
    tl.to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    });

    // Then animate poll cards
    pollCardsRef.current.forEach((card, index) => {
      if (card) {
        tl.fromTo(card, 
          {
            x: index % 2 === 0 ? 100 : -100,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          index * 0.3 // Stagger delay
        );
      }
    });

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-t from-[#8b0000] to-[#b38308] text-white font-inter">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full px-[35px]">
        <h1 
          ref={titleRef}
          className="mt-[198px] ml-[40px] text-[48px] font-semibold tracking-[-0.02em]"
        >
          Election Results
        </h1>

        <div className="mt-[100px] flex flex-col items-center gap-[32px] text-[32px] font-jaldi pb-[160px]">
          {pollsData.map((poll, index) => (
            <div 
              key={index} 
              className="w-[1280px]"
              ref={(el) => addToRefs(el, index)}
            >
              <PollCard position={poll.position} candidates={poll.candidates} />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Results;