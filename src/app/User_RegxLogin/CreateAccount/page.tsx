'use client';
import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

type FormData = {
  email: string;
  courseYear: string;
  password: string;
};

const CreateAccount = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    courseYear: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Memoized form handler to prevent unnecessary re-creations
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Memoized submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            course_year: formData.courseYear,
          }
        },
      });

      if (signUpError) {
        const errorMessage = signUpError.message.includes('User already registered') || 
                           signUpError.message.includes('User already exists')
                          ? 'Account already registered'
                          : signUpError.message;
        
        setError(errorMessage);
        setTimeout(() => setError(null), 5000);
        return;
      }

      if (data.user) {
        setSuccess('Registered successfully! You can now log in.');
        setTimeout(() => router.push('/User_RegxLogin'), 5000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during registration';
      setError(errorMessage);
      console.error('Registration error:', err);
    }
  }, [formData, router]);

  // Memoized common input classes to avoid repetition
  const inputClasses = useMemo(() => (
    "w-full h-[50px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] bg-white border border-[#bcbec0] box-border text-base pl-6 text-black"
  ), []);

  return (
    <div className="h-screen flex bg-gradient-to-b from-[#bb8b1b] to-[#b01818] text-white font-['Merriweather']">
      {/* Left Content Section */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8 relative">
        <div className="mb-8 flex flex-col items-center">
          <Image
            width={147}
            height={147}
            alt="Website Logo"
            src="/Website Logo.png"
            className="mb-4"
            priority // Important for LCP
          />
          <h1 className="text-[50px] font-black">JOIN THE POLLS</h1>
        </div>

        <div className="text-center max-w-md">
          <p className="text-xl font-bold mb-8">
            For more information, click the button below!
          </p>
          <button 
            className="rounded-[40px] bg-[#222121] px-8 py-4 text-[26px] font-bold hover:bg-[#333] transition-colors"
            aria-label="About Us"
          >
            About Us
          </button>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-1/2 relative flex items-center justify-center">
        {/* Background Image - Using next/image optimization */}
        <div className="absolute inset-0 flex items-center justify-start z-0 pt-18 pr-25"> 
          <Image 
            src="/form.png" 
            alt="Form background" 
            width={700}
            height={700}
            className="object-contain object-left"
            priority // Important for LCP
          /> 
        </div>
        
        {/* Form Content */}
        <div className="absolute z-10 w-full max-w-screen-md p-10, pr-30 pl-30">
          <h2 className="text-[40px] text-[#f3e2e2] mb-12 text-center">Register</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <input
                type="email"
                name="email"
                placeholder="University Email"
                className={inputClasses}
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <input
                type="text"
                name="courseYear"
                placeholder="Course & Year"
                className={inputClasses}
                value={formData.courseYear}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={inputClasses}
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <p className="text-[#666] text-xs italic mt-2">
                Password must be at least 6 characters long
              </p>
            </div>

            <div className="pt-4">
              <a 
                href="/User_RegxLogin" 
                className="text-xl text-white font-bold hover:text-[#fac36b] block mb-6 transition-colors"
                aria-label="Login page"
              >
                Log in here
              </a>

              <button 
                type="submit"
                className="w-[184px] h-[50px] text-white text-xl font-bold cursor-pointer border-2 border-black rounded-lg hover:text-[#fac36b] hover:border-[#fac36b] bg-black transition-colors"
                aria-label="Register account"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notifications */}
      {(error || success) && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 ${
          error ? 'bg-white text-red-500' : 'bg-[#e6ffe6] text-green-500'
        }`}>
          {error || success}
        </div>
      )}
    </div>
  );
};

export default CreateAccount;