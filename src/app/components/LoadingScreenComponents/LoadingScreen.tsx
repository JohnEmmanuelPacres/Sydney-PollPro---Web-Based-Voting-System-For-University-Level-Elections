'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Kill any existing animations
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }

    // Clear particle animations
    particlesRef.current.forEach(particle => {
      if (particle) gsap.killTweensOf(particle);
    });

    if (isLoading && !isVisibleRef.current) {
      // Show loading screen
      isVisibleRef.current = true;
      
      // Reset all elements to initial state
      gsap.set(containerRef.current, { 
        display: 'flex', 
        zIndex: 99999999, // Much higher than Next.js loader
        opacity: 1
      });
      
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(logoRef.current, { scale: 0.5, opacity: 0, rotation: -10 });
      gsap.set(spinnerRef.current, { rotation: 0 });
      gsap.set(textRef.current, { y: 30, opacity: 0 });
      gsap.set(progressBarRef.current, { scaleX: 0, opacity: 0 });
      gsap.set(progressFillRef.current, { width: '0%' });
      
      // Create entrance animation timeline
      animationRef.current = gsap.timeline();
      
      animationRef.current
        // Background fade in
        .to(overlayRef.current, { 
          opacity: 1, 
          duration: 0.4, 
          ease: 'power2.out' 
        })
        // Logo animation
        .to(logoRef.current, {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.6,
          ease: 'back.out(1.7)'
        }, '-=0.2')
        // Spinner continuous rotation
        .to(spinnerRef.current, {
          rotation: 360,
          duration: 1.5,
          repeat: -1,
          ease: 'none'
        }, '-=0.3')
        // Text animation
        .to(textRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.8')
        // Progress bar appear
        .to(progressBarRef.current, {
          scaleX: 1,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out'
        }, '-=0.3')
        // Progress fill continuous animation
        .to(progressFillRef.current, {
          width: '100%',
          duration: 2,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        }, '-=0.2');

      // Animate particles
      particlesRef.current.forEach((particle, index) => {
        if (particle) {
          gsap.to(particle, {
            y: -20 + Math.random() * 10,
            x: Math.random() * 40 - 20,
            opacity: 0.7,
            duration: 2 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            delay: index * 0.2,
            ease: 'sine.inOut'
          });
        }
      });

    } else if (!isLoading && isVisibleRef.current) {
      // Hide loading screen
      isVisibleRef.current = false;
      
      // Create exit animation timeline
      const exitTl = gsap.timeline();
      
      exitTl
        .to(progressFillRef.current, {
          width: '100%',
          duration: 0.2,
          ease: 'power2.out'
        })
        .to(logoRef.current, {
          scale: 1.1,
          duration: 0.15,
          ease: 'power2.out'
        }, '-=0.1')
        .to([logoRef.current, spinnerRef.current, textRef.current, progressBarRef.current], {
          y: -30,
          opacity: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.in'
        }, '-=0.1')
        .to(overlayRef.current, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in'
        }, '-=0.15')
        .set(containerRef.current, { 
          display: 'none',
          zIndex: -1
        });
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
      particlesRef.current.forEach(particle => {
        if (particle) gsap.killTweensOf(particle);
      });
    };
  }, [isLoading]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        display: 'none', 
        zIndex: 99999999 // Ensure it's above Next.js loader
      }}
    >
      {/* Animated Background */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-amber-900"
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) particlesRef.current[i] = el;
            }}
            className="absolute w-2 h-2 bg-amber-400 rounded-full opacity-40"
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
          />
        ))}
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 flex flex-col items-center space-y-6 p-8">
        {/* Logo */}
        <div ref={logoRef} className="relative">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
            <img 
              src="/Website Logo.png" 
              alt="UniVote Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>

        {/* Spinner */}
        <div className="relative">
          <div
            ref={spinnerRef}
            className="w-12 h-12 border-4 border-white/20 border-t-amber-400 border-r-yellow-500 rounded-full"
          />
          <div className="absolute inset-2 border-2 border-white/10 border-b-amber-300 rounded-full animate-ping"></div>
        </div>

          {/* Text */}
          <div ref={textRef} className="text-center space-y-4 mb-6">  
            <h2 className="text-xl font-semibold text-white tracking-wide">
              Loading UniVote
            </h2>
            <p className="text-sm text-amber-100">
              Preparing your secure voting experience
            </p>
          </div>

          {/* Progress Bar */}
          <div
            ref={progressBarRef}
            className="w-80 h-2 bg-white/20 rounded-full overflow-hidden shadow-inner backdrop-blur-sm mt-4"
          >
            <div
              ref={progressFillRef}
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full shadow-lg"
              style={{ width: '0%' }}
            />
          </div>

        {/* Bouncing Dots */}
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;