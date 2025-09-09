// src/components/Dashboard.tsx
"use client";

import { useState } from 'react';
import { Sun, Moon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavigationSidebar from '@/components/NavigationSidebar';
import KPIScorecard from '@/components/dashboard/KPIScorecard';
import StatusPieChart from '@/components/dashboard/StatusPieChart';
import WhatIfSimulator from '@/components/dashboard/WhatIfSimulator';
import RankedListTable from '@/components/dashboard/RankedListTable';
import RankingModal from '@/components/dashboard/RankingModal';
import { initialPlan, recalculatedPlan, kpiData, chartData } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('initial');
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark');
  };

  const handleLogout = () => {
    console.log("User logging out...");
    navigate('/login');
  };

  const handleRecalculate = (excludedTrains: string[], brandingImportance: number) => {
    setCurrentPlan('recalculated');
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Rank,Train ID,Status,Score,Reason\n"
      + getCurrentData().map(train =>
          `${train.rank},${train.id},${train.status},${train.scores.final},${train.reason}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "induction-plan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRowClick = (train: any) => {
    setSelectedTrain(train);
    setModalOpen(true);
  };

  const getCurrentData = () => {
    return currentPlan === 'initial' ? initialPlan : recalculatedPlan;
  };

  const getCurrentKPI = () => {
    return currentPlan === 'initial' ? kpiData.initial : kpiData.recalculated;
  };

  const getCurrentChartData = () => {
    return currentPlan === 'initial' ? chartData.initial : chartData.recalculated;
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Navigation Sidebar with all options */}
      <NavigationSidebar currentPage="/dashboard" onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-6 border-b"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)'
              }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Morning Readiness Ranking — 25 Trainsets
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Sorted by overall fitness score considering fitness, maintenance, branding, operational efficiency, crew availability, and route optimization.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="button-radius"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <Button
                onClick={handleExport}
                className="button-radius"
                style={{
                  backgroundColor: '#00b8e6', // Aqua blue
                  color: 'white'
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Plan
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Visual Summary Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* KPI Scorecard */}
            <div>
              <KPIScorecard data={getCurrentKPI()} isDarkMode={isDarkMode} />
            </div>

            {/* Status Pie Chart */}
            <div>
              <StatusPieChart data={getCurrentChartData().statusDistribution} isDarkMode={isDarkMode} />
            </div>

            {/* What-If Simulator */}
            <div>
              <WhatIfSimulator onRecalculate={handleRecalculate} isDarkMode={isDarkMode} />
            </div>
          </div>

          {/* Ranked List Table */}
          <RankedListTable
            data={getCurrentData()}
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      {/* Ranking Modal */}
      {modalOpen && selectedTrain && (
        <RankingModal
          train={selectedTrain}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}