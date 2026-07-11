import React from 'react';
import { motion } from 'framer-motion';
import type { AIAnalysis, HealthMetrics } from '../../../types';

interface AIAnalysisProps {
  analysis: AIAnalysis;
  health: HealthMetrics;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ analysis, health }) => {
  return (
    <div className="card" style={{ gridColumn: '1 / -1' }}>
      <div className="card-header">
        <h3 className="card-title">AI Engineering Analysis</h3>
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--color-gray)',
          background: 'var(--color-cream)',
          padding: '0.25rem 0.75rem',
          borderRadius: 'var(--radius)'
        }}>
          Confidence: {health.confidence}%
        </span>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        <div>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-carbon)',
            marginBottom: '0.75rem'
          }}>
            Root Cause Analysis
          </h4>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--color-gray)',
            lineHeight: 1.6,
            marginBottom: '1rem'
          }}>
            {analysis.rootCause}
          </p>
          
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-carbon)',
            marginBottom: '0.75rem'
          }}>
            Observed Trends
          </h4>
          <ul style={{
            fontSize: '0.875rem',
            color: 'var(--color-gray)',
            lineHeight: 1.8,
            paddingLeft: '1.25rem'
          }}>
            {analysis.observedTrends.map((trend, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {trend}
              </motion.li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-carbon)',
            marginBottom: '0.75rem'
          }}>
            AI Explanation
          </h4>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--color-gray)',
            lineHeight: 1.6,
            background: 'var(--color-cream)',
            padding: '1rem',
            borderRadius: 'var(--radius)',
            marginBottom: '1rem'
          }}>
            {analysis.explanation}
          </div>
          
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-carbon)',
            marginBottom: '0.75rem'
          }}>
            Future Risk Assessment
          </h4>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--color-gray)',
            lineHeight: 1.6,
            marginBottom: '1rem'
          }}>
            {analysis.futureRisk}
          </p>
          
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-carbon)',
            marginBottom: '0.75rem'
          }}>
            Maintenance Recommendation
          </h4>
          <div style={{
            fontSize: '0.875rem',
            color: 'white',
            lineHeight: 1.6,
            background: 'var(--color-carbon)',
            padding: '1rem',
            borderRadius: 'var(--radius)'
          }}>
            {analysis.maintenanceRecommendation}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;