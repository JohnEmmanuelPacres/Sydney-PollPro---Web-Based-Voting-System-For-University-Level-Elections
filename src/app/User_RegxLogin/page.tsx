'use client';
import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next';
import Image from "next/image";
import styles from './UserAuth.module.css';
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
    <div className={styles.signIn}>
      <div className={styles.signInChild} />
      <div className={styles.loginParent}>
        <div className={styles.login}>Login</div>
        <div className={styles.dontHaveAn}>Don't have an account yet?</div>
        <div className={styles.groupChild} />
        <div className={styles.groupItem} />
        <div className={styles.rectangleParent}>
          <div className={styles.institutionalEmail}>Institutional Email</div>
          <div style={{ height: '12px' }} />
          <input
            type="email"
            className={styles.rectangleDiv}
            style={{
              position: 'absolute',
              top: '26.5px',
              left: '0',
              width: '500px',
              height: '50px',
              borderRadius: '10px',
              backgroundColor: '#fff',
              border: '1px solid #bcbec0',
              boxSizing: 'border-box',
              fontSize: '16px',
              paddingLeft: '24px',
              color: '#000',
            }}
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
            <div style={{ position: 'absolute', top: '80px', left: '0', color: '#d90429', fontSize: '16px', fontWeight: 'bold', textShadow: '0 1px 2px #fff' }}>{emailError}</div>
          )}
          <div className={styles.password}>Password</div>
          <input
            type={showPassword ? "text" : "password"}
            className={styles.rectangleDiv}
            style={{
              position: 'absolute',
              top: '102.5px',
              left: '0',
              width: '500px',
              height: '50px',
              borderRadius: '10px',
              backgroundColor: '#fff',
              border: '1px solid #bcbec0',
              boxSizing: 'border-box',
              fontSize: '16px',
              paddingLeft: '24px',
              color: '#000',
            }}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {/* Show Password Checkbox */}
          <div style={{ position: 'absolute', top: '162px', left: '0', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              style={{ marginRight: '8px' }}
            />
            <label htmlFor="showPassword" style={{ color: '#000', fontSize: '14px' }}>Show Password</label>
          </div>
          <div className={styles.forgotPassword}>Forgot Password?</div>
        </div>
      </div>
      <button className={styles.signIn1} onClick={handleSignIn}>
        SIGN IN
      </button>
      {signInError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          background: '#d90429',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '18px',
          padding: '16px',
          textAlign: 'center',
          borderRadius: '0 0 10px 10px',
          zIndex: 1000,
        }}>
          {signInError}
          {signInError.includes('check your email') && (
            <button 
              onClick={handleResendConfirmation}
              style={{
                marginLeft: '10px',
                padding: '5px 10px',
                background: '#fff',
                color: '#d90429',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Resend Confirmation
            </button>
          )}
        </div>
      )}
      <button className={styles.signUp} onClick={handleSignUp}>SIGN UP</button>
      <div className={styles.header}>
        <div className={styles.options}>
          <div className={styles.about}>
            <div className={styles.home1}>About</div>
          </div>
        </div>
        <div className={styles.univote}>UniVote</div>
        <Image className={styles.websiteLogoIcon} width={146} height={120} sizes="100vw" alt="" src="/Website Logo.png" />
      </div>
    </div>
  );
};

export default SIGNIN;
                        