import React from 'react';
import { motion } from 'framer-motion';
import { SensorData } from '../../../types';

interface SensorCardsProps {
  sensors: SensorData;
}

const SensorCards: React.FC<SensorCardsProps> = ({ sensors }) => {
  const sensorConfig = [
    { key: 'vibration', label: 'Vibration', unit: 'mm/s', icon: '〰️' },
    { key: 'bearingTemperature', label: 'Bearing Temp', unit: '°C', icon: '🌡️' },
    { key: 'rpm', label: 'RPM', unit: 'rpm', icon: '⚙️' },
    { key: 'steamPressure', label: 'Steam Pressure', unit: 'bar', icon: '💨' },
    { key: 'powerOutput', label: 'Power Output', unit: 'MW', icon: '⚡' },
    { key: 'powerConsumption', label: 'Power Consumption', unit: 'MW', icon: '🔌' },
    { key: 'steamFlow', label: 'Steam Flow', unit: 'kg/s', icon: '🌊' },
    { key: 'oilPressure', label: 'Oil Pressure', unit: 'bar', icon: '🛢️' },
    { key: 'oilTemperature', label: 'Oil Temperature', unit: '°C', icon: '🔥' },
  ];

  const getSensorColor = (value: number, key: string) => {
    const ranges: Record<string, { normal: number; warning: number; critical: number }> = {
      vibration: { normal: 4.0, warning: 5.5, critical: 7.0 },
      bearingTemperature: { normal: 85, warning: 95, critical: 110 },
      rpm: { normal: 3200, warning: 3400, critical: 3600 },
      steamPressure: { normal: 180, warning: 200, critical: 220 },
      powerOutput: { normal: 600, warning: 650, critical: 700 },
      powerConsumption: { normal: 40, warning: 50, critical: 60 },
      steamFlow: { normal: 250, warning: 280, critical: 300 },
      oilPressure: { normal: 3.0, warning: 3.5, critical: 4.0 },
      oilTemperature: { normal: 65, warning: 75, critical: 85 },
    };

    const range = ranges[key];
    if (value >= range.critical) return 'var(--color-danger)';
    if (value >= range.warning) return 'var(--color-high-risk)';
    if (value >= range.normal) return 'var(--color-warning)';
    return 'var(--color-emerald)';
  };

  return (
    <div className="card" style={{ gridColumn: '1 / -1' }}>
      <div className="card-header">
        <h3 className="card-title">Live Sensor Data</h3>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {sensorConfig.map((sensor) => {
          const value = sensors[sensor.key as keyof SensorData] as number;
          const color = getSensorColor(value, sensor.key);
          
          return (
            <motion.div
              key={sensor.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'var(--color-cream)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '2px solid transparent',
                borderColor: color,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>{sensor.icon}</span>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--color-gray)',
                  fontWeight: 500,
                  textTransform: 'uppercase'
                }}>
                  {sensor.label}
                </span>
              </div>
              
              <div style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: color,
                fontFamily: 'var(--font-mono)',
                marginBottom: '0.25rem'
              }}>
                {value.toFixed(sensor.key === 'rpm' || sensor.key === 'powerOutput' || sensor.key === 'powerConsumption' ? 0 : 1)}
              </div>
              
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-gray)'
              }}>
                {sensor.unit}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SensorCards;