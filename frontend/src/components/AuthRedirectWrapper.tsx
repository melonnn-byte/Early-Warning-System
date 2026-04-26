"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface AuthRedirectWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component untuk landing page yang akan auto-redirect ke dashboard
 * jika user sudah login berdasarkan role mereka
 */
export function AuthRedirectWrapper({ children }: AuthRedirectWrapperProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Jika masih loading, tunggu
    if (loading) {
      return;
    }

    // Jika user sudah login, redirect ke dashboard sesuai role
    if (user) {
      const userRole = user.role?.toLowerCase() || "user";
      const redirectPath = 
        userRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
      router.push(redirectPath);
    }
  }, [user, loading, router]);

  // Jika user sudah login, jangan tampilkan landing page (sedang redirect)
  if (user) {
    return null;
  }

  // Tampilkan landing page jika belum login atau masih loading
  return <>{children}</>;
}
