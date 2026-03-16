"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, dummyAccounts } = useAuth();
  const adminAccount = dummyAccounts.find((account) => account.role === "admin");
  const userAccount = dummyAccounts.find((account) => account.role === "operator") ?? dummyAccounts[0];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const result = login(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setError(null);
    router.push(result.user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
  };

  const quickLogin = (mode: "admin" | "operator") => {
    const account = mode === "admin" ? adminAccount : userAccount;
    if (!account) {
      setError(`Akun ${mode} tidak tersedia.`);
      return;
    }

    const result = login(account.email, account.password);
    if (!result.ok) {
      setError(`Login cepat ${mode} gagal.`);
      return;
    }

    setError(null);
    router.push(result.user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
  };

  return (
    <Card>
      <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
      <p className="mb-6 mt-2 text-sm text-slate-600">Masuk untuk mengelola sensor, threshold, dan broadcast alert.</p>

      <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50/60 p-3">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">Login Cepat</p>
        <p className="mb-2 text-xs text-blue-800/80">Pilih mode akun tanpa mengganggu tampilan form utama.</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => quickLogin("admin")}
            className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
          >
            Admin Cepat
          </button>
          <button
            type="button"
            onClick={() => quickLogin("operator")}
            className="rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100"
          >
            User Cepat
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>
        {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
      </form>
    </Card>
  );
}
