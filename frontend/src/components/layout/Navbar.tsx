"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { landingNavLinks } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface NavbarItem {
  href: string;
  label: string;
  id?: string;
}

const userNavLinks: NavbarItem[] = [
  { href: "/user/dashboard", label: "Dashboard" },
  { href: "/user/map", label: "Peta Sensor" },
  { href: "/user/emergency", label: "Kontak Darurat" },
  { href: "/user/education", label: "Panduan" },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth();
  const [activeSection, setActiveSection] = useState("home");
  const [isHeroMode, setIsHeroMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const isHomePage = pathname === "/";
  const isUserRoute = pathname.startsWith("/user");
  const isLoggedInUser = isAuthenticated && user?.role === "operator";
  const useUserNavbar = isUserRoute;

  const links = useMemo<NavbarItem[]>(() => (useUserNavbar ? userNavLinks : landingNavLinks), [useUserNavbar]);

  useEffect(() => {
    if (!profileOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!profileRef.current?.contains(target)) {
        setProfileOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  useEffect(() => {
    if (!isHomePage) {
      return;
    }

    const heroSection = document.getElementById("home");
    if (!heroSection) {
      return;
    }

    const updateHeroMode = () => {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      const navbarHeight = 76;
      setIsHeroMode(heroBottom > navbarHeight + 24);
    };

    const frameId = window.requestAnimationFrame(updateHeroMode);
    window.addEventListener("scroll", updateHeroMode, { passive: true });
    window.addEventListener("resize", updateHeroMode);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateHeroMode);
      window.removeEventListener("resize", updateHeroMode);
    };
  }, [isHomePage]);

  useEffect(() => {
    if (!isHomePage) {
      return;
    }

    const navbarOffset = 92;

    const updateActiveSection = () => {
      const currentPosition = window.scrollY + navbarOffset;
      let currentSection = links[0]?.id ?? "home";

      links.forEach((item) => {
        if (!item.id) {
          return;
        }

        const section = document.getElementById(item.id);
        if (!section) {
          return;
        }

        if (section.offsetTop <= currentPosition) {
          currentSection = item.id;
        }
      });

      setActiveSection(currentSection);
    };

    const frameId = window.requestAnimationFrame(updateActiveSection);
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [isHomePage, links]);

  const isRouteActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    router.push("/login");
  };

  const goToProfile = () => {
    setProfileOpen(false);
    router.push("/user/profile");
  };

  return (
    <header
      className={cn(
        "z-40 transition-colors duration-300",
        isHomePage ? "fixed inset-x-0 top-0" : "sticky top-0",
        isHomePage && isHeroMode
          ? "border-b border-transparent bg-white/8 backdrop-blur-sm"
          : "border-b border-blue-100 bg-white/95 shadow-sm backdrop-blur",
      )}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className={cn(
            "text-lg font-bold transition-colors",
            isHomePage && isHeroMode ? "text-white" : "text-blue-700",
          )}
        >
          EWS Flood Guard
        </Link>
        <ul className="flex flex-wrap items-center gap-1 sm:gap-1.5">
          {links.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isHomePage && isHeroMode
                    ? "text-blue-50/95 hover:bg-white/15 hover:text-white"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                  (
                    isHomePage
                      ? activeSection === item.id
                      : isRouteActive(item.href)
                  ) && (isHomePage && isHeroMode ? "bg-white/15 text-white" : "bg-blue-50 text-blue-700"),
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full opacity-0 transition-opacity",
                    isHomePage && isHeroMode ? "bg-white" : "bg-blue-600",
                    (
                      isHomePage
                        ? activeSection === item.id
                        : isRouteActive(item.href)
                    ) && "opacity-100",
                  )}
                />
              </Link>
            </li>
          ))}
          {useUserNavbar && isLoggedInUser && (
            <li>
              <Link
                href="/user/notifications"
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors",
                  isRouteActive("/user/notifications")
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                )}
                aria-label="Buka notifikasi"
                title="Notifikasi"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5" />
                  <path strokeLinecap="round" d="M10 19a2 2 0 004 0" />
                </svg>
              </Link>
            </li>
          )}
          <li>
            {useUserNavbar && isLoggedInUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  aria-label="Buka menu profil"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="3.2" />
                    <path strokeLinecap="round" d="M5.8 19a6.2 6.2 0 0112.4 0" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                    <button
                      type="button"
                      onClick={goToProfile}
                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Edit Profile
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full border-t border-slate-100 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                  isHomePage && isHeroMode
                    ? "border border-white/45 text-white hover:bg-white/15"
                    : "border border-blue-200 text-blue-700 hover:bg-blue-50",
                )}
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
