import { DEMO_MODE, simulateDelay } from '../../demo/demoMode';
import { mockReportsData, mockClients, mockSmsHistory } from '../../demo/mockData';

export const reportsService = {
  // Get overall statistics
  getOverallStats: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return {
        totalClients: mockClients.length,
        totalDevices: mockClients.reduce((sum, c) => sum + (c.devices?.length || 0), 0),
        totalServices: mockReportsData.totalServices,
        servicesThisMonth: mockReportsData.servicesThisMonth,
        revenue: mockReportsData.revenue,
      };
    }
    throw new Error('Demo mode only');
  },

  // Get monthly activity for a specific year
  getMonthlyActivity: async (year = new Date().getFullYear()) => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return mockReportsData.monthlyServices;
    }
    throw new Error('Demo mode only');
  },

  // Get recent activity with limit
  getRecentActivity: async (limit = 10) => {
    if (DEMO_MODE) {
      await simulateDelay(150);
      const activities = [
        { type: 'sms', message: 'SMS wysłany do Jan Kowalski', timestamp: new Date().toISOString(), icon: '📱' },
        { type: 'service', message: 'Serwis wykonany u Anna Nowak', timestamp: new Date(Date.now() - 3600000).toISOString(), icon: '🔧' },
        { type: 'client', message: 'Nowy klient: Piotr Wiśniewski', timestamp: new Date(Date.now() - 7200000).toISOString(), icon: '👤' },
        { type: 'device', message: 'Dodano urządzenie: Pompa ciepła', timestamp: new Date(Date.now() - 10800000).toISOString(), icon: '🏠' },
        { type: 'sms', message: 'SMS wysłany do Maria Zielińska', timestamp: new Date(Date.now() - 14400000).toISOString(), icon: '📱' },
      ];
      return activities.slice(0, limit);
    }
    throw new Error('Demo mode only');
  },

  // Get system status
  getSystemStatus: async () => {
    if (DEMO_MODE) {
      await simulateDelay(150);
      return {
        status: 'HEALTHY',
        services: {
          database: { status: 'OK', latency: 15 },
          smsGateway: { status: 'OK', latency: 120 },
          googleCalendar: { status: 'OK', latency: 80 },
          googleMaps: { status: 'OK', latency: 45 },
        },
        uptime: '99.9%',
        lastCheck: new Date().toISOString(),
      };
    }
    throw new Error('Demo mode only');
  },

  // Get team performance statistics
  getTeamPerformance: async () => {
    if (DEMO_MODE) {
      await simulateDelay(200);
      return {
        technicians: [
          { name: 'Jan Technik', servicesCompleted: 45, rating: 4.8, avgTime: 75 },
          { name: 'Piotr Instalator', servicesCompleted: 38, rating: 4.9, avgTime: 85 },
          { name: 'Adam Serwisant', servicesCompleted: 32, rating: 4.7, avgTime: 70 },
        ],
        totalServicesThisMonth: mockReportsData.servicesThisMonth,
        avgResponseTime: 24,
        customerSatisfaction: 4.8,
      };
    }
    throw new Error('Demo mode only');
  },

  // Get SMS statistics
  getSmsStats: async () => {
    if (DEMO_MODE) {
      await simulateDelay(150);
      return mockReportsData.smsStats;
    }
    throw new Error('Demo mode only');
  },

  // Get top clients with limit
  getTopClients: async (limit = 5) => {
    if (DEMO_MODE) {
      await simulateDelay(150);
      return mockClients.slice(0, limit).map((client, index) => ({
        id: client.id,
        name: client.name,
        devicesCount: client.devices?.length || 0,
        servicesCount: 5 - index,
        totalSpent: (5 - index) * 350,
      }));
    }
    throw new Error('Demo mode only');
  },

  // Load all reports data at once
  getAllReportsData: async () => {
    if (DEMO_MODE) {
      await simulateDelay(300);
      const [
        overallStats,
        monthlyActivity,
        recentActivity,
        systemStatus,
        teamPerformance,
        smsStats,
        topClients
      ] = await Promise.all([
        reportsService.getOverallStats(),
        reportsService.getMonthlyActivity(),
        reportsService.getRecentActivity(),
        reportsService.getSystemStatus(),
        reportsService.getTeamPerformance(),
        reportsService.getSmsStats(),
        reportsService.getTopClients()
      ]);

      return {
        overallStats,
        monthlyActivity,
        recentActivity,
        systemStatus,
        teamPerformance,
        smsStats,
        topClients
      };
    }
    throw new Error('Demo mode only');
  }
};
