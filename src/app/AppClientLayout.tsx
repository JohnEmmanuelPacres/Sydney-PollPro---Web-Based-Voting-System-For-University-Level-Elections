"use client";
import ClientLayout from "@/app/components/LoadingScreenComponents/ClientLayout";
import { usePathname } from "next/navigation";

export default function AppClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  return isLandingPage ? <>{children}</> : <ClientLayout>{children}</ClientLayout>;
} 