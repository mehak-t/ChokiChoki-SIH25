// src/components/dashboard/KPIScorecard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KPIScorecardProps {
  data: any;
  title?: string;
  isDarkMode: boolean; // Add this prop to control the theme
}

export default function KPIScorecard({ data, title = "KPI Average Scorecard", isDarkMode }: KPIScorecardProps) {
  const bgColor = isDarkMode ? 'bg-slate-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const borderColor = isDarkMode ? 'border-slate-700' : 'border-gray-200';
  const mutedTextColor = isDarkMode ? 'text-slate-400' : 'text-gray-500';

  return (
    <Card className={`flex flex-col h-full ${bgColor} ${textColor} border ${borderColor}`}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-green-500">{data.brandingFulfillment}%</span>
            <span className={`text-sm mt-1 ${mutedTextColor}`}>Branding Fulfillment</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-orange-500">{data.mileageBalance}/100</span>
            <span className={`text-sm mt-1 ${mutedTextColor}`}>Mileage Balance</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-red-500">{data.shuntingMoves}</span>
            <span className={`text-sm mt-1 ${mutedTextColor}`}>Shunting Moves</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-red-500">{data.riskAlerts}</span>
            <span className={`text-sm mt-1 ${mutedTextColor}`}>Risk Alerts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}