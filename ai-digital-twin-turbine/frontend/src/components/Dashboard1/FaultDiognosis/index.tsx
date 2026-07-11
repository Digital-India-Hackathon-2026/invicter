import React from 'react';
import { motion } from 'framer-motion';

interface FaultDiagnosisProps {
  fault: string;
  probability: number;
  futureFault: string;
}

const FaultDiagnosis: React.FC<FaultDiagnosisProps> = ({ fault, probability, futureFault }) => {
  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return 'var(--color-danger)';
    if (prob >= 40) return 'var(--color-high-risk)';
    if (prob >= 20) return 'var(--color-warning)';
    return 'var(--color-emerald)';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Fault Diagnosis</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-gray)',
            textTransform: 'uppercase',
            marginBottom: '0.25rem'
          }}>
            Current Fault
          </div>
          <motion.div
            key={fault}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: fault === 'None' ? 'var(--color-emerald)' : 'var(--color-carbon)'
            }}
          >
            {fault}
          </motion.div>
        </div>

        <div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-gray)',
            textTransform: 'uppercase',
            marginBottom: '0.25rem'
          }}>
            Failure Probability
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <motion.div
              key={probability}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: getProbabilityColor(probability),
                fontFamily: 'var(--font-mono)'
              }}
            >
              {probability.toFixed(1)}%
            </motion.div>
            <div style={{
              flex: 1,
              height: '8px',
              background: 'var(--color-gray-lighter)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, probability)}%` }}
                transition={{ duration: 0.5 }}
                style={{
                  height: '100%',
                  background: getProbabilityColor(probability),
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-gray)',
            textTransform: 'uppercase',
            marginBottom: '0.25rem'
          }}>
            Possible Future Fault
          </div>
          <motion.div
            key={futureFault}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontSize: '1rem',
              fontWeight: 500,
              color: futureFault === 'None' ? 'var(--color-gray)' : 'var(--color-carbon)'
            }}
          >
            {futureFault}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FaultDiagnosis;