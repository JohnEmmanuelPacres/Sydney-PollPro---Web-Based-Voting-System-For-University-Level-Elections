"use client";
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import VoterHeader from '../components/VoteDash_Header';
import Footer from '../components/Footer';
import { supabase } from '@/utils/supabaseClient';
import { Pencil } from 'lucide-react';

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
  org_id?: string;
  org_name?: string | null;
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

// --- Comments & Replies Types ---
type Reply = {
  reply_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_type: string;
  display_name: string;
  user_email: string;
  avatar_initial: string;
};
type Comment = {
  comment_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_type: string;
  display_name: string;
  user_email: string;
  avatar_initial: string;
  reply_count: number;
  replies: Reply[];
};

const UpdatesPage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isVoterRoute = pathname.startsWith('/Voterdashboard') || pathname.startsWith('/Update_Section');
  const [isSignedIn, setIsSignedIn] = useState(false);
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
const [comments, setComments] = useState<Comment[]>([]);
const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
const [replyingTo, setReplyingTo] = useState<string | null>(null);

// State for modal
const [expandedArticle, setExpandedArticle] = useState<Article | null>(null);
const [modalVisible, setModalVisible] = useState(false);
const modalRef = useRef<HTMLDivElement>(null);
const [modalImageIdx, setModalImageIdx] = useState(0);

// State for fullscreen image viewer
const [imageViewerOpen, setImageViewerOpen] = useState(false);
const [imageViewerIdx, setImageViewerIdx] = useState(0);
const imageViewerRef = useRef<HTMLDivElement>(null);

// State for modal view: 'article' or 'comments'
const [modalView, setModalView] = useState<'article' | 'comments'>('article');

// State for messages
const [commentMessage, setCommentMessage] = useState<string | null>(null);
const [commentError, setCommentError] = useState<string | null>(null);

// Add this state for sort order
const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

