import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-l from-yellow-600 to-red-800 overflow-hidden">
      {/* Header Component */}
      <header className="w-full h-32 bg-red-900 shadow-md relative">
        <div className="absolute left-[641px] top-[47px] flex gap-11">
          {['Home', 'Results', 'Updates', 'About'].map((item) => (
            <a key={item} className="text-white text-xl font-medium hover:text-rose-50">
              {item}
            </a>
          ))}
        </div>
        
        <div className="absolute left-[213px] top-[35px] text-white text-5xl font-normal">
          UniVote
        </div>
        
        <Image
          src="/about-assets/logo.png"
          width={146}
          height={120}
          alt="UniVote Logo"
          className="absolute left-[38px] top-[7px]"
          priority
        />
        
        <button className="absolute left-[1230px] top-[41px] bg-gradient-to-br from-stone-600 to-orange-300 rounded-full px-6 py-3.5 text-white text-xl shadow-lg">
          SIGN IN
        </button>
      </header>
      
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 w-full h-[809px]">
          <Image
            src="/about-assets/hero-image.jpg"
            alt="Sydney Polls Background"
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
          />
        </div>
        <div className="absolute left-[350px] top-[409px] text-red-500 text-9xl font-black">
          Sydney Polls
        </div>
        <div className="absolute left-[377px] top-[591px] text-black text-3xl font-black w-[800px]">
          Empowering every vote, shaping every future.
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-20">
        <h2 className="absolute left-[291px] top-[1547px] text-red-300 text-9xl font-black w-[939px]">
          Meet the team
        </h2>
        
        {/* Team Member 1 */}
        <div className="absolute left-[319px] top-[1812px] w-[963px] h-96 bg-amber-300 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] p-8">
          <h3 className="text-black text-4xl font-black">Frontend Developer</h3>
        </div>
        <div className="absolute left-[135px] top-[1790px] w-96 h-96 bg-orange-700 rounded-full shadow-lg" />
        
        {/* Team Member 2 */}
        <div className="absolute left-[267px] top-[2927px] w-[963px] h-96 bg-amber-300 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] p-8">
          <h3 className="text-black text-4xl font-black">Backend Developer</h3>
        </div>
        <div className="absolute left-[109px] top-[2890px] w-96 h-96 bg-orange-700 rounded-full shadow-lg" />
        <div className="absolute left-[134px] top-[2915px] w-96 h-96 bg-rose-800 rounded-full" />
        
        {/* Team Member 3 */}
        <div className="absolute left-[1122.99px] top-[2752.98px] w-[963px] h-96 origin-top-left rotate-[-179.81deg] bg-amber-300 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] p-8">
          <h3 className="text-black text-4xl font-black">Full Stack Developer</h3>
        </div>
        <div className="absolute left-[1280.87px] top-[2790.51px] w-96 h-96 origin-top-left rotate-[-179.81deg] bg-orange-700 rounded-full shadow-lg" />
      </section>

      {/* Footer */}
      <footer className="w-full h-40 bg-red-900 shadow-inner relative">
        <div className="left-[312px] top-[39px] absolute inline-flex justify-center items-center gap-2.5">
          <div className="w-14 h-7 relative" />
        </div>
      </footer>
    </div>
  );
}