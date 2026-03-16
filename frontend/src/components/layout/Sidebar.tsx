"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavLinks } from "@/constants";
import { cn } from "@/lib/utils";

type NavIconName = "dashboard" | "sensors" | "thresholds" | "alerts" | "reports" | "users";

const iconByPath: Record<string, NavIconName> = {
  "/admin/dashboard": "dashboard",
  "/admin/sensors": "sensors",
  "/admin/thresholds": "thresholds",
  "/admin/alerts": "alerts",
  "/admin/reports": "reports",
  "/admin/users": "users",
};

function NavIcon({ name, className }: { name: NavIconName; className?: string }) {
  switch (name) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-8 9 8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10.5V20h14v-9.5" />
        </svg>
      );
    case "sensors":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="2.2" />
          <path strokeLinecap="round" d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20M6.7 6.7l1.5 1.5M15.8 15.8l1.5 1.5M17.3 6.7l-1.5 1.5M8.2 15.8l-1.5 1.5" />
        </svg>
      );
    case "thresholds":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true">
          <path strokeLinecap="round" d="M5 6h14M5 12h14M5 18h14" />
          <circle cx="9" cy="6" r="1.7" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r="1.7" fill="currentColor" stroke="none" />
          <circle cx="11" cy="18" r="1.7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "alerts":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4a5 5 0 00-5 5v2.7c0 .8-.3 1.6-.8 2.2L5 15.5h14l-1.2-1.6a3.6 3.6 0 01-.8-2.2V9a5 5 0 00-5-5z" />
          <path strokeLinecap="round" d="M10 18a2 2 0 004 0" />
        </svg>
      );
    case "reports":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true">
          <path strokeLinecap="round" d="M4 20h16" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17V9m5 8V6m5 11v-5" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true">
          <circle cx="9" cy="9" r="3" />
          <path strokeLinecap="round" d="M3.8 18.5a5.2 5.2 0 0110.4 0" />
          <circle cx="17" cy="10" r="2.2" />
          <path strokeLinecap="round" d="M14.8 18.5a4 4 0 014 0" />
        </svg>
      );
    default:
      return null;
  }
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function FlowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8c2.4-2.2 5.2-2.2 7.6 0s5.2 2.2 7.6 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 13c2.4-2.2 5.2-2.2 7.6 0s5.2 2.2 7.6 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 18c2.4-2.2 5.2-2.2 7.6 0s5.2 2.2 7.6 0" />
    </svg>
  );
}

function CollapseIcon({ collapsed, className }: { collapsed: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className={className} aria-hidden="true">
      {collapsed ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7l5 5-5 5" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7l-5 5 5 5" />
      )}
    </svg>
  );
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen shrink-0 overflow-hidden bg-linear-to-b from-blue-700 via-blue-700 to-indigo-800 text-blue-50 shadow-xl shadow-blue-950/25 transition-all duration-300",
        collapsed ? "w-24" : "w-71 xl:w-74",
      )}
    >
      <div className="relative flex h-full flex-col px-3 py-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_5%,rgba(255,255,255,0.16),transparent_40%),radial-gradient(circle_at_90%_100%,rgba(125,211,252,0.18),transparent_36%)]" />

        <div className="relative z-10 mb-4 border-b border-white/15 pb-4">
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-3 shadow-sm shadow-blue-950/20 backdrop-blur-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/18">
                <FlowIcon className="h-5 w-5 text-cyan-200" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[0.72rem] font-medium uppercase tracking-[0.14em] text-blue-100/85">Early Warning</p>
                <h2 className="truncate text-[1.35rem] font-semibold leading-tight">Flood Guard</h2>
                <p className="truncate text-xs text-blue-100/90">Dashboard Admin</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2.5">
              <div className="rounded-xl border border-white/25 bg-white/10 px-2.5 py-2 text-sm font-semibold leading-none">EWS</div>
              <FlowIcon className="h-4 w-4 text-cyan-200" />
            </div>
          )}
        </div>

        <div className="relative z-10 mb-3 px-2">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-blue-100/80">Menu Admin</span>
              <span className="h-px flex-1 bg-linear-to-r from-white/30 to-transparent" />
            </div>
          ) : (
            <span className="mx-auto block h-7 w-px bg-white/35" />
          )}
        </div>

        <ul className={cn("relative z-10", collapsed ? "space-y-2.5" : "space-y-1.5")}>
          {adminNavLinks.map((item) => (
            <li key={item.href}>
              {(() => {
                const iconName = iconByPath[item.href] ?? "dashboard";
                const isActive = pathname === item.href;

                return (
                  <Link
                    href={item.href}
                    title={item.label}
                    aria-label={item.label}
                    className={cn(
                      "group relative flex items-center gap-3 overflow-hidden rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium tracking-normal transition-all",
                      "hover:border-white/20 hover:bg-white/16",
                      collapsed && "mx-auto h-11 w-11 justify-center rounded-2xl px-0 py-0",
                      isActive && "border-white/25 bg-white/20 shadow-inner shadow-white/10",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute inset-y-2 left-1.5 w-1 rounded-full bg-transparent transition-colors",
                        isActive && "bg-cyan-200/95",
                        collapsed && "hidden",
                      )}
                    />
                    <NavIcon
                      name={iconName}
                      className={cn(
                        "h-[1.05rem] w-[1.05rem] shrink-0 transition-transform duration-200 group-hover:scale-110",
                        collapsed && "h-[1.22rem] w-[1.22rem]",
                        isActive ? "text-white" : "text-blue-100",
                      )}
                    />
                    {!collapsed && <span className="text-[1rem] text-blue-50/95">{item.label}</span>}
                    {!collapsed && (
                      <span
                        className={cn(
                          "ml-auto h-1.5 w-1.5 rounded-full bg-white/30 transition-colors",
                          isActive && "bg-cyan-200",
                        )}
                      />
                    )}
                  </Link>
                );
              })()}
            </li>
          ))}
        </ul>

        <div className="relative z-10 mt-auto px-2 pb-1 pt-4.5">
          {!collapsed ? (
            <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-blue-50/95">
                <FlowIcon className="h-3.5 w-3.5 text-cyan-200" />
                <p className="text-xs font-medium tracking-wide">Monitoring banjir real-time</p>
              </div>
              <p className="mt-1.5 text-[11px] text-blue-100/80">Status sistem dipantau 24/7 untuk respons cepat.</p>
            </div>
          ) : (
            <div className="mx-auto mt-1 flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={onToggle}
                className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white shadow-sm shadow-blue-950/25 transition-all hover:-translate-y-0.5 hover:bg-white/20"
                aria-label="Buka sidebar"
                title="Buka sidebar"
              >
                <CollapseIcon collapsed className="h-4 w-4" />
              </button>
              <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                <FlowIcon className="h-4 w-4 text-cyan-200" />
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="relative z-10 mt-3 px-2">
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-50 transition-all hover:bg-white/18"
            >
              <CollapseIcon collapsed={false} className="h-3.5 w-3.5" />
              <span>Ciutkan Sidebar</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
