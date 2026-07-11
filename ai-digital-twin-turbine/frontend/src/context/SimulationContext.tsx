import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { SimulationState, HistoricalDataPoint, ControlInputs } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

interface SimulationContextType {
  state: SimulationState | null;
  history: HistoricalDataPoint[];
  loading: boolean;
  error: string | null;
  updateControl: (control: Partial<ControlInputs>) => Promise<void>;
  resetSimulation: () => Promise<void>;
  refreshState: () => Promise<void>;
  generateReport: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SimulationState | null>(null);
  const [history, setHistory] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchState = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/state`);
      if (response.data.success) {
        setState(response.data.data);
        setHistory(response.data.history || []);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch simulation state');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateControl = async (control: Partial<ControlInputs>) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/update`, control);
      if (response.data.success) {
        setState(response.data.data);
      }
    } catch (err) {
      setError('Failed to update control');
    }
  };

  const resetSimulation = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reset`);
      if (response.data.success) {
        setState(response.data.data);
      }
    } catch (err) {
      setError('Failed to reset simulation');
    }
  };

  const refreshState = async () => {
    await fetchState();
  };

  const generateReport = () => {
    window.location.href = '/report';
  };

  return (
    <SimulationContext.Provider
      value={{
        state,
        history,
        loading,
        error,
        updateControl,
        resetSimulation,
        refreshState,
        generateReport,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};