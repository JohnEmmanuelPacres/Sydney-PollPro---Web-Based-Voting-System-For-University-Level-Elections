import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle }) => {
  return (
    <div className="w-full md:w-auto px-4 md:px-7 py-8 md:py-14 bg-black/20 rounded-lg outline outline-4 outline-offset-[-4px] outline-orange-400 inline-flex flex-col justify-start items-start gap-1">
      <h3 className="w-full md:w-80 justify-start text-stone-50 text-xl md:text-2xl lg:text-3xl font-['Baloo_2'] leading-8 md:leading-10">
        {title}
      </h3>
      <p className="w-full md:w-80 h-16 md:h-20 text-center justify-start text-white text-3xl md:text-4xl lg:text-5xl font-['Baloo_2'] leading-tight md:leading-[81px]">
        {value}
      </p>
      <p className="w-full md:w-80 justify-center text-zinc-500 text-lg md:text-xl lg:text-2xl font-normal font-['Inter'] leading-7 md:leading-9">
        {subtitle}
      </p>
    </div>
  );
};

export default StatsCard; 