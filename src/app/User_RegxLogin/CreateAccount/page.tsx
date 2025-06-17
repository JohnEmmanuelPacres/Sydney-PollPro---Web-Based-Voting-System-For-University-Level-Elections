'use client';
import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

const CreateAccount = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    courseYear: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        if (signUpError.message.includes('User already registered') || signUpError.message.includes('User already exists')) {
          setError('Account already registered');
        } else {
          setError(signUpError.message);
        }
        setTimeout(() => {
          setError(null);
        }, 5000);
        return;
      }

      if (data.user) {
        setSuccess('Registered successfully! You can now log in.');
        setTimeout(() => {
          router.push('/User_RegxLogin');
        }, 5000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#bb8b1b] to-[#b01818] text-white font-['Merriweather']">
      {/* Left Content Section */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8 relative">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <Image
            width={147}
            height={147}
            alt="Website Logo"
            src="/Website Logo.png"
            className="mb-4"
          />
          <h1 className="text-[50px] font-black">JOIN US</h1>
        </div>

        {/* About Us Section */}
        <div className="text-center max-w-md">
          <p className="text-xl font-bold mb-8">
            For more information, click the button below!
          </p>
          <button className="rounded-[40px] bg-[#222121] px-8 py-4 text-[26px] font-bold">
            About Us
          </button>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-1/2 relative flex items-center justify-center">
        {/* Background Image - Modified to show original red color */}
        <div className="absolute inset-0 flex items-center justify-start z-0">
          <Image
            src="/form.png"
            alt="Form background"
            fill
            className="object-contain object-left"
            priority
          />
        </div>

        {/* Form Content */}
        <div className="relative z-10 w-full max-w-md p-8">
          <h2 className="text-[40px] text-[#f3e2e2] mb-12 text-center">Register</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                placeholder="University Email"
                className="w-full h-[50px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] bg-white border border-[#bcbec0] box-border text-base pl-6 text-black"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <input
                type="text"
                name="courseYear"
                placeholder="Course & Year"
                className="w-full h-[50px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] bg-white border border-[#bcbec0] box-border text-base pl-6 text-black"
                value={formData.courseYear}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full h-[50px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] bg-white border border-[#bcbec0] box-border text-base pl-6 text-black"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <p className="text-[#666] text-xs italic mt-2">
                Password must be at least 6 characters long
              </p>
            </div>

            <div className="pt-4">
              <a 
                href="/User_RegxLogin" 
                className="text-xl text-white font-bold hover:text-[#fac36b] block mb-6"
              >
                Log in here
              </a>

              <button 
                type="submit"
                className="w-[184px] h-[50px] text-white text-xl font-bold cursor-pointer border-2 border-black rounded-lg hover:text-[#fac36b] hover:border-[#fac36b] bg-black"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white text-red-500 px-6 py-3 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}
      {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#e6ffe6] text-green-500 px-6 py-3 rounded-lg shadow-lg z-50">
          {success}
        </div>
      )}
    </div>
  );
};

export default CreateAccount;