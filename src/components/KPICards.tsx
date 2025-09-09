import { Card, CardContent } from "@/components/ui/card";
import { Train, Wrench, Activity, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const kpiData = [
  {
    title: "Active Trains",
    value: "142",
    change: "+5.2%",
    icon: Train,
    color: "text-success",
  },
  {
    title: "In Maintenance",
    value: "18",
    change: "-2.1%",
    icon: Wrench,
    color: "text-warning",
  },
  {
    title: "Total Mileage",
    value: "2.4M",
    change: "+12.5%",
    icon: Activity,
    color: "text-accent",
  },
  {
    title: "Fleet Efficiency",
    value: "94.2%",
    change: "+1.8%",
    icon: TrendingUp,
    color: "text-success",
  },
];

export function KPICards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => (
        <Card
          key={index}
          className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn("p-2 rounded-lg bg-muted", kpi.color)}>
                  <kpi.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {kpi.value}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "text-sm font-medium",
                  kpi.change.startsWith("+") ? "text-success" : "text-destructive"
                )}
              >
                {kpi.change}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}