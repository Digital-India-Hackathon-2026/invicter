import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useSimulation } from '../../../context/SimulationContext';

const HistoricalGraphs: React.FC = () => {
  const { history } = useSimulation();

  const chartData = history.map(point => ({
    time: new Date(point.timestamp).toLocaleTimeString(),
    healthScore: point.healthScore,
    vibration: point.vibration,
    temperature: point.temperature,
    pressure: point.pressure,
    rpm: point.rpm,
  }));

  const chartConfig = {
    healthScore: { color: '#10B981', label: 'Health Score (%)' },
    vibration: { color: '#F59E0B', label: 'Vibration (mm/s)' },
    temperature: { color: '#EF4444', label: 'Temperature (°C)' },
    pressure: { color: '#3B82F6', label: 'Pressure (bar)' },
    rpm: { color: '#8B5CF6', label: 'RPM' },
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '1.5rem'
    }}>
      {Object.entries(chartConfig).map(([key, config]) => (
        <div key={key} style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Line
                type="monotone"
                dataKey={key}
                stroke={config.color}
                strokeWidth={2}
                dot={false}
                name={config.label}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default HistoricalGraphs;