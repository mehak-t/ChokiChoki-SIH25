// src/components/dashboard/WhatIfSimulator.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RefreshCw, Settings } from 'lucide-react';

interface WhatIfSimulatorProps {
    onRecalculate: (excludedTrains: string[], brandingImportance: number) => void;
    isDarkMode: boolean; 
}

const availableTrains = [
    { id: 'TS-101', name: 'TS-101' },
    { id: 'TS-117', name: 'TS-117' },
    { id: 'TS-121', name: 'TS-121' },
    { id: 'TS-127', name: 'TS-127' },
];

export default function WhatIfSimulator({ onRecalculate, isDarkMode }: WhatIfSimulatorProps) {
    const [brandingWeight, setBrandingWeight] = useState([50]);
    const [excludedTrains, setExcludedTrains] = useState<string[]>([]);
    
    // FIX: This function was missing.
    const handleCheckboxChange = (trainId: string, checked: boolean) => {
        if (checked) {
            setExcludedTrains([...excludedTrains, trainId]);
        } else {
            setExcludedTrains(excludedTrains.filter(id => id !== trainId));
        }
    };
    
    const handleRecalculateClick = () => {
        onRecalculate(excludedTrains, brandingWeight[0]);
    };

    const bgColor = isDarkMode ? 'bg-slate-800' : 'bg-white';
    const textColor = isDarkMode ? 'text-white' : 'text-black';
    const borderColor = isDarkMode ? 'border-slate-700' : 'border-gray-200';
    const mutedTextColor = isDarkMode ? 'text-slate-300' : 'text-gray-500';
    const selectBgColor = isDarkMode ? 'bg-slate-700' : 'bg-white';
    const selectBorderColor = isDarkMode ? 'border-slate-600' : 'border-gray-300';
    const selectTextColor = isDarkMode ? 'text-white' : 'text-black';

    const triggerText = excludedTrains.length > 0 
        ? `${excludedTrains.length} train(s) excluded` 
        : "Select trains to exclude...";

    return (
        <Card className={`flex flex-col h-full ${bgColor} ${textColor} border ${borderColor}`}>
            <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center space-x-2">
                    <Settings className={`h-5 w-5 ${mutedTextColor}`} />
                    <span>What-If Simulator</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${mutedTextColor}`}>
                            Branding Importance: {brandingWeight[0]}%
                        </label>
                        <Slider 
                            value={brandingWeight}
                            onValueChange={setBrandingWeight}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${mutedTextColor}`}>Exclude Trains</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    role="combobox"
                                    className={`w-full justify-between ${selectBgColor} ${selectBorderColor} ${selectTextColor}`}
                                >
                                    {triggerText}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className={`${selectBgColor} ${selectBorderColor} p-2`}>
                                <div className="space-y-2">
                                    {availableTrains.map((train) => (
                                        <div key={train.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`exclude-${train.id}`}
                                                checked={excludedTrains.includes(train.id)}
                                                onCheckedChange={(checked) => handleCheckboxChange(train.id, checked as boolean)}
                                            />
                                            <Label htmlFor={`exclude-${train.id}`} className={selectTextColor}>
                                                {train.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <Button 
                    onClick={handleRecalculateClick}
                    className="w-full font-medium py-3 mt-4" 
                    style={{ backgroundColor: '#00b8e6', color: 'white' }}
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Recalculate Plan
                </Button>
            </CardContent>
        </Card>
    );
}