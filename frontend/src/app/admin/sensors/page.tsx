"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Sensor, SensorConnectivity } from "@/types/sensor";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { getStatusFromLevel } from "@/lib/utils";
import { mockSensors } from "@/constants";

interface SensorFormState {
  id: string;
  name: string;
  riverName: string;
  latitude: number;
  longitude: number;
  zeroCalibrationCm: number;
  batteryPercent: number;
  connectivity: SensorConnectivity;
  lastLevelCm: number;
}

const emptyForm: SensorFormState = {
  id: "",
  name: "",
  riverName: "",
  latitude: -0.95,
  longitude: 100.37,
  zeroCalibrationCm: 200,
  batteryPercent: 100,
  connectivity: "online",
  lastLevelCm: 0,
};

export default function AdminSensorsPage() {
  const [sensors, setSensors] = useState<Sensor[]>(mockSensors);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [form, setForm] = useState<SensorFormState>(emptyForm);

  const modalTitle = editingId ? "Edit Sensor" : "Tambah Sensor";

  const mapPreviewUrl = useMemo(
    () => `https://maps.google.com/maps?q=${form.latitude},${form.longitude}&z=14&output=embed`,
    [form.latitude, form.longitude],
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSavedMessage(null);
    setOpen(true);
  };

  const openEdit = (sensor: Sensor) => {
    setEditingId(sensor.id);
    setForm({
      id: sensor.id,
      name: sensor.name,
      riverName: sensor.riverName,
      latitude: sensor.latitude,
      longitude: sensor.longitude,
      zeroCalibrationCm: 200,
      batteryPercent: sensor.batteryPercent,
      connectivity: sensor.connectivity,
      lastLevelCm: sensor.lastLevelCm,
    });
    setSavedMessage(null);
    setOpen(true);
  };

  const deleteSensor = (id: string) => {
    setSensors((prev) => prev.filter((sensor) => sensor.id !== id));
    setSavedMessage("Sensor berhasil dihapus.");
  };

  const submitForm = (event: FormEvent) => {
    event.preventDefault();

    const nextSensor: Sensor = {
      id: form.id,
      name: form.name,
      riverName: form.riverName,
      latitude: form.latitude,
      longitude: form.longitude,
      connectivity: form.connectivity,
      batteryPercent: form.batteryPercent,
      lastLevelCm: form.lastLevelCm,
      status: getStatusFromLevel(form.lastLevelCm),
      updatedAt: new Date().toISOString(),
    };

    setSensors((prev) => {
      if (editingId) {
        return prev.map((item) => (item.id === editingId ? nextSensor : item));
      }

      return [nextSensor, ...prev];
    });

    setSavedMessage(editingId ? "Data sensor berhasil diperbarui." : "Sensor baru berhasil ditambahkan.");
    setOpen(false);
  };

  return (
    <main className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Sensor IoT</h1>
          <p className="text-sm text-slate-500">Pantau kesehatan perangkat ultrasonik & rain gauge secara real-time.</p>
        </div>
        <Button onClick={openCreate}>Tambah Sensor</Button>
      </div>

      {savedMessage && <p className="text-sm font-medium text-emerald-600">{savedMessage}</p>}

      <Card className="overflow-x-auto">
        <table className="w-full min-w-220 text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2">ID Perangkat</th>
              <th className="py-2">Nama/Lokasi Titik</th>
              <th className="py-2">Ketinggian Air Saat Ini</th>
              <th className="py-2">Status Koneksi</th>
              <th className="py-2">Sisa Baterai</th>
              <th className="py-2">Status</th>
              <th className="py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((sensor) => (
              <tr key={sensor.id} className="border-b border-slate-100">
                <td className="py-3 font-mono text-xs text-slate-700">{sensor.id}</td>
                <td className="py-3">
                  <p className="font-medium text-slate-800">{sensor.name}</p>
                  <p className="text-xs text-slate-500">{sensor.riverName}</p>
                </td>
                <td className="py-3 text-slate-600">{sensor.lastLevelCm} cm</td>
                <td className="py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      sensor.connectivity === "online" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {sensor.connectivity === "online" ? "Online" : "Offline"}
                  </span>
                </td>
                <td className="py-3 text-slate-600">{sensor.batteryPercent}%</td>
                <td className="py-3">
                  <StatusIndicator status={sensor.status} />
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => openEdit(sensor)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => deleteSensor(sensor.id)}>
                      Hapus
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={open} title={modalTitle} onClose={() => setOpen(false)}>
        <form onSubmit={submitForm} className="space-y-3">
          <label className="block text-sm text-slate-700">
            ID Perangkat (MAC Address/UUID)
            <input
              required
              value={form.id}
              onChange={(event) => setForm((prev) => ({ ...prev, id: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="ESP32-UUID-001"
            />
          </label>

          <label className="block text-sm text-slate-700">
            Nama Lokasi
            <input
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Hulu Sungai Jembatan X"
            />
          </label>

          <label className="block text-sm text-slate-700">
            Nama Sungai/Area
            <input
              required
              value={form.riverName}
              onChange={(event) => setForm((prev) => ({ ...prev, riverName: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-slate-700">
              Latitude
              <input
                type="number"
                step="0.0001"
                required
                value={form.latitude}
                onChange={(event) => setForm((prev) => ({ ...prev, latitude: Number(event.target.value) }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-700">
              Longitude
              <input
                type="number"
                step="0.0001"
                required
                value={form.longitude}
                onChange={(event) => setForm((prev) => ({ ...prev, longitude: Number(event.target.value) }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm text-slate-700">
              Kalibrasi Titik Nol (cm)
              <input
                type="number"
                required
                value={form.zeroCalibrationCm}
                onChange={(event) => setForm((prev) => ({ ...prev, zeroCalibrationCm: Number(event.target.value) }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-700">
              Ketinggian Air Saat Ini (cm)
              <input
                type="number"
                required
                value={form.lastLevelCm}
                onChange={(event) => setForm((prev) => ({ ...prev, lastLevelCm: Number(event.target.value) }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-700">
              Sisa Baterai (%)
              <input
                type="number"
                required
                min={0}
                max={100}
                value={form.batteryPercent}
                onChange={(event) => setForm((prev) => ({ ...prev, batteryPercent: Number(event.target.value) }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>

          <label className="block text-sm text-slate-700">
            Status Koneksi
            <select
              value={form.connectivity}
              onChange={(event) => setForm((prev) => ({ ...prev, connectivity: event.target.value as SensorConnectivity }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </label>

          <div>
            <p className="mb-1 text-sm font-medium text-slate-700">Pratinjau Lokasi (Mini Map)</p>
            <iframe
              title="Mini map koordinat sensor"
              src={mapPreviewUrl}
              loading="lazy"
              className="h-38 w-full rounded-lg border border-slate-200"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan Sensor</Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
