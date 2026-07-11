import React from 'react';
import { AffectedComponent, HealthMetrics } from '../../../types';
import TurbineSVG from './TurbineSVG';

interface DigitalTwinProps {
  affectedComponents: AffectedComponent[];
  health: HealthMetrics;
}

const DigitalTwin: React.FC<DigitalTwinProps> = ({ affectedComponents, health }) => {
  const getComponentColor = (status: string) => {
    switch (status) {
      case 'critical': return '#EF4444';
      case 'high-risk': return '#F97316';
      case 'warning': return '#F59E0B';
      default: return '#10B981';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Live Digital Twin</h3>
        <span className={`status-badge status-${health.riskLevel.toLowerCase()}`}>
          {health.riskLevel} Risk
        </span>
      </div>
      
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '400px',
        background: 'var(--color-cream)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }}>
        <TurbineSVG affectedComponents={affectedComponents} getComponentColor={getComponentColor} />
        
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          right: '1rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {affectedComponents.map(component => (
            <div
              key={component.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.375rem 0.75rem',
                background: 'white',
                borderRadius: 'var(--radius)',
                fontSize: '0.75rem',
                fontWeight: 500,
                boxShadow: 'var(--shadow)'
              }}
            >
              <div
                style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  borderRadius: '50%',
                  background: getComponentColor(component.status),
                  border: '2px solid white'
                }}
              />
              {component.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;