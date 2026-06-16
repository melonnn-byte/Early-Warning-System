import type { ThresholdConfig, WaterStatus } from "@/types/water-level";

const defaultThreshold: ThresholdConfig = {
  safeMaxCm: 149,
  warningMaxCm: 174,
  alertMaxCm: 199,
  dangerMinCm: 200,
};

export interface RainfallCategory {
  label: string;
  detail: string;
  color: string;
}

export type UserRiskLevel = "normal" | "yellow" | "orange" | "red";

export const SENSOR_OFFLINE_THRESHOLD_MS = 3 * 60 * 1000;

function toTimestamp(value: string | Date | null | undefined) {
  if (!value) return null;

  const parsed = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isNaN(parsed) ? null : parsed;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatTimestamp(date: string, locale: 'id' | 'en' = 'id') {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return locale === 'en' ? "Invalid time" : "Waktu tidak valid";
  }

  return parsed.toLocaleString(locale === 'en' ? "en-US" : "id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  });
}

export function isSensorOffline(
  lastSeenAt: string | Date | null | undefined,
  nowMs = Date.now(),
  thresholdMs = SENSOR_OFFLINE_THRESHOLD_MS,
) {
  const parsed = toTimestamp(lastSeenAt);
  if (parsed === null) return true;

  return nowMs - parsed > thresholdMs;
}

export function isSensorOnline(
  lastSeenAt: string | Date | null | undefined,
  nowMs = Date.now(),
  thresholdMs = SENSOR_OFFLINE_THRESHOLD_MS,
) {
  return !isSensorOffline(lastSeenAt, nowMs, thresholdMs);
}

export function formatRelativeTime(dateValue: string | Date | null | undefined, nowMs = Date.now(), lang: 'id' | 'en' = 'id') {
  const parsed = toTimestamp(dateValue);
  if (parsed === null) return lang === 'en' ? "No data ingested" : "Belum ada ingest";

  const diffSeconds = Math.round((parsed - nowMs) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  if (absSeconds < 45) {
    if (lang === 'en') {
      return diffSeconds <= 0 ? "a few seconds ago" : "in a few seconds";
    }
    return diffSeconds <= 0 ? "beberapa detik yang lalu" : "dalam beberapa detik";
  }

  const formatter = new Intl.RelativeTimeFormat(lang === 'en' ? "en-US" : "id-ID", { numeric: "auto" });
  const diffMinutes = Math.round(diffSeconds / 60);
  if (Math.abs(diffMinutes) < 60) return formatter.format(diffMinutes, "minute");

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return formatter.format(diffHours, "hour");

  return formatter.format(Math.round(diffHours / 24), "day");
}

export function getStatusFromLevel(
  levelCm: number,
  threshold: ThresholdConfig = defaultThreshold,
): WaterStatus {
  if (levelCm >= threshold.dangerMinCm) return "danger";
  if (levelCm > threshold.safeMaxCm) return "alert";
  return "safe";
}

export function getRiskLevelFromLevel(levelCm: number): UserRiskLevel {
  if (levelCm >= 200) {
    return "red";
  }

  if (levelCm >= 180) {
    return "orange";
  }

  if (levelCm >= 150) {
    return "yellow";
  }

  return "normal";
}

export function getRainfallCategory(rainfallMmPerHour: number, lang: 'id' | 'en' = 'id'): RainfallCategory {
  if (rainfallMmPerHour <= 5) {
    return {
      label: lang === 'en' ? "Light" : "Ringan",
      detail: lang === 'en' ? "0-5 mm/hr" : "0-5 mm/jam",
      color: "text-emerald-700 bg-emerald-100"
    };
  }

  if (rainfallMmPerHour <= 20) {
    return {
      label: lang === 'en' ? "Moderate" : "Sedang",
      detail: lang === 'en' ? ">5-20 mm/hr" : ">5-20 mm/jam",
      color: "text-amber-700 bg-amber-100"
    };
  }

  return {
    label: lang === 'en' ? "Heavy" : "Lebat",
    detail: lang === 'en' ? ">20 mm/hr" : ">20 mm/jam",
    color: "text-rose-700 bg-rose-100"
  };
}
