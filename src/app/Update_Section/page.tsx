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
  const [userType, setUserType] = useState<'admin' | 'voter' | 'guest' | null>(null);
  const [departmentOrg, setDepartmentOrg] = useState<string>('');
  
  const articlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const filtersRef = useRef<(HTMLButtonElement | null)[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Get current user and determine user type
  useEffect(() => {
    const getCurrentUser = async () => {
      setIsLoading(true); // Start loading when we begin user check
      try {
        // First check if we have an active session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setUserType('guest');
          setCurrentUser(null);
          return;
        }

        if (!session) {
          console.log('No active session found, setting as guest');
          setUserType('guest');
          setCurrentUser(null);
          return;
        }

        // Get user from session
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Auth error:', authError);
          setUserType('guest');
          setCurrentUser(null);
          return;
        }
        
        setCurrentUser(user || null);

        if (user) {
          console.log('User found:', user.id);
          
          // Check admin profile first
          const { data: adminProfile, error: adminError } = await supabase
            .from('admin_profiles')
            .select('department_org')
            .eq('id', user.id)
            .single();

          if (!adminError && adminProfile) {
            console.log('Admin profile found:', adminProfile);
            setUserType('admin');
            setDepartmentOrg(adminProfile.department_org);
            return;
          }

          // If not admin, check voter profile
          const { data: voterProfile, error: voterError } = await supabase
            .from('voter_profiles')
            .select('department_org')
            .eq('id', user.id)
            .single();

          if (!voterError && voterProfile) {
            console.log('Voter profile found:', voterProfile);
            setUserType('voter');
            setDepartmentOrg(voterProfile.department_org);
            return;
          }

          // If neither profile exists but user is authenticated
          console.log('User authenticated but no profile found, setting as guest');
          setUserType('guest');
        } else {
          console.log('No user found, setting as guest');
          setUserType('guest');
        }
      } catch (error) {
        console.error('Error getting user:', error);
        setUserType('guest');
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  // Load articles based on user type and organization
  useEffect(() => {
    if (userType !== null) { // Changed from currentUser check
      loadArticles();
    }
  }, [userType, departmentOrg]); // Added dependencies

  const loadArticles = async () => {
    setIsLoading(true);
    
    try {
      console.log('Loading articles with:', {
        user_id: currentUser?.id,
        user_type: userType,
        department_org: departmentOrg
      });

      // For guest users, don't send user_id
      const requestBody = {
        user_id: userType === 'guest' ? null : currentUser?.id || null,
        user_type: userType,
        department_org: departmentOrg || null
      };

      console.log('Request body:', requestBody);

      const response = await fetch('/api/get-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }

      const transformedArticles: Article[] = (data.posts || []).map((post: any) => {
        let imageUrl = '/default-news.jpg';
        if (post.image_urls && Array.isArray(post.image_urls) && post.image_urls.length > 0) {
          imageUrl = post.image_urls[0];
        }

        return {
          id: post.id,
          headline: post.title,
          details: post.content,
          category: post.category,
          timeAgo: formatTimeAgo(new Date(post.created_at)),
          bgColor: getCategoryBgColor(post.category),
          image: imageUrl,
          isUniLevel: post.is_uni_lev,
        };
      });

      console.log('Transformed articles:', transformedArticles);
      setArticles(transformedArticles);
    } catch (error) {
      console.error('Error loading articles:', error);
      setArticles([]);
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

  // Keep articlesRef in sync with filteredArticles
  useEffect(() => {
    articlesRef.current.length = filteredArticles.length;
  }, [filteredArticles.length]);

  // Initialize animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );

      // Only animate non-null refs
      const validArticleRefs = articlesRef.current.filter(Boolean);
      gsap.fromTo(validArticleRefs, 
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
      // Only animate non-null refs
      const validArticleRefs = articlesRef.current.filter(Boolean);
      gsap.fromTo(validArticleRefs, 
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
      <div ref={contentRef} className="flex flex-col items-center px-2 sm:px-4 py-6 sm:py-8 pt-28 sm:pt-32">
        {/* Title Section */}
        <div className="w-full max-w-4xl mb-6 sm:mb-8 px-2 sm:px-0">
          <h1 className="text-white text-2xl sm:text-4xl font-bold font-['Geist'] mb-2">Updates</h1>
          <p className="text-orange-100 text-base sm:text-lg font-normal font-['Geist']">
            Stay informed with the latest news and announcements from UniVote.
          </p>
        </div>

        {/* Filter Section */}
        <div className="w-full max-w-4xl mb-6 sm:mb-8 px-0">
          <div className="bg-[#7A1B1B] rounded-[16px] border-2 border-[#FFD700] p-1 flex gap-1">
            {FILTERS.map((filter, index) => (
              <button
                key={filter}
                ref={el => { filtersRef.current[index] = el; }}
                onClick={() => handleFilterClick(filter, index)}
                onMouseEnter={() => handleFilterHover(index, true)}
                onMouseLeave={() => handleFilterHover(index, false)}
                className={`flex-1 px-2 sm:px-4 py-2 rounded-[12px] font-semibold transition-all duration-200 text-xs sm:text-sm shadow-none border-none outline-none focus:ring-2 focus:ring-[#FFD700] focus:z-10 ${
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

        {/* Articles Section */}
        <div className="w-full max-w-4xl space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
              <p className="text-white">Loading updates...</p>
              {articles.length === 0 && (
                <p className="text-orange-300 text-sm">
                  If this takes too long, try refreshing the page
                </p>
              )}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="bg-white rounded-[16px] border-2 border-[#FFD700] shadow-md p-20 text-center">
              <div className="text-gray-400 text-6xl mb-4">📰</div>
              <p className="text-gray-600 text-xl font-medium mb-2">
                {articles.length === 0 ? 'No updates available' : 'No matching updates'}
              </p>
              <p className="text-gray-400">
                {articles.length === 0 
                  ? 'Check back later for new announcements and updates' 
                  : 'Try a different filter'}
              </p>
              <button
                onClick={loadArticles}
                className="mt-4 px-4 py-2 bg-[#FFD700] text-[#6B0000] rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Retry Loading
              </button>
            </div>
          ) : (
            filteredArticles.map((article, index) => (
              <div
                key={article.id}
                ref={el => { articlesRef.current[index] = el; }}
                onMouseEnter={() => handleArticleHover(index, true)}
                onMouseLeave={() => handleArticleHover(index, false)}
                className="bg-white rounded-[16px] border-2 border-[#FFD700] shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col sm:flex-row"
              >
                {/* Image Section */}
                <div className="w-full sm:w-80 h-48 sm:h-64 flex-shrink-0">
                  <img 
                    src={article.image} 
                    alt={article.headline}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Content Section */}
                <div className="flex-1 p-4 sm:p-6 relative">
                  {/* Tags Row: University + Category */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2 z-10">
                    {article.isUniLevel && (
                      <div className="px-2 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center">
                        🌐 University
                      </div>
                    )}
                    <div className={`category-tag px-2 sm:px-3 py-1 rounded-full text-white text-xs font-semibold tracking-wide shadow ${getCategoryColor(article.category)}`}> 
                      {article.category}
                    </div>
                  </div>
                  {/* Time Stamp */}
                  <p className="text-[#6B0000] text-xs font-semibold mb-1 sm:mb-2">
                    {article.timeAgo}
                  </p>
                  {/* Headline */}
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 pr-12 sm:pr-24">
                    {article.headline}
                  </h2>
                  {/* Details */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-3 sm:mb-4">
                    {article.details}
                  </p>
                  {/* View Post Button */}
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-200 w-full sm:w-auto">
                    View Post
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {!isLoading && filteredArticles.length === 0 && articles.length > 0 && (
          <div className="text-center py-20">
            <p className="text-white text-xl sm:text-2xl font-medium">No updates found for this category.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default UpdatesPage;