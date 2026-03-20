import React, { useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, LabelList
} from 'recharts';
import { ChartConfig, ChartDataPoint } from '../types';
import { useDashboard } from '../context/DashboardContext';
import { Edit2, X } from 'lucide-react';

interface ChartCardProps {
  config: ChartConfig;
  className?: string;
}

// Updated colors for dark theme: Cyan, White, Gray, Red, Green, Amber
const COLORS = ['#06b6d4', '#ffffff', '#9ca3af', '#ef4444', '#22c55e', '#f59e0b'];

export const ChartCard: React.FC<ChartCardProps> = ({ config, className }) => {
  const { isEditing, updateChartData } = useDashboard();
  const [showEditor, setShowEditor] = useState(false);
  const [editData, setEditData] = useState<string>(JSON.stringify(config.data, null, 2));

  const totalValue = useMemo(() => {
    if (!config.data) return 0;
    return config.data.reduce((acc, item) => {
      // Sum all numeric properties that are not 'name' or 'fill'
      const itemTotal = Object.entries(item).reduce((itemAcc, [key, val]) => {
        if (key !== 'name' && key !== 'fill' && typeof val === 'number') {
          return itemAcc + val;
        }
        return itemAcc;
      }, 0);
      return acc + itemTotal;
    }, 0);
  }, [config.data]);

  const formattedTotal = useMemo(() => {
    const isCurrency = config.id.includes('fee') || config.id.includes('mrr') || config.id.includes('arr') || config.id.includes('churn');
    
    return totalValue.toLocaleString('pt-BR', {
      style: isCurrency ? 'currency' : 'decimal',
      currency: 'BRL',
      maximumFractionDigits: isCurrency ? 2 : 0,
    });
  }, [totalValue, config.id]);

  const handleSave = () => {
    try {
      const parsedData = JSON.parse(editData);
      updateChartData(config.id, parsedData);
      setShowEditor(false);
    } catch (e) {
      alert('Invalid JSON format');
    }
  };

  const renderChart = () => {
    const { type, data, dataKeys, colors, stacked, layout } = config;
    const chartColors = colors || COLORS;

    if (type === 'pie' || type === 'donut') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={type === 'donut' ? 60 : 0}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              stroke="#000" // Black stroke for separation
              isAnimationActive={false} // Disable animation for PDF capture
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value }) => {
                if (value === 0) return null;
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
              
                return (
                  <text 
                    x={x} 
                    y={y} 
                    fill="white" 
                    textAnchor="middle" 
                    dominantBaseline="central" 
                    fontSize={10} 
                    fontWeight="bold"
                    style={{ textShadow: '0px 0px 3px black' }}
                  >
                    {value}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill || chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#9ca3af' }} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout={layout || 'horizontal'}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
            {layout === 'vertical' ? (
              <XAxis type="number" stroke="#52525b" tick={{fill: '#a1a1aa', fontSize: 10}} />
            ) : (
              <XAxis dataKey="name" stroke="#52525b" tick={{fill: '#a1a1aa', fontSize: 10}} interval={0} />
            )}
            {layout === 'vertical' ? (
              <YAxis dataKey="name" type="category" width={100} stroke="#52525b" tick={{fill: '#a1a1aa', fontSize: 10}} />
            ) : (
              <YAxis stroke="#52525b" tick={{fill: '#a1a1aa', fontSize: 10}} />
            )}
            <Tooltip 
              cursor={{fill: '#27272a'}}
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
            />
            <Legend wrapperStyle={{fontSize: '10px', color: '#a1a1aa'}} />
            {dataKeys ? (
              dataKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId={stacked ? 'a' : undefined}
                  fill={chartColors[index % chartColors.length]}
                  isAnimationActive={false} // Disable animation for PDF capture
                >
                  <LabelList 
                    dataKey={key} 
                    position="inside" 
                    style={{ fill: '#fff', fontSize: '10px', fontWeight: 'bold', textShadow: '0px 0px 3px black' }} 
                    formatter={(val: number) => val === 0 ? '' : val}
                  />
                </Bar>
              ))
            ) : (
              <Bar dataKey="value" fill={chartColors[0]} isAnimationActive={false}>
                <LabelList 
                  dataKey="value" 
                  position="inside" 
                  style={{ fill: '#fff', fontSize: '10px', fontWeight: 'bold', textShadow: '0px 0px 3px black' }} 
                  formatter={(val: number) => val === 0 ? '' : val}
                />
                {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.fill || chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return <div>Unsupported chart type</div>;
  };


  return (
    <div className={`bg-zinc-900 p-4 rounded-xl border border-zinc-800 relative flex flex-col hover:border-zinc-700 transition-colors ${className || 'h-96'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col overflow-hidden mr-2">
          <h3 className="text-sm font-bold text-zinc-300 uppercase truncate tracking-wider" title={config.title}>{config.title}</h3>
          <span className="text-xs text-cyan-400 font-mono font-bold mt-1">{formattedTotal}</span>
        </div>
        {isEditing && (
          <button
            onClick={() => setShowEditor(true)}
            className="p-1 rounded-full hover:bg-zinc-800 text-zinc-500 flex-shrink-0"
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>
      
      <div className="flex-1 min-h-0">
        {renderChart()}
      </div>

      {showEditor && (
        <div className="absolute inset-0 bg-zinc-900 z-10 p-4 flex flex-col rounded-lg border border-zinc-700 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-white">Edit Data (JSON)</h4>
            <button onClick={() => setShowEditor(false)} className="text-zinc-500 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <textarea
            className="flex-1 w-full p-2 bg-black border border-zinc-700 rounded font-mono text-xs text-green-400 resize-none focus:outline-none focus:border-cyan-500"
            value={editData}
            onChange={(e) => setEditData(e.target.value)}
          />
          <button
            onClick={handleSave}
            className="mt-2 bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition-colors text-sm font-bold"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};
