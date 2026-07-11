import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '../../context/SimulationContext';
import DigitalTwin from './DigitalTwin';
import SensorCards from './SensorCards';
import HistoricalGraphs from './Graphs';
import HealthScore from './HealthRisk/HealthScore';
import RiskMeter from './HealthRisk/RiskMeter';
import FaultDiagnosis from './FaultDiagnosis';
import AIAnalysis from './AIAnalysis';
import SecondaryNav from '../shared/SecondaryNav';

const Dashboard1: React.FC = () => {
  const navigate = useNavigate();
  const { state, loading, error } = useSimulation();

  if (loading) {
    return (
      <div className="app-container">
        <header className="header">
          <div className="header-content">
            <div className="header-title">
              <h1>AI Digital Twin</h1>
              <span className="subtitle">Turbine Monitoring System</span>
            </div>
            <nav className="nav-links">
              <button className="nav-link active">Live Dashboard</button>
              <button className="nav-link" onClick={() => navigate('/report')}>AI Report</button>
              <button className="nav-link" onClick={() => navigate('/controls')}>Controls</button>
            </nav>
          </div>
        </header>
        <main className="main-content">
          <div className="loading-skeleton" style={{ height: '60vh', borderRadius: '1rem' }} />
        </main>
      </div>
    );
  }

  if (error || !state) {
    return (
      <div className="app-container">
        <header className="header">
          <div className="header-content">
            <div className="header-title">
              <h1>AI Digital Twin</h1>
              <span className="subtitle">Turbine Monitoring System</span>
            </div>
            <nav className="nav-links">
              <button className="nav-link active">Live Dashboard</button>
              <button className="nav-link" onClick={() => navigate('/report')}>AI Report</button>
              <button className="nav-link" onClick={() => navigate('/controls')}>Controls</button>
            </nav>
          </div>
        </header>
        <main className="main-content">
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h2>Error Loading Dashboard</h2>
            <p style={{ color: 'var(--color-gray)', marginTop: '0.5rem' }}>
              {error || 'Unable to connect to simulation server'}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
              style={{ marginTop: '1rem' }}
            >
              Reload
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>AI Digital Twin</h1>
            <span className="subtitle">Turbine Monitoring System</span>
          </div>
          <SecondaryNav active="dashboard" />
        </div>
      </header>
      
      <main className="main-content">
        <div style={{ marginBottom: '2rem' }}>
          <DigitalTwin affectedComponents={state.affectedComponents} health={state.health} />
        </div>

        <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
          {healthScore: 1}
          <HealthScore health={state.health} />
          <RiskMeter riskLevel={state.health.riskLevel} healthScore={state.health.healthScore} />
          <FaultDiagnosis fault={state.health.currentFault} probability={state.health.failureProbability} futureFault={state.health.possibleFutureFault} />
          <SensorCards sensors={state.sensors} />
        </div>

        <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
          <AIAnalysis analysis={state.aiAnalysis} health={state.health} />
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Historical Trends</h3>
          </div>
          <HistoricalGraphs />
        </div>
      </main>
    </div>
  );
};

export default Dashboard1;