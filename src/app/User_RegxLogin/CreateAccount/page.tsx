'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from './CreateAccount.module.css';
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
        // Make the error disappear after 5 seconds
        setTimeout(() => {
          setError(null);
        }, 5000);
        return; // Stop further execution if there's an error
      }

      if (data.user) {
        setSuccess('Registered successfully! You can now log in.');
        // Wait for 5 seconds before redirecting to login page
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
    <div className={styles.registration}>
      {error && (
        <div className={styles.error} style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      {success && (
        <div className={styles.success} style={{ 
          color: 'green', 
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: '#e6ffe6',
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          {success}
        </div>
      )}
      <div className={styles.logo}>
        <div className={styles.joinUs}>JOIN US</div>
      </div>

      <div className={styles.aboutUs}>
        <div className={styles.aboutUsChild} />
        <b className={styles.aboutUs1}>About Us</b>
        <b className={styles.forMoreInformation}>
          For more information, click the button below!
        </b>
      </div>

      <Image
        className={styles.formIcon}
        width={740.4}
        height={734.9}
        sizes="100vw"
        alt=""
        src="/form.png"
      />

      <b className={styles.register}>Register</b>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="University Email"
          className={styles.formItem}
          style={{
              position: 'absolute',
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
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="courseYear"
          placeholder="Course & Year"
          className={styles.formChild}
          style={{
              position: 'absolute',
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
          value={formData.courseYear}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className={styles.formInner}
          style={{
              position: 'absolute',
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
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 5px)',
          left: '24px',
          color: '#666',
          fontSize: '12px',
          fontStyle: 'italic'
        }}>
          Password must be at least 6 characters long
        </div>
      </form>

      <a className={styles.logInHere} href="/User_RegxLogin">Log in here</a>

      <button className={styles.register1} onClick={handleSubmit}>
        <div className={styles.registerChild} />
        <b className={styles.register2}>Register</b>
      </button>

      <Image
        className={styles.logoOfMsad1}
        width={147}
        height={147}
        sizes="100vw"
        alt=""
        src="/Website Logo.png"
      />
    </div>
  );
};

export default CreateAccount;