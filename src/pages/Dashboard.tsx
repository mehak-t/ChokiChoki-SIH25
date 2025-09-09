// src/components/Dashboard.tsx
"use client";

import { useState } from 'react';
import { Sun, Moon, Download, LogOut, LayoutDashboard, FileText, Calendar, Sliders, Settings, Database } from 'lucide-react'; // Add Database import
import { Button } from '@/components/ui/button';
import KPIScorecard from '@/components/dashboard/KPIScorecard';
import StatusPieChart from '@/components/dashboard/StatusPieChart';
import WhatIfSimulator from '@/components/dashboard/WhatIfSimulator';
import RankedListTable from '@/components/dashboard/RankedListTable';
import RankingModal from '@/components/dashboard/RankingModal';
import { initialPlan, recalculatedPlan, kpiData, chartData } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import logo from '/logo.jpg';

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
      {/* Sidebar Navigation */}
      <aside
          className="w-64 flex flex-col justify-between p-6 border-r"
          style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)'
          }}
      >
          <div className="space-y-6">
              {/* Logo and KMRL text */}
              <div className="flex items-center space-x-3">
                  <img src="/logo.jpg" alt="KMRL Logo" className="h-10 w-auto" />
                  <div className="text-2xl font-bold" style={{ color: '#00b8e6' }}>
                      KMRL
                  </div>
              </div>

              <nav className="space-y-2">
                  {/* Dashboard link */}
                  <a
                      href="/dashboard"
                      className="flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors"
                      style={{
                          backgroundColor: 'var(--bg-primary)',
                          color: '#00b8e6' // Aqua blue
                      }}
                  >
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                  </a>

                  {/* Reports link */}
                  <a
                      href="/reports"
                      className="flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors hover:bg-slate-700"
                      style={{ color: 'var(--text-primary)' }}
                  >
                      <FileText className="h-5 w-5" />
                      <span>Reports</span>
                  </a>

                  {/* Databases link - NEW */}
                  <a
                      href="/databases"
                      className="flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors hover:bg-slate-700"
                      style={{ color: 'var(--text-primary)' }}
                  >
                      <Database className="h-5 w-5" />
                      <span>Databases</span>
                  </a>
              </nav>
          </div>

          {/* Logout button at the bottom */}
          <div className="mt-auto">
              <Button
                  onClick={handleLogout}
                  className="w-full justify-start space-x-3 p-3 font-medium rounded-lg"
                  variant="ghost"
                  style={{ color: '#FF073A' }} // Neon red
              >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
              </Button>
          </div>
      </aside>

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