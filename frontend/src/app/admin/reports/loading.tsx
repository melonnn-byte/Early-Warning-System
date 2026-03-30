import { AdminPageSkeleton } from "@/components/ui/AdminPageSkeleton";

export default function AdminReportsLoading() {
  return <AdminPageSkeleton statCount={3} showCharts tableRows={5} />;
}
