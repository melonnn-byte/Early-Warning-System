"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RainfallChart } from "@/components/charts/RainfallChart";
import { WaterLevelChart } from "@/components/charts/WaterLevelChart";
import { formatTimestamp } from "@/lib/utils";
import { mockSensors, mockWaterLevelHistory } from "@/constants";

interface FilterState {
  fromDate: string;
  toDate: string;
  sensorId: string;
}

export default function AdminReportsPage() {
  const initialFromDate = mockWaterLevelHistory[0]?.timestamp.slice(0, 10) ?? "";
  const initialToDate = mockWaterLevelHistory[mockWaterLevelHistory.length - 1]?.timestamp.slice(0, 10) ?? "";

  const [filterForm, setFilterForm] = useState<FilterState>({
    fromDate: initialFromDate,
    toDate: initialToDate,
    sensorId: "all",
  });
  const [appliedFilter, setAppliedFilter] = useState<FilterState>({
    fromDate: initialFromDate,
    toDate: initialToDate,
    sensorId: "all",
  });

  const filteredData = useMemo(() => {
    const fromTime = appliedFilter.fromDate ? new Date(`${appliedFilter.fromDate}T00:00:00`).getTime() : Number.MIN_SAFE_INTEGER;
    const toTime = appliedFilter.toDate ? new Date(`${appliedFilter.toDate}T23:59:59`).getTime() : Number.MAX_SAFE_INTEGER;

    return mockWaterLevelHistory.filter((point) => {
      const ts = new Date(point.timestamp).getTime();
      const inDateRange = ts >= fromTime && ts <= toTime;
      const inSensorRange = appliedFilter.sensorId === "all" || point.sensorId === appliedFilter.sensorId;
      return inDateRange && inSensorRange;
    });
  }, [appliedFilter]);

  const exportCsv = () => {
    const lines = [
      ["Waktu", "Sensor", "Ketinggian (cm)", "Intensitas Hujan (mm/jam)"]
        .join(","),
      ...filteredData.map((row) => [
        formatTimestamp(row.timestamp),
        row.sensorId,
        row.levelCm.toString(),
        row.rainfallMm.toString(),
      ].join(",")),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "laporan-ews.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    window.print();
  };

  return (
    <main className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Laporan (Data Logs & Reporting)</h1>
        <p className="text-sm text-slate-500">Analisis historis untuk pelaporan bulanan ke pemerintah daerah dan instansi terkait.</p>
      </div>

      <Card>
        <h2 className="mb-3 text-base font-semibold text-slate-900">Filter Pencarian</h2>
        <div className="grid gap-3 md:grid-cols-4">
          <label className="text-sm text-slate-700">
            Tanggal Mulai
            <input
              type="date"
              value={filterForm.fromDate}
              onChange={(event) => setFilterForm((prev) => ({ ...prev, fromDate: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="text-sm text-slate-700">
            Tanggal Akhir
            <input
              type="date"
              value={filterForm.toDate}
              onChange={(event) => setFilterForm((prev) => ({ ...prev, toDate: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="text-sm text-slate-700">
            Pilih Sensor
            <select
              value={filterForm.sensorId}
              onChange={(event) => setFilterForm((prev) => ({ ...prev, sensorId: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="all">Semua Sensor</option>
              {mockSensors.map((sensor) => (
                <option key={sensor.id} value={sensor.id}>
                  {sensor.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <Button className="w-full" onClick={() => setAppliedFilter(filterForm)}>
              Tampilkan Data
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <WaterLevelChart points={filteredData} />
        </Card>
        <Card>
          <RainfallChart points={filteredData} />
        </Card>
      </div>

      <Card className="overflow-x-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Tabel Data Mentah</h2>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={downloadPdf}>
              Unduh PDF
            </Button>
            <Button onClick={exportCsv}>Unduh Excel/CSV</Button>
          </div>
        </div>

        <table className="w-full min-w-180 text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2">Waktu</th>
              <th className="py-2">Sensor</th>
              <th className="py-2">Ketinggian</th>
              <th className="py-2">Intensitas Hujan</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-sm text-slate-500">
                  Tidak ada data pada rentang filter ini.
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={`${row.sensorId}-${row.timestamp}-${index}`} className="border-b border-slate-100">
                  <td className="py-3 text-slate-700">{formatTimestamp(row.timestamp)}</td>
                  <td className="py-3 text-slate-700">{row.sensorId}</td>
                  <td className="py-3 text-slate-700">{row.levelCm} cm</td>
                  <td className="py-3 text-slate-700">{row.rainfallMm} mm/jam</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </main>
  );
}
