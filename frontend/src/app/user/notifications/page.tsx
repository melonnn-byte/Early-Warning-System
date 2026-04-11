"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { useWaterLevel } from "@/hooks/useWaterLevel";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import { formatTimestamp } from "@/lib/utils";

const levelBadgeClass = {
  yellow: "bg-amber-100 text-amber-700",
  orange: "bg-orange-100 text-orange-700",
  red: "bg-rose-100 text-rose-700",
} as const;

const levelLabel = {
  yellow: "Kuning",
  orange: "Oren",
  red: "Merah",
} as const;

export default function UserNotificationsPage() {
  const { liveBySensor } = useWaterLevel();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useUserNotifications(liveBySensor);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">User Notifications</p>
          <h1 className="text-2xl font-bold text-slate-900">Notifikasi Peringatan Banjir</h1>
          <p className="mt-1 text-sm text-slate-600">Saat sensor berstatus kuning, oren, atau merah, notifikasi akan muncul di sini.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            Belum dibaca: {unreadCount}
          </span>
          <button
            type="button"
            onClick={markAllAsRead}
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Tandai semua dibaca
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <h2 className="text-base font-semibold text-slate-900">Belum ada notifikasi risiko</h2>
          <p className="mt-2 text-sm text-slate-600">Notifikasi akan otomatis muncul saat salah satu sensor masuk level Kuning, Oren, atau Merah.</p>
          <div className="mt-4">
            <Link
              href="/user/education"
              className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Buka Panduan Umum
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <Link
              key={item.id}
              href={`/user/notifications/${item.id}`}
              className="group block"
              onClick={() => {
                if (!item.isRead) {
                  markAsRead(item.id);
                }
              }}
            >
              <Card className={`transition-colors group-hover:bg-slate-50 ${item.isRead ? "border-slate-200" : "border-blue-200 bg-blue-50/30"}`}>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold text-slate-900">{item.title}</h2>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${levelBadgeClass[item.riskLevel]}`}>
                        {levelLabel[item.riskLevel]}
                      </span>
                      {!item.isRead && <span className="text-xs font-semibold text-blue-700">Baru</span>}
                    </div>

                    <p className="mt-2 text-sm text-slate-700">{item.message}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Sensor: {item.sensorName} ({item.sensorId}) • Waktu: {formatTimestamp(item.createdAt)}
                    </p>
                  </div>

                  <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors group-hover:border-blue-300 group-hover:text-blue-700">
                    Buka Detail
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
