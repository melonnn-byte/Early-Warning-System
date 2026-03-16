import { AdminGoogleSensorMap } from "@/components/maps/AdminGoogleSensorMap";
import { Card } from "@/components/ui/Card";
import { formatTimestamp } from "@/lib/utils";
import { mockActivityLogs, mockSensors, mockWaterLevelHistory } from "@/constants";

export default function AdminDashboardPage() {
  const online = mockSensors.filter((sensor) => sensor.connectivity === "online").length;
  const offline = mockSensors.length - online;
  const globalStatus = mockSensors.some((sensor) => sensor.status === "danger")
    ? "Bahaya"
    : mockSensors.some((sensor) => sensor.status === "alert")
      ? "Waspada"
      : "Aman";

  const avgRainfall =
    Math.round(
      (mockWaterLevelHistory.slice(-12).reduce((sum, point) => sum + point.rainfallMm, 0) /
        Math.max(mockWaterLevelHistory.slice(-12).length, 1)) *
        10,
    ) / 10;

  const severityClass: Record<"info" | "warning" | "critical", string> = {
    info: "bg-blue-100 text-blue-700",
    warning: "bg-amber-100 text-amber-700",
    critical: "bg-rose-100 text-rose-700",
  };

  const severityLabel: Record<"info" | "warning" | "critical", string> = {
    info: "Info",
    warning: "Warning",
    critical: "Critical",
  };

  return (
    <main className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-blue-100 bg-linear-to-br from-white to-blue-50/70">
          <p className="text-sm font-medium text-slate-500">Status Global</p>
          <p
            className={`mt-2 text-3xl font-bold ${
              globalStatus === "Bahaya"
                ? "text-rose-600"
                : globalStatus === "Waspada"
                  ? "text-amber-600"
                  : "text-emerald-600"
            }`}
          >
            {globalStatus}
          </p>
          <p className="mt-1 text-xs text-slate-500">Berdasarkan pembacaan seluruh sensor aktif</p>
        </Card>

        <Card className="border-slate-200 bg-white">
          <p className="text-sm font-medium text-slate-500">Total Sensor</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {online} Aktif <span className="text-base font-medium text-slate-500">| {offline} Offline</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">Pemantauan kesehatan perangkat IoT real-time</p>
        </Card>

        <Card className="border-cyan-100 bg-linear-to-br from-white to-cyan-50/70">
          <p className="text-sm font-medium text-slate-500">Rata-rata Curah Hujan</p>
          <p className="mt-2 text-3xl font-bold text-cyan-700">{avgRainfall} mm/jam</p>
          <p className="mt-1 text-xs text-slate-500">Ringkasan dari pembacaan terbaru seluruh titik</p>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white/95 shadow-md shadow-slate-200/40">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Peta Interaktif Sensor</h2>
            <p className="text-sm text-slate-500">Klik titik sensor untuk melihat lokasi, ketinggian air, dan status baterai.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Total {mockSensors.length} Sensor
          </span>
        </div>

        <AdminGoogleSensorMap sensors={mockSensors} />
      </Card>

      <Card className="border-slate-200 bg-white/95 shadow-md shadow-slate-200/40">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Log Aktivitas Terkini</h2>
            <p className="text-sm text-slate-500">Pemantauan kejadian terbaru untuk respons cepat.</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Update: {formatTimestamp(new Date().toISOString())}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2">Waktu (HH:MM)</th>
                <th className="py-2">Kejadian</th>
                <th className="py-2">Tingkat Keparahan</th>
              </tr>
            </thead>
            <tbody>
              {mockActivityLogs.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 align-top">
                  <td className="py-3 font-medium text-slate-700">{item.time}</td>
                  <td className="py-3 text-slate-700">{item.event}</td>
                  <td className="py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${severityClass[item.severity]}`}>
                      {severityLabel[item.severity]}
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
