import React, { useEffect, useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import SecondaryNav from '../shared/SecondaryNav';
import { SimulationState } from '../../types';

const Dashboard2: React.FC = () => {
  const { state } = useSimulation();
  const [reportData, setReportData] = useState<SimulationState | null>(null);

  useEffect(() => {
    if (state) {
      setReportData(state);
    }
  }, [state]);

  if (!reportData) {
    return (
      <div className="app-container">
        <header className="header">
          <div className="header-content">
            <div className="header-title">
              <h1>AI Engineering Report</h1>
            </div>
            <SecondaryNav active="report" />
          </div>
        </header>
        <main className="main-content">
          <div className="loading-skeleton" style={{ height: '60vh', borderRadius: '1rem' }} />
        </main>
      </div>
    );
  }

  const { sensors, health, affectedComponents, aiAnalysis, controls } = reportData;

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>AI Engineering Report</h1>
          </div>
          <SecondaryNav active="report" />
        </div>
      </header>

      <main className="main-content">
        <button
          className="btn btn-primary"
          onClick={() => window.print()}
          style={{ marginBottom: '2rem' }}
        >
          📄 Print Report
        </button>

        <div className="card" style={{
          background: 'white',
          padding: '3rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem',
            paddingBottom: '2rem',
            borderBottom: '2px solid var(--color-emerald)'
          }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--color-carbon)',
              marginBottom: '0.5rem'
            }}>
              Turbine Health Assessment Report
            </h1>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--color-gray)'
            }}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <ReportSection
              title="Overall Health Status"
              value={`${health.healthScore}%`}
              color={health.healthScore >= 80 ? 'var(--color-emerald)' : 
                     health.healthScore >= 60 ? 'var(--color-warning)' :
                     health.healthScore >= 40 ? 'var(--color-high-risk)' : 'var(--color-danger)'}
            />
            <ReportSection
              title="Risk Level"
              value={health.riskLevel}
              color={health.riskLevel === 'Low' ? 'var(--color-emerald)' :
                     health.riskLevel === 'Medium' ? 'var(--color-warning)' :
                     health.riskLevel === 'High' ? 'var(--color-high-risk)' : 'var(--color-danger)'}
            />
            <ReportSection
              title="Remaining Useful Life"
              value={`${health.remainingUsefulLife} hours`}
              color="var(--color-carbon)"
            />
            <ReportSection
              title="Failure Probability"
              value={`${health.failureProbability.toFixed(1)}%`}
              color={health.failureProbability >= 70 ? 'var(--color-danger)' :
                     health.failureProbability >= 40 ? 'var(--color-high-risk)' :
                     health.failureProbability >= 20 ? 'var(--color-warning)' : 'var(--color-emerald)'}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--color-carbon)',
              marginBottom: '1rem',
              borderBottom: '1px solid var(--color-gray-lighter)',
              paddingBottom: '0.5rem'
            }}>
              Current Fault Status
            </h3>
            <p style={{
              fontSize: '1rem',
              color: 'var(--color-carbon)',
              lineHeight: 1.6
            }}>
              <strong>Current Fault:</strong> {health.currentFault}
              <br />
              <strong>Possible Future Fault:</strong> {health.possibleFutureFault}
              <br />
              <strong>Confidence Level:</strong> {health.confidence}%
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--color-carbon)',
              marginBottom: '1rem',
              borderBottom: '1px solid var(--color-gray-lighter)',
              paddingBottom: '0.5rem'
            }}>
              Sensor Summary
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              fontSize: '0.875rem'
            }}>
              <SensorItem label="Vibration" value={`${sensors.vibration.toFixed(2)} mm/s`} />
              <SensorItem label="Bearing Temp" value={`${sensors.bearingTemperature.toFixed(1)}°C`} />
              <SensorItem label="RPM" value={`${sensors.rpm.toFixed(0)}`} />
              <SensorItem label="Steam Pressure" value={`${sensors.steamPressure.toFixed(1)} bar`} />
              <SensorItem label="Power Output" value={`${sensors.powerOutput.toFixed(1)} MW`} />
              <SensorItem label="Steam Flow" value={`${sensors.steamFlow.toFixed(1)} kg/s`} />
              <SensorItem label="Oil Pressure" value={`${sensors.oilPressure.toFixed(2)} bar`} />
              <SensorItem label="Oil Temperature" value={`${sensors.oilTemperature.toFixed(1)}°C`} />
              <SensorItem label="Load" value={`${controls.load.toFixed(0)}%`} />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--color-carbon)',
              marginBottom: '1rem',
              borderBottom: '1px solid var(--color-gray-lighter)',
              paddingBottom: '0.5rem'
            }}>
              Root Cause Analysis
            </h3>
            <p style={{
              fontSize: '0.9375rem',
              color: 'var(--color-carbon)',
              lineHeight: 1.7,
              background: 'var(--color-cream)',
              padding: '1rem',
              borderRadius: 'var(--radius)'
            }}>
              {aiAnalysis.rootCause}
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--color-carbon)',
              marginBottom: '1rem',
              borderBottom: '1px solid var(--color-gray-lighter)',
              paddingBottom: '0.5rem'
            }}>
              Observed Trends
            </h3>
            <ul style={{
              fontSize: '0.9375rem',
              color: 'var(--color-carbon)',
              lineHeight: 1.8,
              paddingLeft: '1.5rem'
            }}>
              {aiAnalysis.observedTrends.map((trend, index) => (
                <li key={index}>{trend}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--color-carbon)',
              marginBottom: '1rem',
              borderBottom: '1px solid var(--color-gray-lighter)',
              paddingBottom: '0.5rem'
            }}>
              Affected Components
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem'
            }}>
              {affectedComponents.map(component => (
                <div
                  key={component.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    padding: '0.5rem',
                    background: 'var(--color-cream)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div
                    style={{
                      width: '0.75rem',
                      height: '0.75rem',
                      borderRadius: '50%',
                      background: component.status === 'critical' ? 'var(--color-danger)' :
                                 component.status === 'high-risk' ? 'var(--color-high-risk)' :
                                 component.status === 'warning' ? 'var(--color-warning)' : 'var(--color-emerald)'
                    }}
                  />
                  {component.name}: {component.status.replace('-', ' ').toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--color-carbon)',
              marginBottom: '1rem',
              borderBottom: '1px solid var(--color-gray-lighter)',
              paddingBottom: '0.5rem'
            }}>
              Maintenance Recommendation
            </h3>
            <p style={{
              fontSize: '0.9375rem',
              color: 'white',
              lineHeight: 1.7,
              background: 'var(--color-carbon)',
              padding: '1.25rem',
              borderRadius: 'var(--radius)'
            }}>
              {aiAnalysis.maintenanceRecommendation}
            </p>
          </div>

          <div style={{
            borderTop: '2px solid var(--color-gray-lighter)',
            paddingTop: '2rem',
            marginTop: '2rem',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--color-gray)'
            }}>
              This report is generated by AI Digital Twin System<br />
              Generated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

interface ReportSectionProps {
  title: string;
  value: string;
  color: string;
}

const ReportSection: React.FC<ReportSectionProps> = ({ title, value, color }) => (
  <div style={{
    background: 'var(--color-cream)',
    padding: '1.25rem',
    borderRadius: 'var(--radius)',
    textAlign: 'center'
  }}>
    <div style={{
      fontSize: '0.75rem',
      color: 'var(--color-gray)',
      textTransform: 'uppercase',
      marginBottom: '0.5rem'
    }}>
      {title}
    </div>
    <div style={{
      fontSize: '1.5rem',
      fontWeight: 700,
      color: color,
      fontFamily: 'var(--font-mono)'
    }}>
      {value}
    </div>
  </div>
);

interface SensorItemProps {
  label: string;
  value: string;
}

const SensorItem: React.FC<SensorItemProps> = ({ label, value }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem',
    background: 'var(--color-cream)',
    borderRadius: 'var(--radius-sm)'
  }}>
    <span style={{ color: 'var(--color-gray)', fontSize: '0.8125rem' }}>{label}</span>
    <span style={{ fontWeight: 600, color: 'var(--color-carbon)', fontSize: '0.8125rem' }}>{value}</span>
  </div>
);

export default Dashboard2;