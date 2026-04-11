"use client";

import { Card } from "@/components/ui/Card";
import { PublicGoogleSensorMap } from "@/components/maps/PublicGoogleSensorMap";
import { useWaterLevel } from "@/hooks/useWaterLevel";
import { formatTimestamp } from "@/lib/utils";

export default function MapPage() {
  const { sensorsSnapshot } = useWaterLevel();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Peta Lokasi Sensor</h1>
      <p className="mb-6 text-sm text-slate-600">
        Lihat titik sensor banjir secara interaktif. Klik marker untuk melihat status level air pada setiap lokasi.
      </p>

      <PublicGoogleSensorMap sensors={sensorsSnapshot} />

      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sensorsSnapshot.map((sensor) => (
          <Card key={sensor.id}>
            <div className="mb-2 flex items-start justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">{sensor.name}</h2>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                  sensor.status === "danger"
                    ? "bg-rose-100 text-rose-700"
                    : sensor.status === "alert"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {sensor.status === "danger" ? "Bahaya" : sensor.status === "alert" ? "Waspada" : "Normal"}
              </span>
            </div>

            <p className="text-sm text-slate-600">{sensor.riverName}</p>
            <p className="mt-2 text-sm text-slate-700">
              Tinggi air: <span className="font-semibold">{sensor.lastLevelCm} cm</span>
            </p>
            <p className="text-xs text-slate-500">Pembaruan: {formatTimestamp(sensor.updatedAt)}</p>
            <a
              href={`https://www.google.com/maps?q=${sensor.latitude},${sensor.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Buka di Google Maps
            </a>
          </Card>
        ))}
      </div>
    </main>
  );
}
