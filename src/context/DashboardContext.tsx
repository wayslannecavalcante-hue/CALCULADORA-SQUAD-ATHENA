import React, { createContext, useContext, useState } from 'react';
import { DashboardData, MetricData, ChartConfig, ChartDataPoint } from '../types';
import { initialData } from '../data/initialData';

interface DashboardContextType {
  data: DashboardData;
  isEditing: boolean;
  toggleEditMode: () => void;
  updateMetric: (id: string, value: string | number) => void;
  updateChartData: (chartId: string, newData: ChartDataPoint[]) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DashboardData>(() => {
    const saved = localStorage.getItem('dashboardData');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    localStorage.setItem('dashboardData', JSON.stringify(data));
  }, [data]);

  const toggleEditMode = () => setIsEditing((prev) => !prev);

  const updateMetric = (id: string, value: string | number) => {
    setData((prev) => ({
      ...prev,
      metrics: prev.metrics.map((m) => (m.id === id ? { ...m, value } : m)),
    }));
  };

  const updateChartData = (chartId: string, newData: ChartDataPoint[]) => {
    setData((prev) => ({
      ...prev,
      charts: prev.charts.map((c) => (c.id === chartId ? { ...c, data: newData } : c)),
    }));
  };

  return (
    <DashboardContext.Provider value={{ data, isEditing, toggleEditMode, updateMetric, updateChartData }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
