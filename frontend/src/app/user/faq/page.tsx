"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import api from "@/lib/api";

interface ContactSummaryItem {
  id: string;
  category: "BPBD" | "SAR" | "AMBULANCE" | "POLICE" | "HOSPITAL" | "OTHER";
}

const faqItems = [
  {
    q: "Bagaimana cara membaca notifikasi banjir?",
    a: "Warna Kuning berarti waspada, Oren berarti siaga, dan Merah berarti bahaya. Buka detail notifikasi lalu tekan tombol Buka Tab Panduan Sesuai Level.",
  },
  {
    q: "Notifikasi saya berasal dari siapa?",
    a: "Di detail notifikasi, sumber pesan ditampilkan sebagai Dari Admin atau Dari Sistem agar pengguna tahu asal informasi.",
  },
  {
    q: "Kapan harus menghubungi layanan darurat?",
    a: "Segera hubungi saat status Merah, ada warga terjebak, akses keluar terputus, atau ada kondisi medis darurat.",
  },
  {
    q: "Apa yang perlu disiapkan saat evakuasi?",
    a: "Prioritaskan dokumen penting, obat rutin, alat komunikasi, air minum, dan kebutuhan anak atau lansia dalam satu tas siaga.",
  },
  {
    q: "Mengapa notifikasi belum muncul?",
    a: "Pastikan akun login aktif, jaringan stabil, dan izin notifikasi di perangkat/browser tidak diblokir.",
  },
];

export default function UserFaqPage() {
  const [stats, setStats] = useState({
    alertCount: 0,
    emergencyContacts: 0,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      try {
        const [historyResp, contactsResp] = await Promise.all([
          api.get("/alerts/history", { params: { page: 1, limit: 1 } }),
          api.get("/emergency-contacts"),
        ]);

        const totalAlerts = Number(historyResp.data?.data?.pagination?.total ?? 0);
        const contacts = (contactsResp.data?.data ?? []) as ContactSummaryItem[];

        if (!cancelled) {
          setStats({
            alertCount: totalAlerts,
            emergencyContacts: contacts.length,
            loading: false,
          });
        }
      } catch {
        if (!cancelled) {
          setStats((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      }
    };

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <section className="rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pusat Bantuan User</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">FAQ & Bantuan Cepat</h1>
        <p className="mt-2 text-sm text-slate-600">
          Halaman ini menggantikan menu Pengaturan. Isi FAQ dirancang singkat agar mudah dipahami saat kondisi mendesak.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Card className="border-blue-100 bg-blue-50/60">
            <p className="text-xs text-blue-700">Total notifikasi pada database</p>
            <p className="mt-1 text-2xl font-bold text-blue-900">
              {stats.loading ? "Memuat..." : stats.alertCount}
            </p>
          </Card>
          <Card className="border-rose-100 bg-rose-50/60">
            <p className="text-xs text-rose-700">Kontak darurat aktif dari backend</p>
            <p className="mt-1 text-2xl font-bold text-rose-900">
              {stats.loading ? "Memuat..." : stats.emergencyContacts}
            </p>
          </Card>
        </div>
      </section>

      <section className="mt-6 space-y-3">
        {faqItems.map((item) => (
          <details key={item.q} className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <summary className="cursor-pointer list-none pr-6 text-base font-semibold text-slate-900 marker:content-none">
              {item.q}
              <span className="ml-2 text-slate-500 transition-transform group-open:rotate-180">v</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</p>
          </details>
        ))}
      </section>

      <section className="mt-6">
        <Card className="border-slate-200 bg-slate-50">
          <h2 className="text-base font-semibold text-slate-900">Akses cepat</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/user/notifications" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Buka Notifikasi
            </Link>
            <Link href="/user/education" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Buka Panduan
            </Link>
            <Link href="/user/emergency" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Kontak Darurat
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
