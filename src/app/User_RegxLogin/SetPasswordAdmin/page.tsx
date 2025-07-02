'use client';
import { useState, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
type FormData = {
  password: string;
  confirmPassword: string;
};
const SetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const courseYear = searchParams.get('courseYear');
  const department_org = searchParams.get('department_org');
  const administered_Org = searchParams.get('administered_Org'); 
  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
    if (!email) {
      router.push('/User_RegxLogin');
    }
  }, [email, router]);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
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
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email!,
        password: formData.password,
        options: {
          data: {
            //orgaadministered_Org || '',  //auth_user_metadata
            user_type: 'admin'
          }
        }
      });
      const user_id = signUpData?.user?.id;
      if (signUpData?.user?.user_metadata.user_type === 'admin' || signUpData?.user?.user_metadata.user_type === 'admin-voter') {
        await supabase.from('admin_profiles').insert({
          id: user_id,
          email: email!,
          course_year: courseYear || '',
          department_org: department_org || '',
          administered_org: administered_Org || '',
          can_vote: true // optional
        });
      }
      if (signUpError) {
        if (signUpError.message.includes('User already registered') || signUpError.message.includes('User already exists')) {
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
            setTimeout(() => router.push('/dashboard/Admin'), 2000);
            return;
          }
        } else {
          setError(signUpError.message);
          setIsLoading(false);
          return;
        }
      }
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
          setTimeout(() => router.push(`/dashboard/Admin?email=${encodeURIComponent(email!)}`), 2000);
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
  }, [formData, email, administered_Org, router]);
  const inputClasses = useMemo(() => (
    "w-full h-[50px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] bg-white border border-[#bcbec0] box-border text-base pl-6 text-black"
  ), []);
  if (!email) return null;
  return (
<div className="h-screen flex bg-gradient-to-b from-[#bb8b1b] to-[#b01818] text-white font-['Actor']">
<div className="w-1/2 flex flex-col items-center justify-center p-8 relative">
<div className="mb-8 flex flex-col items-center">
<Image width={147} height={147} alt="Website Logo" src="/Website Logo.png" className="mb-4" priority />
<h1 className="text-[50px] font-black">SET YOUR PASSWORD</h1>
</div>
<div className="text-center max-w-md">
<p className="text-xl font-bold mb-8">Create a secure password for your account</p>
<div className="text-lg">
<p className="mb-4">Email: {email}</p>
            {administered_Org && <p className="mb-2">Organization: {administered_Org}</p>}
<p className="text-sm opacity-80">PIN verified successfully</p>
</div>
</div>
</div>
<div className="w-1/2 relative flex items-center justify-center">
<div className="absolute inset-0 flex items-center justify-start z-0 pt-18 pr-25">
<Image src="/form.png" alt="Form background" width={700} height={700} className="object-contain object-left" priority />
</div>
<div className="absolute z-10 w-full max-w-screen-md p-10 pr-30 pl-30">
<h2 className="text-[40px] text-[#f3e2e2] mb-12 text-center">Set Password</h2>
<form onSubmit={handleSubmit} className="space-y-6" noValidate>
<div>
<div className="relative">
<input type={showPassword ? "text" : "password"} name="password" placeholder="New Password" className={inputClasses} value={formData.password} onChange={handleChange} required minLength={6} autoComplete="new-password" />
<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showPassword ? "Hide" : "Show"}
</button>
</div>
<p className="text-[#899499] text-xs italic mt-2">Password must be at least 6 characters long</p>
</div>
<div>
<div className="relative">
<input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" className={inputClasses} value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
<button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showConfirmPassword ? "Hide" : "Show"}
</button>
</div>
</div>
<div className="pt-2">
<a href="/User_RegxLogin" className="text-xl text-white font-bold hover:text-[#fac36b] block mb-6 transition-colors">Back to Login</a>
<button type="submit" disabled={isLoading} className="w-[184px] h-[50px] text-white text-xl font-bold cursor-pointer border-2 border-black rounded-lg hover:text-[#fac36b] hover:border-[#fac36b] bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Setting...' : 'Set Password'}
</button>
</div>
</form>
</div>
</div>
      {(error || success) && (
<div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 ${
          error ? 'bg-white text-red-500' : 'bg-[#e6ffe6] text-green-500'
        }`}>
          {error || success}
</div>
      )}
</div>
  );
};
export default SetPassword;