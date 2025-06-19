import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

type Candidate = {
  name: string;
  votes: number;
};

type PollCardProps = {
  position: string;
  candidates: Candidate[];
};

const PollCard: React.FC<PollCardProps> = ({ position, candidates }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const voteCountRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shineRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const highestVote = Math.max(...candidates.map(c => c.votes));

  useEffect(() => {
    voteCountRefs.current = voteCountRefs.current.slice(0, candidates.length);
    progressBarRefs.current = progressBarRefs.current.slice(0, candidates.length);
    shineRefs.current = shineRefs.current.slice(0, candidates.length);
  }, [candidates]);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    // Card entrance animation
    if (cardRef.current) {
      tl.fromTo(cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 }
      );
    }

    // Animate each candidate item with stagger
    candidates.forEach((candidate, i) => {
      const percentage = (candidate.votes / highestVote) * 100;
      
      if (voteCountRefs.current[i]) {
        // Vote count animation
        tl.to(voteCountRefs.current[i], {
          innerText: candidate.votes.toString(),
          duration: 2,
          snap: { innerText: 1 },
          delay: i * 0.1,
        }, "<");
      }

      if (progressBarRefs.current[i]) {
        // Progress bar animation
        tl.to(progressBarRefs.current[i], {
          width: `${percentage}%`,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)",
        }, "<");

        // Pulse glow effect
        tl.to(progressBarRefs.current[i], {
          boxShadow: "0 0 15px rgba(124, 1, 1, 0.8), 0 0 25px rgba(212, 157, 71, 0.3)",
          duration: 1.5,
          yoyo: true,
          repeat: -1,
        }, "<");
      }

      if (shineRefs.current[i]) {
        // Shine animation
        tl.to(shineRefs.current[i], {
          x: "100%",
          duration: 2,
          ease: "none",
          repeat: -1,
        }, "<");
      }
    });

    return () => {
      tl.kill();
    };
  }, [candidates, highestVote]);

  const assignRef = <T extends HTMLElement>(ref: React.MutableRefObject<(T | null)[]>, index: number) => 
    (el: T | null) => {
      if (el) ref.current[index] = el;
    };

  return (
    <div 
      ref={cardRef}
      className="self-stretch rounded-[8px] bg-black/20 border-[4px] border-[#d49d47] h-auto flex flex-col items-start justify-start px-[30px] py-[24px] gap-[4px]"
    >
      <div className="text-[40px] text-[#fff9f9] font-['Baloo_2']">
        <div className="leading-[150%] font-medium">{position} Polls</div>
      </div>
      
      {candidates.map((candidate, index) => (
        <div
          key={index}
          className="w-full bg-transparent overflow-hidden flex flex-col items-start justify-start px-[17px] py-[6px] gap-[4px]"
        >
          <div className="h-[33px] flex flex-row items-center justify-center py-[10px]">
            <b className="leading-[150%] hover:text-[#d49d47] transition-colors duration-300">
              {candidate.name}
            </b>
          </div>
          
          <div className="h-[32px] flex flex-row items-center justify-center py-[10px] text-[21px]">
            <b 
              ref={assignRef<HTMLDivElement>(voteCountRefs, index)}
              className="leading-[150%] tabular-nums"
            >
              0 votes
            </b>
          </div>
          
          <div className="w-full rounded-[8px] bg-white border border-[#d49d47] h-[17px] flex flex-row items-center justify-start px-[3px] overflow-hidden">
            <div
              ref={assignRef<HTMLDivElement>(progressBarRefs, index)}
              className="relative rounded-[25px] bg-gradient-to-r from-[#7c0101] to-[#a51d1d] h-[12px] shadow-sm"
              style={{ width: '0%' }}
            >
              <div 
                ref={assignRef<HTMLDivElement>(shineRefs, index)}
                className="absolute top-0 left-0 h-full w-full rounded-[25px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{ transform: 'translateX(-100%)' }}
              />
            </div>
          </div>
        </div>
      ))}
      
      <div className="text-[24px] leading-[150%] font-inter text-[#828282] mt-2">
        Active Student Voters
      </div>
    </div>
  );
};

export default PollCard;