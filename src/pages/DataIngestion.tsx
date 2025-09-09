import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload } from 'lucide-react';

export default function DataIngestion() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload-csv');
  
  // Manual input form state
  const [formData, setFormData] = useState({
    fitnessValidThru: '',
    jobCardStatus: '',
    brandingHours: '',
    mileage: '',
    cleaningSlot: '',
    stablingPosition: '',
    manualOverride: false
  });

  const handleProcess = () => {
    navigate('/progress');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" 
         style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Fleet Data Ingestion
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Upload or input daily trainset operational data
          </p>
        </div>

        <div className="card-radius card-shadow p-8" 
             style={{ backgroundColor: 'var(--bg-secondary)' }}>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Data Input Methods
              </h2>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload-csv" className="button-radius">Upload CSV</TabsTrigger>
                <TabsTrigger value="manual-input" className="button-radius">Manual Input</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upload-csv" className="space-y-6">
              <div 
                className="border-2 border-dashed p-12 text-center card-radius"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Upload className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Drag & Drop Trainset Data CSV Here, or Click to Browse
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Supported format: CSV files up to 10MB
                </p>
                <Button variant="outline" className="button-radius">
                  Browse Files
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="manual-input" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fitnessValidThru" className="text-sm font-medium">
                    Fitness Certificate Valid Thru
                  </Label>
                  <Input
                    id="fitnessValidThru"
                    type="date"
                    value={formData.fitnessValidThru}
                    onChange={(e) => handleInputChange('fitnessValidThru', e.target.value)}
                    className="mt-1 button-radius"
                  />
                </div>

                <div>
                  <Label htmlFor="jobCardStatus" className="text-sm font-medium">
                    Job Card Status
                  </Label>
                  <Select value={formData.jobCardStatus} onValueChange={(value) => handleInputChange('jobCardStatus', value)}>
                    <SelectTrigger className="mt-1 button-radius">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="brandingHours" className="text-sm font-medium">
                    Branding Hours Left
                  </Label>
                  <Input
                    id="brandingHours"
                    type="number"
                    value={formData.brandingHours}
                    onChange={(e) => handleInputChange('brandingHours', e.target.value)}
                    className="mt-1 button-radius"
                    placeholder="Hours"
                  />
                </div>

                <div>
                  <Label htmlFor="mileage" className="text-sm font-medium">
                    Mileage
                  </Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                    className="mt-1 button-radius"
                    placeholder="Miles"
                  />
                </div>

                <div>
                  <Label htmlFor="cleaningSlot" className="text-sm font-medium">
                    Cleaning Slot
                  </Label>
                  <Select value={formData.cleaningSlot} onValueChange={(value) => handleInputChange('cleaningSlot', value)}>
                    <SelectTrigger className="mt-1 button-radius">
                      <SelectValue placeholder="Select slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="needed">Needed</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="stablingPosition" className="text-sm font-medium">
                    Current Stabling Position
                  </Label>
                  <Input
                    id="stablingPosition"
                    type="text"
                    value={formData.stablingPosition}
                    onChange={(e) => handleInputChange('stablingPosition', e.target.value)}
                    className="mt-1 button-radius"
                    placeholder="Position"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manualOverride"
                  checked={formData.manualOverride}
                  onCheckedChange={(checked) => handleInputChange('manualOverride', checked)}
                />
                <Label htmlFor="manualOverride" className="text-sm font-medium">
                  Manual Override (Force into service)
                </Label>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleProcess}
              className="button-radius font-medium px-8 py-3"
              style={{ 
                backgroundColor: 'var(--accent-orange)',
                color: 'white'
              }}
            >
              Process & Optimize
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}