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

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    pollCardsRef.current[index] = el;
  };

  useEffect(() => {
    gsap.set(pollCardsRef.current, { x: 0, opacity: 0 });
    gsap.set(titleRef.current, { y: -50, opacity: 0 });

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
          index * 0.3 
        );
      }
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-t from-yellow-900 to-red-900 text-white font-inter">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8">
        <h1 
          ref={titleRef}
          className="mt-24 md:mt-32 lg:mt-40 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-center md:text-left mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          Election Results
        </h1>

        <div className="mt-12 md:mt-16 lg:mt-20 flex flex-col items-center gap-6 md:gap-8 lg:gap-10 pb-20 md:pb-24 lg:pb-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {pollsData.map((poll, index) => (
            <div 
              key={index} 
              className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl"
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