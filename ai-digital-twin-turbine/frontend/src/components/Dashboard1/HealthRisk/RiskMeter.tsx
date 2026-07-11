import React from 'react';
import { motion } from 'framer-motion';

interface RiskMeterProps {
  riskLevel: string;
  healthScore: number;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ riskLevel, healthScore }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'var(--color-emerald)';
      case 'Medium': return 'var(--color-warning)';
      case 'High': return 'var(--color-high-risk)';
      case 'Critical': return 'var(--color-danger)';
      default: return 'var(--color-gray)';
    }
  };

  const getGaugeAngle = () => {
    if (healthScore >= 80) return 45;
    if (healthScore >= 60) return 90;
    if (healthScore >= 40) return 135;
    return 180;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Risk Level</h3>
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
          height: '70px',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: `conic-gradient(
              var(--color-emerald) 0deg 45deg,
              var(--color-warning) 45deg 90deg,
              var(--color-high-risk) 90deg 135deg,
              var(--color-danger) 135deg 180deg,
              transparent 180deg 360deg
            )`,
            transform: 'rotate(180deg)',
            top: '0',
            left: '0'
          }} />
          
          <motion.div
            animate={{ rotate: getGaugeAngle() }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: '4px',
              height: '60px',
              background: 'var(--color-carbon)',
              bottom: '0',
              left: '58px',
              transformOrigin: 'bottom center',
              borderRadius: '2px',
              zIndex: 10
            }}
          />
          
          <div style={{
            position: 'absolute',
            bottom: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '20px',
            height: '20px',
            background: 'var(--color-carbon)',
            borderRadius: '50%',
            zIndex: 20
          }} />
        </div>
        
        <motion.div
          key={riskLevel}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: getRiskColor(riskLevel),
            padding: '0.375rem 1rem',
            background: `${getRiskColor(riskLevel)}20`,
            borderRadius: 'var(--radius)',
            textTransform: 'uppercase'
          }}
        >
          {riskLevel}
        </motion.div>
      </div>
    </div>
  );
};

export default RiskMeter;