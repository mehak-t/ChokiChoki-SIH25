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
  },
  {
    id: 'T-109',
    rank: 9,
    status: 'Ready to Run',
    reason: 'Excellent maintenance record',
    alerts: 'No conflicts detected.',
    scores: {
      final: 87.3,
      mileage: 41,
      maintenanceFit: 28,
      brandingBalance: 12.1,
      crewAvailability: 6.2
    },
    fitnessValidThru: '2025-10-12',
    jobCardStatus: 'Closed',
    brandingHours: 20,
    mileage: 41000
  },
  {
    id: 'T-110',
    rank: 10,
    status: 'On Standby',
    reason: 'Scheduled maintenance window',
    alerts: 'Routine inspection due.',
    scores: {
      final: 84.7,
      mileage: 33,
      maintenanceFit: 26,
      brandingBalance: 16.4,
      crewAvailability: 9.3
    },
    fitnessValidThru: '2025-09-22',
    jobCardStatus: 'Open',
    brandingHours: 12,
    mileage: 33000
  },
  {
    id: 'T-111',
    rank: 11,
    status: 'Ready to Run',
    reason: 'High crew availability',
    alerts: 'Minor exterior cleaning needed.',
    scores: {
      final: 82.9,
      mileage: 36,
      maintenanceFit: 24,
      brandingBalance: 13.7,
      crewAvailability: 9.2
    },
    fitnessValidThru: '2025-11-08',
    jobCardStatus: 'Closed',
    brandingHours: 16,
    mileage: 36000
  },
  {
    id: 'T-112',
    rank: 12,
    status: 'Ready to Run',
    reason: 'Optimal branding balance',
    alerts: 'No conflicts detected.',
    scores: {
      final: 81.5,
      mileage: 39,
      maintenanceFit: 22,
      brandingBalance: 14.8,
      crewAvailability: 5.7
    },
    fitnessValidThru: '2025-10-18',
    jobCardStatus: 'Closed',
    brandingHours: 24,
    mileage: 39000
  },
  {
    id: 'T-113',
    rank: 13,
    status: 'On Standby',
    reason: 'Route optimization pending',
    alerts: 'Branding schedule flexible.',
    scores: {
      final: 79.8,
      mileage: 32,
      maintenanceFit: 27,
      brandingBalance: 11.9,
      crewAvailability: 8.9
    },
    fitnessValidThru: '2025-09-30',
    jobCardStatus: 'Closed',
    brandingHours: 8,
    mileage: 32000
  },
  {
    id: 'T-114',
    rank: 14,
    status: 'Ready to Run',
    reason: 'Good maintenance fit',
    alerts: 'AC system check recommended.',
    scores: {
      final: 78.2,
      mileage: 34,
      maintenanceFit: 25,
      brandingBalance: 12.3,
      crewAvailability: 6.9
    },
    fitnessValidThru: '2025-11-15',
    jobCardStatus: 'Closed',
    brandingHours: 21,
    mileage: 34000
  },
  {
    id: 'T-115',
    rank: 15,
    status: 'Hold Back',
    reason: 'Brake system inspection required',
    alerts: 'Critical: Safety inspection overdue.',
    scores: {
      final: 62.4,
      mileage: 28,
      maintenanceFit: 18,
      brandingBalance: 10.2,
      crewAvailability: 6.2
    },
    fitnessValidThru: '2025-08-20',
    jobCardStatus: 'Open',
    brandingHours: 35,
    mileage: 28000
  },
  {
    id: 'T-116',
    rank: 16,
    status: 'Ready to Run',
    reason: 'Recent maintenance completed',
    alerts: 'No conflicts detected.',
    scores: {
      final: 76.9,
      mileage: 31,
      maintenanceFit: 23,
      brandingBalance: 15.6,
      crewAvailability: 7.3
    },
    fitnessValidThru: '2025-12-05',
    jobCardStatus: 'Closed',
    brandingHours: 18,
    mileage: 31000
  },
  {
    id: 'T-117',
    rank: 17,
    status: 'On Standby',
    reason: 'Crew training session',
    alerts: 'Training completion pending.',
    scores: {
      final: 75.1,
      mileage: 29,
      maintenanceFit: 21,
      brandingBalance: 13.8,
      crewAvailability: 11.3
    },
    fitnessValidThru: '2025-09-28',
    jobCardStatus: 'Closed',
    brandingHours: 14,
    mileage: 29000
  },
  {
    id: 'T-118',
    rank: 18,
    status: 'Ready to Run',
    reason: 'Standard operational readiness',
    alerts: 'Interior cleaning scheduled.',
    scores: {
      final: 73.6,
      mileage: 38,
      maintenanceFit: 19,
      brandingBalance: 9.4,
      crewAvailability: 7.2
    },
    fitnessValidThru: '2025-10-25',
    jobCardStatus: 'Closed',
    brandingHours: 28,
    mileage: 38000
  },
  {
    id: 'T-119',
    rank: 19,
    status: 'Ready to Run',
    reason: 'Good mileage efficiency',
    alerts: 'No conflicts detected.',
    scores: {
      final: 72.8,
      mileage: 44,
      maintenanceFit: 17,
      brandingBalance: 8.1,
      crewAvailability: 3.7
    },
    fitnessValidThru: '2025-11-02',
    jobCardStatus: 'Closed',
    brandingHours: 33,
    mileage: 44000
  },
  {
    id: 'T-120',
    rank: 20,
    status: 'Hold Back',
    reason: 'Engine diagnostic required',
    alerts: 'Warning: Engine performance below threshold.',
    scores: {
      final: 58.9,
      mileage: 26,
      maintenanceFit: 14,
      brandingBalance: 11.7,
      crewAvailability: 7.2
    },
    fitnessValidThru: '2025-08-10',
    jobCardStatus: 'Open',
    brandingHours: 40,
    mileage: 26000
  },
  {
    id: 'T-121',
    rank: 21,
    status: 'On Standby',
    reason: 'Branding refresh in progress',
    alerts: 'Branding work 60% complete.',
    scores: {
      final: 71.3,
      mileage: 30,
      maintenanceFit: 20,
      brandingBalance: 14.9,
      crewAvailability: 6.4
    },
    fitnessValidThru: '2025-09-18',
    jobCardStatus: 'Open',
    brandingHours: 45,
    mileage: 30000
  },
  {
    id: 'T-122',
    rank: 22,
    status: 'Ready to Run',
    reason: 'Adequate fitness levels',
    alerts: 'Tire pressure check due.',
    scores: {
      final: 69.7,
      mileage: 35,
      maintenanceFit: 16,
      brandingBalance: 12.4,
      crewAvailability: 6.3
    },
    fitnessValidThru: '2025-10-08',
    jobCardStatus: 'Closed',
    brandingHours: 23,
    mileage: 35000
  },
  {
    id: 'T-123',
    rank: 23,
    status: 'Ready to Run',
    reason: 'Crew availability optimal',
    alerts: 'No conflicts detected.',
    scores: {
      final: 68.4,
      mileage: 27,
      maintenanceFit: 18,
      brandingBalance: 13.2,
      crewAvailability: 10.2
    },
    fitnessValidThru: '2025-11-12',
    jobCardStatus: 'Closed',
    brandingHours: 17,
    mileage: 27000
  },
  {
    id: 'T-124',
    rank: 24,
    status: 'Hold Back',
    reason: 'Safety certification pending',
    alerts: 'Critical: Fire safety inspection required.',
    scores: {
      final: 55.2,
      mileage: 22,
      maintenanceFit: 12,
      brandingBalance: 15.1,
      crewAvailability: 6.1
    },
    fitnessValidThru: '2025-07-28',
    jobCardStatus: 'Open',
    brandingHours: 42,
    mileage: 22000
  },
  {
    id: 'T-125',
    rank: 25,
    status: 'On Standby',
    reason: 'Minor repairs in progress',
    alerts: 'Electrical system check ongoing.',
    scores: {
      final: 66.8,
      mileage: 24,
      maintenanceFit: 15,
      brandingBalance: 16.3,
      crewAvailability: 11.5
    },
    fitnessValidThru: '2025-09-15',
    jobCardStatus: 'Open',
    brandingHours: 38,
    mileage: 24000
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
  },
  {
    id: 'T-109',
    rank: 9,
    status: 'Ready to Run',
    reason: 'Improved maintenance schedule',
    alerts: 'No conflicts detected.',
    scores: {
      final: 88.1,
      mileage: 41,
      maintenanceFit: 28,
      brandingBalance: 13.4,
      crewAvailability: 5.7
    },
    fitnessValidThru: '2025-10-12',
    jobCardStatus: 'Closed',
    brandingHours: 20,
    mileage: 41000
  },
  {
    id: 'T-110',
    rank: 10,
    status: 'On Standby',
    reason: 'Routine maintenance scheduled',
    alerts: 'Inspection window available.',
    scores: {
      final: 85.3,
      mileage: 33,
      maintenanceFit: 26,
      brandingBalance: 17.8,
      crewAvailability: 8.5
    },
    fitnessValidThru: '2025-09-22',
    jobCardStatus: 'Open',
    brandingHours: 12,
    mileage: 33000
  },
  {
    id: 'T-111',
    rank: 11,
    status: 'Ready to Run',
    reason: 'Optimal crew scheduling',
    alerts: 'Minor cleaning required.',
    scores: {
      final: 83.7,
      mileage: 36,
      maintenanceFit: 24,
      brandingBalance: 14.9,
      crewAvailability: 8.8
    },
    fitnessValidThru: '2025-11-08',
    jobCardStatus: 'Closed',
    brandingHours: 16,
    mileage: 36000
  },
  {
    id: 'T-112',
    rank: 12,
    status: 'Ready to Run',
    reason: 'Enhanced branding priority',
    alerts: 'No conflicts detected.',
    scores: {
      final: 82.4,
      mileage: 39,
      maintenanceFit: 22,
      brandingBalance: 16.2,
      crewAvailability: 5.2
    },
    fitnessValidThru: '2025-10-18',
    jobCardStatus: 'Closed',
    brandingHours: 24,
    mileage: 39000
  },
  {
    id: 'T-113',
    rank: 13,
    status: 'On Standby',
    reason: 'Route optimization in progress',
    alerts: 'Branding flexibility available.',
    scores: {
      final: 80.9,
      mileage: 32,
      maintenanceFit: 27,
      brandingBalance: 13.1,
      crewAvailability: 8.8
    },
    fitnessValidThru: '2025-09-30',
    jobCardStatus: 'Closed',
    brandingHours: 8,
    mileage: 32000
  },
  {
    id: 'T-114',
    rank: 14,
    status: 'Ready to Run',
    reason: 'Maintenance optimization',
    alerts: 'AC system check scheduled.',
    scores: {
      final: 79.5,
      mileage: 34,
      maintenanceFit: 25,
      brandingBalance: 13.7,
      crewAvailability: 6.8
    },
    fitnessValidThru: '2025-11-15',
    jobCardStatus: 'Closed',
    brandingHours: 21,
    mileage: 34000
  },
  {
    id: 'T-115',
    rank: 15,
    status: 'Hold Back',
    reason: 'Safety certification pending',
    alerts: 'Critical: Safety inspection required.',
    scores: {
      final: 64.1,
      mileage: 28,
      maintenanceFit: 18,
      brandingBalance: 11.8,
      crewAvailability: 6.3
    },
    fitnessValidThru: '2025-08-20',
    jobCardStatus: 'Open',
    brandingHours: 35,
    mileage: 28000
  },
  {
    id: 'T-116',
    rank: 16,
    status: 'Ready to Run',
    reason: 'Post-maintenance readiness',
    alerts: 'No conflicts detected.',
    scores: {
      final: 78.2,
      mileage: 31,
      maintenanceFit: 23,
      brandingBalance: 17.1,
      crewAvailability: 7.1
    },
    fitnessValidThru: '2025-12-05',
    jobCardStatus: 'Closed',
    brandingHours: 18,
    mileage: 31000
  },
  {
    id: 'T-117',
    rank: 17,
    status: 'On Standby',
    reason: 'Crew training completion',
    alerts: 'Training certification pending.',
    scores: {
      final: 76.8,
      mileage: 29,
      maintenanceFit: 21,
      brandingBalance: 15.3,
      crewAvailability: 10.5
    },
    fitnessValidThru: '2025-09-28',
    jobCardStatus: 'Closed',
    brandingHours: 14,
    mileage: 29000
  },
  {
    id: 'T-118',
    rank: 18,
    status: 'Ready to Run',
    reason: 'Standard operational status',
    alerts: 'Interior refresh scheduled.',
    scores: {
      final: 75.1,
      mileage: 38,
      maintenanceFit: 19,
      brandingBalance: 10.8,
      crewAvailability: 7.3
    },
    fitnessValidThru: '2025-10-25',
    jobCardStatus: 'Closed',
    brandingHours: 28,
    mileage: 38000
  },
  {
    id: 'T-119',
    rank: 19,
    status: 'Ready to Run',
    reason: 'Efficient mileage performance',
    alerts: 'No conflicts detected.',
    scores: {
      final: 73.9,
      mileage: 44,
      maintenanceFit: 17,
      brandingBalance: 9.4,
      crewAvailability: 3.5
    },
    fitnessValidThru: '2025-11-02',
    jobCardStatus: 'Closed',
    brandingHours: 33,
    mileage: 44000
  },
  {
    id: 'T-120',
    rank: 20,
    status: 'Hold Back',
    reason: 'Engine performance issues',
    alerts: 'Warning: Engine diagnostics required.',
    scores: {
      final: 60.2,
      mileage: 26,
      maintenanceFit: 14,
      brandingBalance: 13.1,
      crewAvailability: 7.1
    },
    fitnessValidThru: '2025-08-10',
    jobCardStatus: 'Open',
    brandingHours: 40,
    mileage: 26000
  },
  {
    id: 'T-121',
    rank: 21,
    status: 'On Standby',
    reason: 'Branding refresh priority',
    alerts: 'Branding work 75% complete.',
    scores: {
      final: 72.6,
      mileage: 30,
      maintenanceFit: 20,
      brandingBalance: 16.4,
      crewAvailability: 6.2
    },
    fitnessValidThru: '2025-09-18',
    jobCardStatus: 'Open',
    brandingHours: 45,
    mileage: 30000
  },
  {
    id: 'T-122',
    rank: 22,
    status: 'Ready to Run',
    reason: 'Baseline fitness achieved',
    alerts: 'Tire maintenance due.',
    scores: {
      final: 71.3,
      mileage: 35,
      maintenanceFit: 16,
      brandingBalance: 13.8,
      crewAvailability: 6.5
    },
    fitnessValidThru: '2025-10-08',
    jobCardStatus: 'Closed',
    brandingHours: 23,
    mileage: 35000
  },
  {
    id: 'T-123',
    rank: 23,
    status: 'Ready to Run',
    reason: 'Crew availability maximized',
    alerts: 'No conflicts detected.',
    scores: {
      final: 69.8,
      mileage: 27,
      maintenanceFit: 18,
      brandingBalance: 14.7,
      crewAvailability: 10.1
    },
    fitnessValidThru: '2025-11-12',
    jobCardStatus: 'Closed',
    brandingHours: 17,
    mileage: 27000
  },
  {
    id: 'T-124',
    rank: 24,
    status: 'Hold Back',
    reason: 'Fire safety compliance',
    alerts: 'Critical: Fire safety inspection overdue.',
    scores: {
      final: 56.8,
      mileage: 22,
      maintenanceFit: 12,
      brandingBalance: 16.7,
      crewAvailability: 6.1
    },
    fitnessValidThru: '2025-07-28',
    jobCardStatus: 'Open',
    brandingHours: 42,
    mileage: 22000
  },
  {
    id: 'T-125',
    rank: 25,
    status: 'On Standby',
    reason: 'Electrical system repairs',
    alerts: 'Electrical diagnostics in progress.',
    scores: {
      final: 68.1,
      mileage: 24,
      maintenanceFit: 15,
      brandingBalance: 17.8,
      crewAvailability: 11.3
    },
    fitnessValidThru: '2025-09-15',
    jobCardStatus: 'Open',
    brandingHours: 38,
    mileage: 24000
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
    riskAlerts: 3
  }
};

export const chartData = {
  initial: {
    statusDistribution: [
      { name: 'Ready to Run', value: 16, color: '#28a745' },
      { name: 'On Standby', value: 6, color: '#FFC107' },
      { name: 'Hold Back', value: 3, color: '#DC3545' }
    ]
  },
  recalculated: {
    statusDistribution: [
      { name: 'Ready to Run', value: 15, color: '#28a745' },
      { name: 'On Standby', value: 7, color: '#FFC107' },
      { name: 'Hold Back', value: 3, color: '#DC3545' }
    ]
  }
};