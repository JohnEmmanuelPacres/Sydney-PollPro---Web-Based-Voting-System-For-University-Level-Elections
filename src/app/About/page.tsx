"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Team member data
const TEAM_MEMBERS = [
  {
    name: "Sean Tadiamon",
    role: "Frontend Developer",
    bio: "Sean is passionate about UI/UX and loves building beautiful web apps.",
    image: "/sean.jpg",
    socials: {
      github: "https://github.com/NaesCode",
      facebook: "https://www.facebook.com/seanrichard.tadiamon.9",
      instagram: "https://www.instagram.com/sean_tadz",
    },
  },
  {
    name: "John Emmanuel Pacres",
    role: "Frontend Developer",
    bio: "Pacres specializes in React and animation, making interfaces lively and fun.",
    image: "/pacres.jpg",
    socials: {
      github: "https://github.com/JohnEmmanuelPacres",
      facebook: "https://www.facebook.com/jem.pacres",
      instagram: "https://www.instagram.com/jepcrs",
    },
  },
  {
    name: "Harlie Cañas",
    role: "Backend Developer",
    bio: "Harlie ensures the server and database are always running smoothly.",
    image: "/harlie.jpg",
    socials: {
      github: "https://github.com/major119791",
      facebook: "https://www.facebook.com/harlie.khurt",
      instagram: "https://www.instagram.com/adovong.hotdog",
    },
  },
  {
    name: "Chucky Ebesa",
    role: "Backend Developer",
    bio: "Chucky loves APIs, security, and scalable systems.",
    image: "/chucky.jpg",
    socials: {
      github: "https://github.com/Chokinni",
      facebook: "https://www.facebook.com/michaeljordan.ebesa",
      instagram: "https://www.instagram.com/eee.c_k.v/",
    },
  },
];

export default function AboutPage() {
  const router = useRouter();
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const teamTitleRef = useRef<HTMLDivElement>(null);
  const teamMembersRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

  const addToTeamRefs = (el: HTMLDivElement | null, index: number) => {
    teamMembersRef.current[index] = el;
  };

  useEffect(() => {
    gsap.set(heroImageRef.current, { scale: 0.5, opacity: 0 });
    gsap.set(heroTitleRef.current, { y: 100, opacity: 0 });
    gsap.set(heroSubtitleRef.current, { y: 50, opacity: 0 });
    gsap.set(teamTitleRef.current, { y: 100, opacity: 0 });
    gsap.set(teamMembersRef.current, { x: -100, opacity: 0 });

    const mainTl = gsap.timeline();

    mainTl
      .to(heroImageRef.current, { scale: 1, opacity: 1, duration: 1 })
      .to(heroTitleRef.current, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
      .to(heroSubtitleRef.current, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4");

    gsap.to(teamTitleRef.current, {
      y: 0,
      opacity: 1,
      duration: 1,
      scrollTrigger: {
        trigger: teamTitleRef.current,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
    });

    teamMembersRef.current.forEach((member, index) => {
      if (member) {
        gsap.to(member, {
          x: 0,
          opacity: 1,
          duration: 1,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: member,
            start: "top 85%",
            end: "top 15%",
            toggleActions: "play none none reverse",
          },
        });

        const circle = member.querySelector(".team-circle");
        const card = member.querySelector(".team-card");

        if (circle && card) {
          member.addEventListener("mouseenter", () => {
            gsap.to(circle, {
              scale: 1.05,
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(card, {
              scale: 1.02,
              duration: 0.3,
              ease: "power2.out",
            });
          });

          member.addEventListener("mouseleave", () => {
            gsap.to(circle, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(card, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          });
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      mainTl.kill();
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-yellow-900 to-red-900 overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full min-h-[75vh] flex items-center justify-center text-center px-4">
        <div ref={heroImageRef} className="absolute inset-0 z-0">
          <Image
            src="/hero-image.jpg"
            alt="Sydney Polls Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center">
          <h1
            ref={heroTitleRef}
            className="text-red-500 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black drop-shadow-[0_8px_8px_rgba(0,0,0,0.6)]"
          >
            Sydney Polls
          </h1>
          <p
            ref={heroSubtitleRef}
            className="text-white text-lg sm:text-xl md:text-2xl font-semibold mt-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]"
          >
            Empowering every vote, shaping every future.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-24 px-4">
        <div ref={teamTitleRef} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg">
            Meet the Team
          </h2>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          {TEAM_MEMBERS.map((member, i) => (
            <div
              key={i}
              ref={(el) => addToTeamRefs(el, i)}
              className={`flex flex-col md:flex-row ${
                i % 2 !== 0 ? "md:flex-row-reverse" : ""
              } items-center justify-between gap-6 group`}
            >
              <button
                className="team-circle w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full flex items-center justify-center 
                            bg-gradient-to-br from-orange-600 to-orange-800 border-4 border-orange-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-400 transition-transform duration-200 overflow-hidden relative"
                onClick={() => setSelectedMember(i)}
                aria-label={`Show info for ${member.name}`}
                tabIndex={0}
              >
                <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse" />
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="w-full h-full object-cover rounded-full"
                  sizes="(max-width: 768px) 100vw, 256px"
                />
                <span className="sr-only">Show info for {member.name}</span>
              </button>
              <div
                className="team-card w-full md:flex-1 h-auto p-8 rounded-xl border-4 border-amber-500 
                            bg-gradient-to-r from-amber-300 to-amber-400 shadow-md flex items-center justify-center"
              >
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
                  {member.role}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal for team member info */}
      {selectedMember !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setSelectedMember(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fadeIn"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
              onClick={() => setSelectedMember(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-orange-400 mb-4 flex items-center justify-center relative">
                <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse" />
                <Image
                  src={TEAM_MEMBERS[selectedMember].image}
                  alt={TEAM_MEMBERS[selectedMember].name}
                  fill
                  className="w-full h-full object-cover rounded-full"
                  sizes="112px"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-orange-700">{TEAM_MEMBERS[selectedMember].name}</h3>
              <p className="text-lg font-semibold mb-2 text-gray-700">{TEAM_MEMBERS[selectedMember].role}</p>
              <p className="text-base text-gray-600 mb-4 text-center">{TEAM_MEMBERS[selectedMember].bio}</p>
              <div className="flex gap-4 mt-2">
                <a href={TEAM_MEMBERS[selectedMember].socials.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-black text-2xl" aria-label="GitHub">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
                </a>
                <a href={TEAM_MEMBERS[selectedMember].socials.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 text-2xl" aria-label="Facebook">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                </a>
                <a href={TEAM_MEMBERS[selectedMember].socials.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700 text-2xl" aria-label="Instagram">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.782 2.225 7.148 2.163 8.414 2.105 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.128 4.659.388 3.678 1.37c-.98.98-1.24 2.092-1.298 3.373C2.012 5.668 2 6.077 2 12c0 5.923.012 6.332.07 7.613.058 1.281.318 2.393 1.298 3.373.981.981 2.093 1.241 3.374 1.299C8.332 23.988 8.741 24 12 24s3.668-.012 4.948-.07c1.281-.058 2.393-.318 3.374-1.299.98-.98 1.24-2.092 1.298-3.373.058-1.281.07-1.69.07-7.613 0-5.923-.012-6.332-.07-7.613-.058-1.281-.318-2.393-1.298-3.373-.981-.981-2.093-1.241-3.374-1.299C15.668.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
