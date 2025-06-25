'use client';
import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next';
import AuthPageHeader from '../../components/AuthPageHeader';
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
          setSignInError(data.error || 'Invalid PIN');
          setIsLoading(false);
          return;
        }

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
          setSignInError('Invalid email or password. Please try again.');
          setIsLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .single();

        if (profileError || profile?.user_type !== 'admin') {
          setSignInError('Access denied. This account is not an admin.');
          setIsLoading(false);
          return;
        }

        router.push('/dashboard/Admin');
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
    <div className="w-full h-[1024px] relative bg-red-950 overflow-hidden text-left text-xl text-white font-['Actor']">
      <AuthPageHeader />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[790px] h-[727px] backdrop-blur-[25px] rounded-[40px] bg-white/10 border-3 border-white/79">
        <div className="absolute top-[calc(50%-274px)] left-[calc(50%-251.5px)] font-semibold text-[38px] font-['Baloo_Da_2']">Login</div>
        <div className="absolute top-[calc(50%+188px)] left-[calc(50%-87.5px)] text-lg">Don't have an account yet?</div>
        <div className="absolute top-[calc(50%-172px)] left-[calc(50%-251.5px)] w-[500px] h-[225px] text-sm">
          <div className="text-xl mb-4">Institutional Email</div>
          <input
            type="email"
            className="w-[500px] h-[50px] rounded-[10px] bg-white border border-[#bcbec0] px-6 text-base text-black"
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
          <div className="text-xl mt-4">PIN or Password</div>
          <input
            type={showCredential ? "text" : "password"}
            className="w-[500px] h-[50px] rounded-[10px] bg-white border border-[#bcbec0] px-6 text-base text-black mt-2"
            placeholder="Enter 6-digit PIN or your password"
            value={credential}
            onChange={e => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setCredential(value.slice(0, 6));
              } else {
                setCredential(value);
              }
            }}
            maxLength={credential.match(/^\d*$/) ? 6 : undefined}
          />
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="showCredential"
              checked={showCredential}
              onChange={() => setShowCredential(!showCredential)}
              className="mr-2"
            />
            <label htmlFor="showCredential" className="text-black text-sm">
              Show {/^[\d]{6}$/.test(credential) ? 'PIN' : 'Password'}
            </label>
          </div>
        </div>
        <button onClick={handleSignIn} disabled={isLoading} className="absolute top-[calc(50%+120px)] left-[calc(50%-251.5px)] w-[500px] h-[50px] flex items-center justify-center text-white text-xl font-bold cursor-pointer border-2 border-black rounded-lg transition-colors duration-200 hover:text-[#fac36b] hover:border-[#fac36b] bg-black disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? 'VERIFYING...' : 'SIGN IN'}
        </button>
        <button onClick={handleAdminSignUp} className="absolute top-[calc(50%+220px)] left-[calc(50%-251.5px)] w-[500px] h-[50px] flex items-center justify-center text-white text-xl font-bold cursor-pointer border-2 border-black rounded-lg transition-colors duration-200 hover:text-[#fac36b] hover:border-[#fac36b] bg-black">
          CREATE ADMIN ACCOUNT
        </button>
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
