"use client";

import { UserRealtimeDashboard } from "@/components/dashboard/UserRealtimeDashboard";
import { useLanguage } from "@/lib/LanguageContext";

export default function UserDashboardPage() {
  const { t } = useLanguage();

  return (
    <UserRealtimeDashboard
      roleLabel={t("nav.dashboard")}
      headline={t("dashboard.title")}
      subtitle={t("dashboard.subtitle")}
    />
  );
}
