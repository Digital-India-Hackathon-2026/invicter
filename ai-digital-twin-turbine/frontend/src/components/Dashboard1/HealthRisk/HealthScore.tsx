import React from 'react';
import { motion } from 'framer-motion';
import { HealthMetrics } from '../../../types';

interface HealthScoreProps {
  health: HealthMetrics;
}

const HealthScore: React.FC<HealthScoreProps> = ({ health }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (health.healthScore / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return 'var(--color-emerald)';
    if (score >= 60) return 'var(--color-warning)';
    if (score >= 40) return 'var(--color-high-risk)';
    return 'var(--color-danger)';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Health Score</h3>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          position: 'relative',
          width: '120px',
          height: '120px'
        }}>
          <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="60"
              cy="60"
              r="45"
              stroke="var(--color-gray-lighter)"
              strokeWidth="10"
              fill="none"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="45"
              stroke={getColor(health.healthScore)}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                strokeDasharray: circumference,
              }}
            />
          </svg>
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <motion.div
              key={health.healthScore}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: getColor(health.healthScore),
                fontFamily: 'var(--font-mono)'
              }}
            >
              {health.healthScore}%
            </motion.div>
          </div>
        </div>
        
        <div style={{
          fontSize: '0.875rem',
          color: 'var(--color-gray)',
          textAlign: 'center'
        }}>
          {health.healthScore >= 80 ? 'Healthy' : 
           health.healthScore >= 60 ? 'Warning' :
           health.healthScore >= 40 ? 'High Risk' : 'Critical'}
        </div>
      </div>
    </div>
  );
};

export default HealthScore;