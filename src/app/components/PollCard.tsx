import React from 'react';

type Candidate = {
  name: string;
  votes: number;
};

type PollCardProps = {
  position: string;
  candidates: Candidate[];
};

const PollCard: React.FC<PollCardProps> = ({ position, candidates }) => {
  const highestVote = Math.max(...candidates.map(c => c.votes));

  return (
    <div className="self-stretch rounded-[8px] bg-black/20 border-[4px] border-[#d49d47] h-auto flex flex-col items-start justify-start px-[30px] py-[24px] gap-[4px]">
      <div className="text-[40px] text-[#fff9f9] font-['Baloo_2']">
        <div className="leading-[150%] font-medium">{position} Polls</div>
      </div>
      {candidates.map((candidate, index) => (
        <div
          key={index}
          className="w-full bg-transparent overflow-hidden flex flex-col items-start justify-start px-[17px] py-[6px] gap-[4px]"
        >
          <div className="h-[33px] flex flex-row items-center justify-center py-[10px]">
            <b className="leading-[150%]">{candidate.name}</b>
          </div>
          <div className="h-[32px] flex flex-row items-center justify-center py-[10px] text-[21px]">
            <b className="leading-[150%]">{candidate.votes.toLocaleString()} votes</b>
          </div>
          <div className="w-full rounded-[8px] bg-white border border-[#d49d47] h-[17px] flex flex-row items-center justify-start px-[3px]">
            <div
              className="relative rounded-[25px] bg-[#7c0101] h-[12px]"
              style={{ width: `${(candidate.votes / highestVote) * 100}%` }}
            />
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