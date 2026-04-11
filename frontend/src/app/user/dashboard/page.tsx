import { UserRealtimeDashboard } from "@/components/dashboard/UserRealtimeDashboard";

export default function UserDashboardPage() {
  return (
    <UserRealtimeDashboard
      roleLabel="User Dashboard"
      headline="Monitoring Ketinggian Air Real-Time"
      subtitle="Data diperbarui berkala per sensor untuk membantu kesiapsiagaan banjir."
    />
  );
}
