import { AdminPageSkeleton } from "@/components/ui/AdminPageSkeleton";

export default function AdminDashboardLoading() {
  return <AdminPageSkeleton statCount={6} showInfoStrip showMapCard tableRows={5} />;
}
