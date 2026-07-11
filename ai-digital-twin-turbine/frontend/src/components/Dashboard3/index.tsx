import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '../../context/SimulationContext';
import SecondaryNav from '../shared/SecondaryNav';
import { motion } from 'framer-motion';

const Dashboard3: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateControl, resetSimulation } = useSimulation();

  if (!state) {
    return (
      <div className="app-container">
        <header className="header">
          <div className="header-content">
            <div className="header-title">
              <h1>Simulation Control Center</h1>
            </div>
            <SecondaryNav active="controls" />
          </div>
        </header>
        <main className="main-content">
          <div className="loading-skeleton" style={{ height: '60vh', borderRadius: '1rem' }} />
        </main>
      </div>
    );
  }

  const controls = [
    {
      key: 'load' as keyof typeof state.controls,
      label: 'Load',
      unit: '%',
      value: state.controls.load,
      min: 0,
      max: 100,
      step: 5,
    },
    {
      key: 'rpm' as keyof typeof state.controls,
      label: 'RPM',
      unit: 'rpm',
      value: state.controls.rpm,
      min: 2500,
      max: 3600,
      step: 50,
    },
    {
      key: 'steamPressure' as keyof typeof state.controls,
      label: 'Steam Pressure',
      unit: 'bar',
      value: state.controls.steamPressure,
      min: 140,
      max: 220,
      step: 5,
    },
    {
      key: 'bearingTemperature' as keyof typeof state.controls,
      label: 'Bearing Temperature',
      unit: '°C',
      value: state.controls.bearingTemperature,
      min: 60,
      max: 120,
      step: 2,
    },
    {
      key: 'vibration' as keyof typeof state.controls,
      label: 'Vibration',
      unit: 'mm/s',
      value: state.controls.vibration,
      min: 1,
      max: 8,
      step: 0.5,
    },
  ];

  const handleControlChange = async (key: string, value: number) => {
    await updateControl({ [key]: value });
  };

  const handleReset = async () => {
    await resetSimulation();
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>Simulation Control Center</h1>
          </div>
          <SecondaryNav active="controls" />
        </div>
      </header>

      <main className="main-content">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--color-carbon)'
          }}>
            Control Parameters
          </h2>
          <button
            className="btn btn-secondary"
            onClick={handleReset}
          >
            🔄 Reset to Defaults
          </button>
        </div>

        <div className="dashboard-grid">
          {controls.map((control) => (
            <ControlCard
              key={control.key}
              control={control}
              onChange={handleControlChange}
            />
          ))}
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">Current System Status</h3>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <StatusItem label="Health Score" value={`${state.health.healthScore}%`} />
            <StatusItem label="Risk Level" value={state.health.riskLevel} />
            <StatusItem label="Remaining Life" value={`${state.health.remainingUsefulLife} hrs`} />
            <StatusItem label="Failure Probability" value={`${state.health.failureProbability.toFixed(1)}%`} />
          </div>
        </div>
      </main>
    </div>
  );
};

interface ControlCardProps {
  control: {
    key: string;
    label: string;
    unit: string;
    value: number;
    min: number;
    max: number;
    step: number;
  };
  onChange: (key: string, value: number) => void;
}

const ControlCard: React.FC<ControlCardProps> = ({ control, onChange }) => {
  const handleIncrease = () => {
    onChange(control.key, Math.min(control.max, control.value + control.step));
  };

  const handleDecrease = () => {
    onChange(control.key, Math.max(control.min, control.value - control.step));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{control.label}</h3>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '1rem 0'
      }}>
        <motion.button
          className="btn btn-outline btn-icon"
          onClick={handleDecrease}
          whileTap={{ scale: 0.95 }}
        >
          ▼
        </motion.button>
        
        <div style={{
          textAlign: 'center',
          minWidth: '120px'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--color-carbon)',
            fontFamily: 'var(--font-mono)'
          }}>
            {control.value.toFixed(control.step < 1 ? 1 : 0)}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-gray)',
            textTransform: 'uppercase'
          }}>
            {control.unit}
          </div>
        </div>
        
        <motion.button
          className="btn btn-primary btn-icon"
          onClick={handleIncrease}
          whileTap={{ scale: 0.95 }}
        >
          ▲
        </motion.button>
      </div>

      <div style={{
        width: '100%',
        height: '6px',
        background: 'var(--color-gray-lighter)',
        borderRadius: '3px',
        overflow: 'hidden'
      }}>
        <div
          style={{
            height: '100%',
            width: `${((control.value - control.min) / (control.max - control.min)) * 100}%`,
            background: 'var(--color-emerald)',
            borderRadius: '3px',
            transition: 'width 0.3s ease'
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '0.5rem',
        fontSize: '0.625rem',
        color: 'var(--color-gray)'
      }}>
        <span>{control.min}</span>
        <span>{control.max}</span>
      </div>
    </div>
  );
};

interface StatusItemProps {
  label: string;
  value: string;
}

const StatusItem: React.FC<StatusItemProps> = ({ label, value }) => (
  <div>
    <div style={{
      fontSize: '0.75rem',
      color: 'var(--color-gray)',
      textTransform: 'uppercase',
      marginBottom: '0.25rem'
    }}>
      {label}
    </div>
    <div style={{
      fontSize: '1.25rem',
      fontWeight: 600,
      color: 'var(--color-carbon)'
    }}>
      {value}
    </div>
  </div>
);

export default Dashboard3;