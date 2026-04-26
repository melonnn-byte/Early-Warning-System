"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import type { UserNotificationItem } from "@/types/user-notification";

export const USER_NOTIFICATION_STORAGE_KEY = "ews_user_notifications_read_map";

interface ApiAlertItem {
  id: string;
  title: string;
  message: string;
  severity: "INFO" | "WARNING" | "DANGER";
  targetArea?: string | null;
  sentAt: string;
}

function parseReadMap(raw: string | null): Record<string, boolean> {
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function mapSeverityToRiskLevel(severity: ApiAlertItem["severity"]): UserNotificationItem["riskLevel"] {
  if (severity === "DANGER") {
    return "red";
  }

  if (severity === "WARNING") {
    return "orange";
  }

  return "yellow";
}

function mapSeverityToGuideHref(severity: ApiAlertItem["severity"]): string {
  if (severity === "DANGER") {
    return "/user/education#aksi-merah";
  }

  if (severity === "WARNING") {
    return "/user/education#aksi-oren";
  }

  return "/user/education#aksi-kuning";
}

export function useUserNotifications() {
  const [items, setItems] = useState<UserNotificationItem[]>([]);
  const [readMap, setReadMap] = useState<Record<string, boolean>>(() =>
    parseReadMap(localStorage.getItem(USER_NOTIFICATION_STORAGE_KEY)),
  );

  const loadNotifications = useCallback(async () => {
    try {
      const response = await api.get("/alerts/history", {
        params: { page: 1, limit: 100 },
      });

      const rows = (response.data?.data?.items ?? []) as ApiAlertItem[];

      const mapped: UserNotificationItem[] = rows.map((row) => {
        const riskLevel = mapSeverityToRiskLevel(row.severity);

        return {
          id: row.id,
          sensorId: row.targetArea || "WILAYAH",
          sensorName: row.targetArea || "Wilayah Umum",
          levelCm: 0,
          riskLevel,
          title: row.title,
          message: row.message,
          createdAt: row.sentAt,
          isRead: Boolean(readMap[row.id]),
          guideHref: mapSeverityToGuideHref(row.severity),
        };
      });

      setItems(mapped);
    } catch {
      setItems([]);
    }
  }, [readMap]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    localStorage.setItem(USER_NOTIFICATION_STORAGE_KEY, JSON.stringify(readMap));
  }, [readMap]);

  const unreadCount = useMemo(
    () => items.filter((item) => !item.isRead).length,
    [items],
  );

  const markAsRead = useCallback((id: string) => {
    setReadMap((prev) => ({ ...prev, [id]: true }));
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setReadMap((prev) => {
      const next = { ...prev };
      items.forEach((item) => {
        next[item.id] = true;
      });
      return next;
    });

    setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
  }, [items]);

  return {
    notifications: items,
    unreadCount,
    markAsRead,
    markAllAsRead,
    reload: loadNotifications,
  };
}
