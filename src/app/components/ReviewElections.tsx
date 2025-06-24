import type { NextPage } from 'next';

const ReviewElectionPanel: NextPage = () => {
  return (
    <div
      className="w-full relative backdrop-blur-md rounded-[14px] bg-white border-[4px] border-[#ac6d6c] box-border
                 h-[180px] flex flex-col items-start justify-start px-[39px] py-[26px] gap-[40px] text-left text-[34px]
                 text-black font-['Baloo_2']"
    >
      <div className="w-[564px] relative h-[51px]">
        <div className="absolute w-full top-0 left-0 leading-[150%] font-medium flex items-center">
          CIT-U HALALAN - 2027
        </div>
      </div>
      <div
        className="flex flex-row items-start justify-start gap-[44px] text-[23px] text-[#7f1d1d] font-inter"
      >
        <div className="relative leading-[150%] font-medium">Schedule:</div>
        <div className="relative leading-[150%] font-medium">
          mm/dd/yyyy hh:mm:ss
        </div>
        <div className="relative leading-[150%] font-medium">Status:</div>
        <div className="relative leading-[150%] font-medium">COMPLETED</div>
      </div>
    </div>
  );
};

export default ReviewElectionPanel;
