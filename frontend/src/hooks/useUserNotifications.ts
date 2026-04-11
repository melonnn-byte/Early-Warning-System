"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { LiveWaterLevel } from "@/types/water-level";
import type { UserNotificationItem } from "@/types/user-notification";
import { getRiskLevelFromLevel, type UserRiskLevel } from "@/lib/utils";

export const USER_NOTIFICATION_STORAGE_KEY = "ews_user_notifications";
const SENSOR_RISK_STATE_KEY = "ews_user_sensor_risk_state";

const guideByRiskLevel: Record<Exclude<UserRiskLevel, "normal">, string> = {
  yellow: "/user/education#aksi-kuning",
  orange: "/user/education#aksi-oren",
  red: "/user/education#aksi-merah",
};

const riskLabel: Record<Exclude<UserRiskLevel, "normal">, string> = {
  yellow: "Kuning",
  orange: "Oren",
  red: "Merah",
};

const riskMessagePrefix: Record<Exclude<UserRiskLevel, "normal">, string> = {
  yellow: "Waspada dini. Mulai siapkan kebutuhan darurat.",
  orange: "Status siaga. Bersiap untuk evakuasi terarah.",
  red: "Status bahaya. Lakukan evakuasi segera.",
};

const dummyNotifications: UserNotificationItem[] = [
  {
    id: "DUMMY-NTF-YELLOW",
    sensorId: "SEN-02",
    sensorName: "Sensor Tengah",
    levelCm: 158,
    riskLevel: "yellow",
    title: "Peringatan Kuning • Sensor Tengah",
    message: "Waspada dini. Mulai siapkan kebutuhan darurat. Tinggi muka air saat ini 158 cm.",
    createdAt: "2026-04-11T08:15:00.000Z",
    isRead: false,
    guideHref: guideByRiskLevel.yellow,
  },
  {
    id: "DUMMY-NTF-ORANGE",
    sensorId: "SEN-03",
    sensorName: "Sensor Hilir",
    levelCm: 186,
    riskLevel: "orange",
    title: "Peringatan Oren • Sensor Hilir",
    message: "Status siaga. Bersiap untuk evakuasi terarah. Tinggi muka air saat ini 186 cm.",
    createdAt: "2026-04-11T08:22:00.000Z",
    isRead: false,
    guideHref: guideByRiskLevel.orange,
  },
  {
    id: "DUMMY-NTF-RED",
    sensorId: "SEN-03",
    sensorName: "Sensor Hilir",
    levelCm: 212,
    riskLevel: "red",
    title: "Peringatan Merah • Sensor Hilir",
    message: "Status bahaya. Lakukan evakuasi segera. Tinggi muka air saat ini 212 cm.",
    createdAt: "2026-04-11T08:30:00.000Z",
    isRead: false,
    guideHref: guideByRiskLevel.red,
  },
];

function parseNotifications(raw: string | null): UserNotificationItem[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as UserNotificationItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

function parseRiskState(raw: string | null): Record<string, UserRiskLevel> {
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, UserRiskLevel>;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
}

type NotificationAction =
  | { type: "replace"; items: UserNotificationItem[] }
  | { type: "append"; items: UserNotificationItem[] }
  | { type: "markOne"; id: string }
  | { type: "markAll" };

function notificationReducer(state: UserNotificationItem[], action: NotificationAction) {
  switch (action.type) {
    case "replace":
      return action.items;
    case "append":
      return [...action.items, ...state].slice(0, 100);
    case "markOne":
      return state.map((item) => (item.id === action.id ? { ...item, isRead: true } : item));
    case "markAll":
      return state.map((item) => ({ ...item, isRead: true }));
    default:
      return state;
  }
}

export function useUserNotifications(liveBySensor: LiveWaterLevel[]) {
  const [notifications, dispatch] = useReducer(notificationReducer, [] as UserNotificationItem[]);

  useEffect(() => {
    const stored = parseNotifications(localStorage.getItem(USER_NOTIFICATION_STORAGE_KEY));

    if (stored.length === 0) {
      localStorage.setItem(USER_NOTIFICATION_STORAGE_KEY, JSON.stringify(dummyNotifications));
      dispatch({ type: "replace", items: dummyNotifications });
      return;
    }

    dispatch({ type: "replace", items: stored });
  }, []);

  useEffect(() => {
    const previousRiskState = parseRiskState(localStorage.getItem(SENSOR_RISK_STATE_KEY));
    const nextRiskState = { ...previousRiskState };
    let createdNewNotification = false;

    const incomingNotifications: UserNotificationItem[] = [];

    liveBySensor.forEach((item) => {
      const nextRisk = getRiskLevelFromLevel(item.levelCm);
      const previousRisk = previousRiskState[item.sensorId] ?? "normal";

      nextRiskState[item.sensorId] = nextRisk;

      if (nextRisk === "normal") {
        return;
      }

      if (nextRisk !== previousRisk) {
        createdNewNotification = true;

        incomingNotifications.push({
          id: `NTF-${item.sensorId}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
          sensorId: item.sensorId,
          sensorName: item.sensorName,
          levelCm: item.levelCm,
          riskLevel: nextRisk,
          title: `Peringatan ${riskLabel[nextRisk]} • ${item.sensorName}`,
          message: `${riskMessagePrefix[nextRisk]} Tinggi muka air saat ini ${item.levelCm} cm.`,
          createdAt: new Date().toISOString(),
          isRead: false,
          guideHref: guideByRiskLevel[nextRisk],
        });
      }
    });

    localStorage.setItem(SENSOR_RISK_STATE_KEY, JSON.stringify(nextRiskState));

    if (!createdNewNotification) {
      return;
    }

    dispatch({ type: "append", items: incomingNotifications });
  }, [liveBySensor]);

  useEffect(() => {
    localStorage.setItem(USER_NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications]);

  const markAsRead = useCallback((id: string) => {
    dispatch({ type: "markOne", id });
  }, []);

  const markAllAsRead = useCallback(() => {
    dispatch({ type: "markAll" });
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
