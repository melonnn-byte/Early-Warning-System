"use client";

import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { RainfallCard } from "@/components/dashboard/RainfallCard";
import { WaterLevelGauge } from "@/components/dashboard/WaterLevelGauge";
import { WaterLevelChart } from "@/components/charts/WaterLevelChart";
import { RainfallChart } from "@/components/charts/RainfallChart";
import { FlowSpeedChart } from "@/components/charts/FlowSpeedChart";
import { Card } from "@/components/ui/Card";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { useWaterLevel } from "@/hooks/useWaterLevel";
import { formatTimestamp } from "@/lib/utils";

export default function UserDashboardPage() {
  const { latest, history } = useWaterLevel();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">User Dashboard</p>
          <h1 className="text-2xl font-bold text-slate-900">Monitoring Ketinggian Air Real-Time</h1>
        </div>
        <StatusIndicator status={latest.status} />
      </div>

      <AlertBanner
        status={latest.status}
        message={`Update terakhir: ${formatTimestamp(latest.updatedAt)} dari ${latest.sensorName}`}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <WaterLevelGauge levelCm={latest.levelCm} />
        </Card>
        <div className="md:col-span-2">
          <RainfallCard rainfallMm={latest.rainfallMm} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <WaterLevelChart points={history} />
        </Card>
        <Card>
          <RainfallChart points={history} />
        </Card>
        <Card>
          <FlowSpeedChart points={history} />
        </Card>
      </div>
    </main>
  );
}
