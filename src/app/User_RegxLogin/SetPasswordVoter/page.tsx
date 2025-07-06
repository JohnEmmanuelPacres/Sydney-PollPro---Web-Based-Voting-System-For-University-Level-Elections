'use client';
import { useState, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { extractFirstAndLastNameFromEmail, prettifyFirstName } from '@/utils/emailUtils';
import { motion } from 'framer-motion';

type FormData = {
  password: string;
  confirmPassword: string;
};

const SetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const courseYear = searchParams.get('courseYear');
  const department_org = searchParams.get('department_org'); // Added for department/org
  
  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if no email is provided
  useEffect(() => {
    if (!email) {
      router.push('/User_RegxLogin');
    }
  }, [email, router]);

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
    setIsLoading(true);

    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password);
    
    try {
      // Validate password
      if (!hasLowerCase || !hasUpperCase || !hasNumber || !hasSpecialChar) {
        setError('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character');
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      // Try to sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email!,
        password: formData.password,
        options: {
          data: {
            //course_year: courseYear || '', //auth.users.user_metadata
            user_type: 'voter',
          }
        }
      });

      const user_id = signUpData?.user?.id;

      if (signUpData?.user?.user_metadata.user_type === 'voter' || signUpData?.user?.user_metadata.user_type === 'admin-voter') {
        const { first_name, last_name } = extractFirstAndLastNameFromEmail(email!);
        const prettyFirstName = prettifyFirstName(first_name);
        await supabase.from('voter_profiles').insert({
          id: user_id,
          email: email!,
          course_year: courseYear || '',
          department_org: department_org || '',
          first_name: prettyFirstName,
          last_name,
        });
      }

      if (signUpError) {
        // If user already exists, show alert and stop
        if (
          signUpError.message.includes('User already registered') ||
          signUpError.message.includes('User already exists') ||
          signUpError.message.includes('duplicate key value violates unique constraint')
        ) {
          alert('User already registered. Please log in or use a different email.');
          setIsLoading(false);
          return;
        }
        // If user already exists, try to sign in
        if (
          signUpError.message.includes('User already registered') ||
          signUpError.message.includes('User already exists') ||
          signUpError.message.includes('duplicate key value violates unique constraint')
        ) {
          // Try to sign in with the new password
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: email!,
            password: formData.password,
          });

          if (signInError) {
            setError('Failed to log in. Please try again or contact support.');
            setIsLoading(false);
            return;
          }

          if (signInData.user) {
            setSuccess('Password updated and logged in successfully! Redirecting to dashboard...');
            setTimeout(() => router.push('/Voterdashboard'), 2000);
            return;
          }
        } else {
          setError(signUpError.message);
          setIsLoading(false);
          return;
        }
      }

      // If signup was successful, try to sign in immediately
      if (signUpData.user) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email!,
          password: formData.password,
        });

        if (signInError) {
          setError('Account created but login failed. Please try logging in manually.');
          setIsLoading(false);
          return;
        }

        if (signInData.user) {
          setSuccess('Account created and logged in successfully! Redirecting to dashboard...');
          setTimeout(() => router.push('/Voterdashboard'), 2000);
          return;
        }
      }

      setSuccess('Password set successfully! Please log in with your new password.');
      setTimeout(() => router.push('/User_RegxLogin'), 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while setting password';
      setError(errorMessage);
      console.error('Password setup error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [formData, email, courseYear, router]);

  // Memoized common input classes to avoid repetition
  const inputClasses = useMemo(() => (
    "w-full h-[50px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] bg-white border border-[#bcbec0] box-border text-base pl-6 text-black"
  ), []);

  if (!email) {
    return null; // Will redirect
  }

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
        <h1 className="text-3xl font-black text-center mb-4">SET YOUR PASSWORD</h1>
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
          <h1 className="text-[50px] font-black">SET YOUR PASSWORD</h1>
        </div>
        <div className="text-center max-w-md">
          <p className="text-xl font-bold mb-8">Create a secure password for your account</p>
          <div className="text-lg">
            <p className="mb-4">Email: {email}</p>
            {courseYear && <p className="mb-2">Course: {courseYear}</p>}
            <p className="text-sm opacity-80">PIN verified successfully</p>
          </div>
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
            Set Password
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full max-w-[500px] mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" noValidate>
              <div>
                <div className="text-lg sm:text-xl mb-2 sm:mb-4">New Password</div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="New Password" className={inputClasses} value={formData.password} onChange={handleChange} required minLength={6} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-[#899499] text-xs italic mt-2">Password must be at least 6 characters long</p>
              </div>
              <div>
                <div className="text-lg sm:text-xl mb-2 sm:mb-4">Confirm Password</div>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" className={inputClasses} value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <motion.a 
                  href="/User_RegxLogin" 
                  className="text-lg sm:text-xl text-white font-bold hover:text-[#fac36b] block mb-4 sm:mb-6 transition-colors"
                  aria-label="Login page"
                  whileHover={{ scale: 1.02 }}
                >
                  Back to Login
                </motion.a>
                <motion.button 
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-[50px] text-white text-lg sm:text-xl font-bold cursor-pointer border-2 border-black rounded-lg hover:text-[#fac36b] hover:border-[#fac36b] bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Set password"
                >
                  {isLoading ? 'Setting...' : 'Set Password'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
      {/* Toast Notifications */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={(error || success) ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 left-0 w-full ${error ? 'bg-[#d90429]' : 'bg-green-600'} text-white font-bold text-base sm:text-lg p-3 sm:p-4 text-center rounded-b-[10px] z-[1000]`}
        style={{ display: error || success ? 'block' : 'none' }}
      >
        {error || success}
      </motion.div>
    </div>
  );
};

export default SetPassword; 