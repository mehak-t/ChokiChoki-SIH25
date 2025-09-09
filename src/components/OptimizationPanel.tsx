import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Play, Settings } from "lucide-react";
import { useState } from "react";

const constraints = [
  { id: "maintenance", label: "Maintenance Windows" },
  { id: "capacity", label: "Capacity Limits" },
  { id: "fuel", label: "Fuel Efficiency" },
  { id: "weather", label: "Weather Conditions" },
  { id: "crew", label: "Crew Availability" },
];

export function OptimizationPanel() {
  const [selectedTrain, setSelectedTrain] = useState("");
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleConstraintChange = (constraintId: string, checked: boolean) => {
    if (checked) {
      setSelectedConstraints([...selectedConstraints, constraintId]);
    } else {
      setSelectedConstraints(selectedConstraints.filter(id => id !== constraintId));
    }
  };

  const handleGeneratePlan = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <Card className="border-0 shadow-md h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold">
          <Settings className="h-5 w-5 mr-2 text-accent" />
          Optimization Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Train Selection */}
        <div className="space-y-2">
          <Label htmlFor="train-select" className="text-sm font-medium">
            Select Train
          </Label>
          <Select value={selectedTrain} onValueChange={setSelectedTrain}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a train..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TR-001">TR-001 (Ready)</SelectItem>
              <SelectItem value="TR-002">TR-002 (Maintenance)</SelectItem>
              <SelectItem value="TR-003">TR-003 (Standby)</SelectItem>
              <SelectItem value="TR-004">TR-004 (Ready)</SelectItem>
              <SelectItem value="TR-005">TR-005 (Ready)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Simulation Parameters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Simulation Parameters</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="duration" className="text-xs text-muted-foreground">
                Duration (days)
              </Label>
              <Input id="duration" type="number" placeholder="30" className="h-8" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="routes" className="text-xs text-muted-foreground">
                Routes
              </Label>
              <Input id="routes" type="number" placeholder="5" className="h-8" />
            </div>
          </div>
        </div>

        {/* Constraints */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Optimization Constraints</Label>
          <div className="space-y-3">
            {constraints.map((constraint) => (
              <div key={constraint.id} className="flex items-center space-x-2">
                <Checkbox
                  id={constraint.id}
                  checked={selectedConstraints.includes(constraint.id)}
                  onCheckedChange={(checked) =>
                    handleConstraintChange(constraint.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={constraint.id}
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  {constraint.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGeneratePlan}
          disabled={!selectedTrain || isGenerating}
          className="w-full bg-accent hover:bg-accent-hover text-accent-foreground font-medium"
        >
          <Play className="h-4 w-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate Plan"}
        </Button>

        {/* Results Summary */}
        <div className="pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Last optimization: 2 hours ago</p>
            <p>Success rate: 94.2%</p>
            <p>Avg. processing time: 1.2s</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}