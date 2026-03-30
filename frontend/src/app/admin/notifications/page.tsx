"use client";

import { Card } from "@/components/ui/Card";
import { formatTimestamp } from "@/lib/utils";
import {
  mockNotificationConditions,
  mockNotificationInbox,
  type NotificationConditionLevel,
} from "@/constants";

const levelBadgeClass: Record<NotificationConditionLevel, string> = {
  Aman: "bg-emerald-100 text-emerald-700",
  Waspada: "bg-amber-100 text-amber-700",
  Siaga: "bg-orange-100 text-orange-700",
  Bahaya: "bg-rose-100 text-rose-700",
};

const levelDotClass: Record<NotificationConditionLevel, string> = {
  Aman: "bg-emerald-500",
  Waspada: "bg-amber-500",
  Siaga: "bg-orange-500",
  Bahaya: "bg-rose-500",
};

export default function AdminNotificationsPage() {
  const unreadCount = mockNotificationInbox.filter((item) => !item.isRead).length;
  const dangerCount = mockNotificationInbox.filter((item) => item.level === "Bahaya").length;

  return (
    <main className="space-y-6">
      <Card className="relative overflow-hidden border-blue-500/30 bg-linear-to-r from-blue-600 via-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-900/20">
        <div className="absolute -right-2 top-4 h-24 w-24 rounded-3xl border border-white/20 bg-white/10" />
        <div className="relative z-10 space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">Notifikasi & Inbox Admin</h1>
          <p className="max-w-2xl text-sm text-blue-50/95">
            Ringkasan kondisi peringatan dari Aman hingga Bahaya, lengkap dengan dummy pesan inbox lintas kanal komunikasi.
          </p>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <p className="text-sm text-slate-500">Kondisi Peringatan</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{mockNotificationConditions.length}</p>
          <p className="text-xs text-slate-500">Aman, Waspada, Siaga, Bahaya</p>
        </Card>
        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <p className="text-sm text-slate-500">Total Pesan Inbox</p>
          <p className="mt-1 text-3xl font-bold text-cyan-700">{mockNotificationInbox.length}</p>
          <p className="text-xs text-slate-500">Push, WhatsApp, Email, SMS</p>
        </Card>
        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <p className="text-sm text-slate-500">Belum Dibaca</p>
          <p className="mt-1 text-3xl font-bold text-amber-600">{unreadCount}</p>
          <p className="text-xs text-slate-500">Pesan butuh atensi admin</p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="border-slate-200 bg-white/95 shadow-md shadow-slate-200/40 xl:col-span-2">
          <div className="mb-3">
            <h2 className="text-base font-semibold text-slate-900">Kondisi Peringatan</h2>
            <p className="text-sm text-slate-500">Dummy data untuk tiap level kondisi saat monitoring banjir.</p>
          </div>

          <div className="space-y-3">
            {mockNotificationConditions.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${levelBadgeClass[item.level]}`}>{item.level}</span>
                </div>

                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                <p className="mt-1 text-sm text-slate-600">
                  <span className="font-medium text-slate-700">Rekomendasi:</span> {item.recommendation}
                </p>

                <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span>{item.responseSla}</span>
                  <span>Update: {formatTimestamp(item.updatedAt)}</span>
                </div>
              </article>
            ))}
          </div>
        </Card>

        <Card className="border-slate-200 bg-white/95 shadow-md shadow-slate-200/40 xl:col-span-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Inbox Notifikasi</h2>
              <p className="text-sm text-slate-500">Pesan masuk berdasarkan beragam kondisi peringatan.</p>
            </div>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              {dangerCount} pesan level Bahaya
            </span>
          </div>

          <div className="space-y-3">
            {mockNotificationInbox.map((item) => (
              <article
                key={item.id}
                className={`rounded-xl border p-3.5 transition-colors ${
                  item.isRead ? "border-slate-200 bg-white" : "border-blue-200 bg-blue-50/45"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${levelDotClass[item.level]}`} />
                  <h3 className="text-sm font-semibold text-slate-900">{item.subject}</h3>
                  {!item.isRead && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">Baru</span>}
                </div>

                <p className="mt-2 text-sm text-slate-600">{item.message}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className={`rounded-full px-2.5 py-1 font-semibold ${levelBadgeClass[item.level]}`}>{item.level}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">{item.channel}</span>
                  <span className="text-slate-500">{item.sender}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">{formatTimestamp(item.receivedAt)}</span>
                </div>
              </article>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
