// src/pages/DataIngestion.tsx
"use client";

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '@/components/NavigationSidebar';
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

  // New state to manage the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // New ref to reference the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleLogout = () => {
    navigate('/login');
  };

  // New function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // New function to programmatically click the hidden input
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleProcess = () => {
    // You can add logic here to handle either file upload or manual input
    if (activeTab === 'upload-csv' && selectedFile) {
        // Handle CSV processing
        console.log('Processing CSV file:', selectedFile.name);
    } else if (activeTab === 'manual-input') {
        // Handle manual data processing
        console.log('Processing manual data:', formData);
    }
    navigate('/progress');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Navigation Sidebar */}
      <NavigationSidebar currentPage="/data-ingestion" onLogout={handleLogout} />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Upload Trainset Data
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
                {/* Hidden file input element */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".csv, .xlsx"
                />
                <Button onClick={handleBrowseClick} variant="outline" className="button-radius">
                  Browse Files
                </Button>
                {selectedFile && (
                    <p className="mt-2 text-sm text-slate-400">Selected file: **{selectedFile.name}**</p>
                )}
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
                backgroundColor: '#00b8e6',
                color: 'white'
              }}
              // Disable the button if no file is selected for the CSV tab
              disabled={activeTab === 'upload-csv' && !selectedFile}
            >
              Process & Optimize
            </Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}