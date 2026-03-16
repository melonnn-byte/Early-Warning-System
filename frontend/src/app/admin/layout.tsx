"use client";

import { useState } from "react";
import type { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { loading, isAuthenticated, logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (pathname === "/admin/login") {
    return <main className="mx-auto w-full max-w-lg px-6 py-10">{children}</main>;
  }

  if (loading) {
    return <main className="mx-auto w-full max-w-2xl px-6 py-10 text-sm text-slate-600">Memuat sesi admin...</main>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <main className="mx-auto w-full max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Akses Admin Diperlukan</h1>
        <p className="mt-2 text-sm text-slate-600">
          {isAuthenticated
            ? "Akun ini bukan admin. Gunakan akun admin atau lanjut ke dashboard user."
            : "Silakan login untuk mengakses dashboard admin."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/admin/login"
            className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Ke Halaman Login Admin
          </Link>
          {isAuthenticated && (
            <Link
              href="/user/dashboard"
              className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Ke Dashboard User
            </Link>
          )}
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-5 py-3.5 backdrop-blur lg:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Admin Session</p>
              <h2 className="text-base font-semibold text-slate-800">{user?.name}</h2>
            </div>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-6">{children}</main>
      </section>
    </div>
  );
}
