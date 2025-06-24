"use client";
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Types
type Article = {
  id: number;
  headline: string;
  details: string;
  category: string;
  timeAgo: string;
  bgColor: string;
};

type Filter = 'All Updates' | 'Announcements' | 'System Updates' | 'Election News';

// Constants
const FILTERS: Filter[] = ['All Updates', 'Announcements', 'System Updates', 'Election News'];

const ARTICLES: Article[] = [
  {
    id: 1,
    headline: "System Maintenance Scheduled",
    details: "UniVote platform will undergo scheduled maintenance this weekend to improve performance and security.",
    category: "System Updates",
    timeAgo: "2 Hours ago",
    bgColor: "bg-green-500"
  },
  {
    id: 2,
    headline: "New Candidate Registration Open",
    details: "Registration for new candidates is now open for the upcoming university elections. Submit your applications before the deadline.",
    category: "Announcements",
    timeAgo: "5 Hours ago",
    bgColor: "bg-cyan-400"
  },
  {
    id: 3,
    headline: "Election Results Announcement",
    details: "Final results for the student council elections have been verified and will be published tomorrow morning.",
    category: "Election News",
    timeAgo: "4 hours ago",
    bgColor: "bg-amber-300"
  }
];

const UpdatesPage = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>('All Updates');
  const articlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const filtersRef = useRef<(HTMLButtonElement | null)[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const filteredArticles = activeFilter === 'All Updates' 
    ? ARTICLES 
    : ARTICLES.filter(article => article.category === activeFilter);

  // Initialize animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Page entrance animation
      gsap.fromTo(pageRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );

      // Content animation
      gsap.fromTo(contentRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 0.3 }
      );

      // Articles animation
      gsap.fromTo(articlesRef.current, 
        { opacity: 0, y: 50, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.8, 
          stagger: 0.2, 
          ease: "power3.out",
          delay: 0.5
        }
      );
    }, pageRef);

    return () => ctx.revert(); // Cleanup animations
  }, []);

  // Filter change animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(articlesRef.current, 
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0,
          duration: 0.6, 
          stagger: 0.1, 
          ease: "power2.out"
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [activeFilter]);

  const handleFilterClick = (filter: Filter, index: number) => {
    if (filter === activeFilter) return;
    
    // Animate filter button
    if (filtersRef.current[index]) {
      gsap.to(filtersRef.current[index], {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
    
    setActiveFilter(filter);
  };

  const handleArticleHover = (index: number, isEntering: boolean) => {
    const article = articlesRef.current[index];
    if (!article) return;

    if (isEntering) {
      gsap.to(article, {
        scale: 1.02,
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        duration: 0.4,
        ease: "power2.out"
      });
      
      const categoryTag = article.querySelector('.category-tag');
      if (categoryTag) {
        gsap.to(categoryTag, {
          scale: 1.05,
          rotation: 2,
          duration: 0.3,
          ease: "back.out(1.7)"
        });
      }
    } else {
      gsap.to(article, {
        scale: 1,
        y: 0,
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        duration: 0.4,
        ease: "power2.out"
      });
      
      const categoryTag = article.querySelector('.category-tag');
      if (categoryTag) {
        gsap.to(categoryTag, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
  };

  const handleFilterHover = (index: number, isEntering: boolean) => {
    const filter = filtersRef.current[index];
    if (!filter) return;

    if (isEntering) {
      gsap.to(filter, {
        scale: 1.05,
        y: -2,
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        duration: 0.3,
        ease: "back.out(1.7)"
      });
    } else {
      gsap.to(filter, {
        scale: 1,
        y: 0,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-red-950 font-inter">
      <Header />

      {/* Main Content */}
      <div ref={contentRef} className="flex flex-col items-center px-4 py-8">
        {/* Title Section */}
        <div className="w-full max-w-[1280px] mb-8">
          <h1 className="text-white text-3xl font-bold font-['Geist'] mb-2">News and Updates</h1>
          <p className="text-gray-300 text-base font-normal font-['Geist']">
            Stay informed with the latest news and announcements from UniVote.
          </p>
        </div>

        {/* Filter Section */}
        <div className="w-full max-w-[1165px] h-16 bg-red-900 rounded-[20px] outline outline-[3px] outline-offset-[-3px] outline-red-50/95 mb-8 relative">
          <div className="flex justify-between items-center h-full px-10">
            {FILTERS.map((filter, index) => (
              <button
                key={filter}
                ref={el => { filtersRef.current[index] = el; }}
                onClick={() => handleFilterClick(filter, index)}
                onMouseEnter={() => handleFilterHover(index, true)}
                onMouseLeave={() => handleFilterHover(index, false)}
                className={`px-6 py-2 rounded-3xl outline outline-4 outline-offset-[-4px] outline-stone-500 backdrop-blur-[2px] transition-all duration-300 cursor-pointer
                  ${activeFilter === filter 
                    ? 'bg-orange-300 text-black shadow-lg' 
                    : 'bg-white text-red-800 hover:bg-gray-100'
                  }`}
              >
                <span className="text-xl font-medium font-['Inter']">{filter}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Articles Section */}
        <div className="w-full max-w-[1165px] bg-red-900 rounded-[20px] outline outline-[3px] outline-offset-[-3px] outline-red-50/95 p-10">
          <div className="space-y-8">
            {filteredArticles.map((article, index) => (
              <div
                key={article.id}
                ref={el => { articlesRef.current[index] = el; }}
                onMouseEnter={() => handleArticleHover(index, true)}
                onMouseLeave={() => handleArticleHover(index, false)}
                className="bg-white rounded-2xl outline outline-4 outline-offset-[-4px] outline-stone-500 backdrop-blur-[2px] p-10 cursor-pointer transition-all duration-300 relative"
              >
                {/* Category Tag */}
                <div className={`category-tag absolute top-6 right-10 px-6 py-2 ${article.bgColor} rounded-3xl outline outline-4 outline-offset-[-4px] outline-stone-500 backdrop-blur-[2px]`}>
                  <span className="text-black text-xl font-medium font-['Inter']">{article.category}</span>
                </div>

                {/* Headline */}
                <h2 className="text-red-800 text-4xl font-medium font-['Baloo_2'] leading-[51px] mb-6 max-w-[70%]">
                  {article.headline}
                </h2>

                {/* Details */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-red-800 text-2xl font-medium font-['Inter'] mb-4">Details:</div>
                    <p className="text-gray-700 text-lg font-['Inter'] leading-relaxed max-w-[80%]">
                      {article.details}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
                  <span className="text-red-800 text-xl font-medium font-['Inter']">{article.timeAgo}</span>
                  <span className="text-red-800 text-xl font-medium font-['Inter']">Tap the article for full details</span>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white text-2xl font-medium">No updates found for this category.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UpdatesPage;