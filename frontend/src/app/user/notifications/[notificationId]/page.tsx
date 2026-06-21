"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import api from "@/lib/api";
import { formatTimestamp } from "@/lib/utils";
import type { UserNotificationItem } from "@/types/user-notification";
import { useLanguage } from "@/lib/LanguageContext";

const levelBadgeClass = {
  yellow: "bg-amber-100 text-amber-700",
  orange: "bg-orange-100 text-orange-700",
  red: "bg-rose-100 text-rose-700",
} as const;

function mapSeverityToRiskLevel(severity: string): UserNotificationItem["riskLevel"] {
  if (severity === "DANGER") {
    return "red";
  }

  if (severity === "WARNING") {
    return "orange";
  }

  return "yellow";
}

function mapSeverityToGuideHref(severity: string): string {
  if (severity === "DANGER") {
    return "/user/education#aksi-merah";
  }

  if (severity === "WARNING") {
    return "/user/education#aksi-oren";
  }

  return "/user/education#aksi-kuning";
}

function isNotificationRead(sentAt: string, notificationReadAt: string | null, id: string, readNotificationIds: string[]) {
  if (readNotificationIds.includes(id)) {
    return true;
  }
  if (!notificationReadAt) {
    return false;
  }

  return new Date(sentAt).getTime() <= new Date(notificationReadAt).getTime();
}

export default function UserNotificationDetailPage() {
  const { t, language } = useLanguage();
  const params = useParams<{ notificationId: string | string[] }>();
  const notificationId = useMemo(() => {
    if (!params?.notificationId) {
      return "";
    }

    return Array.isArray(params.notificationId) ? params.notificationId[0] : params.notificationId;
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<UserNotificationItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const levelLabel = useMemo(() => ({
    yellow: t("userNotificationDetail.levels.yellow"),
    orange: t("userNotificationDetail.levels.orange"),
    red: t("userNotificationDetail.levels.red"),
  }), [t]);

  const levelQuickAction = useMemo(() => ({
    yellow: t("userNotificationDetail.actions.yellow"),
    orange: t("userNotificationDetail.actions.orange"),
    red: t("userNotificationDetail.actions.red"),
  }), [t]);

  useEffect(() => {
    let cancelled = false;

    const loadDetail = async () => {
      setErrorMessage(null);

      if (!notificationId) {
        if (!cancelled) {
          setNotification(null);
          setLoading(false);
        }
        return;
      }

      try {
        const [meResponse, response] = await Promise.all([
          api.get("/auth/me"),
          api.get(`/alerts/${notificationId}`),
        ]);

        const notificationReadAt = meResponse.data?.data?.notificationReadAt ?? null;
        const readNotificationIds = meResponse.data?.data?.readNotificationIds ?? [];
        const row = response.data?.data as {
          id: string;
          title: string;
          message: string;
          severity: string;
          channels?: string[];
          sourceType?: "ADMIN" | "SYSTEM";
          user?: {
            name?: string | null;
          } | null;
          targetArea?: string | null;
          sentAt: string;
        };

        if (!isNotificationRead(row.sentAt, notificationReadAt, row.id, readNotificationIds)) {
          await api.put(`/auth/notifications/${row.id}/read`);
          window.dispatchEvent(new CustomEvent("notificationsUpdated"));
        }

        const sourceType = row.sourceType ?? (row.user?.name ? "ADMIN" : "SYSTEM");

        const mapped: UserNotificationItem = {
          id: row.id,
          sensorId: row.targetArea || "WILAYAH",
          sensorName: row.targetArea || t("userNotificationDetail.generalArea"),
          levelCm: 0,
          riskLevel: mapSeverityToRiskLevel(row.severity),
          title: row.title,
          message: row.message,
          createdAt: row.sentAt,
          isRead: true,
          guideHref: mapSeverityToGuideHref(row.severity),
          senderName: row.user?.name?.trim() || (sourceType === "ADMIN" ? `${t("userNotificationDetail.sourceAdmin")} EWS` : `${t("userNotificationDetail.sourceSystem")} EWS`),
          sourceType,
          channels: row.channels ?? [],
        };

        if (!cancelled) {
          setNotification(mapped);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setNotification(null);
          setErrorMessage(t("userNotificationDetail.errorLoad"));
          setLoading(false);
        }
      }
    };

    void loadDetail();

    return () => {
      cancelled = true;
    };
  }, [notificationId, t]);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        <Card>
          <p className="text-sm text-slate-600">{t("userNotificationDetail.loading")}</p>
        </Card>
      </main>
    );
  }

  if (!notification) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        <Card>
          <h1 className="text-lg font-bold text-slate-900">{t("userNotificationDetail.notFoundTitle")}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {errorMessage ?? t("userNotificationDetail.notFoundDesc")}
          </p>
          <div className="mt-4">
            <Link
              href="/user/notifications"
              className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {t("userNotificationDetail.notFoundBtn")}
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href="/user/dashboard" className="hover:text-blue-700">{t("userNotificationDetail.breadcrumbDashboard")}</Link>
        <span>›</span>
        <Link href="/user/notifications" className="hover:text-blue-700">{t("userNotificationDetail.breadcrumbNotifications")}</Link>
        <span>›</span>
        <span className="text-slate-700">{t("userNotificationDetail.breadcrumbDetail")}</span>
      </div>

      <Card className={notification.isRead ? "border-slate-200" : "border-blue-200 bg-blue-50/30"}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{t("userNotificationDetail.tagLabel")}</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{notification.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{notification.message}</p>
          </div>

          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${levelBadgeClass[notification.riskLevel]}`}>
            {levelLabel[notification.riskLevel]}
          </span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-xs text-slate-500">{t("userNotificationDetail.sensorLabel")}</p>
            <p className="text-sm font-semibold text-slate-800">{notification.sensorName} ({notification.sensorId})</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-xs text-slate-500">{t("userNotificationDetail.waterLevelLabel")}</p>
            <p className="text-sm font-semibold text-slate-800">{notification.levelCm} cm</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-xs text-slate-500">{t("userNotificationDetail.timeLabel")}</p>
            <p className="text-sm font-semibold text-slate-800">{formatTimestamp(notification.createdAt, language)}</p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-xs text-slate-500">{t("userNotificationDetail.sourceLabel")}</p>
            <p className="text-sm font-semibold text-slate-800">
              {notification.sourceType === "ADMIN" ? t("userNotificationDetail.sourceAdmin") : t("userNotificationDetail.sourceSystem")} • {notification.senderName}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-xs text-slate-500">{t("userNotificationDetail.channelLabel")}</p>
            <p className="text-sm font-semibold text-slate-800">
              {notification.channels.length > 0 ? notification.channels.join(", ") : "push"}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <h2 className="text-sm font-semibold text-blue-900">{t("userNotificationDetail.recommendationTitle")}</h2>
          <p className="mt-1 text-sm text-blue-900/90">{levelQuickAction[notification.riskLevel]}</p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            href={notification.guideHref}
            className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {t("userNotificationDetail.btnGuides")}
          </Link>
          <Link
            href="/user/notifications"
            className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t("userNotificationDetail.btnBack")}
          </Link>
        </div>
      </Card>
    </main>
  );
}
