// src/components/dashboard/StatusPieChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface StatusPieChartProps {
    data: {
        name: string;
        value: number;
        color: string;
    }[];
    isDarkMode: boolean; // Add this prop
}

const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export default function StatusPieChart({ data, isDarkMode }: StatusPieChartProps) {
    const bgColor = isDarkMode ? 'bg-slate-800' : 'bg-white';
    const textColor = isDarkMode ? 'text-white' : 'text-black';
    const borderColor = isDarkMode ? 'border-slate-700' : 'border-gray-200';
    const mutedTextColor = isDarkMode ? 'text-slate-400' : 'text-gray-500';

    return (
        <Card className={`flex flex-col h-full ${bgColor} ${textColor} border ${borderColor}`}>
            <CardHeader>
                <CardTitle className="text-xl font-semibold">
                    Status Distribution
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
                <div className="flex-1 min-h-[120px] mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center space-x-4">
                    {data.map((entry, index) => (
                        <div key={index} className={`flex items-center space-x-1 text-sm ${mutedTextColor}`}>
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                            <span>{entry.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}