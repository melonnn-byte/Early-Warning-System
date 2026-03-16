import { Card } from "@/components/ui/Card";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { mockAlertHistory, mockSensors } from "@/constants";

export default function AdminDashboardPage() {
  const online = mockSensors.filter((sensor) => sensor.connectivity === "online").length;
  const offline = mockSensors.length - online;
  const dangerCount = mockSensors.filter((sensor) => sensor.status === "danger").length;
  const alertCount = mockSensors.filter((sensor) => sensor.status === "alert").length;

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 via-blue-600 to-cyan-500 p-6 text-white shadow-lg shadow-blue-900/20">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-100">Early Warning System</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight">Admin Overview Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm text-blue-100/95">
          Pantau kondisi sensor, evaluasi level risiko, dan tindak lanjuti alert terbaru dalam satu halaman yang lebih
          rapi dan cepat dibaca.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-blue-50/95">
          <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1">{online} Sensor Online</span>
          <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1">{alertCount} Status Siaga</span>
          <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1">{dangerCount} Status Bahaya</span>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-emerald-100 bg-linear-to-br from-white to-emerald-50/60">
          <p className="text-sm font-medium text-slate-500">Sensor Aktif</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{online}</p>
          <p className="mt-1 text-xs text-slate-500">Terhubung ke sistem monitoring</p>
        </Card>

        <Card className="border-rose-100 bg-linear-to-br from-white to-rose-50/60">
          <p className="text-sm font-medium text-slate-500">Sensor Offline</p>
          <p className="mt-2 text-3xl font-bold text-rose-600">{offline}</p>
          <p className="mt-1 text-xs text-slate-500">Perlu pengecekan perangkat lapangan</p>
        </Card>

        <Card className="border-amber-100 bg-linear-to-br from-white to-amber-50/60">
          <p className="text-sm font-medium text-slate-500">Status Siaga</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{alertCount}</p>
          <p className="mt-1 text-xs text-slate-500">Titik butuh pemantauan lebih ketat</p>
        </Card>

        <Card className="border-blue-100 bg-linear-to-br from-white to-blue-50/70">
          <p className="text-sm font-medium text-slate-500">Alert Terbaru</p>
          <p className="mt-2 text-sm font-semibold text-slate-800">{mockAlertHistory[0]?.title}</p>
          <p className="mt-1 text-xs text-slate-500">Pastikan pesan diteruskan ke pihak terkait</p>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white/95 shadow-md shadow-slate-200/40">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Status Titik Pemantauan</h2>
            <p className="text-sm text-slate-500">Ringkasan kondisi tiap sensor dan parameter utama.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Total {mockSensors.length} Sensor
          </span>
        </div>

        <div className="space-y-2.5">
          {mockSensors.map((sensor) => (
            <div
              key={sensor.id}
              className="grid gap-3 rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 md:grid-cols-[1.2fr_1fr_auto] md:items-center"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800">{sensor.name}</p>
                <p className="text-xs text-slate-500">{sensor.riverName}</p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-600">
                  Level: {sensor.lastLevelCm} cm
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-600">
                  Baterai: {sensor.batteryPercent}%
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 font-medium ${
                    sensor.connectivity === "online" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {sensor.connectivity === "online" ? "Online" : "Offline"}
                </span>
              </div>

              <StatusIndicator status={sensor.status} />
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}
