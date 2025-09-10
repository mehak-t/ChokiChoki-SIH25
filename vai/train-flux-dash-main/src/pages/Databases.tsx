// src/pages/Databases.tsx
"use client";

import { useState, useEffect } from 'react';
import { FileText, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '@/components/NavigationSidebar';
import { apiService, DailyDataResponse } from '@/services/api';


export default function Databases() {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [dailyData, setDailyData] = useState<DailyDataResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDailyData();
        setDailyData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch daily data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleExpansion = (date: string) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Navigation Sidebar with all options */}
      <NavigationSidebar currentPage="/databases" onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <div className="p-6" style={{ color: 'var(--text-primary)' }}>
          <h1 className="text-3xl font-bold mb-6">Databases & Data History</h1>
          <p className="text-sm mt-1 mb-6" style={{ color: 'var(--text-secondary)' }}>
            This section provides a historical record of all metro system datasets, organized by date.
          </p>
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Loading data...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">⚠️ Error loading data</div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          )}
          <div className="space-y-4">
            {dailyData.map((day: DailyDataResponse) => (
              <div
                key={day.date}
                className="rounded-lg p-4 border"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpansion(day.date)}
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">{day.date}</h2>
                  </div>
                  <div>
                    {expandedDate === day.date ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </div>
                </div>
                {expandedDate === day.date && (
                  <div className="mt-4 space-y-2 pl-8">
                    {day.datasets.map((dataset: any) => (
                      <div
                        key={dataset.id}
                        className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-gray-700"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span>{dataset.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{dataset.size}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}