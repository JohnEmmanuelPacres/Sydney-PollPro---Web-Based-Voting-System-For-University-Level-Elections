"use client";
import ClientLayout from "@/app/components/LoadingScreenComponents/ClientLayout";
import { usePathname, useSearchParams } from "next/navigation";

export default function AppClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const isLandingPage = pathname === "/";
  const isCreateAccountPage = pathname === "/User_RegxLogin/CreateAccount";
  const isSetPasswordVoterPage = pathname === "/User_RegxLogin/SetPasswordVoter";
  const isAboutPage = pathname === "/About";
  
  // Check if it's the public Election_Results page (exact path without any query parameters)
  const isPublicElectionResults = pathname === "/Election_Results" && searchParams.toString() === "";
  
  // Check if it's the public Update_Section page (exact path without any query parameters)
  const isPublicUpdateSection = pathname === "/Update_Section" && searchParams.toString() === "";
  
  // Don't apply ClientLayout (and AFK timeout) to:
  // - Landing page
  // - CreateAccount page  
  // - SetPasswordVoter page
  // - About page
  // - Public Election_Results page (only when no query parameters)
  // - Public Update_Section page (only when no query parameters)
  return (isLandingPage || isCreateAccountPage || isSetPasswordVoterPage || isAboutPage || isPublicElectionResults || isPublicUpdateSection) ? <>{children}</> : <ClientLayout>{children}</ClientLayout>;
} 