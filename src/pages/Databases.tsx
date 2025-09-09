// src/components/Databases.tsx
"use client";

import { useState } from 'react';
import { FileText, Calendar, ChevronDown, ChevronRight } from 'lucide-react';

// This is a mock-up of daily data. In a real application, this would come from an API call
// that fetches data from a backend database.
const mockDailyData = [
  {
    date: '2025-09-10',
    datasets: [
      { id: '1', name: 'Morning Readiness Ranking', size: '2.5 MB' },
      { id: '2', name: 'Operational Efficiency Report', size: '1.1 MB' },
      { id: '3', name: 'Maintenance Log', size: '500 KB' },
    ],
  },
  {
    date: '2025-09-09',
    datasets: [
      { id: '1', name: 'Morning Readiness Ranking', size: '2.4 MB' },
      { id: '2', name: 'Operational Efficiency Report', size: '1.0 MB' },
      { id: '3', name: 'Maintenance Log', size: '480 KB' },
    ],
  },
  {
    date: '2025-09-08',
    datasets: [
      { id: '1', name: 'Morning Readiness Ranking', size: '2.3 MB' },
      { id: '2', name: 'Operational Efficiency Report', size: '0.9 MB' },
      { id: '3', name: 'Maintenance Log', size: '450 KB' },
    ],
  },
];

export default function Databases() {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const toggleExpansion = (date: string) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  return (
    <div className="p-6" style={{ color: 'var(--text-primary)' }}>
      <h1 className="text-3xl font-bold mb-6">Databases & Data History</h1>
      <p className="text-sm mt-1 mb-6" style={{ color: 'var(--text-secondary)' }}>
        This section provides a historical record of all metro system datasets, organized by date.
      </p>

      <div className="space-y-4">
        {mockDailyData.map((day) => (
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
                {day.datasets.map((dataset) => (
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
  );
}