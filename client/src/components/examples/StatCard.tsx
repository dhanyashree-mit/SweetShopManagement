import StatCard from '../StatCard';
import { Package } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-8 bg-background">
      <div className="max-w-sm">
        <StatCard
          title="Total Products"
          value={156}
          icon={Package}
          description="Active in inventory"
          trend={{ value: 12, isPositive: true }}
        />
      </div>
    </div>
  );
}