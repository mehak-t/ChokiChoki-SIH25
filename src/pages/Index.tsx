import { Sidebar } from "@/components/Sidebar";
import { KPICards } from "@/components/KPICards";
import { TrainStatusTable } from "@/components/TrainStatusTable";
import { OptimizationPanel } from "@/components/OptimizationPanel";
import { StatusPieChart, MileageBarChart } from "@/components/Charts";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Train Induction Planning Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor fleet status and optimize train operations
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Dashboard Area */}
          <div className="flex-1 p-6 space-y-6 overflow-auto">
            {/* KPI Cards */}
            <KPICards />

            {/* Train Status Table */}
            <TrainStatusTable />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatusPieChart />
              <MileageBarChart />
            </div>
          </div>

          {/* Right Side Optimization Panel */}
          <div className="w-80 p-6 border-l border-border bg-muted/30">
            <OptimizationPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;