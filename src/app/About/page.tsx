import Header from './Components/Header';
import TeamGrid from './Components/TeamGrid';
import Footer from './Components/Footer';

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-l from-yellow-600 to-red-800 overflow-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="relative">
        <img 
          className="w-full h-[809px] object-cover" 
          src="/about-assets/hero-image.jpg" 
          alt="Sydney Polls"
        />
        <div className="absolute left-[350px] top-[409px] text-red-500 text-9xl font-black">
          Sydney Polls
        </div>
        <div className="absolute left-[377px] top-[591px] text-black text-3xl font-black w-[800px]">
          Empowering every vote, shaping every future.
        </div>
      </section>

      {/* Team Section */}
      <TeamGrid />

      {/* Footer */}
      <Footer />
    </div>
  );
}