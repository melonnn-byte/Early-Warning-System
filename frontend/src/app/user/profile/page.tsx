"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function UserProfilePage() {
  const { user, updateProfile } = useAuth();
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const whatsappNumber = String(formData.get("whatsappNumber") ?? "").trim();

    updateProfile({
      name,
      email,
      whatsappNumber,
    });

    setMessage("Profil berhasil diperbarui.");
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Edit Profile</h1>
      <p className="mb-6 text-sm text-slate-600">Perbarui data profil pengguna untuk notifikasi dan identitas akun.</p>

      <Card>
        <form key={user?.id ?? "guest"} onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm text-slate-700">
            Nama
            <input
              name="name"
              required
              defaultValue={user?.name ?? ""}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm text-slate-700">
            Email
            <input
              name="email"
              type="email"
              required
              defaultValue={user?.email ?? ""}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm text-slate-700">
            Nomor WhatsApp
            <input
              name="whatsappNumber"
              defaultValue={user?.whatsappNumber ?? ""}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="62812xxxxxxx"
            />
          </label>

          <div className="flex items-center gap-3">
            <Button type="submit">Simpan Perubahan</Button>
            {message && <p className="text-sm font-medium text-emerald-600">{message}</p>}
          </div>
        </form>
      </Card>
    </main>
  );
}
