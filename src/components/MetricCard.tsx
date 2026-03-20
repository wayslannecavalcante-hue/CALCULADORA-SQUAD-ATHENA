import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { MetricData } from '../types';

interface MetricCardProps {
  metric: MetricData;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const { isEditing, updateMetric } = useDashboard();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMetric(metric.id, e.target.value);
  };

  return (
    <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between h-full hover:border-cyan-500/50 transition-colors">
      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">{metric.label}</h3>
      <div className="flex items-baseline">
        {metric.prefix && <span className="text-zinc-500 mr-1 text-lg">{metric.prefix}</span>}
        {isEditing ? (
          <input
            type="text"
            value={metric.value}
            onChange={handleChange}
            className="w-full text-3xl font-bold text-white border-b-2 border-cyan-500 focus:outline-none bg-transparent"
          />
        ) : (
          <span className="text-3xl font-bold text-white">{metric.value}</span>
        )}
        {metric.suffix && <span className="text-zinc-500 ml-1 text-lg">{metric.suffix}</span>}
      </div>
    </div>
  );
};
