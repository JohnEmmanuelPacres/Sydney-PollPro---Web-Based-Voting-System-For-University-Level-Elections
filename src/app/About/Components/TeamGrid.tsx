import AboutCard from '../AboutCard';

export default function TeamGrid() {
  return (
    <section className="relative py-20">
      <h2 className="absolute left-[291px] top-[1547px] text-red-300 text-9xl font-black w-[939px]">
        Meet the team
      </h2>
      
      {/* Team Member 1 */}
      <AboutCard 
        className="left-[319px] top-[1812px] bg-amber-300"
        title="Frontend Developer"
      />
      <div className="absolute left-[135px] top-[1790px] w-96 h-96 bg-orange-700 rounded-full shadow-lg" />
      
      {/* Team Member 2 */}
      <AboutCard 
        className="left-[267px] top-[2927px] bg-amber-300"
        title="Backend Developer"
      />
      <div className="absolute left-[109px] top-[2890px] w-96 h-96 bg-orange-700 rounded-full shadow-lg" />
      <div className="absolute left-[134px] top-[2915px] w-96 h-96 bg-rose-800 rounded-full" />
      
      {/* Team Member 3 */}
      <AboutCard 
        className="left-[1122.99px] top-[2752.98px] rotate-[-179.81deg] bg-amber-300"
        title="Full Stack Developer"
      />
      <div className="absolute left-[1280.87px] top-[2790.51px] w-96 h-96 rotate-[-179.81deg] bg-orange-700 rounded-full shadow-lg" />
    </section>
  );
}