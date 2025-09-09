import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { initialPlan } from '@/data/mockData';

interface WhatIfSimulatorProps {
  onRecalculate: (excludedTrains: string[], brandingImportance: number) => void;
}

export default function WhatIfSimulator({ onRecalculate }: WhatIfSimulatorProps) {
  const [excludedTrains, setExcludedTrains] = useState<string[]>([]);
  const [brandingImportance, setBrandingImportance] = useState([50]);

  const handleRecalculate = () => {
    onRecalculate(excludedTrains, brandingImportance[0]);
  };

  return (
    <div 
      className="card-radius card-shadow p-6"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        What-If Simulator
      </h3>
      
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Exclude Trains
          </Label>
          <Select onValueChange={(value) => setExcludedTrains([value])}>
            <SelectTrigger className="mt-1 button-radius">
              <SelectValue placeholder="Select trains to exclude" />
            </SelectTrigger>
            <SelectContent>
              {initialPlan.map((train) => (
                <SelectItem key={train.id} value={train.id}>
                  {train.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
            Branding Importance
          </Label>
          <div className="px-3">
            <Slider
              value={brandingImportance}
              onValueChange={setBrandingImportance}
              max={100}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleRecalculate}
          className="w-full button-radius font-medium"
          style={{ 
            backgroundColor: 'var(--accent-orange)',
            color: 'white'
          }}
        >
          Recalculate Plan
        </Button>
      </div>
    </div>
  );
}