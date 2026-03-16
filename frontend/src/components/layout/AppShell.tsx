"use client";

import type { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const noChromeRoutes = new Set(["/login", "/register", "/admin/login"]);

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isNoChromeRoute = noChromeRoutes.has(pathname) || isAdminRoute;

  if (isNoChromeRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
