"use client";
import type { NextPage } from 'next';
import Header from '../components/Header';
import PollCard from '../components/PollCard';

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

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-t from-[#8b0000] to-[#b38308] text-white font-inter">

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full px-[35px]">
        <h1 className="mt-[198px] ml-[40px] text-[48px] font-semibold tracking-[-0.02em]">
          Election Results
        </h1>

        <div className="mt-[100px] flex flex-col items-center gap-[32px] text-[32px] font-jaldi pb-[160px]">
          {pollsData.map((poll, index) => (
            <div key={index} className="w-[1280px]">
              <PollCard position={poll.position} candidates={poll.candidates} />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full shadow-[0_-5px_4px_rgba(0,0,0,0.5)] bg-[#7c0101] h-[156px]">
        <div className="flex items-center justify-center h-full">
          <div className="w-[57px] h-[30px]" />
        </div>
      </footer>
    </div>
  );
};

export default Results;
