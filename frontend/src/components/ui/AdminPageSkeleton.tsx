import { Card } from "@/components/ui/Card";

interface AdminPageSkeletonProps {
  statCount?: number;
  showHero?: boolean;
  showInfoStrip?: boolean;
  showMapCard?: boolean;
  showCharts?: boolean;
  tableRows?: number;
  formRows?: number;
}

function SkeletonBar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/90 ${className}`} aria-hidden="true" />;
}

export function AdminPageSkeleton({
  statCount = 3,
  showHero = true,
  showInfoStrip = false,
  showMapCard = false,
  showCharts = false,
  tableRows = 5,
  formRows = 0,
}: AdminPageSkeletonProps) {
  return (
    <main className="space-y-6" aria-busy="true" aria-live="polite">
      {showHero && (
        <Card className="relative overflow-hidden border-blue-500/30 bg-linear-to-r from-blue-600 via-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-900/20">
          <div className="absolute -right-2 top-4 h-24 w-24 rounded-3xl border border-white/20 bg-white/10" />
          <div className="relative z-10 space-y-3">
            <SkeletonBar className="h-7 w-56 bg-white/30" />
            <SkeletonBar className="h-4 w-full max-w-2xl bg-white/25" />
            <SkeletonBar className="h-4 w-80 bg-white/25" />
          </div>
        </Card>
      )}

      {showInfoStrip && (
        <Card className="border-slate-200 bg-white py-4">
          <div className="flex justify-center">
            <SkeletonBar className="h-6 w-72" />
          </div>
        </Card>
      )}

      {statCount > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: statCount }).map((_, index) => (
            <Card key={`stat-${index}`} className="border-slate-200 bg-white/95 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-2.5">
                  <SkeletonBar className="h-4 w-28" />
                  <SkeletonBar className="h-9 w-20" />
                  <SkeletonBar className="h-3 w-36" />
                </div>
                <SkeletonBar className="h-16 w-16 rounded-2xl" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {formRows > 0 && (
        <Card className="border-slate-200 bg-white/95 shadow-md shadow-slate-200/40">
          <div className="space-y-4">
            <SkeletonBar className="h-6 w-64" />
            <SkeletonBar className="h-4 w-96 max-w-full" />
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: formRows }).map((_, index) => (
                <SkeletonBar key={`form-${index}`} className="h-11 w-full" />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <SkeletonBar className="h-10 w-28" />
              <SkeletonBar className="h-10 w-32" />
            </div>
          </div>
        </Card>
      )}

      {showCharts && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="border-slate-200 bg-white/95 shadow-sm">
            <SkeletonBar className="h-6 w-40" />
            <SkeletonBar className="mt-4 h-64 w-full rounded-xl" />
          </Card>
          <Card className="border-slate-200 bg-white/95 shadow-sm">
            <SkeletonBar className="h-6 w-40" />
            <SkeletonBar className="mt-4 h-64 w-full rounded-xl" />
          </Card>
        </div>
      )}

      {showMapCard && (
        <Card className="border-slate-200 bg-white/95 shadow-md shadow-slate-200/40">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="space-y-2">
              <SkeletonBar className="h-6 w-52" />
              <SkeletonBar className="h-4 w-96 max-w-full" />
            </div>
            <SkeletonBar className="h-7 w-28 rounded-full" />
          </div>
          <SkeletonBar className="h-84 w-full rounded-xl" />
        </Card>
      )}

      {tableRows > 0 && (
        <Card className="overflow-x-auto border-slate-200 bg-white/95 shadow-md shadow-slate-200/40">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="space-y-2">
              <SkeletonBar className="h-6 w-48" />
              <SkeletonBar className="h-4 w-80 max-w-full" />
            </div>
            <SkeletonBar className="h-8 w-24 rounded-full" />
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-3">
              <SkeletonBar className="h-4 w-full" />
              <SkeletonBar className="h-4 w-full" />
              <SkeletonBar className="h-4 w-full" />
              <SkeletonBar className="h-4 w-full" />
            </div>
            {Array.from({ length: tableRows }).map((_, index) => (
              <div key={`row-${index}`} className="grid grid-cols-4 gap-3">
                <SkeletonBar className="h-9 w-full" />
                <SkeletonBar className="h-9 w-full" />
                <SkeletonBar className="h-9 w-full" />
                <SkeletonBar className="h-9 w-full" />
              </div>
            ))}
          </div>
        </Card>
      )}
    </main>
  );
}
