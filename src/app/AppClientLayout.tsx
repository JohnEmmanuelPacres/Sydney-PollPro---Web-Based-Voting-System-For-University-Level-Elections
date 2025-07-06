"use client";
import { Suspense } from "react";
import ClientLayout from "@/app/components/LoadingScreenComponents/ClientLayout";
import { usePathname, useSearchParams } from "next/navigation";

export default function AppClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <PathnameAwareLayout>{children}</PathnameAwareLayout>
    </Suspense>
  );
}

function PathnameAwareLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // These paths don't need searchParams checks
  const isLandingPage = pathname === "/";
  const isCreateAccountPage = pathname === "/User_RegxLogin/CreateAccount";
  const isSetPasswordVoterPage = pathname === "/User_RegxLogin/SetPasswordVoter";
  const isAboutPage = pathname === "/About";
  const isVoterLoginPage = pathname === "/User_RegxLogin";
  const isAdminLoginPage = pathname === "/User_RegxLogin/LoginAdmin";

  // For these paths, we'll use a separate component that handles searchParams
  const needsSearchParamCheck = pathname === "/Election_Results" || pathname === "/Update_Section";
  
  if (needsSearchParamCheck) {
    return (
      <Suspense fallback={null}>
        <SearchParamAwareLayout pathname={pathname}>
          {children}
        </SearchParamAwareLayout>
      </Suspense>
    );
  }

  // Don't apply ClientLayout to specific pages
  const shouldSkipClientLayout = isLandingPage || isCreateAccountPage || 
    isSetPasswordVoterPage || isAboutPage || isVoterLoginPage || isAdminLoginPage;

  return shouldSkipClientLayout ? <>{children}</> : <ClientLayout>{children}</ClientLayout>;
}

function SearchParamAwareLayout({ children, pathname }: { children: React.ReactNode, pathname: string }) {
  const searchParams = useSearchParams();
  
  const isPublicElectionResults = pathname === "/Election_Results" && searchParams.toString() === "";
  const isPublicUpdateSection = pathname === "/Update_Section" && searchParams.toString() === "";

  return (isPublicElectionResults || isPublicUpdateSection) ? 
    <>{children}</> : 
    <ClientLayout>{children}</ClientLayout>;
}