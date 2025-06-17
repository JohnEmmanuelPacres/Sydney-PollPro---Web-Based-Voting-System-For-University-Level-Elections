'use client';
import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next';
import Image from "next/image";
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/navigation';

const SIGNIN: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [signInError, setSignInError] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    setSignInError("");
    if (!email.endsWith('@cit.edu')) {
      setSignInError('Please use your CIT email address (@cit.edu)');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setSignInError('Please check your email (@cit.edu) for a confirmation link. Click the link to verify your account before logging in.');
        } else if (error.message.includes('Invalid login credentials')) {
          setSignInError('Invalid email or password. Please try again.');
        } else {
          setSignInError(error.message);
        }
      } else if (data.user) {
        router.push(`/dashboard?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      setSignInError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) {
        setSignInError('Failed to resend confirmation email. Please try again.');
      } else {
        setSignInError('Confirmation email has been resent. Please check your inbox.');
      }
    } catch (err) {
      setSignInError('Failed to resend confirmation email. Please try again.');
    }
  };

  const handleSignUp = () => {
    router.push('/User_RegxLogin/CreateAccount');
  };

  useEffect(() => {
    if (signInError) {
      const timer = setTimeout(() => setSignInError("") , 5000);
      return () => clearTimeout(timer);
    }
  }, [signInError]);

  return (
    <div className="w-full h-[1024px] relative bg-gradient-to-b from-[#c31d1d] to-[#b38308] overflow-hidden text-left text-xl text-white font-['Actor']">
      {/* Sign In Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[790px] h-[727px] backdrop-blur-[25px] rounded-[40px] bg-white/10 border-3 border-white/79">
        <div className="absolute top-[calc(50%-274px)] left-[calc(50%-251.5px)] font-semibold text-[38px] font-['Baloo_Da_2']">
          Login
        </div>
        <div className="absolute top-[calc(50%+188px)] left-[calc(50%-87.5px)] text-lg">
          Don't have an account yet?
        </div>

        {/* Form Container */}
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
          {emailError && (
            <div className="mt-1 text-[#d90429] text-base font-bold">
              {emailError}
            </div>
          )}
          
          <div className="text-xl mt-4">Password</div>
          <input
            type={showPassword ? "text" : "password"}
            className="w-[500px] h-[50px] rounded-[10px] bg-white border border-[#bcbec0] px-6 text-base text-black mt-2"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          
          {/* Show Password Checkbox */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            <label htmlFor="showPassword" className="text-black text-sm">
              Show Password
            </label>
          </div>
          
          <div className="mt-4 text-black">Forgot Password?</div>
        </div>

      {/* Sign in */}
        <button 
          onClick={handleSignIn}
          className="absolute top-[calc(50%+120px)] left-[calc(50%-92px)] w-[184px] h-[50px] flex items-center justify-center text-white text-xl font-bold cursor-pointer border-2 border-black rounded-lg transition-colors duration-200 hover:text-[#fac36b] hover:border-[#fac36b] bg-black"
        >
          SIGN IN
        </button>

      {/* Sign up */}
        <button 
          onClick={handleSignUp}
          className="absolute top-[calc(50%+220px)] left-[calc(50%-92px)] w-[184px] h-[50px] flex items-center justify-center text-white text-xl font-bold cursor-pointer border-2 border-black rounded-lg transition-colors duration-200 hover:text-[#fac36b] hover:border-[#fac36b] bg-black"
        >
          SIGN UP
        </button>
      </div>

      {/* Header */}
      <div className="absolute w-[calc(100%+61px)] -top-[11px] -right-[61px] left-0 shadow-[0px_5px_4px_rgba(0,0,0,0.5)] bg-[#7c0101] h-[127px] overflow-hidden font-['Inter']">
        <div className="absolute top-[47px] right-[359px] flex flex-row items-center justify-start py-[11px] px-[21px] gap-[44px]">
          <div className="w-[58px] relative h-[30px] text-[#fff2f2] ml-[210px]">
            <div className="absolute left-0 top-0 leading-[150%] font-medium">About</div>
          </div>
        </div>
        <div className="absolute top-[35px] left-[213px] text-[45px] leading-[150%] font-['Abyssinica_SIL']">
          UniVote
        </div>
        <Image 
          className="absolute top-[7px] left-[38px] w-[146px] h-[120px] object-cover"
          width={146}
          height={120}
          alt="Website Logo"
          src="/Website Logo.png"
        />
      </div>

      {/* Error Message */}
      {signInError && (
        <div className="fixed top-0 left-0 w-full bg-[#d90429] text-white font-bold text-lg p-4 text-center rounded-b-[10px] z-[1000]">
          {signInError}
          {signInError.includes('check your email') && (
            <button 
              onClick={handleResendConfirmation}
              className="ml-2.5 px-2.5 py-1.5 bg-white text-[#d90429] border-none rounded-[5px] cursor-pointer font-bold"
            >
              Resend Confirmation
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SIGNIN;
