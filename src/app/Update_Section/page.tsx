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
  image: string;
};

type Filter = 'All Updates' | 'Announcements' | 'System Updates' | 'Election News';

// Constants
const FILTERS: Filter[] = ['All Updates', 'Announcements', 'System Updates', 'Election News'];

const ARTICLES: Article[] = [
  {
    id: 1,
    headline: "Election Day Is Approaching",
    details: "With the election just around the corner, it's crucial to be prepared. Ensure you know your polling location and the candidates on your ballot. Remember, every vote counts in shaping our campus community's future. Stay informed and make your voice heard!",
    category: "Election News",
    timeAgo: "Posted 2 hours ago",
    bgColor: "bg-blue-100",
    image: "https://images.unsplash.com/photo-1541872718-0b1c8b2d9afa?w=400&h=250&fit=crop"
  },
  {
    id: 2,
    headline: "Candidate Debate Recap",
    details: "The candidate debate provided valuable insights into each candidate's vision for our university. Key topics included academic reforms, student support services, and campus sustainability. If you missed it, a full recap is available on our website. Understanding the candidates' platforms is essential for making an informed decision.",
    category: "Election News",
    timeAgo: "Posted 1 day ago",
    bgColor: "bg-purple-100",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    headline: "Important Election Dates",
    details: "Mark your calendar! Early voting begins on March 15th and runs through March 22nd. Election Day is March 25th. Don't miss the opportunity to cast your vote and influence the direction of our university. Check our website for detailed voting hours and locations.",
    category: "Announcements",
    timeAgo: "Posted 2 days ago",
    bgColor: "bg-yellow-100",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
  },
  {
    id: 4,
    headline: "System Maintenance Scheduled",
    details: "UniVote platform will undergo scheduled maintenance this weekend to improve performance and security. The system will be temporarily unavailable on Saturday from 2 AM to 6 AM. We apologize for any inconvenience.",
    category: "System Updates",
    timeAgo: "Posted 3 days ago",
    bgColor: "bg-green-100",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop"
  }
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Election News': 'bg-blue-500',
    'Announcements': 'bg-orange-500',
    'System Updates': 'bg-green-500'
  };
  return colors[category] || 'bg-gray-500';
};

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
      // Content animation (excluding header)
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
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
      <div ref={contentRef} className="flex flex-col items-center px-4 py-8 pt-32">
        {/* Title Section */}
        <div className="w-full max-w-4xl mb-8">
          <h1 className="text-white text-4xl font-bold font-['Geist'] mb-2">Updates</h1>
          <p className="text-gray-300 text-lg font-normal font-['Geist']">
            Stay informed with the latest news and announcements from UniVote.
          </p>
        </div>

        {/* Filter Section */}
        <div className="w-full max-w-4xl mb-8">
          <div className="bg-red-900 rounded-[20px] outline outline-[3px] outline-offset-[-3px] outline-red-50/95 p-2 inline-flex gap-2">
            {FILTERS.map((filter, index) => (
              <button
                key={filter}
                ref={el => { filtersRef.current[index] = el; }}
                onClick={() => handleFilterClick(filter, index)}
                onMouseEnter={() => handleFilterHover(index, true)}
                onMouseLeave={() => handleFilterHover(index, false)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeFilter === filter 
                    ? 'bg-orange-300 text-black shadow-lg' 
                    : 'text-white hover:bg-red-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Section */}
        <div className="w-full max-w-4xl space-y-6">
          {filteredArticles.map((article, index) => (
            <div
              key={article.id}
              ref={el => { articlesRef.current[index] = el; }}
              onMouseEnter={() => handleArticleHover(index, true)}
              onMouseLeave={() => handleArticleHover(index, false)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              <div className="flex">
                {/* Image Section */}
                <div className="w-80 h-64 flex-shrink-0">
                  <img 
                    src={article.image} 
                    alt={article.headline}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content Section */}
                <div className="flex-1 p-6 relative">
                  {/* Category Tag */}
                  <div className={`category-tag absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-medium ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </div>
                  
                  {/* Time Stamp */}
                  <p className="text-blue-500 text-sm font-medium mb-2">
                    {article.timeAgo}
                  </p>
                  
                  {/* Headline */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 pr-24">
                    {article.headline}
                  </h2>
                  
                  {/* Details */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {article.details}
                  </p>
                  
                  {/* View Post Button */}
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                    View Post
                  </button>
                </div>
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

      <Footer />
    </div>
  );
};

export default UpdatesPage;