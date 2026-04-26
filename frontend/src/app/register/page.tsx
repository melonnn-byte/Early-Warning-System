"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api"; // Wajib ditambahkan untuk memanggil backend

const getRedirectPathByRole = (role: string) => 
  (role === "ADMIN" || role === "admin" ? "/admin/dashboard" : "/user/dashboard");

export default function RegisterPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!name || !email || !institution || !password || !confirmPassword) {
      setError("Mohon lengkapi semua field.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password belum sama.");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Mengirim request ke backend (institution tidak dikirim karena belum ada di DB)
      await api.post("/auth/register", {
        name,
        email,
        password,
        institution,
      });

      setMessage("Pendaftaran berhasil! Mengalihkan ke dashboard...");

      // Auto-login setelah registrasi
      setTimeout(async () => {
        const result = await login(email, password);
        if (result.ok && result.user) {
          router.push(getRedirectPathByRole(result.user.role));
        } else {
          // Jika auto-login gagal, arahkan ke login page
          router.push("/login");
        }
      }, 1000);
    } catch (err: unknown) {
      // Menangkap pesan error dari backend (misal: "Email sudah terdaftar")
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan saat mendaftar.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onGoogleRegister = async () => {
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const result = await loginWithGoogle();

    if (!result.ok) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    setMessage("Pendaftaran/Login Google berhasil! Mengalihkan ke dashboard...");
    setTimeout(() => {
      if (result.user) {
        router.push(getRedirectPathByRole(result.user.role));
      }
    }, 700);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sky-50 px-6 py-10">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_44%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.2),transparent_48%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(239,246,255,0.95),rgba(219,234,254,0.72))]" />
      </div>

      <div className="relative grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_1fr]">
        <section className="hidden rounded-2xl border border-blue-200/70 bg-white/75 p-8 text-slate-800 shadow-sm backdrop-blur-sm lg:block">
          <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            Daftar Akun EWS
          </p>
          <h1 className="mt-5 text-3xl font-bold leading-tight">Buat Akun Baru untuk Monitoring Banjir</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Daftarkan akun admin/user untuk mengelola sensor, memantau alert, dan mengoordinasikan tindakan
            cepat saat kondisi darurat.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-slate-700">
            <li className="rounded-lg border border-blue-100 bg-sky-50/70 px-3 py-2">✅ Aktivasi akun cepat</li>
            <li className="rounded-lg border border-blue-100 bg-sky-50/70 px-3 py-2">✅ Akses dashboard real-time</li>
            <li className="rounded-lg border border-blue-100 bg-sky-50/70 px-3 py-2">✅ Integrasi notifikasi peringatan dini</li>
          </ul>
        </section>

        <Card className="border-blue-100 bg-white/95 p-6 shadow-xl md:p-7">
          <h2 className="text-2xl font-bold text-slate-900">Register</h2>
          <p className="mt-2 text-sm text-slate-600">Buat akun baru untuk menggunakan layanan EWS.</p>

          <button
            type="button"
            onClick={onGoogleRegister}
            disabled={isSubmitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.5-5.5 3.5-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 2.9 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.3-.2-2H12z" />
            </svg>
            Daftar dengan Google
          </button>

          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">atau</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Nama lengkap"
                required
              />
            </div>

            <div>
              <label htmlFor="institution" className="mb-1 block text-sm font-medium text-slate-700">
                Instansi / Organisasi
              </label>
              <input
                id="institution"
                type="text"
                value={institution}
                onChange={(event) => setInstitution(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Contoh: BPBD Padang"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="nama@email.com"
                required
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
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Minimal 8 karakter"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-700">
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Ulangi password"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : "Daftar"}
            </Button>

            {error && <p className="text-sm font-medium text-rose-600 text-center">{error}</p>}
            {message && <p className="text-sm font-medium text-emerald-600 text-center">{message}</p>}
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-blue-700 hover:text-blue-800">
              Login di sini
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}