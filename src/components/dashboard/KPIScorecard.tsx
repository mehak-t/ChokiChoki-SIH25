interface KPIData {
  brandingFulfillment: number;
  mileageBalance: number;
  shuntingMoves: number;
  riskAlerts: number;
}

interface KPIScorecardProps {
  data: KPIData;
}

export default function KPIScorecard({ data }: KPIScorecardProps) {
  const kpis = [
    {
      label: 'Branding Fulfillment',
      value: `${data.brandingFulfillment}%`,
      color: 'var(--status-green)'
    },
    {
      label: 'Mileage Balance',
      value: `${data.mileageBalance}/100`,
      color: 'var(--accent-orange)'
    },
    {
      label: 'Shunting Moves',
      value: data.shuntingMoves.toString(),
      color: 'var(--status-yellow)'
    },
    {
      label: 'Risk Alerts',
      value: data.riskAlerts.toString(),
      color: 'var(--status-red)'
    }
  ];

  return (
    <div 
      className="card-radius card-shadow p-6"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        KPI Scorecard
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="text-center">
            <div 
              className="text-2xl font-bold mb-1"
              style={{ color: kpi.color }}
            >
              {kpi.value}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              {kpi.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}