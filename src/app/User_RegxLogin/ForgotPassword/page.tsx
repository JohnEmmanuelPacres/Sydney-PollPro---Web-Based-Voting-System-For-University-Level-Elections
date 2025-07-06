"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from '@/utils/supabaseClient';
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const adminOnly = searchParams.get("admin") === "1";
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    if (!email.endsWith("@cit.edu")) {
      setError("Please use your CIT email address (@cit.edu)");
      setIsLoading(false);
      return;
    }
    if (adminOnly) {
      // Check if email exists in admin_profiles
      const { data, error: profileError } = await supabase
        .from('admin_profiles')
        .select('id')
        .eq('email', email)
        .single();
      if (profileError || !data) {
        setError("No admin account found with this email.");
        setIsLoading(false);
        return;
      }
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/User_RegxLogin/ResetPassword`,
    });
    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }
    setSuccess("Password reset email sent! Please check your inbox.");
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
        <h2 className="text-3xl font-bold mb-6 text-center">Forgot Password</h2>
        <form onSubmit={handleSendResetEmail} className="space-y-6">
          <div>
            <label className="block mb-2">Institutional Email</label>
            <input
              type="email"
              className="w-full h-[50px] rounded-[10px] bg-white border border-[#bcbec0] px-6 text-base text-black"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="username@cit.edu"
            />
          </div>
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-[50px] text-white text-lg font-bold cursor-pointer border-2 border-black rounded-lg hover:text-[#fac36b] hover:border-[#fac36b] bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Reset Email"}
          </motion.button>
          {error && <div className="w-full bg-red-700 text-white text-center py-2 rounded-lg font-bold">{error}</div>}
          {success && <div className="w-full bg-green-700 text-white text-center py-2 rounded-lg font-bold">{success}</div>}
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword; 