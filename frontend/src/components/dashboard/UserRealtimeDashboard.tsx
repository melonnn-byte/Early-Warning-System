"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { RainfallCard } from "@/components/dashboard/RainfallCard";
import { WaterLevelGauge } from "@/components/dashboard/WaterLevelGauge";
import { WaterLevelChart } from "@/components/charts/WaterLevelChart";
import { RainfallChart } from "@/components/charts/RainfallChart";
import { FlowSpeedChart } from "@/components/charts/FlowSpeedChart";
import { Card } from "@/components/ui/Card";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { useWaterLevel } from "@/hooks/useWaterLevel";
import { cn, getRainfallCategory } from "@/lib/utils";
import { formatTimestamp } from "@/lib/utils";
import type { WaterStatus } from "@/types/water-level";

interface UserRealtimeDashboardProps {
  headline: string;
  subtitle?: string;
  roleLabel?: string;
}

const statusRank: Record<WaterStatus, number> = {
  safe: 0,
  alert: 1,
  danger: 2,
};

const statusMeta: Record<
  WaterStatus,
  {
    label: string;
    summary: string;
    panelClass: string;
    dotClass: string;
    actions: string[];
  }
> = {
  safe: {
    label: "Normal",
    summary: "Situasi cenderung aman, tetap pantau dashboard secara berkala.",
    panelClass: "border-emerald-200 bg-emerald-50 text-emerald-900",
    dotClass: "bg-emerald-500",
    actions: [
      "Pantau pembaruan level air setiap 30 menit.",
      "Pastikan notifikasi perangkat tetap aktif.",
      "Simpan jalur evakuasi sebagai antisipasi.",
    ],
  },
  alert: {
    label: "Waspada",
    summary: "Terjadi kenaikan risiko, siapkan perlengkapan dan rencana evakuasi.",
    panelClass: "border-amber-200 bg-amber-50 text-amber-900",
    dotClass: "bg-amber-500",
    actions: [
      "Pantau dashboard tiap 10-15 menit.",
      "Siapkan tas siaga dan dokumen penting.",
      "Prioritaskan kesiapan anggota keluarga rentan.",
    ],
  },
  danger: {
    label: "Bahaya",
    summary: "Kondisi kritis, prioritaskan keselamatan jiwa dan evakuasi segera.",
    panelClass: "border-rose-200 bg-rose-50 text-rose-900",
    dotClass: "bg-rose-500",
    actions: [
      "Lakukan evakuasi ke titik aman resmi.",
      "Hubungi layanan darurat jika akses terputus.",
      "Ikuti arahan petugas dan hindari arus banjir.",
    ],
  },
};

