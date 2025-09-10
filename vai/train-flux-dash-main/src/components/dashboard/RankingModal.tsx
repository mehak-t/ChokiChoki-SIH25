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
  aiExplanation?: {
    summary: string;
    technical_reasoning: string;
    business_impact: string;
    recommended_action: string;
  };
  riskFactors?: string[];
}

interface RankingModalProps {
  train: Train;
  onClose: () => void;
}

export default function RankingModal({ train, onClose }: RankingModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="w-full max-w-md card-radius card-shadow p-5" // Reduced p-6 to p-5
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="flex items-center justify-between mb-4"> {/* Reduced mb-6 to mb-4 */}
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}> {/* Reduced text-xl to text-lg */}
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

        <div className="space-y-4"> {/* Reduced space-y-6 to space-y-4 */}
          {/* Final Score */}
          <div className="text-center">
            <div className="text-3xl font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}> {/* Reduced text-4xl to text-3xl, mb-2 to mb-1.5 */}
              {train.scores.final}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}> {/* Reduced text-sm to text-xs */}
              Final Score
            </div>
          </div>

          {/* Score Breakdown */}
          <div>
            <h3 className="font-semibold mb-2 text-sm" style={{ color: 'var(--text-primary)' }}> {/* Reduced mb-3 to mb-2, added text-sm */}
              Score Breakdown
            </h3>
            <div className="space-y-2"> {/* Reduced space-y-3 to space-y-2 */}
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--text-primary)' }}> {/* Reduced text-sm to text-xs */}
                  Low Mileage
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--status-green)' }}> {/* Reduced text-sm to text-xs */}
                  +{train.scores.mileage}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--text-primary)' }}> {/* Reduced text-sm to text-xs */}
                  Maintenance Window Fit
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--status-green)' }}> {/* Reduced text-sm to text-xs */}
                  +{train.scores.maintenanceFit}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--text-primary)' }}> {/* Reduced text-sm to text-xs */}
                  Branding Balance
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--status-green)' }}> {/* Reduced text-sm to text-xs */}
                  +{train.scores.brandingBalance}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--text-primary)' }}> {/* Reduced text-sm to text-xs */}
                  Crew Availability
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--status-green)' }}> {/* Reduced text-sm to text-xs */}
                  +{train.scores.crewAvailability}
                </span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div>
            <h3 className="font-semibold mb-1.5 text-sm" style={{ color: 'var(--text-primary)' }}> {/* Reduced mb-2 to mb-1.5, added text-sm */}
              Alerts
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}> {/* Reduced text-sm to text-xs */}
              {train.alerts}
            </p>
          </div>

          {/* Risk Factors */}
          {train.riskFactors && train.riskFactors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-1.5 text-sm" style={{ color: 'var(--text-primary)' }}>
                Risk Factors
              </h3>
              <div className="space-y-1">
                {train.riskFactors.map((factor, index) => (
                  <div key={index} className="text-xs px-2 py-1 rounded" style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    color: 'var(--text-secondary)' 
                  }}>
                    • {factor}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Explanation */}
          {train.aiExplanation ? (
            <div>
              <h3 className="font-semibold mb-1.5 text-sm" style={{ color: 'var(--text-primary)' }}>
                AI Analysis
              </h3>
              <div className="space-y-2">
                <div>
                  <h4 className="text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Summary:</h4>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {train.aiExplanation.summary}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Technical Reasoning:</h4>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {train.aiExplanation.technical_reasoning}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Business Impact:</h4>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {train.aiExplanation.business_impact}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Recommended Action:</h4>
                  <p className="text-xs font-medium" style={{ color: 'var(--status-green)' }}>
                    {train.aiExplanation.recommended_action}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold mb-1.5 text-sm" style={{ color: 'var(--text-primary)' }}>
                AI Analysis
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                AI explanation not available for this train. This may be due to using fallback data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}