// Get current user and determine user type
useEffect(() => {
  const getCurrentUser = async () => {
    setIsLoading(true); // Start loading when we begin user check
    try {
      // First check if we have an active session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // Debug logging
      console.log('=== SESSION DEBUG ===');
      console.log('Session:', session);
      console.log('Session error:', sessionError);
      console.log('User ID:', session?.user?.id);
      console.log('User email:', session?.user?.email);
      console.log('=====================');
      
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
          .select('administered_org')
          .eq('id', user.id)
          .single();

        if (!adminError && adminProfile) {
          console.log('Admin profile found:', adminProfile);
          setUserType('admin');
          setDepartmentOrg(adminProfile.administered_org);
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
        org_id: post.org_id,
        org_name: post.organizations?.organization_name || null,
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
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) return 'Posted just now';
  if (minutes < 60) return `Posted ${minutes} min${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `Posted ${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `Posted ${days} day${days > 1 ? 's' : ''} ago`;
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

  // Fetch comments for a post
  const fetchComments = async (postId: string) => {
    const res = await fetch(`/api/get-comments?post_id=${postId}`);
    const data = await res.json();
    setComments(data.comments || []);
  };

  // Image navigation functions
  const nextImage = () => {
    if (expandedArticle?.image_urls) {
      setModalImageIdx(prev => (prev + 1) % expandedArticle.image_urls!.length);
    }
  };

  const prevImage = () => {
    if (expandedArticle?.image_urls) {
      setModalImageIdx(prev => prev === 0 ? expandedArticle.image_urls!.length - 1 : prev - 1);
    }
  };

  // Open modal: fetch comments
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
    fetchComments(article.id);
    setModalView('article');
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

  // Open image viewer
  const openImageViewer = (idx: number) => {
    setImageViewerIdx(idx);
    setImageViewerOpen(true);
    setTimeout(() => {
      if (imageViewerRef.current) {
        gsap.fromTo(
          imageViewerRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      }
    }, 10);
  };

  // Close image viewer
  const closeImageViewer = () => {
    if (imageViewerRef.current) {
      gsap.to(imageViewerRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => setImageViewerOpen(false),
      });
    } else {
      setImageViewerOpen(false);
    }
  };

  // Image viewer navigation
  const nextViewerImage = () => {
    if (expandedArticle?.image_urls) {
      setImageViewerIdx((prev) => (prev + 1) % expandedArticle.image_urls!.length);
    }
  };
  const prevViewerImage = () => {
    if (expandedArticle?.image_urls) {
      setImageViewerIdx((prev) => prev === 0 ? expandedArticle.image_urls!.length - 1 : prev - 1);
    }
  };

  // Helper to determine if user can comment
  const isVoter = currentUser && userType === 'voter';
  const isAdmin = currentUser && userType === 'admin';
  const canView = expandedArticle?.isUniLevel || 
    (isVoter && departmentOrg && departmentOrg === expandedArticle?.org_name) ||
    (isAdmin && departmentOrg && departmentOrg === expandedArticle?.org_name);
  const canComment = (isVoter || isAdmin) && canView;

  // Add comment handler (API)
  const handleAddComment = async () => {
    if (!commentInput.trim() || !expandedArticle || !currentUser) return;
    setCommentError(null);
    setCommentMessage(null);
    try {
      const res = await fetch('/api/add-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: expandedArticle.id,
          user_id: currentUser.id,
          user_type: userType,
          content: commentInput.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setCommentError(data.error || 'Failed to post comment');
        return;
      }
      setCommentInput('');
      setCommentMessage('Comment posted');
      fetchComments(expandedArticle.id);
      setTimeout(() => setCommentMessage(null), 2500);
    } catch (err: any) {
      setCommentError('Failed to post comment');
    }
  };

  // Add reply handler (API)
  const handleAddReply = async (commentId: string) => {
    if (!replyInputs[commentId]?.trim() || !currentUser) return;
    await fetch('/api/add-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comment_id: commentId,
        user_id: currentUser.id,
        user_type: userType,
        content: replyInputs[commentId].trim(),
      }),
    });
    setReplyInputs(inputs => ({ ...inputs, [commentId]: '' }));
    setReplyingTo(null);
    if (expandedArticle) fetchComments(expandedArticle.id);
  };

  // Add this function:
  const handleDeleteComment = async (commentId: string) => {
    if (!expandedArticle) return;
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    const res = await fetch('/api/delete-comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment_id: commentId }),
    });
    if (res.ok) {
      fetchComments(expandedArticle.id);
    } else {
      const data = await res.json().catch(() => ({}));
      setCommentError(data.error || 'Failed to delete comment. Please try again.');
    }
  };

  // Add delete reply function
  const handleDeleteReply = async (replyId: string) => {
    if (!expandedArticle) return;
    if (!window.confirm('Are you sure you want to delete this reply?')) return;
    await fetch('/api/delete-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply_id: replyId }),
    });
    fetchComments(expandedArticle.id);
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-red-950 font-inter">
      {userType === 'admin' ? <Header /> : isVoterRoute ? <VoterHeader /> : <Header />}

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
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeModal}></div>
          <div
            ref={modalRef}
            className="fixed left-1/2 top-1/2 z-50 bg-white rounded-xl shadow-2xl flex flex-col"
            style={{
              transform: 'translate(-50%, -50%)',
              maxWidth: '800px',
              width: '95vw',
              maxHeight: '90vh',
              minHeight: '500px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
            }}
          >
            {/* Modal Header with Close */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getCategoryColor(expandedArticle.category)}`}>
                  {expandedArticle.category}
                </div>
                {expandedArticle.isUniLevel && (
                  <div className="px-3 py-1 rounded-full bg-blue-500 text-white text-sm font-semibold">
                    🌐 University
                  </div>
                )}
              </div>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Image and Article Section - Responsive Layout */}
              {modalView === 'article' && (
                <div className="flex flex-col lg:flex-row gap-4 p-4 sm:p-6 flex-1 overflow-hidden">
                  {/* Image Section - Smaller on mobile */}
                  <div className="w-full lg:w-80 flex-shrink-0">
                    {expandedArticle.image_urls && expandedArticle.image_urls.length > 0 ? (
                      <div className="relative w-full h-32 sm:h-40 lg:h-64 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => openImageViewer(modalImageIdx)}
                      >
                        <img
                          src={expandedArticle.image_urls[modalImageIdx]}
                          alt={expandedArticle.headline}
                          className="w-full h-full object-cover"
                        />
                        {/* Navigation arrows for multiple images */}
                        {expandedArticle.image_urls.length > 1 && (
                          <>
                            <button
                              onClick={e => { e.stopPropagation(); prevImage(); }}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); nextImage(); }}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </>
                        )}
                        {/* Image indicators */}
                        {expandedArticle.image_urls.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {expandedArticle.image_urls.map((img, idx) => (
                              <button
                                key={img}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  modalImageIdx === idx 
                                    ? 'bg-white' 
                                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                }`}
                                onClick={e => { e.stopPropagation(); setModalImageIdx(idx); }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative w-full h-32 sm:h-40 lg:h-64 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => openImageViewer(0)}
                      >
                        <img
                          src={expandedArticle.image}
                          alt={expandedArticle.headline}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  {/* Article and Comments Section - Overlap logic */}
                  <div className="flex-1 flex flex-col overflow-hidden min-h-0 w-full relative">
                    <div className="mb-4 flex-shrink-0">
                      <p className="text-gray-500 text-sm mb-2">{expandedArticle.timeAgo}</p>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                        {expandedArticle.headline}
                      </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto min-h-0">
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        {expandedArticle.details}
                      </p>
                    </div>
                    <div className="flex justify-center mt-6">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold text-base shadow transition-colors duration-200"
                        onClick={() => setModalView('comments')}
                      >
                        Check Comments
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {modalView === 'comments' && (
                <div className="flex flex-col p-4 sm:p-6 flex-1 h-full min-h-0 overflow-hidden rounded-xl shadow-xl animate-fadeIn bg-white">
                  <button
                    className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-base"
                    onClick={() => setModalView('article')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Article
                  </button>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-black">Comments</h4>
                    <select
                      className="border border-gray-300 rounded px-2 py-1 text-sm text-black"
                      value={sortOrder}
                      onChange={e => setSortOrder(e.target.value as 'newest' | 'oldest')}
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                    </select>
                  </div>
                  {/* Comments List */}
                  <div className="space-y-3 flex-1 min-h-0 overflow-y-auto mb-4">
                    {(() => {
                      const sortedComments = [...comments].sort((a, b) => {
                        const dateA = new Date(a.created_at).getTime();
                        const dateB = new Date(b.created_at).getTime();
                        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
                      });
                      return sortedComments.length === 0 ? (
                        <p className="text-gray-400 text-sm italic">No comments yet. Be the first to comment!</p>
                      ) : (
                        sortedComments.map((comment) => (
                          <div key={comment.comment_id} className="flex flex-col gap-2">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm flex-shrink-0">
                                {comment.avatar_initial || 'U'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-gray-800 text-sm">{comment.display_name}</span>
                                  <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
                                  {/* Reply count indicator */}
                                  {comment.reply_count > 0 && (
                                    <span className="ml-2 text-xs text-blue-500 font-semibold">{comment.reply_count} repl{comment.reply_count === 1 ? 'y' : 'ies'}</span>
                                  )}
                                </div>
                                <p className="text-gray-700 text-sm">{comment.content}</p>
                                <button
                                  className="text-black text-xs font-semibold mt-1 hover:underline"
                                  onClick={() => setReplyingTo(comment.comment_id)}
                                >Reply</button>
                                {/* Replies */}
                                {comment.replies.length > 0 && (
                                  <div className="ml-8 mt-2 space-y-2">
                                    {comment.replies.map(reply => (
                                      <div key={reply.reply_id} className="flex items-start gap-2">
                                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-xs flex-shrink-0">
                                          {reply.avatar_initial || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-semibold text-gray-800 text-xs">{reply.display_name}</span>
                                            <span className="text-xs text-gray-400">{new Date(reply.created_at).toLocaleString()}</span>
                                          </div>
                                          <p className="text-gray-700 text-xs">{reply.content}</p>
                                          {/* Delete reply button */}
                                          {currentUser?.id === reply.user_id && (
                                            <button
                                              className="text-red-600 text-xs font-semibold mt-1 hover:underline"
                                              onClick={() => handleDeleteReply(reply.reply_id)}
                                            >Delete</button>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {/* Reply input */}
                                {replyingTo === comment.comment_id && canComment && (
                                  <div className="flex items-center gap-2 mt-2 ml-8">
                                    <input
                                      type="text"
                                      className="flex-1 border border-gray-300 rounded-full px-3 py-1 text-xs focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-black"
                                      placeholder="Write a reply..."
                                      value={replyInputs[comment.comment_id] || ''}
                                      onChange={e => setReplyInputs(inputs => ({ ...inputs, [comment.comment_id]: e.target.value }))}
                                      onKeyPress={e => e.key === 'Enter' && handleAddReply(comment.comment_id)}
                                    />
                                    <button
                                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full font-semibold text-xs shadow transition-colors duration-200 flex-shrink-0"
                                      onClick={() => handleAddReply(comment.comment_id)}
                                    >Post</button>
                                    <button
                                      className="text-gray-400 text-xs ml-1 hover:underline"
                                      onClick={() => setReplyingTo(null)}
                                    >Cancel</button>
                                  </div>
                                )}
                                {/* Delete button */}
                                {currentUser?.id === comment.user_id && (
                                  <button
                                    className="text-blue-600 text-xs font-semibold ml-2 hover:underline flex items-center gap-1"
                                    onClick={() => handleDeleteComment(comment.comment_id)}
                                    title="Delete Comment"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      );
                    })()}
                  </div>
                  {/* Comment Input or Permission Message */}
                  {canComment ? (
                    <div className="flex flex-col gap-1 w-full">
                      {commentMessage && (
                        <div className="text-green-600 text-xs font-semibold mb-1">{commentMessage}</div>
                      )}
                      {commentError && (
                        <div className="text-red-600 text-xs font-semibold mb-1">{commentError}</div>
                      )}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm flex-shrink-0">
                          {currentUser?.user_metadata?.full_name?.[0] || currentUser?.email?.[0] || 'A'}
                        </div>
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm text-black focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                            placeholder="Write a comment..."
                            value={commentInput}
                            onChange={e => setCommentInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleAddComment()}
                          />
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold text-sm shadow transition-colors duration-200 flex-shrink-0"
                            onClick={() => handleAddComment()}
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 italic mt-2">
                      {expandedArticle?.isUniLevel
                        ? 'Sign in as a registered voter to comment.'
                        : 'You do not have permission to comment on this article.'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Fullscreen Image Viewer Popup */}
      {imageViewerOpen && expandedArticle && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex items-center justify-center" onClick={closeImageViewer}></div>
          <div
            ref={imageViewerRef}
            className="fixed inset-0 z-[110] flex flex-col items-center justify-center"
            style={{ pointerEvents: 'none' }}
          >
            <div className="relative w-full h-full flex items-center justify-center" style={{ pointerEvents: 'auto' }}>
              {/* Prev Button */}
              {expandedArticle.image_urls && expandedArticle.image_urls.length > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); prevViewerImage(); }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white w-10 h-10 rounded-full flex items-center justify-center z-20"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {/* Image */}
              <img
                src={expandedArticle.image_urls && expandedArticle.image_urls.length > 0
                  ? expandedArticle.image_urls[imageViewerIdx]
                  : expandedArticle.image}
                alt={expandedArticle.headline}
                className="max-h-[90vh] max-w-[95vw] rounded-xl shadow-2xl object-contain bg-white"
                style={{ background: 'white' }}
              />
              {/* Next Button */}
              {expandedArticle.image_urls && expandedArticle.image_urls.length > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); nextViewerImage(); }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white w-10 h-10 rounded-full flex items-center justify-center z-20"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              {/* Close Button */}
              <button
                onClick={closeImageViewer}
                className="absolute top-6 right-6 bg-black bg-opacity-60 hover:bg-opacity-80 text-white w-10 h-10 rounded-full flex items-center justify-center z-30"
                aria-label="Close viewer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default UpdatesPage;