export function UserRealtimeDashboard({ headline, subtitle, roleLabel }: UserRealtimeDashboardProps) {
  const pathname = usePathname();
  const isUserRoute = pathname.startsWith("/user");
  const [selectedSensorId, setSelectedSensorId] = useState("SEN-01");
  const { latest, history, sensorsSnapshot, liveBySensor } = useWaterLevel({ sensorId: selectedSensorId });

  const sortedSensors = useMemo(
    () => [...liveBySensor].sort((a, b) => statusRank[b.status] - statusRank[a.status] || b.levelCm - a.levelCm),
    [liveBySensor],
  );

  const overallStatus = sortedSensors[0]?.status ?? latest.status;
  const dangerCount = liveBySensor.filter((sensor) => sensor.status === "danger").length;
  const alertCount = liveBySensor.filter((sensor) => sensor.status === "alert").length;

  const selectedSensor = useMemo(
    () => sensorsSnapshot.find((sensor) => sensor.id === latest.sensorId) ?? sensorsSnapshot[0],
    [latest.sensorId, sensorsSnapshot],
  );

  const rainfallCategory = getRainfallCategory(latest.rainfallMm);
  const onlineCount = sensorsSnapshot.filter((sensor) => sensor.connectivity === "online").length;
  const activeMeta = statusMeta[latest.status];

  const routeLinks = {
    map: isUserRoute ? "/user/map" : "/map",
    emergency: isUserRoute ? "/user/emergency" : "/emergency",
    education: isUserRoute ? "/user/education" : "/education",
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-6 py-8">
      <section className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            {roleLabel && <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{roleLabel}</p>}
            <h1 className="mt-1 text-3xl font-bold text-slate-900">{headline}</h1>
            {subtitle && <p className="mt-2 max-w-2xl text-sm text-slate-600">{subtitle}</p>}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                <span className={cn("inline-flex h-2 w-2 rounded-full", statusMeta[overallStatus].dotClass)} aria-hidden="true" />
                Status Umum: <span className="font-semibold text-slate-800">{statusMeta[overallStatus].label}</span>
              </span>
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                Update: <span className="ml-1 font-semibold text-slate-800">{formatTimestamp(latest.updatedAt)}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusIndicator status={overallStatus} />
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <p className="text-xs font-medium text-slate-500">Ketinggian Air Aktif</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{latest.levelCm} cm</p>
          <p className="mt-1 text-xs text-slate-500">Sensor: {latest.sensorName}</p>
        </Card>

        <Card className="border-slate-200 bg-white">
          <p className="text-xs font-medium text-slate-500">Curah Hujan</p>
          <p className="mt-2 text-2xl font-bold text-cyan-700">{latest.rainfallMm} mm/jam</p>
          <p className="mt-1 text-xs text-slate-500">{rainfallCategory.label} • {rainfallCategory.detail}</p>
        </Card>

        <Card className="border-slate-200 bg-white">
          <p className="text-xs font-medium text-slate-500">Sensor Berisiko</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{dangerCount + alertCount}</p>
          <p className="mt-1 text-xs text-slate-500">Bahaya: {dangerCount} • Waspada: {alertCount}</p>
        </Card>

        <Card className="border-slate-200 bg-white">
          <p className="text-xs font-medium text-slate-500">Konektivitas Sensor</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{onlineCount}/{sensorsSnapshot.length}</p>
          <p className="mt-1 text-xs text-slate-500">Sensor online aktif</p>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Monitor Sensor Aktif</p>
              <h2 className="text-xl font-bold text-slate-900">{selectedSensor?.name ?? latest.sensorName}</h2>
              <p className="text-xs text-slate-500">{selectedSensor?.riverName ?? "-"} • {selectedSensor?.id ?? latest.sensorId}</p>
            </div>

            <label className="text-sm text-slate-700">
              Pilih Sensor
              <select
                value={latest.sensorId}
                onChange={(event) => setSelectedSensorId(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm md:min-w-72"
              >
                {sensorsSnapshot.map((sensor) => (
                  <option key={sensor.id} value={sensor.id}>
                    {sensor.name} ({sensor.riverName})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Status</p>
              <div className="mt-1">
                <StatusIndicator status={latest.status} />
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Tinggi Air</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{latest.levelCm} cm</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Konektivitas</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{selectedSensor?.connectivity === "online" ? "Online" : "Offline"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Baterai</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{selectedSensor?.batteryPercent ?? 0}%</p>
            </div>
          </div>

          <div className={cn("mt-4 rounded-xl border p-4", activeMeta.panelClass)}>
            <h3 className="text-sm font-semibold">Rekomendasi Tindakan Saat Ini</h3>
            <p className="mt-1 text-sm">{activeMeta.summary}</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {activeMeta.actions.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-slate-900">Aksi Cepat User</h2>
          <p className="mt-1 text-sm text-slate-600">Akses fitur penting tanpa berpindah menu terlalu jauh.</p>

          <div className="mt-4 grid gap-2">
            <Link
              href={routeLinks.map}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Buka Peta Sensor
            </Link>
            <Link
              href={routeLinks.emergency}
              className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              Kontak Darurat
            </Link>
            <Link
              href={routeLinks.education}
              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
            >
              Buka Panduan Tindakan
            </Link>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sensor Prioritas</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{sortedSensors[0]?.sensorName ?? latest.sensorName}</p>
            <p className="mt-1 text-xs text-slate-600">
              {sortedSensors[0]?.levelCm ?? latest.levelCm} cm • {statusMeta[sortedSensors[0]?.status ?? latest.status].label}
            </p>
            <p className="mt-2 text-xs text-slate-500">Fokuskan pemantauan pada sensor dengan status paling tinggi terlebih dahulu.</p>
          </div>
        </Card>
      </section>

      <Card>
        <h2 className="text-base font-semibold text-slate-900">Kondisi Semua Sensor</h2>
        <p className="mt-1 text-sm text-slate-600">Urutan otomatis dari level risiko tertinggi agar mudah menentukan prioritas respons.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {sortedSensors.map((item) => (
            <div key={item.sensorId} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.sensorName}</p>
                  <p className="text-xs text-slate-500">{item.sensorId}</p>
                </div>
                <StatusIndicator status={item.status} />
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <p>Tinggi air: <span className="font-semibold text-slate-800">{item.levelCm} cm</span></p>
                <p>Curah hujan: <span className="font-semibold text-slate-800">{item.rainfallMm} mm/jam</span></p>
                <p>Pembaruan: <span className="font-semibold text-slate-800">{formatTimestamp(item.updatedAt)}</span></p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <AlertBanner
        status={overallStatus}
        message={`Status umum saat ini ${statusMeta[overallStatus].label}. Fokus pemantauan pada ${sortedSensors[0]?.sensorName ?? latest.sensorName}.`}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="flex h-full flex-col justify-between">
            <WaterLevelGauge levelCm={latest.levelCm} status={latest.status} />
            <p className="mt-3 text-xs text-slate-500">Gauge memvisualkan level sensor aktif untuk keputusan cepat.</p>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <RainfallCard rainfallMm={latest.rainfallMm} />
        </div>

        <Card className="lg:col-span-2">
          <WaterLevelChart points={history} />
        </Card>

        <Card>
          <FlowSpeedChart points={history} />
        </Card>

        <Card className="lg:col-span-3">
          <RainfallChart points={history} />
        </Card>
      </section>
    </main>
  );
}
