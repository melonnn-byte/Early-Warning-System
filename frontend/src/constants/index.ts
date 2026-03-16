import type { Sensor } from "@/types/sensor";
import type { AlertMessage } from "@/types/alert";
import type { AppUser } from "@/types/user";
import type { WaterLevelPoint } from "@/types/water-level";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:3001";

export const statusColor: Record<"safe" | "alert" | "danger", string> = {
  safe: "bg-emerald-100 text-emerald-700",
  alert: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
};

export const publicNavLinks = [
  { href: "/", label: "Beranda" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/map", label: "Peta Sensor" },
  { href: "/emergency", label: "Kontak Darurat" },
  { href: "/education", label: "Edukasi" },
];

export const landingNavLinks = [
  { id: "home", href: "/#home", label: "Beranda" },
  { id: "realtime-dashboard", href: "/#realtime-dashboard", label: "Dashboard" },
  { id: "status-legend", href: "/#status-legend", label: "Status" },
  { id: "emergency-action", href: "/#emergency-action", label: "Darurat" },
  { id: "education-faq", href: "/#education-faq", label: "Edukasi & FAQ" },
  { id: "contact", href: "/#contact", label: "Kontak" },
];

export const adminNavLinks = [
  { href: "/admin/dashboard", label: "Dasbor" },
  { href: "/admin/sensors", label: "Sensor" },
  { href: "/admin/thresholds", label: "Ambang Batas" },
  { href: "/admin/alerts", label: "Peringatan" },
  { href: "/admin/reports", label: "Laporan" },
  { href: "/admin/users", label: "Pengguna" },
];

export const emergencyContacts = [
  { name: "BPBD Kota", phone: "117" },
  { name: "Basarnas", phone: "115" },
  { name: "Ambulans", phone: "118" },
];

export const mockSensors: Sensor[] = [
  {
    id: "SEN-01",
    name: "Sensor Hulu",
    riverName: "Batang Arau",
    latitude: -0.9478,
    longitude: 100.3615,
    connectivity: "online",
    batteryPercent: 87,
    lastLevelCm: 120,
    status: "safe",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "SEN-02",
    name: "Sensor Tengah",
    riverName: "Batang Arau",
    latitude: -0.9554,
    longitude: 100.3689,
    connectivity: "online",
    batteryPercent: 63,
    lastLevelCm: 165,
    status: "alert",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "SEN-03",
    name: "Sensor Hilir",
    riverName: "Batang Arau",
    latitude: -0.9681,
    longitude: 100.3862,
    connectivity: "offline",
    batteryPercent: 12,
    lastLevelCm: 220,
    status: "danger",
    updatedAt: new Date().toISOString(),
  },
];

export const mockAlertHistory: AlertMessage[] = [
  {
    id: "ALT-001",
    title: "Waspada Kenaikan Air",
    message: "Ketinggian air di titik tengah naik ke status SIAGA.",
    status: "alert",
    channels: ["push", "whatsapp"],
    sentAt: new Date().toISOString(),
  },
  {
    id: "ALT-002",
    title: "Status BAHAYA",
    message: "Segera evakuasi area bantaran sungai sektor hilir.",
    status: "danger",
    channels: ["push", "whatsapp", "email"],
    sentAt: new Date().toISOString(),
  },
];

export interface DummyAuthAccount {
  email: string;
  password: string;
  name: string;
  role: AppUser["role"];
}

export const dummyAuthAccounts: DummyAuthAccount[] = [
  {
    email: "admin@ews.local",
    password: "Admin123!",
    name: "Admin EWS",
    role: "admin",
  },
  {
    email: "operator@ews.local",
    password: "Operator123!",
    name: "Operator Lapangan",
    role: "operator",
  },
  {
    email: "supervisor@ews.local",
    password: "Supervisor123!",
    name: "Supervisor EWS",
    role: "admin",
  },
];

export const mockUsers: AppUser[] = [
  { id: "USR-01", name: "Petugas A", email: "petugas.a@ews.id", whatsappNumber: "6281211110001", role: "operator" },
  { id: "USR-02", name: "Petugas B", email: "petugas.b@ews.id", whatsappNumber: "6281211110002", role: "operator" },
  { id: "USR-03", name: "Supervisor", email: "supervisor@ews.id", whatsappNumber: "6281211110003", role: "admin" },
  { id: "USR-04", name: "Komandan Posko", email: "komandan@ews.id", whatsappNumber: "6281211110004", role: "admin" },
];

export const mockReportLogs = [
  { date: "2026-03-11", type: "Water Level", value: "142 cm", sensor: "Sensor Hulu" },
  { date: "2026-03-12", type: "Water Level", value: "175 cm", sensor: "Sensor Tengah" },
  { date: "2026-03-12", type: "Rainfall", value: "34 mm", sensor: "Sensor Tengah" },
  { date: "2026-03-13", type: "Alert", value: "Status Siaga", sensor: "Sektor Tengah" },
  { date: "2026-03-13", type: "Alert", value: "Status Bahaya", sensor: "Sektor Hilir" },
];

export type ActivitySeverity = "info" | "warning" | "critical";

export interface ActivityLogItem {
  id: string;
  time: string;
  event: string;
  severity: ActivitySeverity;
}

export const mockActivityLogs: ActivityLogItem[] = [
  { id: "ACT-001", time: "08:05", event: "Air mencapai 150 cm di Sensor Tengah", severity: "warning" },
  { id: "ACT-002", time: "08:12", event: "Baterai Sensor Hilir tersisa 10%", severity: "critical" },
  { id: "ACT-003", time: "08:20", event: "Sinkronisasi data 3 sensor berhasil", severity: "info" },
  { id: "ACT-004", time: "08:35", event: "Curah hujan 18 mm/jam di area Hulu", severity: "warning" },
  { id: "ACT-005", time: "08:45", event: "Mode auto-broadcast aktif untuk Sensor Hilir", severity: "info" },
];

export interface BroadcastHistoryItem {
  id: string;
  sentAt: string;
  level: "Aman" | "Waspada" | "Bahaya";
  channels: string[];
  sender: string;
  status: "Berhasil" | "Gagal";
}

export const mockBroadcastHistory: BroadcastHistoryItem[] = [
  {
    id: "BRC-001",
    sentAt: "2026-03-16T07:15:00.000Z",
    level: "Waspada",
    channels: ["WhatsApp", "Push Notification"],
    sender: "Admin EWS",
    status: "Berhasil",
  },
  {
    id: "BRC-002",
    sentAt: "2026-03-16T06:05:00.000Z",
    level: "Bahaya",
    channels: ["WhatsApp", "Email", "Push Notification"],
    sender: "Supervisor EWS",
    status: "Berhasil",
  },
  {
    id: "BRC-003",
    sentAt: "2026-03-15T21:40:00.000Z",
    level: "Waspada",
    channels: ["Email"],
    sender: "Admin EWS",
    status: "Gagal",
  },
];

export interface SensorThresholdSetting {
  sensorId: string;
  normalMaxCm: number;
  warningMinCm: number;
  warningMaxCm: number;
  dangerMinCm: number;
  rainLightMax: number;
  rainModerateMax: number;
  rainHeavyMin: number;
  autoBroadcast: boolean;
}

export const mockSensorThresholds: SensorThresholdSetting[] = [
  {
    sensorId: "SEN-01",
    normalMaxCm: 150,
    warningMinCm: 151,
    warningMaxCm: 220,
    dangerMinCm: 221,
    rainLightMax: 5,
    rainModerateMax: 20,
    rainHeavyMin: 21,
    autoBroadcast: false,
  },
  {
    sensorId: "SEN-02",
    normalMaxCm: 140,
    warningMinCm: 141,
    warningMaxCm: 200,
    dangerMinCm: 201,
    rainLightMax: 6,
    rainModerateMax: 22,
    rainHeavyMin: 23,
    autoBroadcast: true,
  },
  {
    sensorId: "SEN-03",
    normalMaxCm: 130,
    warningMinCm: 131,
    warningMaxCm: 190,
    dangerMinCm: 191,
    rainLightMax: 4,
    rainModerateMax: 18,
    rainHeavyMin: 19,
    autoBroadcast: true,
  },
];

const historyBase = new Date("2026-03-15T00:00:00.000Z").getTime();

export const mockWaterLevelHistory: WaterLevelPoint[] = Array.from({ length: 48 }, (_, index) => {
  const sensor = mockSensors[index % mockSensors.length];
  const timestamp = new Date(historyBase + index * 30 * 60 * 1000);

  const levelShift = sensor.id === "SEN-03" ? 55 : sensor.id === "SEN-02" ? 25 : 0;
  const rainfallShift = sensor.id === "SEN-03" ? 6 : sensor.id === "SEN-02" ? 3 : 1;

  return {
    timestamp: timestamp.toISOString(),
    levelCm: Math.max(95, sensor.lastLevelCm - 18 + (index % 7) * 6 + levelShift),
    rainfallMm: Math.max(0, 2 + (index % 6) * 3 + rainfallShift),
    sensorId: sensor.id,
  };
});
