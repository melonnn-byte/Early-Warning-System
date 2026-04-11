"use client";

import type { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const noChromeRoutes = new Set(["/login", "/register"]);

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isUserRoute = pathname.startsWith("/user");
  const isNoChromeRoute = noChromeRoutes.has(pathname) || isAdminRoute;

  if (isNoChromeRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      {!isUserRoute && <Footer />}
    </div>
  );
}
