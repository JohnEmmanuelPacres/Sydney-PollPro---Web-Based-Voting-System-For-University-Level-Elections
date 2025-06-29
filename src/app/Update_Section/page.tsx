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
  image_urls?: string[];
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

  // State for expanded article
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  // State for comments (UI only, not persisted)
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<Record<string, {name: string, time: string, text: string}[]>>({});

  // State for modal
  const [expandedArticle, setExpandedArticle] = useState<Article | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalImageIdx, setModalImageIdx] = useState(0);

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
          image_urls: post.image_urls,
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

  // Add comment handler
  const handleAddComment = (articleId: string) => {
    if (!commentInput.trim()) return;
    setComments(prev => ({
      ...prev,
      [articleId]: [
        ...(prev[articleId] || []),
        {
          name: currentUser?.user_metadata?.full_name || 'Anonymous',
          time: 'just now',
          text: commentInput.trim(),
        }
      ]
    }));
    setCommentInput('');
  };

  // Open modal with GSAP animation (centered modal)
  const openModal = (article: Article) => {
    setExpandedArticle(article);
    setModalImageIdx(0);
    setModalVisible(true);
    setTimeout(() => {
      if (modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { x: '-100vw', opacity: 0 },
          { x: '0vw', opacity: 1, duration: 0.5, ease: 'power3.out' }
        );
      }
    }, 10);
  };

  // Close modal with GSAP animation
  const closeModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        x: '-100vw',
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          setModalVisible(false);
          setExpandedArticle(null);
        }
      });
    } else {
      setModalVisible(false);
      setExpandedArticle(null);
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
            filteredArticles.map((article, index) => {
              // Support multiple images
              const images = article.image_urls && Array.isArray(article.image_urls) && article.image_urls.length > 0
                ? article.image_urls
                : [article.image];
              const isStacked = images.length > 1;
              return (
                <div
                  key={article.id}
                  ref={el => { articlesRef.current[index] = el; }}
                  onMouseEnter={() => handleArticleHover(index, true)}
                  onMouseLeave={() => handleArticleHover(index, false)}
                  className="bg-white rounded-[16px] border-2 border-[#FFD700] shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-row relative"
                >
                  {/* Image Section with stack indicator */}
                  <div className="relative w-32 sm:w-48 h-32 sm:h-40 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={images[0]}
                      alt={article.headline}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {isStacked && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                        +{images.length - 1}
                      </div>
                    )}
                  </div>
                  {/* Content Section with fade-out for long text */}
                  <div className="flex-1 p-4 sm:p-6 relative flex flex-col justify-between">
                    <div>
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
                      {/* Details with fade-out if too long */}
                      <div className="relative max-h-20 overflow-hidden">
                        <p className="text-gray-700 text-sm leading-relaxed mb-3 sm:mb-4">
                          {article.details}
                        </p>
                        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                      </div>
                    </div>
                    {/* View Post Button */}
                    <div className="flex justify-end mt-2">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-200 w-full sm:w-auto"
                        onClick={() => openModal(article)}
                      >
                        View Post
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!isLoading && filteredArticles.length === 0 && articles.length > 0 && (
          <div className="text-center py-20">
            <p className="text-white text-xl sm:text-2xl font-medium">No updates found for this category.</p>
          </div>
        )}
      </div>

      {/* Modal for expanded article */}
      {modalVisible && expandedArticle && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={closeModal}></div>
          <div
            ref={modalRef}
            className="fixed left-1/2 top-1/2 z-50 bg-white rounded-xl shadow-2xl flex flex-col"
            style={{
              transform: 'translate(-50%, -50%)',
              maxWidth: '900px',
              width: '95vw',
              maxHeight: '90vh',
              minHeight: '400px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
            }}
          >
            {/* Modal Header with Close */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{expandedArticle.headline}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
            </div>
            {/* Modal Content: Flex row for image and article */}
            <div className="flex-1 flex flex-row gap-6 overflow-hidden">
              {/* Image Section (left) */}
              <div className="flex flex-col items-center p-6 min-w-[280px] max-w-[320px] w-full">
                {expandedArticle.image_urls && expandedArticle.image_urls.length > 0 ? (
                  <div className="relative w-full h-48 mb-4 flex items-center justify-center">
                    <img
                      src={expandedArticle.image_urls[modalImageIdx]}
                      alt={expandedArticle.headline}
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    {expandedArticle.image_urls.length > 1 && (
                      <div className="flex gap-2 mt-2 absolute bottom-2 left-1/2 -translate-x-1/2">
                        {expandedArticle.image_urls.map((img, idx) => (
                          <button
                            key={img}
                            className={`w-3 h-3 rounded-full border-2 ${modalImageIdx === idx ? 'bg-blue-600 border-blue-600' : 'bg-gray-200 border-gray-400'}`}
                            onClick={() => setModalImageIdx(idx)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <img
                    src={expandedArticle.image}
                    alt={expandedArticle.headline}
                    className="w-full h-48 object-cover rounded-lg border mb-4"
                  />
                )}
              </div>
              {/* Article and Comments Section (right) */}
              <div className="flex-1 flex flex-col overflow-hidden pr-6 pt-6 pb-6">
                {/* Article Content (scrollable) */}
                <div className="flex-1 overflow-y-auto pr-2">
                  <p className="text-gray-700 text-base whitespace-pre-line mb-8">{expandedArticle.details}</p>
                </div>
                {/* Comments Section */}
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-4">Comments</h4>
                  <div className="space-y-4 mb-4">
                    {(comments[expandedArticle.id] || []).length === 0 && (
                      <p className="text-gray-400">No comments yet. Be the first to comment!</p>
                    )}
                    {(comments[expandedArticle.id] || []).map((comment, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                          {comment.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800">{comment.name}</span>
                            <span className="text-xs text-gray-400">{comment.time}</span>
                          </div>
                          <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-end gap-3">
                    <textarea
                      className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-400 resize-none min-h-[48px]"
                      placeholder="Write a comment..."
                      value={commentInput}
                      onChange={e => setCommentInput(e.target.value)}
                    />
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200"
                      onClick={() => handleAddComment(expandedArticle.id)}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default UpdatesPage;