"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatTimestamp } from "@/lib/utils";
import { mockBroadcastHistory } from "@/constants";

type AlertLevel = "Aman" | "Waspada" | "Bahaya";

export default function AdminAlertsPage() {
  const [target, setTarget] = useState("Semua Pengguna Terdaftar");
  const [level, setLevel] = useState<AlertLevel>("Waspada");
  const [channels, setChannels] = useState({
    whatsapp: true,
    push: true,
    email: false,
  });
  const [message, setMessage] = useState("Waspada kenaikan debit air di sektor hilir. Mohon siaga dan pantau instruksi lanjutan.");
  const [sent, setSent] = useState(false);
  const [history, setHistory] = useState(mockBroadcastHistory);

  const toggleChannel = (key: keyof typeof channels) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyTemplate = (type: "evakuasi" | "waspada") => {
    if (type === "evakuasi") {
      setLevel("Bahaya");
      setMessage("PERHATIAN: Status BAHAYA. Segera lakukan evakuasi terarah ke titik aman terdekat sesuai prosedur BPBD.");
      return;
    }

    setLevel("Waspada");
    setMessage("Status WASPADA: terjadi kenaikan debit air. Mohon tingkatkan kesiapsiagaan dan pantau update resmi.");
  };

  const sendAlert = (event: FormEvent) => {
    event.preventDefault();

    const usedChannels = [
      channels.whatsapp ? "WhatsApp" : null,
      channels.push ? "Push Notification" : null,
      channels.email ? "Email" : null,
    ].filter((item): item is string => Boolean(item));

    if (usedChannels.length === 0) {
      setSent(false);
      return;
    }

    const nextHistoryItem = {
      id: `BRC-${history.length + 1}`,
      sentAt: new Date().toISOString(),
      level,
      channels: usedChannels,
      sender: "Admin EWS",
      status: "Berhasil" as const,
    };

    setHistory((prev) => [nextHistoryItem, ...prev]);
    setSent(true);
  };

  return (
    <main className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Peringatan (Broadcast Alert System)</h1>
        <p className="text-sm text-slate-500">Sebarkan peringatan darurat melalui WhatsApp, Push Notification, dan Email secara terpusat.</p>
      </div>

      <Card>
        <h2 className="mb-3 text-base font-semibold text-slate-900">Panel Kirim Peringatan Manual</h2>
        <form onSubmit={sendAlert} className="space-y-4">
          <label className="block text-sm text-slate-700">
            Target Penerima
            <select
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option>Semua Pengguna Terdaftar</option>
              <option>Hanya Petugas</option>
              <option>Berdasarkan Area</option>
            </select>
          </label>

          <label className="block text-sm text-slate-700">
            Jenis/Level Peringatan
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value as AlertLevel)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="Aman">Aman</option>
              <option value="Waspada">Waspada</option>
              <option value="Bahaya">Bahaya</option>
            </select>
          </label>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Pilih Saluran</p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-700">
              <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                <input type="checkbox" checked={channels.whatsapp} onChange={() => toggleChannel("whatsapp")} /> WhatsApp
              </label>
              <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                <input type="checkbox" checked={channels.push} onChange={() => toggleChannel("push")} /> Push Notification
              </label>
              <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                <input type="checkbox" checked={channels.email} onChange={() => toggleChannel("email")} /> Email
              </label>
            </div>
          </div>

          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={() => applyTemplate("evakuasi")}>
                Template Evakuasi
              </Button>
              <Button type="button" variant="secondary" onClick={() => applyTemplate("waspada")}>
                Template Waspada
              </Button>
            </div>

            <label className="block text-sm font-medium text-slate-700">Isi Pesan</label>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-30 w-full rounded-lg border border-slate-300 px-3 py-2"
          />

          <div className="flex items-center gap-3">
            <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
              Siarkan Sekarang
            </Button>
            {sent && <p className="text-sm text-emerald-600">Peringatan berhasil disiarkan (mock).</p>}
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-semibold text-slate-900">Tabel Riwayat Peringatan</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2">Tanggal & Waktu</th>
                <th className="py-2">Jenis/Level Peringatan</th>
                <th className="py-2">Saluran Digunakan</th>
                <th className="py-2">Pengirim</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 align-top">
                  <td className="py-3 text-slate-700">{formatTimestamp(item.sentAt)}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.level === "Bahaya"
                          ? "bg-rose-100 text-rose-700"
                          : item.level === "Waspada"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {item.level}
                    </span>
                  </td>
                  <td className="py-3 text-slate-700">{item.channels.join(", ")}</td>
                  <td className="py-3 text-slate-700">{item.sender}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.status === "Berhasil" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}
