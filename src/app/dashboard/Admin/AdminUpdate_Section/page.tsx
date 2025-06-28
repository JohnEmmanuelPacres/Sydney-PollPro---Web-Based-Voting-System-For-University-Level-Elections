'use client';
import React, { useState, useRef } from 'react';
import { Camera, FileText, Send, X, Plus, Clock, Eye, Tag, AlertCircle, Check } from 'lucide-react';
import AdminHeader from '../../../components/AdminHeader';
import Footer from '../../../components/Footer';

// Types
type Category = 'Announcements' | 'System Updates' | 'Election News';
type Priority = 'Low' | 'Medium' | 'High';

type Article = {
  id: string;
  headline: string;
  content: string;
  category: Category;
  priority: Priority;
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
    priority: 'Medium',
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
      priority: 'Medium',
      images: [],
      status: 'draft'
    });
  };

  const getCategoryColor = (category: Category) => {
    switch (category) {
      case 'Announcements': return 'bg-cyan-400';
      case 'System Updates': return 'bg-green-500';
      case 'Election News': return 'bg-amber-300';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-red-950 font-inter">
      <AdminHeader />

      {/* Main Content */}
      <div className="flex flex-col items-center px-4 py-8 pt-32">
        <div className="w-full max-w-7xl">
          {/* Header */}
          <div className="bg-red-900 rounded-[20px] outline outline-[3px] outline-offset-[-3px] outline-red-50/95 p-8 mb-8">
            <h1 className="text-white text-4xl font-bold font-['Geist'] mb-2">Admin Panel</h1>
            <p className="text-gray-300 text-lg">Create and manage news, announcements, and updates</p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-red-900 rounded-[20px] outline outline-[3px] outline-offset-[-3px] outline-red-50/95 p-2 mb-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-4 px-6 rounded-2xl transition-all duration-300 ${
                  activeTab === 'create' 
                    ? 'bg-orange-300 text-black shadow-lg' 
                    : 'text-white hover:bg-red-800'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Plus size={20} />
                  <span className="text-xl font-medium">Create New</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`flex-1 py-4 px-6 rounded-2xl transition-all duration-300 ${
                  activeTab === 'manage' 
                    ? 'bg-orange-300 text-black shadow-lg' 
                    : 'text-white hover:bg-red-800'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <FileText size={20} />
                  <span className="text-xl font-medium">Manage Articles ({articles.length})</span>
                </div>
              </button>
            </div>
          </div>

          {activeTab === 'create' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Article Form */}
                <div className="bg-red-900 rounded-[20px] outline outline-[3px] outline-offset-[-3px] outline-red-50/95 p-8">
                  <h2 className="text-white text-2xl font-bold mb-6 flex items-center">
                    <FileText className="mr-3" size={24} />
                    Article Details
                  </h2>

                  {/* Headline */}
                  <div className="mb-6">
                    <label className="block text-white text-lg font-medium mb-2">Headline *</label>
                    <input
                      type="text"
                      value={currentArticle.headline}
                      onChange={(e) => setCurrentArticle(prev => ({ ...prev, headline: e.target.value }))}
                      placeholder="Enter your headline here..."
                      className="w-full p-4 bg-white rounded-xl outline outline-2 outline-stone-500 text-red-800 text-lg font-medium placeholder-gray-400 focus:outline-orange-300 transition-all duration-300"
                    />
                  </div>

                  {/* Category and Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-white text-lg font-medium mb-2">Category *</label>
                      <select
                        value={currentArticle.category}
                        onChange={(e) => setCurrentArticle(prev => ({ ...prev, category: e.target.value as Category }))}
                        className="w-full p-4 bg-white rounded-xl outline outline-2 outline-stone-500 text-red-800 text-lg font-medium focus:outline-orange-300 transition-all duration-300"
                      >
                        <option value="Announcements">Announcements</option>
                        <option value="System Updates">System Updates</option>
                        <option value="Election News">Election News</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white text-lg font-medium mb-2">Priority</label>
                      <select
                        value={currentArticle.priority}
                        onChange={(e) => setCurrentArticle(prev => ({ ...prev, priority: e.target.value as Priority }))}
                        className="w-full p-4 bg-white rounded-xl outline outline-2 outline-stone-500 text-red-800 text-lg font-medium focus:outline-orange-300 transition-all duration-300"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <label className="block text-white text-lg font-medium mb-2">Content *</label>
                    <textarea
                      value={currentArticle.content}
                      onChange={(e) => setCurrentArticle(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your article content here..."
                      rows={8}
                      className="w-full p-4 bg-white rounded-xl outline outline-2 outline-stone-500 text-red-800 text-lg font-medium placeholder-gray-400 focus:outline-orange-300 transition-all duration-300 resize-none"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="bg-red-900 rounded-[20px] outline outline-[3px] outline-offset-[-3px] outline-red-50/95 p-8">
                  <h2 className="text-white text-2xl font-bold mb-6 flex items-center">
                    <Camera className="mr-3" size={24} />
                    Images
                  </h2>

                  {/* Upload Area */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                      dragActive ? 'border-orange-300 bg-orange-50' : 'border-gray-300 hover:border-orange-300'
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
                      <h3 className="text-white text-lg font-medium mb-4">Uploaded Images ({currentArticle.images.length})</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {currentArticle.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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
                <div className="bg-red-900 rounded-[20px] outline outline-[3px] outline-offset-[-3px] outline-red-50/95 p-6">
                  <h3 className="text-white text-xl font-bold mb-4 flex items-center">
                    <Send className="mr-2" size={20} />
                    Publish
                  </h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={publishArticle}
                      className="w-full bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
                    >
                      <Check className="mr-2" size={18} />
                      Publish Now
                    </button>
                    
                    <button
                      onClick={() => setShowPreview(true)}
                      className="w-full bg-orange-300 text-black py-3 px-4 rounded-xl font-medium hover:bg-orange-400 transition-colors duration-300 flex items-center justify-center"
                    >
                      <Eye className="mr-2" size={18} />
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Manage Articles */
            <div className="bg-red-900 rounded-[20px] outline outline-[3px] outline-offset-[-3px] outline-red-50/95 p-8">
              <h2 className="text-white text-2xl font-bold mb-6">Published Articles</h2>
              
              {articles.length === 0 ? (
                <div className="text-center py-20">
                  <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-300 text-xl">No articles published yet</p>
                  <p className="text-gray-400">Create your first article to get started</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {articles.map((article) => (
                    <div key={article.id} className="bg-white rounded-2xl p-6 outline outline-2 outline-stone-500">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                            {article.category}
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(article.priority)}`}>
                            {article.priority} Priority
                          </div>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock size={16} className="mr-1" />
                          {article.publishedAt ? formatTimeAgo(article.publishedAt) : 'Draft'}
                        </div>
                      </div>
                      
                      <h3 className="text-red-800 text-2xl font-bold mb-3">{article.headline}</h3>
                      <p className="text-gray-700 mb-4 line-clamp-2">{article.content}</p>
                      
                      {article.images.length > 0 && (
                        <div className="flex items-center text-gray-500 text-sm mb-4">
                          <Camera size={16} className="mr-1" />
                          {article.images.length} image{article.images.length !== 1 ? 's' : ''} attached
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          article.status === 'published' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                        </span>
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            Edit
                          </button>
                          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                            Delete
                          </button>
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
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-red-800">Article Preview</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${getCategoryColor(currentArticle.category)}`}>
                    {currentArticle.category}
                  </div>
                  
                  <h1 className="text-3xl font-bold text-red-800 mb-4">{currentArticle.headline}</h1>
                  
                  {currentArticle.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {currentArticle.images.map((image, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="prose max-w-none">
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                      {currentArticle.content}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                    <span>Just now</span>
                    <span>Tap for full details</span>
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