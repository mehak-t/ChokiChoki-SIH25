// src/components/Dashboard.tsx
"use client";

import { useState, useEffect } from 'react';
import { Sun, Moon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavigationSidebar from '@/components/NavigationSidebar';
import KPIScorecard from '@/components/dashboard/KPIScorecard';
import StatusPieChart from '@/components/dashboard/StatusPieChart';
import WhatIfSimulator from '@/components/dashboard/WhatIfSimulator';
import RankedListTable from '@/components/dashboard/RankedListTable';
import RankingModal from '@/components/dashboard/RankingModal';
import { BackendStatus } from '@/components/BackendStatus';
import { apiService, TrainScheduleResponse } from '@/services/api';
import { initialPlan, recalculatedPlan, kpiData, chartData } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('initial');
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [aiScheduleData, setAiScheduleData] = useState<TrainScheduleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadAiSchedule = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Dashboard: Loading AI schedule...');
        
        // Try to load AI schedule with a reasonable timeout (15 seconds)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('AI schedule loading timed out after 15 seconds')), 15000)
        );
        
        const schedule = await Promise.race([
          apiService.getAiEnhancedSchedule(),
          timeoutPromise
        ]) as TrainScheduleResponse[];
        
        console.log('✅ Dashboard: AI schedule loaded successfully!', schedule.length, 'trains');
        console.log('📊 Sample train data:', schedule[0]);
        
        // IMPORTANT: Make sure we're setting the state correctly
        if (schedule && Array.isArray(schedule) && schedule.length > 0) {
          console.log('🎯 Setting aiScheduleData with', schedule.length, 'trains');
          console.log('🔍 First train structure check:', {
            hasAssetId: !!schedule[0].asset_id,
            hasAssetNum: !!schedule[0].asset_num,
            hasFinalRiskScore: schedule[0].final_risk_score !== undefined,
            hasPriorityLevel: !!schedule[0].priority_level,
            hasRiskFactors: Array.isArray(schedule[0].risk_factors)
          });
          setAiScheduleData([...schedule]); // Create a copy to avoid reference issues
          setError(null); // Clear any previous errors
        } else {
          console.warn('⚠️ Invalid schedule data received:', schedule);
          throw new Error('No valid schedule data received');
        }
      } catch (err) {
        console.error('❌ Dashboard: Failed to load AI schedule:', err);
        setError(err instanceof Error ? err.message : 'Failed to load schedule');
        // DON'T fall back to empty array - let it use mock data
        console.log('📋 Dashboard: Will use mock data as fallback');
      } finally {
        console.log('🏁 Dashboard: Loading complete, setting loading to false');
        setLoading(false);
      }
    };

    loadAiSchedule();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark');
  };

  const handleLogout = () => {
    console.log("User logging out...");
    navigate('/login');
  };

  const retryLoadSchedule = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Retry timed out after 15 seconds')), 15000)
      );
      
      const schedule = await Promise.race([
        apiService.getAiEnhancedSchedule(),
        timeoutPromise
      ]) as TrainScheduleResponse[];
      
      setAiScheduleData(schedule);
    } catch (err) {
      console.error('Retry failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to load schedule');
      setAiScheduleData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async (excludedTrains: string[], brandingImportance: number) => {
    setCurrentPlan('recalculated');
    // TODO: Implement recalculation with backend
  };

  // Convert AI schedule data to dashboard format
  const convertAiDataToDashboard = (aiData: TrainScheduleResponse[]) => {
    console.log('🔄 convertAiDataToDashboard: Converting', aiData.length, 'trains');
    console.log('🔍 Sample input data:', aiData[0]);
    
    try {
      const converted = aiData.map((train, index) => {
        const result = {
          id: train.asset_num || train.asset_id,
          rank: index + 1,
          status: train.priority_level === 'HIGH' ? 'Ready to Run' : 
                   train.priority_level === 'MEDIUM' ? 'On Standby' : 'Hold Back',
          reason: train.ai_explanation?.summary || 'AI analysis completed',
          alerts: train.risk_factors?.join(', ') || 'No alerts',
          scores: {
            final: Math.round(train.final_risk_score * 100),
            mileage: Math.round((1 - train.current_mileage / 150000) * 50), // Normalize mileage score
            maintenanceFit: Math.round((1 - train.days_since_maint / 365) * 40), // Normalize maintenance score  
            brandingBalance: Math.round(Math.random() * 20), // TODO: Get real branding data
            crewAvailability: Math.round(Math.random() * 10) // TODO: Get real crew data
          },
          fitnessValidThru: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          jobCardStatus: train.priority_level === 'HIGH' ? 'Closed' : 'Open',
          brandingHours: Math.round(Math.random() * 40), // TODO: Get real branding hours
          mileage: train.current_mileage,
          aiExplanation: train.ai_explanation, // Add AI explanation for modal
          riskFactors: train.risk_factors
        };
        return result;
      });
      
      console.log('✅ convertAiDataToDashboard: Successfully converted', converted.length, 'trains');
      console.log('🔍 Sample output data:', converted[0]);
      return converted;
    } catch (error) {
      console.error('❌ convertAiDataToDashboard: Conversion failed:', error);
      throw error;
    }
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
    console.log('📊 getCurrentData called - loading:', loading, 'aiScheduleData.length:', aiScheduleData.length, 'currentPlan:', currentPlan);
    
    if (loading) {
      console.log('📋 getCurrentData: Still loading...');
      return [];
    }
    
    if (aiScheduleData.length > 0 && currentPlan === 'initial') {
      console.log('🤖 getCurrentData: Using AI data path with', aiScheduleData.length, 'trains');
      const converted = convertAiDataToDashboard(aiScheduleData);
      console.log('🤖 getCurrentData: Converted to', converted.length, 'dashboard trains');
      return converted;
    }
    
    const mockData = currentPlan === 'initial' ? initialPlan : recalculatedPlan;
    console.log('📋 getCurrentData: Using mock data path with', mockData.length, 'trains');
    return mockData;
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
                Morning Readiness Ranking — AI Enhanced
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Sorted by overall fitness score considering fitness, maintenance, branding, operational efficiency, crew availability, and route optimization.
              </p>
              {/* Debug Info */}
              <div className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                Debug: Loading={loading.toString()}, AI Data Length={aiScheduleData.length}, Error={error || 'none'}, Current Plan={currentPlan}
              </div>
              <div className="mt-2">
                <BackendStatus />
              </div>
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
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>Loading AI-enhanced schedule...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <div className="text-red-500 text-lg mb-2">⚠️ Failed to load AI schedule</div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{error}</p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Showing fallback data</p>
              <Button 
                onClick={retryLoadSchedule}
                className="button-radius"
                style={{
                  backgroundColor: '#00b8e6',
                  color: 'white'
                }}
              >
                Retry AI Schedule
              </Button>
            </div>
          )}

          {!loading && (
            <>
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
            </>
          )}
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