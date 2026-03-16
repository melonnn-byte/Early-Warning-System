"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { mockSensorThresholds, mockSensors } from "@/constants";

interface ThresholdForm {
  normalMaxCm: number;
  warningMinCm: number;
  warningMaxCm: number;
  dangerMinCm: number;
  rainLightMax: number;
  rainModerateMax: number;
  rainHeavyMin: number;
  autoBroadcast: boolean;
}

export default function AdminThresholdsPage() {
  const [selectedSensorId, setSelectedSensorId] = useState(mockSensors[0]?.id ?? "");
  const [configs, setConfigs] = useState(mockSensorThresholds);
  const [saved, setSaved] = useState(false);

  const selectedConfig =
    configs.find((item) => item.sensorId === selectedSensorId) ??
    mockSensorThresholds[0] ?? {
      sensorId: selectedSensorId,
      normalMaxCm: 150,
      warningMinCm: 151,
      warningMaxCm: 250,
      dangerMinCm: 251,
      rainLightMax: 5,
      rainModerateMax: 20,
      rainHeavyMin: 21,
      autoBroadcast: false,
    };

  const [form, setForm] = useState<ThresholdForm>({
    normalMaxCm: selectedConfig.normalMaxCm,
    warningMinCm: selectedConfig.warningMinCm,
    warningMaxCm: selectedConfig.warningMaxCm,
    dangerMinCm: selectedConfig.dangerMinCm,
    rainLightMax: selectedConfig.rainLightMax,
    rainModerateMax: selectedConfig.rainModerateMax,
    rainHeavyMin: selectedConfig.rainHeavyMin,
    autoBroadcast: selectedConfig.autoBroadcast,
  });

  const syncFormWithSensor = (sensorId: string) => {
    const config = configs.find((item) => item.sensorId === sensorId);
    if (!config) return;

    setForm({
      normalMaxCm: config.normalMaxCm,
      warningMinCm: config.warningMinCm,
      warningMaxCm: config.warningMaxCm,
      dangerMinCm: config.dangerMinCm,
      rainLightMax: config.rainLightMax,
      rainModerateMax: config.rainModerateMax,
      rainHeavyMin: config.rainHeavyMin,
      autoBroadcast: config.autoBroadcast,
    });
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    setConfigs((prev) =>
      prev.map((item) =>
        item.sensorId === selectedSensorId
          ? {
              ...item,
              normalMaxCm: form.normalMaxCm,
              warningMinCm: form.warningMinCm,
              warningMaxCm: form.warningMaxCm,
              dangerMinCm: form.dangerMinCm,
              rainLightMax: form.rainLightMax,
              rainModerateMax: form.rainModerateMax,
              rainHeavyMin: form.rainHeavyMin,
              autoBroadcast: form.autoBroadcast,
            }
          : item,
      ),
    );

    setSaved(true);
  };

  return (
    <main className="space-y-6">
      <Card className="relative overflow-hidden border-blue-500/30 bg-linear-to-r from-blue-600 via-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-900/20">
        <div className="absolute -right-2 top-4 h-24 w-24 rounded-3xl border border-white/20 bg-white/10" />
        <div className="relative z-10 space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">Ambang Batas (Threshold Settings)</h1>
          <p className="max-w-2xl text-sm text-blue-50/95">Atur level ketinggian air dan curah hujan per sensor untuk logika notifikasi otomatis.</p>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <p className="text-sm text-slate-500">Sensor Terkonfigurasi</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{configs.length}</p>
          <p className="text-xs text-slate-500">Sudah memiliki rule threshold</p>
        </Card>
        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <p className="text-sm text-slate-500">Auto Broadcast Aktif</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">{configs.filter((item) => item.autoBroadcast).length}</p>
          <p className="text-xs text-slate-500">Sensor siap kirim peringatan otomatis</p>
        </Card>
        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <p className="text-sm text-slate-500">Sensor Dipilih</p>
          <p className="mt-1 truncate text-xl font-bold text-cyan-700">{selectedSensorId}</p>
          <p className="text-xs text-slate-500">Konfigurasi sedang diedit</p>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white/95 shadow-md shadow-slate-200/40">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Form Pengaturan Ambang Batas</h2>
          <p className="text-sm text-slate-500">Pastikan konfigurasi level air dan hujan sesuai kondisi lapangan tiap sensor.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <label className="block text-sm text-slate-700">
            Pilih Sensor
            <select
              value={selectedSensorId}
              onChange={(event) => {
                const sensorId = event.target.value;
                setSelectedSensorId(sensorId);
                syncFormWithSensor(sensorId);
                setSaved(false);
              }}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {mockSensors.map((sensor) => (
                <option key={sensor.id} value={sensor.id}>
                  {sensor.name}
                </option>
              ))}
            </select>
          </label>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-slate-800">Konfigurasi Ketinggian Air</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="text-sm text-slate-700">
                Level Normal (Hijau) Maks (cm)
                <input
                  type="number"
                  value={form.normalMaxCm}
                  onChange={(event) => setForm((prev) => ({ ...prev, normalMaxCm: Number(event.target.value) }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm text-slate-700">
                Level Waspada Min (cm)
                <input
                  type="number"
                  value={form.warningMinCm}
                  onChange={(event) => setForm((prev) => ({ ...prev, warningMinCm: Number(event.target.value) }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm text-slate-700">
                Level Waspada Maks (cm)
                <input
                  type="number"
                  value={form.warningMaxCm}
                  onChange={(event) => setForm((prev) => ({ ...prev, warningMaxCm: Number(event.target.value) }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm text-slate-700 md:col-span-3">
                Level Bahaya (Merah) Min (cm)
                <input
                  type="number"
                  value={form.dangerMinCm}
                  onChange={(event) => setForm((prev) => ({ ...prev, dangerMinCm: Number(event.target.value) }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 md:max-w-xs"
                />
              </label>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-slate-800">Konfigurasi Curah Hujan (mm/jam)</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="text-sm text-slate-700">
                Ringan (Maks)
                <input
                  type="number"
                  value={form.rainLightMax}
                  onChange={(event) => setForm((prev) => ({ ...prev, rainLightMax: Number(event.target.value) }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="text-sm text-slate-700">
                Sedang (Maks)
                <input
                  type="number"
                  value={form.rainModerateMax}
                  onChange={(event) => setForm((prev) => ({ ...prev, rainModerateMax: Number(event.target.value) }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="text-sm text-slate-700">
                Lebat (Min)
                <input
                  type="number"
                  value={form.rainHeavyMin}
                  onChange={(event) => setForm((prev) => ({ ...prev, rainHeavyMin: Number(event.target.value) }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
            </div>
          </div>

          <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span>Aktifkan Auto-Broadcast saat mencapai Level Bahaya</span>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, autoBroadcast: !prev.autoBroadcast }))}
              aria-label="Toggle auto broadcast"
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                form.autoBroadcast ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  form.autoBroadcast ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </label>

          <div className="flex items-center gap-3">
            <Button type="submit">Simpan Konfigurasi</Button>
            {saved && <p className="text-sm text-emerald-600">Perubahan ambang batas berhasil disimpan (mock).</p>}
          </div>
        </form>
      </Card>
    </main>
  );
}
