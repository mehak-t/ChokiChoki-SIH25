import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Train {
  id: string;
  scores: {
    final: number;
    mileage: number;
    maintenanceFit: number;
    brandingBalance: number;
    crewAvailability: number;
  };
  alerts: string;
}

interface RankingModalProps {
  train: Train;
  onClose: () => void;
}

export default function RankingModal({ train, onClose }: RankingModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="w-full max-w-md card-radius card-shadow p-6"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Ranking Explanation for Train {train.id}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Final Score */}
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {train.scores.final}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Final Score
            </div>
          </div>

          {/* Score Breakdown */}
          <div>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Score Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  Low Mileage
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--status-green)' }}>
                  +{train.scores.mileage}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  Maintenance Window Fit
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--status-green)' }}>
                  +{train.scores.maintenanceFit}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  Branding Balance
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--status-green)' }}>
                  +{train.scores.brandingBalance}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  Crew Availability
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--status-green)' }}>
                  +{train.scores.crewAvailability}
                </span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Alerts
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {train.alerts}
            </p>
          </div>

          {/* Conclusion */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Conclusion
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              AI reasoning placeholder text will go here to summarize the ranking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}