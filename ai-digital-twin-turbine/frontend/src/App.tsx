import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';
import Dashboard1 from './components/Dashboard1';
import Dashboard2 from './components/Dashboard2';
import Dashboard3 from './components/Dashboard3';

const App: React.FC = () => {
  return (
    <SimulationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard1 />} />
          <Route path="/report" element={<Dashboard2 />} />
          <Route path="/controls" element={<Dashboard3 />} />
        </Routes>
      </Router>
    </SimulationProvider>
  );
};

export default App;