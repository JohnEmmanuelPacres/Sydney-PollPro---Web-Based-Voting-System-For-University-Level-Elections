'use client';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type FormData = {
  email: string;
  courseYear: string;
  department_org: string;
};

const CreateAccount = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    courseYear: '',
    department_org: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const organizations = [
    'Supreme Student Government',
    'Philippine Institute of Civil Engineers',
    'Philippine Society of Mechanical Engineers',
    'Institute of Integrated Electrical Engineers of the Philippines',
    'Institute of Computer Engineers of the Philippines',
    'Junior Philippine Institute of Accountants',
    'Young Entrepreneurs Society',
    'Young Educators Society',
  ];

  const courseYearOptions = [
    // Architecture
    'BS Architecture - 1st Year',
    'BS Architecture - 2nd Year',
    'BS Architecture - 3rd Year',
    'BS Architecture - 4th Year',
    'BS Architecture - 5th Year',

    // Engineering Programs
    'BS Chemical Engineering - 1st Year',
    'BS Chemical Engineering - 2nd Year',
    'BS Chemical Engineering - 3rd Year',
    'BS Chemical Engineering - 4th Year',
    
    'BS Civil Engineering - 1st Year',
    'BS Civil Engineering - 2nd Year',
    'BS Civil Engineering - 3rd Year',
    'BS Civil Engineering - 4th Year',
    
    'BS Computer Engineering - 1st Year',
    'BS Computer Engineering - 2nd Year',
    'BS Computer Engineering - 3rd Year',
    'BS Computer Engineering - 4th Year',
    
    'BS Electrical Engineering - 1st Year',
    'BS Electrical Engineering - 2nd Year',
    'BS Electrical Engineering - 3rd Year',
    'BS Electrical Engineering - 4th Year',
    
    'BS Electronics Engineering - 1st Year',
    'BS Electronics Engineering - 2nd Year',
    'BS Electronics Engineering - 3rd Year',
    'BS Electronics Engineering - 4th Year',
    
    'BS Industrial Engineering - 1st Year',
    'BS Industrial Engineering - 2nd Year',
    'BS Industrial Engineering - 3rd Year',
    'BS Industrial Engineering - 4th Year',
    
    'BS Mechanical Engineering - 1st Year',
    'BS Mechanical Engineering - 2nd Year',
    'BS Mechanical Engineering - 3rd Year',
    'BS Mechanical Engineering - 4th Year',
    
    'BS Mechanical Engineering with Computational Science - 1st Year',
    'BS Mechanical Engineering with Computational Science - 2nd Year',
    'BS Mechanical Engineering with Computational Science - 3rd Year',
    'BS Mechanical Engineering with Computational Science - 4th Year',
    
    'BS Mechanical Engineering with Mechatronics - 1st Year',
    'BS Mechanical Engineering with Mechatronics - 2nd Year',
    'BS Mechanical Engineering with Mechatronics - 3rd Year',
    'BS Mechanical Engineering with Mechatronics - 4th Year',
    
    'BS Mining Engineering - 1st Year',
    'BS Mining Engineering - 2nd Year',
    'BS Mining Engineering - 3rd Year',
    'BS Mining Engineering - 4th Year',

    // Accountancy and Business Programs
    'BS Accountancy - 1st Year',
    'BS Accountancy - 2nd Year',
    'BS Accountancy - 3rd Year',
    'BS Accountancy - 4th Year',
    
    'BS Accounting Information Systems - 1st Year',
    'BS Accounting Information Systems - 2nd Year',
    'BS Accounting Information Systems - 3rd Year',
    'BS Accounting Information Systems - 4th Year',
    
    'BS Management Accounting - 1st Year',
    'BS Management Accounting - 2nd Year',
    'BS Management Accounting - 3rd Year',
    'BS Management Accounting - 4th Year',
    
    'BS Business Administration (Banking & Financial Management) - 1st Year',
    'BS Business Administration (Banking & Financial Management) - 2nd Year',
    'BS Business Administration (Banking & Financial Management) - 3rd Year',
    'BS Business Administration (Banking & Financial Management) - 4th Year',
    
    'BS Business Administration (Business Analytics) - 1st Year',
    'BS Business Administration (Business Analytics) - 2nd Year',
    'BS Business Administration (Business Analytics) - 3rd Year',
    'BS Business Administration (Business Analytics) - 4th Year',
    
    'BS Business Administration (General Business Management) - 1st Year',
    'BS Business Administration (General Business Management) - 2nd Year',
    'BS Business Administration (General Business Management) - 3rd Year',
    'BS Business Administration (General Business Management) - 4th Year',
    
    'BS Business Administration (Human Resource Management) - 1st Year',
    'BS Business Administration (Human Resource Management) - 2nd Year',
    'BS Business Administration (Human Resource Management) - 3rd Year',
    'BS Business Administration (Human Resource Management) - 4th Year',
    
    'BS Business Administration (Marketing Management) - 1st Year',
    'BS Business Administration (Marketing Management) - 2nd Year',
    'BS Business Administration (Marketing Management) - 3rd Year',
    'BS Business Administration (Marketing Management) - 4th Year',
    
    'BS Business Administration (Operations Management) - 1st Year',
    'BS Business Administration (Operations Management) - 2nd Year',
    'BS Business Administration (Operations Management) - 3rd Year',
    'BS Business Administration (Operations Management) - 4th Year',
    
    'BS Business Administration (Quality Management) - 1st Year',
    'BS Business Administration (Quality Management) - 2nd Year',
    'BS Business Administration (Quality Management) - 3rd Year',
    'BS Business Administration (Quality Management) - 4th Year',
    
    'BS Hospitality Management - 1st Year',
    'BS Hospitality Management - 2nd Year',
    'BS Hospitality Management - 3rd Year',
    'BS Hospitality Management - 4th Year',
    
    'BS Tourism Management - 1st Year',
    'BS Tourism Management - 2nd Year',
    'BS Tourism Management - 3rd Year',
    'BS Tourism Management - 4th Year',
    
    'BS Office Administration - 1st Year',
    'BS Office Administration - 2nd Year',
    'BS Office Administration - 3rd Year',
    'BS Office Administration - 4th Year',
    
    'Associate in Office Administration - 1st Year',
    'Associate in Office Administration - 2nd Year',
    
    'Bachelor in Public Administration - 1st Year',
    'Bachelor in Public Administration - 2nd Year',
    'Bachelor in Public Administration - 3rd Year',
    'Bachelor in Public Administration - 4th Year',

    // Arts and Humanities
    'AB Communication - 1st Year',
    'AB Communication - 2nd Year',
    'AB Communication - 3rd Year',
    'AB Communication - 4th Year',
    
    'AB English with Applied Linguistics - 1st Year',
    'AB English with Applied Linguistics - 2nd Year',
    'AB English with Applied Linguistics - 3rd Year',
    'AB English with Applied Linguistics - 4th Year',

    // Education
    'Bachelor of Elementary Education - 1st Year',
    'Bachelor of Elementary Education - 2nd Year',
    'Bachelor of Elementary Education - 3rd Year',
    'Bachelor of Elementary Education - 4th Year',
    
    'Bachelor of Secondary Education (English) - 1st Year',
    'Bachelor of Secondary Education (English) - 2nd Year',
    'Bachelor of Secondary Education (English) - 3rd Year',
    'Bachelor of Secondary Education (English) - 4th Year',
    
    'Bachelor of Secondary Education (Filipino) - 1st Year',
    'Bachelor of Secondary Education (Filipino) - 2nd Year',
    'Bachelor of Secondary Education (Filipino) - 3rd Year',
    'Bachelor of Secondary Education (Filipino) - 4th Year',
    
    'Bachelor of Secondary Education (Mathematics) - 1st Year',
    'Bachelor of Secondary Education (Mathematics) - 2nd Year',
    'Bachelor of Secondary Education (Mathematics) - 3rd Year',
    'Bachelor of Secondary Education (Mathematics) - 4th Year',
    
    'Bachelor of Secondary Education (Science) - 1st Year',
    'Bachelor of Secondary Education (Science) - 2nd Year',
    'Bachelor of Secondary Education (Science) - 3rd Year',
    'Bachelor of Secondary Education (Science) - 4th Year',
    
    'Bachelor of Multimedia Arts - 1st Year',
    'Bachelor of Multimedia Arts - 2nd Year',
    'Bachelor of Multimedia Arts - 3rd Year',
    'Bachelor of Multimedia Arts - 4th Year',

    // Sciences
    'BS Biology - 1st Year',
    'BS Biology - 2nd Year',
    'BS Biology - 3rd Year',
    'BS Biology - 4th Year',
    
    'BS Math with Applied Industrial Mathematics - 1st Year',
    'BS Math with Applied Industrial Mathematics - 2nd Year',
    'BS Math with Applied Industrial Mathematics - 3rd Year',
    'BS Math with Applied Industrial Mathematics - 4th Year',
    
    'BS Psychology - 1st Year',
    'BS Psychology - 2nd Year',
    'BS Psychology - 3rd Year',
    'BS Psychology - 4th Year',

    // Health Sciences
    'BS Nursing - 1st Year',
    'BS Nursing - 2nd Year',
    'BS Nursing - 3rd Year',
    'BS Nursing - 4th Year',
    
    'BS Pharmacy - 1st Year',
    'BS Pharmacy - 2nd Year',
    'BS Pharmacy - 3rd Year',
    'BS Pharmacy - 4th Year',
    
    'BS Medical Technology - 1st Year',
    'BS Medical Technology - 2nd Year',
    'BS Medical Technology - 3rd Year',
    'BS Medical Technology - 4th Year',

    // Computing
    'BS Computer Science - 1st Year',
    'BS Computer Science - 2nd Year',
    'BS Computer Science - 3rd Year',
    'BS Computer Science - 4th Year',
    
    'BS Information Technology - 1st Year',
    'BS Information Technology - 2nd Year',
    'BS Information Technology - 3rd Year',
    'BS Information Technology - 4th Year',

    // Criminology
    'BS Criminology - 1st Year',
    'BS Criminology - 2nd Year',
    'BS Criminology - 3rd Year',
    'BS Criminology - 4th Year'
  ];

  // Categories for filtering
  const categories = useMemo(() => [
    'All',
    'Architecture',
    'Engineering',
    'Accountancy & Business',
    'Arts & Humanities',
    'Education',
    'Sciences',
    'Health Sciences',
    'Computing',
    'Criminology'
  ], []);

  // Filter options based on search term and selected category
  const filteredOptions = useMemo(() => {
    return courseYearOptions.filter(option => {
      const matchesSearch = option.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = 
        selectedCategory === 'All' || 
        (selectedCategory === 'Architecture' && option.includes('Architecture')) ||
        (selectedCategory === 'Engineering' && option.includes('Engineering') && !option.includes('Accountancy')) ||
        (selectedCategory === 'Accountancy & Business' && 
          (option.includes('Accountancy') || 
           option.includes('Business') || 
           option.includes('Hospitality') || 
           option.includes('Tourism') || 
           option.includes('Office Administration') || 
           option.includes('Public Administration'))) ||
        (selectedCategory === 'Arts & Humanities' && 
          (option.includes('Communication') || 
           option.includes('English with Applied Linguistics'))) ||
        (selectedCategory === 'Education' && 
          (option.includes('Education') || 
           option.includes('Multimedia Arts'))) ||
        (selectedCategory === 'Sciences' && 
          (option.includes('Biology') || 
           option.includes('Math with Applied Industrial Mathematics') || 
           option.includes('Psychology'))) ||
        (selectedCategory === 'Health Sciences' && 
          (option.includes('Nursing') || 
           option.includes('Pharmacy') || 
           option.includes('Medical Technology'))) ||
        (selectedCategory === 'Computing' && 
          (option.includes('Computer Science') || 
           option.includes('Information Technology'))) ||
        (selectedCategory === 'Criminology' && option.includes('Criminology'));
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, courseYearOptions]);

  const [dropdownOpenCourseYear, setDropdownOpenCourseYear] = useState(false);
  const [dropdownOpenDepartment, setDropdownOpenDepartment] = useState(false);

  const dropdownRefCourseYear = useRef<HTMLDivElement>(null);
  const dropdownRefDepartment = useRef<HTMLDivElement>(null);
  
  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRefCourseYear.current && !dropdownRefCourseYear.current.contains(event.target as Node)) {
        setDropdownOpenCourseYear(false);
      }
      if (dropdownRefDepartment.current && !dropdownRefDepartment.current.contains(event.target as Node)) {
        setDropdownOpenDepartment(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Keyboard navigation for course year dropdown
  const [highlightedIndexCourseYear, setHighlightedIndexCourseYear] = useState(-1);
  const handleDropdownKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!dropdownOpenCourseYear) return;
    if (e.key === 'ArrowDown') {
      setHighlightedIndexCourseYear((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndexCourseYear((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
      e.preventDefault();
    } else if (e.key === 'Enter' && highlightedIndexCourseYear >= 0) {
      setFormData((prev) => ({ ...prev, courseYear: filteredOptions[highlightedIndexCourseYear] }));
      setDropdownOpenCourseYear(false);
      setHighlightedIndexCourseYear(-1);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setDropdownOpenCourseYear(false);
      setHighlightedIndexCourseYear(-1);
      e.preventDefault();
    }
  };

  // Keyboard navigation for department_org dropdown
  const [highlightedIndexDepartment, setHighlightedIndexDepartment] = useState(-1);
  const handleDepartmentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!dropdownOpenDepartment) return;
    if (e.key === 'ArrowDown') {
      setHighlightedIndexDepartment((prev) => (prev < organizations.length - 1 ? prev + 1 : 0));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndexDepartment((prev) => (prev > 0 ? prev - 1 : organizations.length - 1));
      e.preventDefault();
    } else if (e.key === 'Enter' && highlightedIndexDepartment >= 0) {
      setFormData((prev) => ({ ...prev, department_org: organizations[highlightedIndexDepartment] }));
      setDropdownOpenDepartment(false);
      setHighlightedIndexDepartment(-1);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setDropdownOpenDepartment(false);
      setHighlightedIndexDepartment(-1);
      e.preventDefault();
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    try {
      if (!formData.email.endsWith('@cit.edu')) {
        setError('Please use your CIT email address (@cit.edu)');
        setIsLoading(false);
        return;
      }

      try {
        const checkRes = await fetch('/api/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        });
        const checkData = await checkRes.json();
        if (checkData.exists) {
          setError('This email is already registered. Please log in or use a different email.');
          setIsLoading(false);
          return;
        }
      } catch (err) {
        setError('Could not verify email. Please try again.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/send-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email,
          courseYear: formData.courseYear,
          department_org: formData.department_org
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send temporary PIN');
        setTimeout(() => setError(null), 5000);
        return;
      }

      setSuccess('Temporary PIN sent to your email! Please check your inbox and use the PIN to log in.');
      setTimeout(() => router.push('/User_RegxLogin'), 8000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during registration';
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [formData, router]);

  const inputClasses = useMemo(() => (
    "w-full h-[50px] rounded-[10px] bg-white border border-[#bcbec0] px-4 sm:px-6 text-base text-black"
  ), []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-b from-yellow-900 to-red-900 overflow-hidden text-left text-xl text-white font-['Actor']">
      
      {/* Mobile Header */}
      <div className="lg:hidden flex flex-col items-center p-4 pt-8">
        <Image
          width={100}
          height={100}
          alt="Website Logo"
          src="/Website Logo.png"
          className="mb-4"
          priority
        />
        <h1 className="text-3xl font-black text-center mb-4">JOIN THE POLLS</h1>
      </div>

      {/* Left Content Section - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-8 relative">
        <div className="mb-8 flex flex-col items-center">
          <Image
            width={147}
            height={147}
            alt="Website Logo"
            src="/Website Logo.png"
            className="mb-4"
            priority
          />
          <h1 className="text-[50px] font-black">JOIN THE POLLS</h1>
        </div>

        <div className="text-center max-w-md">
          <p className="text-xl font-bold mb-8">
            For more information, click the button below!
          </p>
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-[40px] bg-[#222121] px-8 py-4 text-[26px] font-bold hover:bg-[#333] transition-colors"
            aria-label="About Us"
            href="/About"
          >
            About Us
          </motion.a>
        </div>
      </div>

      {/* Right Form Section - Full width on mobile */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[790px] h-auto min-h-[auto] lg:min-h-[727px] backdrop-blur-[25px] rounded-[40px] bg-white/10 border-3 border-white/79 p-4 sm:p-6 md:p-8"
        >
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center md:text-left text-2xl sm:text-3xl md:text-4xl font-semibold font-['Baloo_Da_2'] mb-6 md:mb-8"
          >
            Register
          </motion.div>

          {/* Form Container */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full max-w-[500px] mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" noValidate>
              <div>
                <div className="text-lg sm:text-xl mb-2 sm:mb-4">Institutional Email</div>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  type="email"
                  name="email"
                  placeholder="username@cit.edu"
                  className={inputClasses}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="relative" ref={dropdownRefCourseYear}>
                <div className="text-lg sm:text-xl mb-2 sm:mb-4">Course & Year</div>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  tabIndex={0}
                  className={`${inputClasses} flex items-center justify-between cursor-pointer pr-3`}
                  onClick={() => setDropdownOpenCourseYear((open) => !open)}
                  onKeyDown={handleDropdownKeyDown}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpenCourseYear}
                  aria-label="Select Course and Year"
                >
                  <span className={`truncate ${formData.courseYear ? 'text-black' : 'text-gray-400'}`}>
                    {formData.courseYear || 'Select Course & Year'}
                  </span>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#bb8b1b] ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
                {dropdownOpenCourseYear && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-0 mt-1 w-full bg-white border border-[#bcbec0] rounded-[10px] shadow-lg z-50 max-h-96 overflow-hidden"
                    role="listbox"
                  >
                    {/* Search input */}
                    <div className="p-2 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Search programs..."
                        className="w-full p-2 border border-gray-300 rounded-md text-black"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                      />
                    </div>
                    
                    {/* Category filter */}
                    <div className="p-2 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
                      {categories.map(category => (
                        <button
                          key={category}
                          className={`mx-1 px-3 py-1 rounded-full text-sm ${
                            selectedCategory === category 
                              ? 'bg-[#bb8b1b] text-white' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                    
                    {/* Options list */}
                    <div className="max-h-60 overflow-auto">
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, idx) => (
                          <motion.div
                            key={option}
                            whileHover={{ scale: 1.02 }}
                            className={`px-4 sm:px-6 py-2 cursor-pointer text-sm sm:text-base text-black hover:bg-[#fac36b] hover:text-white transition-colors ${
                              formData.courseYear === option ? 'bg-[#fac36b] text-white' : ''
                            } ${highlightedIndexCourseYear === idx ? 'bg-[#bb8b1b] text-white' : ''}`}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, courseYear: option }));
                              setDropdownOpenCourseYear(false);
                              setHighlightedIndexDepartment(-1);
                            }}
                            onMouseEnter={() => setHighlightedIndexDepartment(idx)}
                            role="option"
                            aria-selected={formData.courseYear === option}
                          >
                            {option}
                          </motion.div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500 text-center">
                          No programs found matching your search
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="relative" ref={dropdownRefDepartment}>
                <div className="text-lg sm:text-xl mb-2 sm:mb-4">Department Organization</div>
                <div
                  tabIndex={0}
                  className={`${inputClasses} flex items-center justify-between cursor-pointer focus:border-[#fac36b] focus:ring-2 focus:ring-[#fac36b] transition-all duration-200 hover:border-[#fac36b] pr-3 bg-white text-black`}
                  onClick={() => setDropdownOpenDepartment((open) => !open)}
                  onKeyDown={handleDepartmentKeyDown}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpenDepartment}
                  aria-label="Select your Department's Organization"
                >
                  <span className={formData.department_org ? 'text-black' : 'text-gray-400'}>
                    {formData.department_org || 'Select your Department\'s Organization'}
                  </span>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#bb8b1b] ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {dropdownOpenDepartment && (
                  <ul
                    className="absolute left-0 mt-2 w-full bg-white border border-[#bcbec0] rounded-[10px] shadow-lg z-50 max-h-60 overflow-auto"
                    role="listbox"
                  >
                    {organizations.map((option, idx) => (
                      <li
                        key={option}
                        className={`px-6 py-2 cursor-pointer text-black hover:bg-[#fac36b] hover:text-white transition-colors ${
                          formData.department_org === option ? 'bg-[#fac36b] text-white' : ''
                        } ${highlightedIndexDepartment === idx ? 'bg-[#bb8b1b] text-white' : ''}`}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, department_org: option }));
                          setDropdownOpenDepartment(false);
                          setHighlightedIndexDepartment(-1);
                        }}
                        onMouseEnter={() => setHighlightedIndexDepartment(idx)}
                        role="option"
                        aria-selected={formData.department_org === option}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-2">
                <motion.a 
                  href="/User_RegxLogin" 
                  className="text-lg sm:text-xl text-white font-bold hover:text-[#fac36b] block mb-4 sm:mb-6 transition-colors"
                  aria-label="Login page"
                  whileHover={{ scale: 1.02 }}
                >
                  Already have an account? Log in here
                </motion.a>

                <motion.button 
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-[50px] text-white text-lg sm:text-xl font-bold cursor-pointer border-2 border-black rounded-lg hover:text-[#fac36b] hover:border-[#fac36b] bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Register account"
                >
                  {isLoading ? 'SENDING...' : 'REGISTER'}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Mobile About Us Button */}
          <div className="lg:hidden mt-8 text-center">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-[40px] bg-[#222121] px-6 py-3 text-lg font-bold hover:bg-[#333] transition-colors"
              aria-label="About Us"
              href='/About'
            >
              About Us
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-0 left-0 w-full ${
              error ? 'bg-[#d90429]' : 'bg-green-600'
            } text-white font-bold text-base sm:text-lg p-3 sm:p-4 text-center rounded-b-[10px] z-[1000]`}
          >
            {error || success}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateAccount;