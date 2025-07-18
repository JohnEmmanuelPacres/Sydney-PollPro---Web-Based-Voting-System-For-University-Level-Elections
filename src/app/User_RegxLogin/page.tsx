'use client';
import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next';
import Header from '../components/Header';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { extractFirstAndLastNameFromEmail, prettifyFirstName } from '@/utils/emailUtils';

const SIGNIN: NextPage = () => {
  const [email, setEmail] = useState("");
  const [credential, setCredential] = useState("");
  const [showCredential, setShowCredential] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [signInError, setSignInError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const router = useRouter();

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_MINUTES = 15;

  function getRateLimitInfo(email: string) {
    const data = localStorage.getItem(`login_attempts_${email}`);
    if (!data) return { attempts: 0, lockoutUntil: 0 };
    try {
      return JSON.parse(data);
    } catch {
      return { attempts: 0, lockoutUntil: 0 };
    }
  }

  function setRateLimitInfo(email: string, info: { attempts: number; lockoutUntil: number }) {
    localStorage.setItem(`login_attempts_${email}`, JSON.stringify(info));
  }

  const handleSignIn = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    setSignInError("");
    setIsLoading(true);
    
    // Rate limiting logic
    const { attempts, lockoutUntil } = getRateLimitInfo(email);
    const now = Date.now();
    if (lockoutUntil && now < lockoutUntil) {
      setSignInError(`Too many failed attempts. Please try again after ${new Date(lockoutUntil).toLocaleTimeString()}.`);
      setIsLoading(false);
      return;
    }

    if (!email.endsWith('@cit.edu')) {
      setSignInError('Please use your CIT email address (@cit.edu)');
      setIsLoading(false);
      return;
    }

    if (!credential) {
      setSignInError('Please enter your PIN or password');
      setIsLoading(false);
      return;
    }

    // Check if credential is a 6-digit PIN
    const isPIN = /^\d{6}$/.test(credential);

    if (isPIN) {
      // Handle PIN-based login
      try {
        const response = await fetch('/api/send-pin', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, pin: credential }),
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (!response.ok) {
          // Increment failed attempts
          const newAttempts = attempts + 1;
          if (newAttempts >= MAX_ATTEMPTS) {
            setRateLimitInfo(email, { attempts: newAttempts, lockoutUntil: now + LOCKOUT_MINUTES * 60 * 1000 });
            setSignInError(`Too many failed attempts. Please try again after ${new Date(now + LOCKOUT_MINUTES * 60 * 1000).toLocaleTimeString()}.`);
          } else {
            setRateLimitInfo(email, { attempts: newAttempts, lockoutUntil: 0 });
            setSignInError(data.error || 'Invalid PIN');
          }
          setIsLoading(false);
          return;
        }

        // On success, reset attempts
        setRateLimitInfo(email, { attempts: 0, lockoutUntil: 0 });

        // Redirect to password setup page
        router.push(`/User_RegxLogin/SetPasswordVoter?email=${encodeURIComponent(email)}${data.courseYear ? `&courseYear=${encodeURIComponent(data.courseYear)}` : ''}${data.department_org ? `&department_org=${encodeURIComponent(data.department_org)}` : ''}`);
      } catch (err) {
        setSignInError('An unexpected error occurred. Please try again.');
        console.error('Login error:', err);
        setIsLoading(false);
      }
    } else {
      // Handle password-based login
      try {
        // First check if we have an existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        // If there's an existing session, sign out first
        if (session) {
          await supabase.auth.signOut();
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: credential,
        });

        if (error) {
          // Increment failed attempts
          const newAttempts = attempts + 1;
          if (newAttempts >= MAX_ATTEMPTS) {
            setRateLimitInfo(email, { attempts: newAttempts, lockoutUntil: now + LOCKOUT_MINUTES * 60 * 1000 });
            setSignInError(`Too many failed attempts. Please try again after ${new Date(now + LOCKOUT_MINUTES * 60 * 1000).toLocaleTimeString()}.`);
          } else {
            setRateLimitInfo(email, { attempts: newAttempts, lockoutUntil: 0 });
            if (error.message.includes('Invalid login credentials')) {
              setSignInError('Invalid email or password. Please try again.');
            } else if (error.message.includes('Email not confirmed')) {
              setSignInError('Please verify your email address before signing in.');
            } else {
              setSignInError(error.message);
            }
          }
          setIsLoading(false);
          return;
        }

        // On success, reset attempts
        setRateLimitInfo(email, { attempts: 0, lockoutUntil: 0 });

        const { data: voterProfile, error: voterProfileError } = await supabase
          .from('voter_profiles')
          .select('*')
          .eq('email', email)
          .single();

        if (voterProfileError || !voterProfile) {
          const {data: adminProfile, error: adminError} = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('email', email)
            .single();

          if (adminError || !adminProfile) {
            setSignInError('Invalid login credentials. Please try again.');
            setIsLoading(false);
            return;
          }

           // Check for required fields and prompt if missing
          if (!adminProfile.course_year || !adminProfile.department_org) {
            setSignInError('Your admin profile is missing required voter information (course year or department/org). Please contact support.');
            setIsLoading(false);
            return;
          }

          // If the admin tries to log in as voter
          const { first_name, last_name } = extractFirstAndLastNameFromEmail(email!);
          const prettyFirstName = prettifyFirstName(first_name);
          const {error: voterInsertError} = await supabase.from('voter_profiles').insert({
            id: adminProfile.id,
            email: email!,
            course_year: adminProfile.course_year || '',
            department_org: adminProfile.department_org || '',
            first_name: prettyFirstName,
            last_name,
          });

          if (voterInsertError) {
            // If duplicate, ignore; otherwise, show error
            if (voterInsertError.code !== '23505') { // 23505 = unique_violation in Postgres
              setSignInError('Failed to register you as a voter: ' + voterInsertError.message);
              setIsLoading(false);
              return;
            }
          }
        }

        if (data.user) {
          // Store the session in localStorage
          localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
          router.push(`/Voterdashboard?department_org=${voterProfile.department_org}`);
        }
      } catch (err) {
        setSignInError('An unexpected error occurred. Please try again.');
        console.error('Login error:', err);
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  };

  const handleSignUp = () => {
    router.push('/User_RegxLogin/CreateAccount');
  };

  const handleAdminLogin = () => {
    router.push('/User_RegxLogin/LoginAdmin');
  };

  useEffect(() => {
    if (signInError) {
      const timer = setTimeout(() => setSignInError("") , 5000);
      return () => clearTimeout(timer);
    }
  }, [signInError]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        // Fetch the voter profile to get department_org
        const { data: voterProfile, error } = await supabase
          .from('voter_profiles')
          .select('department_org')
          .eq('id', session.user.id)
          .single();

        if (voterProfile && voterProfile.department_org) {
          router.push(`/Voterdashboard?department_org=${voterProfile.department_org}`);
        } else {
          // If no profile or error, just go to dashboard without department_org
          router.push('/Voterdashboard');
        }
      } else {
        setLoading(false); // Show login form
      }
    });
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Shift + A + D combination (desktop)
      if (event.shiftKey && event.key.toLowerCase() === 'a') {
        // Wait for the 'D' key
        const handleDKey = (dEvent: KeyboardEvent) => {
          if (dEvent.key.toLowerCase() === 'd') {
            setShowAdminLogin(true);
            document.removeEventListener('keydown', handleDKey);
          }
        };
        document.addEventListener('keydown', handleDKey);
        // Remove the listener after a short delay if 'D' is not pressed
        setTimeout(() => {
          document.removeEventListener('keydown', handleDKey);
        }, 1000);
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-red-950 overflow-hidden text-left text-xl text-white font-['Actor'] pt-24 md:pt-32">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center gap-y-8 px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[790px] h-auto min-h-[727px] backdrop-blur-[25px] rounded-[40px] bg-white/10 border-3 border-white/79 mt-8 p-6 md:p-8"
        >
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center md:text-left text-3xl sm:text-4xl font-semibold font-['Baloo_Da_2'] mb-8"
          >
            Log In as Voter
          </motion.div>

          {/* Form Container */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full max-w-[500px] mx-auto"
          >
            <form onSubmit={handleSignIn}>
              <div className="text-xl mb-4">Institutional Email</div>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                type="email"
                className="w-full h-[50px] rounded-[10px] bg-white border border-[#bcbec0] px-6 text-base text-black transform-gpu"
                placeholder="username@cit.edu"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (e.target.value && !e.target.value.endsWith('@cit.edu')) {
                    setEmailError('Email must end with @cit.edu');
                  } else {
                    setEmailError("");
                  }
                }}
              />
              <AnimatePresence>
                {emailError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-1 text-[#d90429] text-base font-bold"
                  >
                    {emailError}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="text-xl mt-6">PIN or Password</div>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                type={showCredential ? "text" : "password"}
                className="w-full h-[50px] rounded-[10px] bg-white border border-[#bcbec0] px-6 text-base text-black mt-2 transform-gpu"
                placeholder="Enter 6-digit PIN or your password"
                value={credential}
                onChange={e => {
                  setCredential(e.target.value);
                }}
              />
              
              {/* Show Credential Checkbox */}
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="showCredential"
                  checked={showCredential}
                  onChange={() => setShowCredential(!showCredential)}
                  className="mr-2"
                />
                <label htmlFor="showCredential" className="text-base">Show PIN/Password</label>
              </div>
              {/* Forgot Password Link */}
              <div className="mt-4 text-right">
                <a href="/User_RegxLogin/ForgotPassword" className="text-sm text-blue-300 hover:underline">Forgot Password?</a>
              </div>

              {/* Sign in */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full h-[50px] mt-8 flex items-center justify-center text-white text-xl font-bold cursor-pointer border-2 border-black rounded-lg transition-colors duration-200 hover:text-[#fac36b] hover:border-[#fac36b] bg-black disabled:opacity-50 disabled:cursor-not-allowed transform-gpu"
              >
                {isLoading ? 'VERIFYING...' : 'SIGN IN'}
              </motion.button>
            </form>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-4 text-lg"
            >
              Don't have an account yet?
            </motion.div>

            {/* Sign up */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignUp}
              className="w-full h-[50px] mt-4 flex items-center justify-center text-white text-xl font-bold cursor-pointer border-2 border-black rounded-lg transition-colors duration-200 hover:text-[#fac36b] hover:border-[#fac36b] bg-black transform-gpu"
            >
              SIGN UP
            </motion.button>

            {showAdminLogin && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={handleAdminLogin}
                className="w-full h-[50px] mt-4 flex items-center justify-center text-white text-xl cursor-pointer rounded-lg transition-colors duration-200 hover:text-[#fac36b] underline underline-offset-4"
              >
                Login as Admin
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {signInError && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 w-full bg-[#d90429] text-white font-bold text-lg p-4 text-center rounded-b-[10px] z-[1000]"
          >
            {signInError}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SIGNIN;