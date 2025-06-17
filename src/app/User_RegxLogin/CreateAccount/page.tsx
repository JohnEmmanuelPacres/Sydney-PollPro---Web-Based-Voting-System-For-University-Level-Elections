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
    <div className="w-full h-[1024px] relative bg-gradient-to-b from-[#bb8b1b] to-[#b01818] overflow-hidden text-center text-2xl text-white font-['Merriweather']">
      {error && (
        <div className="text-red-500 mb-2.5">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-500 mb-2.5 p-2.5 bg-[#e6ffe6] rounded-[5px] text-center">
          {success}
        </div>
      )}

      {/* Logo Section */}
      <div className="absolute top-[309.47px] left-[256px] w-[198px] h-[63px] text-left text-[50px]">
        <div className="absolute top-0 left-0 font-black">JOIN US</div>
      </div>

      {/* About Us Section */}
      <div className="absolute top-[512.47px] left-[142px] w-[426px] h-[161px] text-[26px]">
        <div className="absolute top-[89px] left-[114px] rounded-[40px] bg-[#222121] w-[200px] h-[72px]" />
        <div className="absolute top-[111px] left-[155px] font-bold">About Us</div>
        <div className="absolute top-0 left-0 text-xl inline-block w-[426px] h-[65px] font-bold">
          For more information, click the button below!
        </div>
      </div>

      {/* Form Image */}
      <Image
        className="w-full relative top-[145px] left-[260px] max-w-full overflow-hidden h-[734.9px] object-contain"
        width={740.4}
        height={734.9}
        alt="Form"
        src="/form.png"
      />

      {/* Register Title */}
      <div className="absolute top-[199.47px] left-[827px] text-[40px] inline-block text-[#f3e2e2] w-[343px] h-[82px]">
        Register
      </div>

      {/* Form */}
      <form className="absolute top-[292.47px] left-[759px] w-[450px] h-[292px] text-[#c6c3c3]" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="University Email"
          className="absolute top-0 left-0 w-[500px] h-[50px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] bg-white border border-[#bcbec0] box-border text-base pl-6 text-black"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="courseYear"
          placeholder="Course & Year"
          className="absolute top-[118px] left-0 w-[500px] h-[50px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] bg-white border border-[#bcbec0] box-border text-base pl-6 text-black"
          value={formData.courseYear}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="absolute top-[236px] left-0 w-[500px] h-[50px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] bg-white border border-[#bcbec0] box-border text-base pl-6 text-black"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className="absolute top-[calc(100%+5px)] left-6 text-[#666] text-xs italic">
          Password must be at least 6 characters long
        </div>
      </form>

      {/* Login Link */}
      <a 
        href="/User_RegxLogin" 
        className="absolute top-[603.47px] left-[779px] text-xl inline-block w-[223px] h-8 no-underline text-white font-bold cursor-pointer border-none bg-transparent rounded-none transition-colors duration-200 text-left hover:text-[#fac36b]"
      >
        Log in here
      </a>

      {/* Register Button */}
      <button 
        onClick={handleSubmit}
        className="absolute top-[667.47px] left-[758px] flex items-center justify-center w-[184px] h-[23px] text-white text-xl font-bold cursor-pointer border-2 border-black rounded-lg transition-colors duration-200 text-left hover:text-[#fac36b] hover:border-[#fac36b] bg-black"
      >
        Register
      </button>

      {/* Logo */}
      <Image
        className="absolute top-[145.47px] left-[282px] w-[147px] h-[147px] object-cover"
        width={147}
        height={147}
        alt="Website Logo"
        src="/Website Logo.png"
      />
    </div>
  );
};

export default CreateAccount;