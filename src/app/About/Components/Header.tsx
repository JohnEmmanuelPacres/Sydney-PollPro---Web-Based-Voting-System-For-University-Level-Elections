import Image from 'next/image';

export default function Header() {
  return (
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
      />
      
      <button className="absolute left-[1230px] top-[41px] bg-gradient-to-br from-stone-600 to-orange-300 rounded-full px-6 py-3.5 text-white text-xl shadow-lg">
        SIGN IN
      </button>
    </header>
  );
}