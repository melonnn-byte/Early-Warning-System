"use client";

import { UserRealtimeDashboard } from "@/components/dashboard/UserRealtimeDashboard";
import { useLanguage } from "@/lib/LanguageContext";

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <UserRealtimeDashboard
      headline={t("dashboard.title")}
      subtitle={t("dashboard.subtitle")}
    />
  );
}
