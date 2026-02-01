import { useState, useEffect } from 'react';
import { DEMO_MODE, simulateDelay } from '../demo/demoMode';
import { mockReportsData, mockClients, mockDevices, mockServices, mockSmsHistory } from '../demo/mockData';

export const useReportsData = () => {
  const [data, setData] = useState({
    stats: {
      totalClients: 0,
      totalDevices: 0,
      totalServices: 0,
      pendingServices: 0,
      completedServices: 0,
      revenue: 0,
      activeUsers: 0,
      avgServiceTime: 0
    },
    monthlyActivity: [],
    recentActivity: [],
    systemStatus: null,
    teamPerformance: null,
    smsStats: null,
    topClients: []
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (DEMO_MODE) {
        await simulateDelay(500);

        // Calculate stats from mock data
        const completedCount = mockReportsData.monthlyServices.reduce((sum, m) => sum + m.completedServices, 0);
        const totalServicesCount = mockReportsData.monthlyServices.reduce((sum, m) => sum + m.totalServices, 0);
        const pendingCount = totalServicesCount - completedCount;

        const stats = {
          totalClients: mockClients.length,
          totalDevices: mockDevices.length,
          totalServices: mockReportsData.servicesThisMonth,
          pendingServices: pendingCount > 0 ? 3 : 0,
          completedServices: mockReportsData.servicesThisMonth - 3,
          revenue: mockReportsData.revenue.thisYear,
          activeUsers: 3,
          avgServiceTime: 90
        };

        const monthlyActivity = mockReportsData.monthlyServices;

        // Use detailed SMS stats from mockReportsData
        const smsStats = mockReportsData.smsStats;

        const topClients = mockClients.slice(0, 5).map(client => ({
          id: client.id,
          name: client.name,
          devicesCount: client.devices?.length || 0,
          totalServices: Math.floor(Math.random() * 10) + 1
        }));

        setData({
          stats,
          monthlyActivity,
          recentActivity: [],
          systemStatus: { status: 'healthy', uptime: '99.9%' },
          teamPerformance: null,
          smsStats,
          topClients
        });

        return;
      }

      setError('Demo mode only');
    } catch (err) {
      console.error('Error loading reports data:', err);
      setError('Nie udało się załadować niektórych statystyk.');
    } finally {
      setLoading(false);
    }
  };

  const loadOverallStats = async () => {
    if (DEMO_MODE) {
      await loadAllData();
    }
  };

  const loadMonthlyActivity = async () => {
    if (DEMO_MODE) {
      setData(prev => ({
        ...prev,
        monthlyActivity: mockReportsData.monthlyServices
      }));
    }
  };

  const loadSmsStats = async () => {
    if (DEMO_MODE) {
      setData(prev => ({
        ...prev,
        smsStats: mockReportsData.smsStats
      }));
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return {
    data,
    loading,
    refreshing,
    error,
    refreshData,
    loadAllData
  };
};
