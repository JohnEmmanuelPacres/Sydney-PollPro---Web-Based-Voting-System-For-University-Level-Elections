'use client';
import React, { useState, useRef } from 'react';
import { Camera, FileText, Send, X, Plus, Clock, Eye, Tag, AlertCircle, Check } from 'lucide-react';
import AdminHeader from '../../../components/AdminHeader';
import Footer from '../../../components/Footer';

// Types
type Category = 'Announcements' | 'System Updates' | 'Election News';

type Article = {
  id: string;
  headline: string;
  content: string;
  category: Category;
  images: File[];
  publishedAt?: Date;
  status: 'draft' | 'published';
};

const AdminUpdateSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article>({
    id: '',
    headline: '',
    content: '',
    category: 'Announcements',
    images: [],
    status: 'draft'
  });
  const [showPreview, setShowPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newImages = Array.from(files).filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB limit
    );
    
    setCurrentArticle(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = (index: number) => {
    setCurrentArticle(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const publishArticle = () => {
    if (!currentArticle.headline.trim() || !currentArticle.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newArticle: Article = {
      ...currentArticle,
      id: Date.now().toString(),
      status: 'published',
      publishedAt: new Date()
    };

    setArticles(prev => [newArticle, ...prev]);
    
    // Reset form
    setCurrentArticle({
      id: '',
      headline: '',
      content: '',
      category: 'Announcements',
      images: [],
      status: 'draft'
    });
  };

  const getCategoryColor = (category: Category) => {
    switch (category) {
      case 'Announcements': return 'bg-orange-500';
      case 'System Updates': return 'bg-green-600';
      case 'Election News': return 'bg-blue-600';
      default: return 'bg-gray-400';
    }
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

  return (
    <div className="min-h-screen bg-red-950 font-inter">
      <AdminHeader />

      {/* Main Content */}
      <div className="flex flex-col items-center px-4 py-8 pt-32">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="w-full mb-8">
            <h1 className="text-white text-2xl sm:text-4xl font-bold font-['Geist'] mb-2">Admin Panel</h1>
            <p className="text-orange-100 text-base sm:text-lg font-normal font-['Geist']">
              Create and manage news, announcements, and updates for UniVote.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-[#7A1B1B] rounded-[16px] border-2 border-[#FFD700] p-1 mb-8">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 px-4 py-3 rounded-[12px] font-semibold transition-all duration-200 text-sm ${
                  activeTab === 'create' 
                    ? 'bg-[#FFD700] text-[#6B0000] shadow-lg' 
                    : 'text-white hover:bg-[#8B2323]'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Plus size={18} />
                  <span>Create New Article</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`flex-1 px-4 py-3 rounded-[12px] font-semibold transition-all duration-200 text-sm ${
                  activeTab === 'manage' 
                    ? 'bg-[#FFD700] text-[#6B0000] shadow-lg' 
                    : 'text-white hover:bg-[#8B2323]'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <FileText size={18} />
                  <span>Manage Articles ({articles.length})</span>
                </div>
              </button>
            </div>
          </div>

          {activeTab === 'create' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Article Form */}
                <div className="bg-white rounded-[16px] border-2 border-[#FFD700] shadow-md p-6">
                  <h2 className="text-[#6B0000] text-2xl font-bold mb-6 flex items-center">
                    <FileText className="mr-3" size={24} />
                    Article Details
                  </h2>

                  {/* Headline */}
                  <div className="mb-6">
                    <label className="block text-gray-700 text-lg font-medium mb-2">Headline *</label>
                    <input
                      type="text"
                      value={currentArticle.headline}
                      onChange={(e) => setCurrentArticle(prev => ({ ...prev, headline: e.target.value }))}
                      placeholder="Enter your headline here..."
                      className="w-full p-4 bg-white rounded-xl border-2 border-gray-300 text-gray-900 text-lg font-medium placeholder-gray-400 focus:border-[#FFD700] focus:outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Category */}
                  <div className="mb-6">
                    <label className="block text-gray-700 text-lg font-medium mb-2">Category *</label>
                    <select
                      value={currentArticle.category}
                      onChange={(e) => setCurrentArticle(prev => ({ ...prev, category: e.target.value as Category }))}
                      className="w-full p-4 bg-white rounded-xl border-2 border-gray-300 text-gray-900 text-lg font-medium focus:border-[#FFD700] focus:outline-none transition-all duration-300"
                    >
                      <option value="Announcements">Announcements</option>
                      <option value="System Updates">System Updates</option>
                      <option value="Election News">Election News</option>
                    </select>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <label className="block text-gray-700 text-lg font-medium mb-2">Content *</label>
                    <textarea
                      value={currentArticle.content}
                      onChange={(e) => setCurrentArticle(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your article content here..."
                      rows={8}
                      className="w-full p-4 bg-white rounded-xl border-2 border-gray-300 text-gray-900 text-lg font-medium placeholder-gray-400 focus:border-[#FFD700] focus:outline-none transition-all duration-300 resize-none"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="bg-white rounded-[16px] border-2 border-[#FFD700] shadow-md p-6">
                  <h2 className="text-[#6B0000] text-2xl font-bold mb-6 flex items-center">
                    <Camera className="mr-3" size={24} />
                    Images
                  </h2>

                  {/* Upload Area */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                      dragActive ? 'border-[#FFD700] bg-yellow-50' : 'border-gray-300 hover:border-[#FFD700]'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg mb-2">Drag and drop images here, or click to browse</p>
                    <p className="text-gray-400 text-sm">Supports JPG, PNG, GIF up to 10MB each</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                    />
                  </div>

                  {/* Image Preview */}
                  {currentArticle.images.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-gray-700 text-lg font-medium mb-4">Uploaded Images ({currentArticle.images.length})</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {currentArticle.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publishing Options */}
                <div className="bg-white rounded-[16px] border-2 border-[#FFD700] shadow-md p-6">
                  <h3 className="text-[#6B0000] text-xl font-bold mb-4 flex items-center">
                    <Send className="mr-2" size={20} />
                    Publish Article
                  </h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={publishArticle}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center justify-center shadow"
                    >
                      <Check className="mr-2" size={18} />
                      Publish Now
                    </button>
                    
                    <button
                      onClick={() => setShowPreview(true)}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center shadow"
                    >
                      <Eye className="mr-2" size={18} />
                      Preview Article
                    </button>
                  </div>
                </div>

                {/* Category Preview */}
                <div className="bg-white rounded-[16px] border-2 border-[#FFD700] shadow-md p-6">
                  <h3 className="text-[#6B0000] text-xl font-bold mb-4 flex items-center">
                    <Tag className="mr-2" size={20} />
                    Category Preview
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-white text-sm font-semibold tracking-wide shadow inline-block ${getCategoryColor(currentArticle.category)}`}>
                    {currentArticle.category}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Manage Articles */
            <div className="space-y-6">
              <h2 className="text-white text-2xl font-bold">Published Articles</h2>
              
              {articles.length === 0 ? (
                <div className="bg-white rounded-[16px] border-2 border-[#FFD700] shadow-md p-20 text-center">
                  <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-xl font-medium mb-2">No articles published yet</p>
                  <p className="text-gray-400">Create your first article to get started</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {articles.map((article) => (
                    <div key={article.id} className="bg-white rounded-[16px] border-2 border-[#FFD700] shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`px-3 py-1 rounded-full text-white text-sm font-semibold tracking-wide shadow ${getCategoryColor(article.category)}`}>
                              {article.category}
                            </div>
                          </div>
                          <div className="flex items-center text-[#6B0000] text-sm font-semibold">
                            <Clock size={16} className="mr-1" />
                            {article.publishedAt ? formatTimeAgo(article.publishedAt) : 'Draft'}
                          </div>
                        </div>
                        
                        <h3 className="text-gray-900 text-2xl font-bold mb-3">{article.headline}</h3>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4 line-clamp-3">{article.content}</p>
                        
                        {article.images.length > 0 && (
                          <div className="flex items-center text-gray-500 text-sm mb-4">
                            <Camera size={16} className="mr-1" />
                            {article.images.length} image{article.images.length !== 1 ? 's' : ''} attached
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            article.status === 'published' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                          </span>
                          <div className="flex space-x-2">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow">
                              Edit
                            </button>
                            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold shadow">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Preview Modal */}
          {showPreview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-[16px] border-2 border-[#FFD700] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-[#6B0000]">Article Preview</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6">
                  {/* Category Tag */}
                  <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold tracking-wide shadow mb-4 ${getCategoryColor(currentArticle.category)}`}>
                    {currentArticle.category}
                  </div>
                  
                  {/* Time Stamp */}
                  <p className="text-[#6B0000] text-sm font-semibold mb-2">
                    Posted just now
                  </p>
                  
                  {/* Headline */}
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">{currentArticle.headline || 'Your headline will appear here'}</h1>
                  
                  {/* Images */}
                  {currentArticle.images.length > 0 && (
                    <div className="w-full mb-6">
                      <img
                        src={URL.createObjectURL(currentArticle.images[0])}
                        alt="Article preview"
                        className="w-full h-64 object-cover rounded-lg border border-gray-200"
                      />
                      {currentArticle.images.length > 1 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {currentArticle.images.slice(1, 4).map((image, index) => (
                            <img
                              key={index}
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 2}`}
                              className="w-full h-20 object-cover rounded border border-gray-200"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="prose max-w-none">
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                      {currentArticle.content || 'Your article content will appear here...'}
                    </p>
                  </div>
                  
                  {/* Footer */}
                  <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                    <span>Tap for full details</span>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-200">
                      View Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminUpdateSection;