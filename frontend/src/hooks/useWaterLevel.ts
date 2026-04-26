"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import type { Sensor } from "@/types/sensor";
import type { LiveWaterLevel, WaterLevelPoint } from "@/types/water-level";

interface UseWaterLevelOptions {
  sensorId?: string;
  refreshMs?: number;
}

const DEFAULT_REFRESH_MS = 15_000;
const HISTORY_HOURS = 7 * 24;

interface ApiSensor {
  sensorId: string;
  name: string;
  latitude: number;
  longitude: number;
  batteryLevel: number | null;
  connectivity: string;
  lastActiveAt: string | null;
}

interface ApiWaterCurrent {
  sensorId: string;
  sensorName: string;
  waterLevel: number;
  status: string;
  recordedAt: string;
}

interface ApiRainfallCurrent {
  sensorId: string;
  rainfall: number;
}

interface ApiWaterHistory {
  sensorId: string;
  waterLevel: number;
  recordedAt: string;
}

function mapStatus(status?: string) {
  if (status === "DANGER") return "danger" as const;
  if (status === "WARNING") return "alert" as const;
  return "safe" as const;
}

function mapConnectivity(connectivity?: string) {
  return connectivity === "ONLINE" ? "online" : "offline";
}

function toIsoNow() {
  return new Date().toISOString();
}

export function useWaterLevel(options: UseWaterLevelOptions = {}) {
  const { sensorId, refreshMs = DEFAULT_REFRESH_MS } = options;
  const [historyBySensor, setHistoryBySensor] = useState<Record<string, WaterLevelPoint[]>>({});
  const [latestBySensor, setLatestBySensor] = useState<Record<string, LiveWaterLevel>>({});
  const [sensorsSnapshot, setSensorsSnapshot] = useState<Sensor[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadCurrent = async () => {
      try {
        const [sensorsResp, waterResp, rainfallResp] = await Promise.all([
          api.get("/sensors"),
          api.get("/water-levels/current"),
          api.get("/rainfall/current"),
        ]);

        if (cancelled) {
          return;
        }

        const sensors = (sensorsResp.data?.data ?? []) as ApiSensor[];
        const waterRows = (waterResp.data?.data ?? []) as ApiWaterCurrent[];
        const rainfallRows = (rainfallResp.data?.data ?? []) as ApiRainfallCurrent[];

        const waterBySensorId = new Map(waterRows.map((row) => [row.sensorId, row]));
        const rainfallBySensorId = new Map(rainfallRows.map((row) => [row.sensorId, row]));

        const nextSensors: Sensor[] = sensors.map((sensor) => {
          const water = waterBySensorId.get(sensor.sensorId);
          return {
            id: sensor.sensorId,
            name: sensor.name,
            riverName: sensor.name,
            latitude: sensor.latitude,
            longitude: sensor.longitude,
            connectivity: mapConnectivity(sensor.connectivity),
            batteryPercent: sensor.batteryLevel ?? 0,
            lastLevelCm: water?.waterLevel ?? 0,
            status: mapStatus(water?.status),
            updatedAt: water?.recordedAt ?? sensor.lastActiveAt ?? toIsoNow(),
          };
        });

        setSensorsSnapshot(nextSensors);

        const nextLiveBySensor = nextSensors.reduce<Record<string, LiveWaterLevel>>((acc, sensor) => {
          const rain = rainfallBySensorId.get(sensor.id);
          acc[sensor.id] = {
            sensorId: sensor.id,
            sensorName: sensor.name,
            levelCm: sensor.lastLevelCm,
            rainfallMm: rain?.rainfall ?? 0,
            status: sensor.status,
            updatedAt: sensor.updatedAt,
          };
          return acc;
        }, {});

        setLatestBySensor(nextLiveBySensor);
      } catch {
        if (!cancelled) {
          setSensorsSnapshot([]);
          setLatestBySensor({});
        }
      }
    };

    void loadCurrent();
    const timer = window.setInterval(() => {
      void loadCurrent();
    }, refreshMs);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [refreshMs]);

  useEffect(() => {
    const activeId = sensorId && latestBySensor[sensorId] ? sensorId : sensorsSnapshot[0]?.id;

    if (!activeId) {
      return;
    }

    let cancelled = false;
    const loadHistory = async () => {
      try {
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - HISTORY_HOURS * 60 * 60 * 1000);

        const historyResp = await api.get("/water-levels/history", {
          params: {
            sensorId: activeId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            interval: "hourly",
          },
        });

        if (cancelled) {
          return;
        }

        const rows = (historyResp.data?.data ?? []) as ApiWaterHistory[];
        const latestRain = latestBySensor[activeId]?.rainfallMm ?? 0;

        const mapped: WaterLevelPoint[] = rows.map((row) => {
          const levelCm = row.waterLevel;
          const rainfallMm = latestRain;
          return {
            timestamp: row.recordedAt,
            levelCm,
            rainfallMm,
            flowSpeedMs: Number((Math.max(0.3, levelCm / 220 + rainfallMm / 35)).toFixed(2)),
            sensorId: row.sensorId,
          };
        });

        setHistoryBySensor((prev) => ({
          ...prev,
          [activeId]: mapped,
        }));
      } catch {
        if (!cancelled) {
          setHistoryBySensor((prev) => ({ ...prev, [activeId]: [] }));
        }
      }
    };

    void loadHistory();
    return () => {
      cancelled = true;
    };
  }, [sensorId, sensorsSnapshot, latestBySensor]);

  const activeSensorId = sensorId && latestBySensor[sensorId] ? sensorId : sensorsSnapshot[0]?.id ?? "";

  const latest = latestBySensor[activeSensorId] ?? {
    sensorId: activeSensorId,
    sensorName: "Sensor",
    levelCm: 0,
    rainfallMm: 0,
    status: "safe",
    updatedAt: new Date().toISOString(),
  };

  const history = historyBySensor[activeSensorId] ?? [];

  const liveBySensor = useMemo(() => {
    return sensorsSnapshot.map((sensor) => {
      const live = latestBySensor[sensor.id];
      return {
        sensorId: sensor.id,
        sensorName: sensor.name,
        levelCm: live?.levelCm ?? sensor.lastLevelCm,
        rainfallMm: live?.rainfallMm ?? 0,
        status: live?.status ?? sensor.status,
        updatedAt: live?.updatedAt ?? sensor.updatedAt,
      } as LiveWaterLevel;
    });
  }, [latestBySensor, sensorsSnapshot]);

  return { latest, history, sensorsSnapshot, liveBySensor };
}
