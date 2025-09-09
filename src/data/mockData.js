// Mock data for KMRL Fleet Command

export const initialPlan = [
  {
    id: 'T-101',
    rank: 1,
    status: 'Ready to Run',
    reason: 'Optimal mileage + Valid certificates',
    alerts: 'No conflicts detected.',
    scores: {
      final: 98.5,
      mileage: 45,
      maintenanceFit: 35,
      brandingBalance: 15.2,
      crewAvailability: 8
    },
    fitnessValidThru: '2025-09-30',
    jobCardStatus: 'Closed',
    brandingHours: 25,
    mileage: 45000
  },
  {
    id: 'T-102',
    rank: 2,
    status: 'Ready to Run',
    reason: 'Balanced fitness + Branding SLA',
    alerts: 'Low mileage alert.',
    scores: {
      final: 95.2,
      mileage: 42,
      maintenanceFit: 33,
      brandingBalance: 12.8,
      crewAvailability: 7.4
    },
    fitnessValidThru: '2025-10-15',
    jobCardStatus: 'Closed',
    brandingHours: 18,
    mileage: 42000
  },
  {
    id: 'T-103',
    rank: 3,
    status: 'On Standby',
    reason: 'Maintenance window conflict',
    alerts: 'Branding hours due.',
    scores: {
      final: 88.7,
      mileage: 38,
      maintenanceFit: 30,
      brandingBalance: 12.5,
      crewAvailability: 8.2
    },
    fitnessValidThru: '2025-09-28',
    jobCardStatus: 'Open',
    brandingHours: 5,
    mileage: 38000
  },
  {
    id: 'T-104',
    rank: 4,
    status: 'Hold Back',
    reason: 'Fitness certificate expired',
    alerts: 'Critical: Brake pads require inspection.',
    scores: {
      final: 65.3,
      mileage: 25,
      maintenanceFit: 15,
      brandingBalance: 18.3,
      crewAvailability: 7
    },
    fitnessValidThru: '2025-08-15',
    jobCardStatus: 'Open',
    brandingHours: 30,
    mileage: 25000
  },
  {
    id: 'T-105',
    rank: 5,
    status: 'Ready to Run',
    reason: 'Optimal mileage + crew availability',
    alerts: 'No conflicts detected.',
    scores: {
      final: 93.1,
      mileage: 40,
      maintenanceFit: 32,
      brandingBalance: 13.6,
      crewAvailability: 7.5
    },
    fitnessValidThru: '2025-11-20',
    jobCardStatus: 'Closed',
    brandingHours: 22,
    mileage: 40000
  },
  {
    id: 'T-106',
    rank: 6,
    status: 'Ready to Run',
    reason: 'Maintenance fit + branding balance',
    alerts: 'Minor cleaning required.',
    scores: {
      final: 91.4,
      mileage: 43,
      maintenanceFit: 28,
      brandingBalance: 14.2,
      crewAvailability: 6.2
    },
    fitnessValidThru: '2025-10-05',
    jobCardStatus: 'Closed',
    brandingHours: 19,
    mileage: 43000
  },
  {
    id: 'T-107',
    rank: 7,
    status: 'On Standby',
    reason: 'Crew scheduling conflict',
    alerts: 'Branding window available.',
    scores: {
      final: 86.9,
      mileage: 35,
      maintenanceFit: 31,
      brandingBalance: 13.4,
      crewAvailability: 7.5
    },
    fitnessValidThru: '2025-09-25',
    jobCardStatus: 'Closed',
    brandingHours: 15,
    mileage: 35000
  },
  {
    id: 'T-108',
    rank: 8,
    status: 'Ready to Run',
    reason: 'Good overall fitness score',
    alerts: 'No conflicts detected.',
    scores: {
      final: 89.6,
      mileage: 37,
      maintenanceFit: 29,
      brandingBalance: 15.8,
      crewAvailability: 7.8
    },
    fitnessValidThru: '2025-12-10',
    jobCardStatus: 'Closed',
    brandingHours: 27,
    mileage: 37000
  }
];

