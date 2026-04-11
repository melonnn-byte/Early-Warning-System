import { Card } from "@/components/ui/Card";
import { getRainfallCategory } from "@/lib/utils";

interface RainfallCardProps {
  rainfallMm: number;
}

export function RainfallCard({ rainfallMm }: RainfallCardProps) {
  const category = getRainfallCategory(rainfallMm);

  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-900">Curah Hujan Terkini</h3>
      <p className="mt-3 text-2xl font-bold text-cyan-600">{rainfallMm} mm/jam</p>
      <p className="text-sm text-slate-500">
        Intensitas: {category.label} ({category.detail})
      </p>
    </Card>
  );
}
