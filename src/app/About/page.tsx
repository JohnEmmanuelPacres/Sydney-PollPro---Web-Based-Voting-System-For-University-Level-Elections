"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Footer from "../components/Footer";
import Header from '../components/Header';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const router = useRouter();
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const teamTitleRef = useRef<HTMLDivElement>(null);
  const teamMembersRef = useRef<(HTMLDivElement | null)[]>([]);

  const addToTeamRefs = (el: HTMLDivElement | null, index: number) => {
    teamMembersRef.current[index] = el;
  };

  useEffect(() => {
    gsap.set(heroImageRef.current, { scale: 0.5, opacity: 0 });
    gsap.set(heroTitleRef.current, { y: 100, opacity: 0, scale: 0.8 });
    gsap.set(heroSubtitleRef.current, { y: 50, opacity: 0 });
    gsap.set(teamTitleRef.current, { y: 100, opacity: 0, scale: 0.9 });
    gsap.set(teamMembersRef.current, { x: -100, opacity: 0 });

    // Create main timeline
    const mainTl = gsap.timeline();

    // Hero section animations
    mainTl
      .to(heroImageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out"
      })
      .to(heroTitleRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)"
      }, "-=0.6")
      .to(heroSubtitleRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4");

    // Team title scroll animation
    gsap.to(teamTitleRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: teamTitleRef.current,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Team members scroll animations
    teamMembersRef.current.forEach((member, index) => {
      if (member) {
        gsap.to(member, {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: member,
            start: "top 85%",
            end: "top 15%",
            toggleActions: "play none none reverse"
          },
          delay: index * 0.2
        });

        // Add hover animations
        const circle = member.querySelector('.team-circle');
        const card = member.querySelector('.team-card');
        
        if (circle && card) {
          // Hover in
          member.addEventListener('mouseenter', () => {
            gsap.to(circle, {
              scale: 1.05,
              duration: 0.3,
              ease: "power2.out"
            });
            gsap.to(card, {
              scale: 1.02,
              duration: 0.3,
              ease: "power2.out"
            });
          });

          // Hover out
          member.addEventListener('mouseleave', () => {
            gsap.to(circle, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            });
            gsap.to(card, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            });
          });
        }
      }
    });

    // Add hover effects for hero elements
    if (heroTitleRef.current) {
      heroTitleRef.current.addEventListener('mouseenter', () => {
        gsap.to(heroTitleRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      heroTitleRef.current.addEventListener('mouseleave', () => {
        gsap.to(heroTitleRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    }

    if (heroSubtitleRef.current) {
      heroSubtitleRef.current.addEventListener('mouseenter', () => {
        gsap.to(heroSubtitleRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      heroSubtitleRef.current.addEventListener('mouseleave', () => {
        gsap.to(heroSubtitleRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    }

    // Team title hover effect - REMOVED

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      mainTl.kill();
    };
  }, []);

  return (
    <div className="w-full min-h-screen relative bg-gradient-to-br from-yellow-600 via-orange-500 to-red-800 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
      <Header />

      {/* Hero Section */}
      <div className="w-full h-[809px] left-0 top-[128px] absolute overflow-hidden">
        <div ref={heroImageRef} className="w-full h-full">
          <Image
            src="/hero-image.jpg"
            alt="Sydney Polls Background"
            layout="fill"
            objectFit="cover"
            quality={100}
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute left-1/2 top-[40%] transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-4 z-10">
          <h1 
            ref={heroTitleRef}
            className="text-red-500 text-6xl md:text-9xl font-black font-['Inter'] mb-4 
                       drop-shadow-[0_8px_8px_rgba(0,0,0,0.6)] cursor-pointer"
          >
            Sydney Polls
          </h1>
          <p 
            ref={heroSubtitleRef}
            className="text-white text-xl md:text-3xl font-black font-['Inter'] 
                      drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] cursor-pointer"
          >
            Empowering every vote, shaping every future.
          </p>
        </div>
      </div>

      {/* 3D Team Section */}
      <div className="w-full relative pb-60" style={{ marginTop: '1050px' }}>
        {/* 3D Framed "Meet the team" title */}
        <div className="w-full text-center mb-32 relative flex justify-center">
          <div 
            ref={teamTitleRef}
            className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-red-600 p-8 md:p-12
                      shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_-8px_16px_rgba(0,0,0,0.3),inset_0_8px_16px_rgba(255,255,255,0.2)]
                      border-8 border-red-900 rounded-3xl
                      before:absolute before:inset-[-4px] before:bg-red-900 before:-z-10 before:rounded-[28px]
                      after:absolute after:inset-[-8px] after:bg-red-800 after:-z-20 after:rounded-[32px] after:blur-sm"
          >
            <h2 className="text-6xl md:text-9xl font-black font-['Inter'] relative
                         bg-gradient-to-b from-white via-gray-100 to-gray-200 bg-clip-text text-transparent
                         drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]
                         before:content-[attr(data-text)] before:absolute before:inset-0 
                         before:bg-gradient-to-t before:from-gray-400 before:to-gray-300 before:bg-clip-text before:text-transparent
                         before:translate-x-[2px] before:translate-y-[2px] before:-z-10
                         after:content-[attr(data-text)] after:absolute after:inset-0
                         after:bg-gradient-to-br after:from-gray-600 after:to-black after:bg-clip-text after:text-transparent
                         after:translate-x-[4px] after:translate-y-[4px] after:-z-20"
                data-text="Meet the team"
            >
              Meet the team
            </h2>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Team Member 1 */}
          <div 
            ref={(el) => addToTeamRefs(el, 0)}
            className="flex flex-col md:flex-row items-center justify-center mb-24 relative group"
          >
            <div className="team-circle w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-orange-600 to-orange-800 rounded-full 
                          shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-8px_-8px_20px_rgba(0,0,0,0.3),inset_8px_8px_20px_rgba(255,255,255,0.1)] 
                          flex items-center justify-center relative z-10
                          border-2 border-orange-400"
                 style={{ marginRight: '-192px' }}
            > 
              <span className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">Team Member 1</span>
            </div>
            <div className="team-card w-full md:w-[963px] h-64 md:h-96 bg-gradient-to-r from-amber-300 to-amber-400 
                          shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-8px_-8px_20px_rgba(0,0,0,0.2),inset_8px_8px_20px_rgba(255,255,255,0.3)] 
                          flex items-center justify-center rounded-3xl
                          border-2 border-amber-500"
            >
              <h3 className="text-black text-2xl md:text-4xl font-black font-['Inter'] drop-shadow-md">Frontend Developer</h3>
            </div>
          </div>

          {/* Team Member 2 */}
          <div 
            ref={(el) => addToTeamRefs(el, 1)}
            className="flex flex-col md:flex-row-reverse items-center justify-center mb-24 relative group"
          >
            <div className="team-circle w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-orange-600 to-orange-800 rounded-full 
                          shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-8px_-8px_20px_rgba(0,0,0,0.3),inset_8px_8px_20px_rgba(255,255,255,0.1)] 
                          flex items-center justify-center relative z-10
                          border-2 border-orange-400"
                 style={{ marginLeft: '-192px' }}
            > 
              <span className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">Team Member 2</span>
            </div>
            <div className="team-card w-full md:w-[963px] h-64 md:h-96 bg-gradient-to-l from-amber-300 to-amber-400 
                          shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-8px_-8px_20px_rgba(0,0,0,0.2),inset_8px_8px_20px_rgba(255,255,255,0.3)] 
                          flex items-center justify-center rounded-3xl
                          border-2 border-amber-500"
            >
              <h3 className="text-black text-2xl md:text-4xl font-black font-['Inter'] drop-shadow-md">Frontend Developer</h3>
            </div>
          </div>

          {/* Team Member 3 */}
          <div 
            ref={(el) => addToTeamRefs(el, 2)}
            className="flex flex-col md:flex-row items-center justify-center mb-24 relative group"
          >
            <div className="team-circle w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-rose-700 to-rose-900 rounded-full 
                          shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-8px_-8px_20px_rgba(0,0,0,0.3),inset_8px_8px_20px_rgba(255,255,255,0.1)] 
                          flex items-center justify-center relative z-10
                          border-2 border-rose-400"
                 style={{ marginRight: '-192px' }}
            > 
              <span className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">Team Member 3</span>
            </div>
            <div className="team-card w-full md:w-[963px] h-64 md:h-96 bg-gradient-to-r from-amber-300 to-amber-400 
                          shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-8px_-8px_20px_rgba(0,0,0,0.2),inset_8px_8px_20px_rgba(255,255,255,0.3)] 
                          flex items-center justify-center rounded-3xl
                          border-2 border-amber-500"
            >
              <h3 className="text-black text-2xl md:text-4xl font-black font-['Inter'] drop-shadow-md">Backend Developer</h3>
            </div>
          </div>

          {/* Team Member 4 */}
          <div 
            ref={(el) => addToTeamRefs(el, 3)}
            className="flex flex-col md:flex-row-reverse items-center justify-center mb-32 relative group"
          >
            <div className="team-circle w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-rose-700 to-rose-900 rounded-full 
                          shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-8px_-8px_20px_rgba(0,0,0,0.3),inset_8px_8px_20px_rgba(255,255,255,0.1)] 
                          flex items-center justify-center relative z-10
                          border-2 border-rose-400"
                 style={{ marginLeft: '-192px' }}
            > 
              <span className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">Team Member 4</span>
            </div>
            <div className="team-card w-full md:w-[963px] h-64 md:h-96 bg-gradient-to-l from-amber-300 to-amber-400 
                          shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-8px_-8px_20px_rgba(0,0,0,0.2),inset_8px_8px_20px_rgba(255,255,255,0.3)] 
                          flex items-center justify-center rounded-3xl
                          border-2 border-amber-500"
            >
              <h3 className="text-black text-2xl md:text-4xl font-black font-['Inter'] drop-shadow-md">Backend Developer</h3>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}