export const recalculatedPlan = [
  {
    id: 'T-105',
    rank: 1,
    status: 'Ready to Run',
    reason: 'High branding priority + optimal mileage',
    alerts: 'Prioritized for branding SLA.',
    scores: {
      final: 96.8,
      mileage: 40,
      maintenanceFit: 32,
      brandingBalance: 17.3,
      crewAvailability: 7.5
    },
    fitnessValidThru: '2025-11-20',
    jobCardStatus: 'Closed',
    brandingHours: 22,
    mileage: 40000
  },
  {
    id: 'T-108',
    rank: 2,
    status: 'Ready to Run',
    reason: 'Excellent branding balance',
    alerts: 'No conflicts detected.',
    scores: {
      final: 94.3,
      mileage: 37,
      maintenanceFit: 29,
      brandingBalance: 20.1,
      crewAvailability: 7.8
    },
    fitnessValidThru: '2025-12-10',
    jobCardStatus: 'Closed',
    brandingHours: 27,
    mileage: 37000
  },
  {
    id: 'T-101',
    rank: 3,
    status: 'Ready to Run',
    reason: 'Balanced overall performance',
    alerts: 'No conflicts detected.',
    scores: {
      final: 92.7,
      mileage: 45,
      maintenanceFit: 35,
      brandingBalance: 12.4,
      crewAvailability: 8
    },
    fitnessValidThru: '2025-09-30',
    jobCardStatus: 'Closed',
    brandingHours: 25,
    mileage: 45000
  },
  {
    id: 'T-106',
    rank: 4,
    status: 'Ready to Run',
    reason: 'Good maintenance + branding fit',
    alerts: 'Minor cleaning required.',
    scores: {
      final: 89.8,
      mileage: 43,
      maintenanceFit: 28,
      brandingBalance: 16.7,
      crewAvailability: 6.2
    },
    fitnessValidThru: '2025-10-05',
    jobCardStatus: 'Closed',
    brandingHours: 19,
    mileage: 43000
  },
  {
    id: 'T-102',
    rank: 5,
    status: 'On Standby',
    reason: 'Lower branding priority adjustment',
    alerts: 'Adjusted for branding requirements.',
    scores: {
      final: 87.1,
      mileage: 42,
      maintenanceFit: 33,
      brandingBalance: 8.9,
      crewAvailability: 7.4
    },
    fitnessValidThru: '2025-10-15',
    jobCardStatus: 'Closed',
    brandingHours: 18,
    mileage: 42000
  },
  {
    id: 'T-107',
    rank: 6,
    status: 'On Standby',
    reason: 'Crew + branding constraints',
    alerts: 'Branding window available.',
    scores: {
      final: 84.2,
      mileage: 35,
      maintenanceFit: 31,
      brandingBalance: 11.1,
      crewAvailability: 7.5
    },
    fitnessValidThru: '2025-09-25',
    jobCardStatus: 'Closed',
    brandingHours: 15,
    mileage: 35000
  },
  {
    id: 'T-103',
    rank: 7,
    status: 'Hold Back',
    reason: 'Low branding score under new priority',
    alerts: 'Branding requirement not met.',
    scores: {
      final: 72.4,
      mileage: 38,
      maintenanceFit: 30,
      brandingBalance: 6.2,
      crewAvailability: 8.2
    },
    fitnessValidThru: '2025-09-28',
    jobCardStatus: 'Open',
    brandingHours: 5,
    mileage: 38000
  },
  {
    id: 'T-104',
    rank: 8,
    status: 'Hold Back',
    reason: 'Fitness + branding issues',
    alerts: 'Critical: Multiple system failures.',
    scores: {
      final: 58.7,
      mileage: 25,
      maintenanceFit: 15,
      brandingBalance: 11.2,
      crewAvailability: 7
    },
    fitnessValidThru: '2025-08-15',
    jobCardStatus: 'Open',
    brandingHours: 30,
    mileage: 25000
  }
];

export const kpiData = {
  initial: {
    brandingFulfillment: 95,
    mileageBalance: 88,
    shuntingMoves: 12,
    riskAlerts: 3
  },
  recalculated: {
    brandingFulfillment: 88,
    mileageBalance: 92,
    shuntingMoves: 8,
    riskAlerts: 2
  }
};

export const chartData = {
  initial: {
    statusDistribution: [
      { name: 'Ready to Run', value: 5, color: '#28a745' },
      { name: 'On Standby', value: 2, color: '#FFC107' },
      { name: 'Hold Back', value: 1, color: '#DC3545' }
    ]
  },
  recalculated: {
    statusDistribution: [
      { name: 'Ready to Run', value: 4, color: '#28a745' },
      { name: 'On Standby', value: 2, color: '#FFC107' },
      { name: 'Hold Back', value: 2, color: '#DC3545' }
    ]
  }
};