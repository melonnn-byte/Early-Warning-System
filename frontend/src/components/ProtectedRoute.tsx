"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "operator" | "user";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Jika masih loading, tunggu
    if (loading) {
      return;
    }

    // Jika tidak authenticated, redirect ke login
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    // Jika ada role requirement, check role
    if (requiredRole) {
      const userRole = user.role?.toLowerCase() || "user";
      const hasRequiredRole = 
        (requiredRole === "admin" && userRole === "admin") ||
        (requiredRole === "operator" && userRole === "operator") ||
        (requiredRole === "user" && (userRole === "operator" || userRole === "field_officer"));

      if (!hasRequiredRole) {
        // Redirect ke dashboard yang sesuai dengan role mereka
        router.push(userRole === "admin" ? "/admin/dashboard" : "/user/dashboard");
      }
    }
  }, [loading, isAuthenticated, user, requiredRole, router]);

  // Show loading atau nothing while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex size-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-sm text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Jika tidak authenticated, return null (akan di-redirect oleh useEffect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Jika ada role requirement dan tidak sesuai, return null (akan di-redirect)
  if (requiredRole) {
    const userRole = user.role?.toLowerCase() || "user";
    const hasRequiredRole = 
      (requiredRole === "admin" && userRole === "admin") ||
      (requiredRole === "operator" && userRole === "operator") ||
      (requiredRole === "user" && (userRole === "operator" || userRole === "field_officer"));

    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}
