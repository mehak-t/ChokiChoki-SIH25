// src/pages/Reports.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, FileText, HardHat, ClipboardList, Tag, Bolt, Users, Route, CheckCircle2, AlertTriangle, XCircle, Sun, Moon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// --- MOCK DATA & TYPES ---
interface ChecklistItem {
    label: string;
    status: "OK" | "Risk" | "Blocker";
}

interface TrainData {
    train_id: string;
    checklist: ChecklistItem[];
    score: number;
}

const initialTrainData: TrainData[] = [
    {
        train_id: "TS-101",
        checklist: [
            { label: "Fitness", status: "OK" },
            { label: "Maintenance", status: "OK" },
            { label: "Branding", status: "OK" },
            { label: "Ops Eff.", status: "OK" },
            { label: "Crew", status: "OK" },
            { label: "Route Opt.", status: "OK" },
        ],
        score: 98,
    },
    {
        train_id: "TS-117",
        checklist: [
            { label: "Fitness", status: "OK" },
            { label: "Maintenance", status: "OK" },
            { label: "Branding", status: "OK" },
            { label: "Ops Eff.", status: "OK" },
            { label: "Crew", status: "OK" },
            { label: "Route Opt.", status: "OK" },
        ],
        score: 96,
    },
    {
        train_id: "TS-121",
        checklist: [
            { label: "Fitness", status: "OK" },
            { label: "Maintenance", status: "Risk" },
            { label: "Branding", status: "Risk" },
            { label: "Ops Eff.", status: "OK" },
            { label: "Crew", status: "OK" },
            { label: "Route Opt.", status: "Risk" },
        ],
        score: 66,
    },
    {
        train_id: "TS-127",
        checklist: [
            { label: "Fitness", status: "Blocker" },
            { label: "Maintenance", status: "Blocker" },
            { label: "Branding", status: "OK" },
            { label: "Ops Eff.", status: "OK" },
            { label: "Crew", status: "OK" },
            { label: "Route Opt.", status: "Risk" },
        ],
        score: 50,
    },
];

const constraints = [
    { name: "Fitness", icon: HardHat, label: "Fitness" },
    { name: "Maintenance", icon: ClipboardList, label: "Maintenance" },
    { name: "Branding", icon: Tag, label: "Branding" },
    { name: "Operational Efficiency", icon: Bolt, label: "Ops Eff." },
    { name: "Crew Availability", icon: Users, label: "Crew" },
    { name: "Route Optimization", icon: Route, label: "Route Opt." },
];

const getStatusIcon = (status: "OK" | "Risk" | "Blocker") => {
    if (status === "OK") return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (status === "Risk") return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    if (status === "Blocker") return <XCircle className="h-4 w-4 text-red-500" />;
    return null;
};

export default function Reports() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark');
    };

    const handleLogout = () => {
        navigate('/login');
    };

    // The logic for handling background and text colors based on theme can be simplified
    // by using CSS variables, as you are already doing in some places.
    // I will primarily use Tailwind's `dark:` variant for a more streamlined approach.

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
            {/* Sidebar Navigation */}
            <aside
                className="w-64 flex flex-col justify-between p-6 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800"
            >
                <div className="space-y-6">
                    <div className="text-2xl font-bold text-cyan-500">
                        KMRL
                    </div>

                    <nav className="space-y-2">
                        <a
                            href="/dashboard"
                            className="flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <LayoutDashboard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            <span>Dashboard</span>
                        </a>
                        <a
                            href="/reports"
                            className="flex items-center space-x-3 p-3 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-cyan-500"
                        >
                            <FileText className="h-5 w-5" />
                            <span>Reports</span>
                        </a>
                    </nav>
                </div>
                {/* Logout button at the bottom */}
                <div className="mt-auto">
                    <Button
                        onClick={handleLogout}
                        className="w-full justify-start space-x-3 p-3 font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        variant="ghost"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Operational Logbooks
                        </h1>
                        <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                            Detailed reports on individual fleet constraints for easy issue tracking.
                        </p>
                    </div>
                    {/* Night mode toggle button */}
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleTheme}
                            className="button-radius"
                        >
                            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {constraints.map((constraint, index) => {
                            const Icon = constraint.icon;
                            const issues = initialTrainData.filter(train =>
                                train.checklist.some(item => item.label === constraint.label && (item.status === 'Risk' || item.status === 'Blocker'))
                            );

                            return (
                                <Card key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-xl font-semibold flex items-center space-x-2 text-gray-900 dark:text-gray-50">
                                            <Icon className="h-6 w-6 text-cyan-500" />
                                            <span>{constraint.name} Log</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {issues.length > 0 ? (
                                                <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                                                    {issues.map(train => {
                                                        const item = train.checklist.find(i => i.label === constraint.label);
                                                        return (
                                                            <div key={train.train_id} className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                                                                <div className="flex items-center space-x-3">
                                                                    <span className="font-bold text-lg text-gray-900 dark:text-gray-50">
                                                                        {train.train_id}
                                                                    </span>
                                                                    {item && (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`${item.status === 'Risk' ? 'bg-amber-500' : 'bg-red-500'} text-white border-transparent`}
                                                                        >
                                                                            {item.status}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                {item && getStatusIcon(item.status)}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-center text-gray-400 dark:text-gray-500 p-4">
                                                    All trains are OK for this constraint.
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}