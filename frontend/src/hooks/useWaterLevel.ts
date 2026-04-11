"use client";

import { useEffect, useMemo, useState } from "react";
import { mockSensors } from "@/constants";
import type { Sensor } from "@/types/sensor";
import type { LiveWaterLevel, WaterLevelPoint } from "@/types/water-level";
import { getStatusFromLevel } from "@/lib/utils";

interface UseWaterLevelOptions {
  sensorId?: string;
  autoSimulate?: boolean;
  refreshMs?: number;
}

const HISTORY_LIMIT = 7 * 24 * 2;
const DEFAULT_SENSOR_ID = mockSensors[0]?.id ?? "SEN-01";
const INITIAL_BASE_TIME = Date.now();

function buildInitialPoint(sensor: Sensor, index: number, offset: number): WaterLevelPoint {
  const distance = 7 * 24 - 1 - index;
  const ts = INITIAL_BASE_TIME - distance * 60 * 60 * 1000;
  const wave = Math.sin((index + offset) / 8) * 15;
  const rainWave = Math.abs(Math.cos((index + offset) / 10)) * 6;
  const flowWave = Math.abs(Math.sin((index + offset) / 7)) * 1.2;
  const baseLevel = sensor.lastLevelCm + (sensor.id === "SEN-03" ? 22 : sensor.id === "SEN-02" ? 8 : 0);

  return {
    timestamp: new Date(ts).toISOString(),
    levelCm: Math.round(Math.max(70, baseLevel - 15 + wave + (index % 4))),
    rainfallMm: Math.round(Math.max(0, 3 + rainWave + (index % 3))),
    flowSpeedMs: Number((0.65 + flowWave + (index % 4) * 0.07).toFixed(2)),
    sensorId: sensor.id,
  };
}

function buildInitialHistoryBySensor() {
  return mockSensors.reduce<Record<string, WaterLevelPoint[]>>((acc, sensor, sensorIndex) => {
    acc[sensor.id] = Array.from({ length: 7 * 24 }).map((_, index) => buildInitialPoint(sensor, index, sensorIndex * 6));
    return acc;
  }, {});
}

function buildInitialLatestBySensor(historyBySensor: Record<string, WaterLevelPoint[]>) {
  return mockSensors.reduce<Record<string, LiveWaterLevel>>((acc, sensor) => {
    const latestPoint = historyBySensor[sensor.id]?.at(-1);
    const levelCm = latestPoint?.levelCm ?? sensor.lastLevelCm;
    const rainfallMm = latestPoint?.rainfallMm ?? 0;

    acc[sensor.id] = {
      sensorId: sensor.id,
      sensorName: sensor.name,
      levelCm,
      rainfallMm,
      status: getStatusFromLevel(levelCm),
      updatedAt: latestPoint?.timestamp ?? new Date(INITIAL_BASE_TIME).toISOString(),
    };

    return acc;
  }, {});
}

function createInitialWaterState() {
  const historyBySensor = buildInitialHistoryBySensor();
  const latestBySensor = buildInitialLatestBySensor(historyBySensor);

  return { historyBySensor, latestBySensor };
}

export function useWaterLevel(options: UseWaterLevelOptions = {}) {
  const { sensorId, autoSimulate = true, refreshMs = 7000 } = options;
  const initialState = useMemo(() => createInitialWaterState(), []);
  const [historyBySensor, setHistoryBySensor] = useState<Record<string, WaterLevelPoint[]>>(initialState.historyBySensor);
  const [latestBySensor, setLatestBySensor] = useState<Record<string, LiveWaterLevel>>(initialState.latestBySensor);

  useEffect(() => {
    if (!autoSimulate) {
      return;
    }

    const timer = setInterval(() => {
      setLatestBySensor((prev) => {
        const next: Record<string, LiveWaterLevel> = { ...prev };

        mockSensors.forEach((sensor, index) => {
          const prevSensor = prev[sensor.id] ?? {
            sensorId: sensor.id,
            sensorName: sensor.name,
            levelCm: sensor.lastLevelCm,
            rainfallMm: 4,
            status: getStatusFromLevel(sensor.lastLevelCm),
            updatedAt: new Date().toISOString(),
          };

          const drift = Math.floor(Math.random() * 8) - 2;
          const nextLevel = Math.max(70, prevSensor.levelCm + drift + (index === 2 ? 1 : 0));
          const nextRainfall = Math.max(0, prevSensor.rainfallMm + Math.floor(Math.random() * 4) - 1);
          const nextUpdatedAt = new Date().toISOString();

          next[sensor.id] = {
            ...prevSensor,
            levelCm: nextLevel,
            rainfallMm: nextRainfall,
            status: getStatusFromLevel(nextLevel),
            updatedAt: nextUpdatedAt,
          };
        });

        setHistoryBySensor((prevHistory) => {
          const updatedHistory = { ...prevHistory };

          Object.values(next).forEach((live) => {
            const nextPoint: WaterLevelPoint = {
              timestamp: live.updatedAt,
              levelCm: live.levelCm,
              rainfallMm: live.rainfallMm,
              flowSpeedMs: Number((Math.max(0.3, live.levelCm / 220 + live.rainfallMm / 35)).toFixed(2)),
              sensorId: live.sensorId,
            };

            const current = updatedHistory[live.sensorId] ?? [];
            updatedHistory[live.sensorId] = [...current, nextPoint].slice(-HISTORY_LIMIT);
          });

          return updatedHistory;
        });

        return next;
      });
    }, refreshMs);

    return () => clearInterval(timer);
  }, [autoSimulate, refreshMs]);

  const activeSensorId = sensorId && latestBySensor[sensorId] ? sensorId : DEFAULT_SENSOR_ID;

  const latest = latestBySensor[activeSensorId] ?? {
    sensorId: activeSensorId,
    sensorName: "Sensor",
    levelCm: 0,
    rainfallMm: 0,
    status: "safe",
    updatedAt: new Date().toISOString(),
  };

  const history = historyBySensor[activeSensorId] ?? [];

  const sensorsSnapshot = useMemo<Sensor[]>(() => {
    return mockSensors.map((sensor) => {
      const live = latestBySensor[sensor.id];
      return {
        ...sensor,
        lastLevelCm: live?.levelCm ?? sensor.lastLevelCm,
        status: live?.status ?? sensor.status,
        updatedAt: live?.updatedAt ?? sensor.updatedAt,
      };
    });
  }, [latestBySensor]);

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
