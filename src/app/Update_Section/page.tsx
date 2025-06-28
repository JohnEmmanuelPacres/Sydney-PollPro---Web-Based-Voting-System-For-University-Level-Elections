"use client";
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '@/utils/supabaseClient';

// Types
type Article = {
  id: string;
  headline: string;
  details: string;
  category: string;
  timeAgo: string;
  bgColor: string;
  image: string;
  isUniLevel: boolean;
};

type Filter = 'All Updates' | 'Announcements' | 'System Updates' | 'Election News';

// Constants
const FILTERS: Filter[] = ['All Updates', 'Announcements', 'System Updates', 'Election News'];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Election News': 'bg-blue-600',
    'Announcements': 'bg-orange-500', 
    'System Updates': 'bg-green-600'
  };
  return colors[category] || 'bg-gray-500';
};

const UpdatesPage = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>('All Updates');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userType, setUserType] = useState<'admin' | 'voter' | 'guest'>('guest');
  const [departmentOrg, setDepartmentOrg] = useState<string>('');
  
  const articlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const filtersRef = useRef<(HTMLButtonElement | null)[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Get current user and determine user type
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        if (user) {
          // Check if user is admin
          const { data: adminProfile } = await supabase
            .from('admin_profiles')
            .select('department_org')
            .eq('id', user.id)
            .single();

          if (adminProfile) {
            setUserType('admin');
            setDepartmentOrg(adminProfile.department_org);
          } else {
            // Check if user is voter
            const { data: voterProfile } = await supabase
              .from('voter_profiles')
              .select('department_org')
              .eq('id', user.id)
              .single();

            if (voterProfile) {
              setUserType('voter');
              setDepartmentOrg(voterProfile.department_org);
            }
          }
        }
      } catch (error) {
        console.error('Error getting user:', error);
      }
    };

    getCurrentUser();
  }, []);

  // Load articles based on user type and organization
  useEffect(() => {
    if (currentUser !== null) { // Allow loading for both authenticated and unauthenticated users
      loadArticles();
    }
  }, [currentUser, userType, departmentOrg]);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/get-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser?.id || null,
          user_type: userType,
          department_org: departmentOrg
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { posts, error } = await response.json();
      
      if (error) {
        throw new Error(error);
      }
      
      const transformedArticles: Article[] = posts.map((post: any) => ({
        id: post.id,
        headline: post.title,
        details: post.context,
        category: post.category,
        timeAgo: formatTimeAgo(new Date(post.created_at)),
        bgColor: getCategoryBgColor(post.category),
        image: post.image_urls && post.image_urls.length > 0 ? post.image_urls[0] : '/default-news.jpg',
        isUniLevel: post.is_uni_lev
      }));

      setArticles(transformedArticles);
    } catch (error) {
      console.error('Error loading articles:', error);
      // Optionally show error to user
      setArticles([]); // Clear articles to show empty state
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryBgColor = (category: string) => {
    const colors: Record<string, string> = {
      'Election News': 'bg-blue-100',
      'Announcements': 'bg-yellow-100', 
      'System Updates': 'bg-green-100'
    };
    return colors[category] || 'bg-gray-100';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `Posted ${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `Posted ${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Posted just now';
  };

  const filteredArticles = activeFilter === 'All Updates' 
    ? articles 
    : articles.filter(article => article.category === activeFilter);

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
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <div className="min-h-screen bg-red-950 font-inter" ref={pageRef}>
      <Header />

      {/* Main Content */}
      <div className="flex flex-col items-center px-4 py-8 pt-32" ref={contentRef}>
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="w-full mb-8">
            <h1 className="text-white text-2xl sm:text-4xl font-bold font-['Geist'] mb-2">Latest Updates</h1>
            <p className="text-orange-100 text-base sm:text-lg font-normal font-['Geist']">
              Stay informed with the latest news, announcements, and updates from UniVote.
            </p>
          </div>

          {/* Filter Navigation */}
          <div className="bg-[#7A1B1B] rounded-[16px] border-2 border-[#FFD700] p-1 mb-8">
            <div className="flex gap-1 overflow-x-auto">
              {FILTERS.map((filter, index) => (
                <button
                  key={filter}
                  ref={(el) => { filtersRef.current[index] = el; }}
                  onClick={() => handleFilterClick(filter, index)}
                  onMouseEnter={() => handleFilterHover(index, true)}
                  onMouseLeave={() => handleFilterHover(index, false)}
                  className={`px-4 py-3 rounded-[12px] font-semibold transition-all duration-200 text-sm whitespace-nowrap ${
                    activeFilter === filter 
                      ? 'bg-[#FFD700] text-[#6B0000] shadow-lg' 
                      : 'text-white hover:bg-[#8B2323]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="bg-white rounded-[16px] border-2 border-[#FFD700] shadow-md p-20 text-center">
              <div className="text-gray-400 text-6xl mb-4">📰</div>
              <p className="text-gray-600 text-xl font-medium mb-2">No updates available</p>
              <p className="text-gray-400">Check back later for new announcements and updates</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  ref={(el) => { articlesRef.current[index] = el; }}
                  onMouseEnter={() => handleArticleHover(index, true)}
                  onMouseLeave={() => handleArticleHover(index, false)}
                  className="bg-white rounded-[16px] border-2 border-[#FFD700] shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.headline}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <div className={`category-tag px-3 py-1 rounded-full text-white text-sm font-semibold tracking-wide shadow ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </div>
                      {article.isUniLevel && (
                        <div className="px-2 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center">
                          🌐 University
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center text-[#6B0000] text-sm font-semibold mb-3">
                      <span>🕒</span>
                      <span className="ml-1">{article.timeAgo}</span>
                    </div>
                    
                    <h3 className="text-gray-900 text-xl font-bold mb-3 line-clamp-2 leading-tight">
                      {article.headline}
                    </h3>
                    
                    <p className="text-gray-700 text-base leading-relaxed line-clamp-3 mb-4">
                      {article.details}
                    </p>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <span className="text-[#6B0000] text-sm font-semibold">
                        Tap for full details
                      </span>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200">
                        Read More
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UpdatesPage;