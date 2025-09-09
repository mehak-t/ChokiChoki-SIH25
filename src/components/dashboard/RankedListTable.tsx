import { AlertTriangle } from 'lucide-react';

interface Train {
  id: string;
  rank: number;
  status: string;
  reason: string;
  alerts: string;
  scores: {
    final: number;
  };
}

interface RankedListTableProps {
  data: Train[];
  onRowClick: (train: Train) => void;
}

export default function RankedListTable({ data, onRowClick }: RankedListTableProps) {
  const getStatusPill = (status: string) => {
    const statusClass = status === 'Ready to Run' ? 'status-ready' 
      : status === 'On Standby' ? 'status-standby' 
      : 'status-hold';
    
    return (
      <span className={`status-pill ${statusClass}`}>
        {status}
      </span>
    );
  };

  const getStatusColor = (status: string) => {
    if (status === 'Ready to Run') return 'var(--status-green)';
    if (status === 'On Standby') return 'var(--status-yellow)';
    return 'var(--status-red)';
  };

  return (
    <div 
      className="card-radius card-shadow overflow-hidden"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Showing {data.length} trainsets
          </h3>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--status-green)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>OK</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--status-yellow)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--status-red)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Blocker</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>#</th>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Trainset</th>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Fitness</th>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Maintenance</th>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Branding</th>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Ops Eff.</th>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Crew</th>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Route Opt.</th>
              <th className="text-left p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((train, index) => (
              <tr 
                key={train.id}
                className="border-b cursor-pointer hover:opacity-75 transition-colors"
                style={{ 
                  borderColor: 'var(--border-color)'
                }}
                onClick={() => onRowClick(train)}
              >
                <td className="p-4" style={{ color: 'var(--text-primary)' }}>
                  {train.rank}
                </td>
                <td className="p-4" style={{ color: 'var(--text-primary)' }}>
                  {train.id}
                </td>
                <td className="p-4">
                  <span className="text-green-600">✓</span>
                </td>
                <td className="p-4">
                  <span className="text-green-600">✓</span>
                </td>
                <td className="p-4">
                  {train.status === 'Ready to Run' ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                </td>
                <td className="p-4">
                  <span className="text-green-600">✓</span>
                </td>
                <td className="p-4">
                  <span className="text-green-600">✓</span>
                </td>
                <td className="p-4">
                  {train.status === 'Hold Back' ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : (
                    <span className="text-green-600">✓</span>
                  )}
                </td>
                <td className="p-4">
                  {getStatusPill(train.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}