// src/components/dashboard/KPIScorecard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KPIScorecardProps {
  data: {
    brandingFulfillment: number;
    mileageBalance: number;
    shuntingMoves: number;
    riskAlerts: number;
  };
  title?: string; // Add title prop
}

export default function KPIScorecard({ data, title = "KPI Scorecard" }: KPIScorecardProps) { // Set default title
  return (
    <Card className="bg-slate-800 border-slate-700 text-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title} {/* Use the title prop here */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold" style={{ color: '#22c55e' }}>{data.brandingFulfillment}%</span>
            <span className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Branding Fulfillment</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold" style={{ color: '#f59e0b' }}>{data.mileageBalance}/100</span>
            <span className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Mileage Balance</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold" style={{ color: '#ef4444' }}>{data.shuntingMoves}</span>
            <span className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Shunting Moves</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold" style={{ color: '#ef4444' }}>{data.riskAlerts}</span>
            <span className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Risk Alerts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}