interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
}

interface StatusPieChartProps {
  data: ChartDataPoint[];
}

export default function StatusPieChart({ data }: StatusPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div 
      className="card-radius card-shadow p-6"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Status Distribution
      </h3>
      
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -data.slice(0, index).reduce((sum, prev) => sum + (prev.value / total) * 100, 0);
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="15.9155"
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
        </div>
      </div>
      
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span 
                className="text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.name}
              </span>
            </div>
            <span 
              className="text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}