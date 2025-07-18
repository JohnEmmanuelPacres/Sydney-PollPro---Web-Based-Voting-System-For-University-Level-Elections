'use client';
import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Header from '../../components/Header';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

const SIGNIN_ADMIN: NextPage = () => {
  const [email, setEmail] = useState("");
  const [credential, setCredential] = useState("");
  const [showCredential, setShowCredential] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [signInError, setSignInError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    const isPIN = /^\d{6}$/.test(credential);

    if (isPIN) {
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

        router.push(`/User_RegxLogin/SetPasswordAdmin?email=${encodeURIComponent(email)}${data.courseYear ? `&courseYear=${encodeURIComponent(data.courseYear)}` : ''}${data.department_org ? `&department_org=${encodeURIComponent(data.department_org)}` : ''}${data.administered_Org ? `&administered_Org=${encodeURIComponent(data.administered_Org)}` : ''}`);

      } catch (err) {
        setSignInError('An unexpected error occurred. Please try again.');
        console.error('Login error:', err);
        setIsLoading(false);
      }
    } else {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: credential,
        });

        if (error || !data.user) {
          // Increment failed attempts
          const newAttempts = attempts + 1;
          if (newAttempts >= MAX_ATTEMPTS) {
            setRateLimitInfo(email, { attempts: newAttempts, lockoutUntil: now + LOCKOUT_MINUTES * 60 * 1000 });
            setSignInError(`Too many failed attempts. Please try again after ${new Date(now + LOCKOUT_MINUTES * 60 * 1000).toLocaleTimeString()}.`);
          } else {
            setRateLimitInfo(email, { attempts: newAttempts, lockoutUntil: 0 });
            setSignInError('Invalid email or password. Please try again.');
          }
          setIsLoading(false);
          return;
        }
        // On success, reset attempts
        setRateLimitInfo(email, { attempts: 0, lockoutUntil: 0 });

        const { data: adminProfile, error: adminError } = await supabase
          .from('admin_profiles')
          .select('administered_org')
          .eq('id', data.user.id)
          .single();

        if (adminError || !adminProfile) {
          setSignInError('Access denied. This account is not an admin.');
          setIsLoading(false);
          return;
        }

        router.push(`/dashboard/Admin?administered_Org=${encodeURIComponent(adminProfile.administered_org)}`);
        console.log('administered_org:', adminProfile.administered_org);

      } catch (err) {
        setSignInError('An unexpected error occurred. Please try again.');
        console.error('Login error:', err);
        setIsLoading(false);
      }
    }
  };

  const handleAdminSignUp = () => {
    router.push('/User_RegxLogin/CreateAdminAccount');
  };

  useEffect(() => {
    if (signInError) {
      const timer = setTimeout(() => setSignInError("") , 5000);
      return () => clearTimeout(timer);
    }
  }, [signInError]);

  return (
    <div className="min-h-screen flex flex-col bg-red-950 overflow-hidden text-white font-['Actor'] pt-24 md:pt-32">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[790px] h-auto min-h-[600px] md:min-h-[727px] backdrop-blur-[25px] rounded-[40px] bg-white/10 border-3 border-white/79 p-6 md:p-8">
          <div className="text-center md:text-left text-3xl md:text-[38px] font-semibold font-['Baloo_Da_2'] mb-8">
            Log In as Admin
          </div>
          
          <div className="w-full max-w-[500px] mx-auto">
            <form onSubmit={handleSignIn}>
              <div className="text-xl mb-4">Institutional Email</div>
              <input
                type="email"
                className="w-full h-[50px] rounded-[10px] bg-white border border-[#bcbec0] px-6 text-base text-black"
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

              {emailError && <div className="mt-1 text-[#d90429] text-base font-bold">{emailError}</div>}
              
              <div className="text-xl mt-6">PIN or Password</div>
              <input
                type={showCredential ? "text" : "password"}
                className="w-full h-[50px] rounded-[10px] bg-white border border-[#bcbec0] px-6 text-base text-black mt-2"
                placeholder="Enter 6-digit PIN or your password"
                value={credential}
                onChange={e => {
                  setCredential(e.target.value);
                }}
              />
              
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
                <a href="/User_RegxLogin/ForgotPassword?admin=1" className="text-sm text-blue-300 hover:underline">Forgot Password?</a>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full h-[50px] mt-8 flex items-center justify-center text-white text-xl font-bold cursor-pointer border-2 border-black rounded-lg transition-colors duration-200 hover:text-[#fac36b] hover:border-[#fac36b] bg-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'VERIFYING...' : 'SIGN IN'}
              </button>
            </form>

            <div className="text-center mt-6 text-lg">
              Don't have an account yet?
            </div>

            <button 
              onClick={handleAdminSignUp} 
              className="w-full h-[50px] mt-4 flex items-center justify-center text-white text-xl font-bold cursor-pointer border-2 border-black rounded-lg transition-colors duration-200 hover:text-[#fac36b] hover:border-[#fac36b] bg-black"
            >
              CREATE ADMIN ACCOUNT
            </button>
          </div>
        </div>
      </div>

      {signInError && (
        <div className="fixed top-0 left-0 w-full bg-[#d90429] text-white font-bold text-lg p-4 text-center rounded-b-[10px] z-[1000]">
          {signInError}
        </div>
      )}
    </div>
  );
};

export default SIGNIN_ADMIN;