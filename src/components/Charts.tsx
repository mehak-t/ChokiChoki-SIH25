import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const statusData = [
  { name: "Ready", value: 142, color: "hsl(var(--success))" },
  { name: "Maintenance", value: 18, color: "hsl(var(--warning))" },
  { name: "Standby", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Out of Service", value: 8, color: "hsl(var(--destructive))" },
];

const mileageData = [
  { range: "0-50K", count: 23 },
  { range: "50-100K", count: 45 },
  { range: "100-150K", count: 67 },
  { range: "150-200K", count: 34 },
  { range: "200K+", count: 11 },
];

export function StatusPieChart() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Train Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} trains`, 'Count']}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function MileageBarChart() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Mileage Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mileageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="range" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              formatter={(value) => [`${value} trains`, 'Count']}
              labelFormatter={(label) => `Range: ${label} miles`}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Bar 
              dataKey="count" 
              fill="hsl(var(--accent))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}