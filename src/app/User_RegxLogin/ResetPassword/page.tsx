"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '@/utils/supabaseClient';
import { motion } from "framer-motion";

const ResetPassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    // Password validation
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    if (!hasLowerCase || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      setError("Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    // Update password using Supabase
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }
    setSuccess("Password updated successfully! Redirecting to login...");
    setTimeout(() => router.push("/User_RegxLogin"), 2000);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-900 to-red-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[400px] bg-white/10 p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Set New Password</h2>
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label className="block mb-2">New Password</label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              className="w-full h-[50px] rounded-[10px] bg-white border border-[#bcbec0] px-6 text-base text-black"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Enter new password"
            />
            <p className="text-[#fac36b] text-xs italic mt-2">Password must contain uppercase, lowercase, number, and special character.</p>
          </div>
          <div>
            <label className="block mb-2">Confirm Password</label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              className="w-full h-[50px] rounded-[10px] bg-white border border-[#bcbec0] px-6 text-base text-black"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Confirm new password"
            />
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={isPasswordVisible}
              onChange={() => setIsPasswordVisible(!isPasswordVisible)}
              className="mr-2"
            />
            <label htmlFor="showPassword" className="text-sm">Show Password</label>
          </div>
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-[50px] text-white text-lg font-bold cursor-pointer border-2 border-black rounded-lg hover:text-[#fac36b] hover:border-[#fac36b] bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Set Password"}
          </motion.button>
          {error && <div className="w-full bg-red-700 text-white text-center py-2 rounded-lg font-bold">{error}</div>}
          {success && <div className="w-full bg-green-700 text-white text-center py-2 rounded-lg font-bold">{success}</div>}
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword; 