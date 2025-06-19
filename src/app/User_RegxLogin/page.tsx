'use client';
import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next';
import AuthPageHeader from '../components/AuthPageHeader';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

const SIGNIN: NextPage = () => {
  const [email, setEmail] = useState("");
  const [credential, setCredential] = useState("");
  const [showCredential, setShowCredential] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [signInError, setSignInError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setSignInError("");
    setIsLoading(true);
    
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

        if (!response.ok) {
          setSignInError(data.error || 'Invalid PIN');
          setIsLoading(false);
          return;
        }

        // Redirect to password setup page
        router.push(`/User_RegxLogin/SetPasswordVoter?email=${encodeURIComponent(email)}${data.courseYear ? `&courseYear=${encodeURIComponent(data.courseYear)}` : ''}`);
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
          if (error.message.includes('Invalid login credentials')) {
            setSignInError('Invalid email or password. Please try again.');
          } else if (error.message.includes('Email not confirmed')) {
            setSignInError('Please verify your email address before signing in.');
          } else {
            setSignInError(error.message);
          }
          setIsLoading(false);
          return;
        }

        if (data.user) {
          // Store the session in localStorage
          localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
          router.push(`/dashboard?email=${encodeURIComponent(email)}`);
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

  // Add useEffect to check session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    
    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#c31d1d] to-[#b38308] overflow-hidden text-left text-xl text-white font-['Actor'] pt-24 md:pt-32">
      <AuthPageHeader />
      <div className="flex-1 flex flex-col items-center justify-center gap-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-[790px] h-[727px] backdrop-blur-[25px] rounded-[40px] bg-white/10 border-3 border-white/79 mt-8"
        >
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute top-[calc(50%-274px)] left-[calc(50%-251.5px)] font-semibold text-[38px] font-['Baloo_Da_2']"
          >
            Login
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute top-[calc(50%+188px)] left-[calc(50%-87.5px)] text-lg"
          >
            Don't have an account yet?
          </motion.div>

          {/* Form Container */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute top-[calc(50%-172px)] left-[calc(50%-251.5px)] w-[500px] h-[225px] text-sm"
          >
            <div className="text-xl mb-4">Institutional Email</div>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              type="email"
              className="w-[500px] h-[50px] rounded-[10px] bg-white border border-[#bcbec0] px-6 text-base text-black transform-gpu"
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
            
            <div className="text-xl mt-4">PIN or Password</div>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              type={showCredential ? "text" : "password"}
              className="w-[500px] h-[50px] rounded-[10px] bg-white border border-[#bcbec0] px-6 text-base text-black mt-2 transform-gpu"
              placeholder="Enter 6-digit PIN or your password"
              value={credential}
              onChange={e => {
                setCredential(e.target.value);
              }}
            />
            
            {/* Show Credential Checkbox */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center mt-4"
            >
              <input
                type="checkbox"
                id="showCredential"
                checked={showCredential}
                onChange={() => setShowCredential(!showCredential)}
                className="mr-2"
              />
              <label htmlFor="showCredential" className="text-black text-sm">
                Show {/^\d{6}$/.test(credential) ? 'PIN' : 'Password'}
              </label>
            </motion.div>
          </motion.div>

          {/* Sign in */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignIn}
            disabled={isLoading}
            className="absolute top-[calc(50%+120px)] left-[calc(50%-251.5px)] w-[500px] h-[50px] flex items-center justify-center text-white text-xl font-bold cursor-pointer border-2 border-black rounded-lg transition-colors duration-200 hover:text-[#fac36b] hover:border-[#fac36b] bg-black disabled:opacity-50 disabled:cursor-not-allowed transform-gpu"
          >
            {isLoading ? 'VERIFYING...' : 'SIGN IN'}
          </motion.button>

          {/* Sign up */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignUp}
            className="absolute top-[calc(50%+220px)] left-[calc(50%-251.5px)] w-[500px] h-[50px] flex items-center justify-center text-white text-xl font-bold cursor-pointer border-2 border-black rounded-lg transition-colors duration-200 hover:text-[#fac36b] hover:border-[#fac36b] bg-black transform-gpu"
          >
            SIGN UP
          </motion.button>

          <motion.button
          onClick={handleAdminLogin}
          className="absolute top-[calc(50%+280px)] left-[calc(50%-251.5px)] w-[500px] h-[50px] flex items-center justify-center text-white text-xl cursor-pointer rounded-lg transition-colors duration-200 hover:text-[#fac36b] underline underline-offset-4"
        >
          Login as Admin
        </motion.button>

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
