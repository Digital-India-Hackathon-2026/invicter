export interface SensorData {
  vibration: number;
  bearingTemperature: number;
  rpm: number;
  steamPressure: number;
  powerOutput: number;
  powerConsumption: number;
  steamFlow: number;
  oilPressure: number;
  oilTemperature: number;
}

export interface ControlInputs {
  load: number;
  rpm: number;
  steamPressure: number;
  bearingTemperature: number;
  vibration: number;
}

export interface HealthMetrics {
  healthScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  remainingUsefulLife: number;
  currentFault: string;
  possibleFutureFault: string;
  failureProbability: number;
  confidence: number;
}

export interface AffectedComponent {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'high-risk' | 'critical';
}

export interface AIAnalysis {
  rootCause: string;
  observedTrends: string[];
  explanation: string;
  futureRisk: string;
  maintenanceRecommendation: string;
}

export interface SimulationState {
  controls: ControlInputs;
  sensors: SensorData;
  health: HealthMetrics;
  affectedComponents: AffectedComponent[];
  aiAnalysis: AIAnalysis;
  timestamp: number;
}

export interface HistoricalDataPoint {
  timestamp: number;
  healthScore: number;
  vibration: number;
  temperature: number;
  pressure: number;
  rpm: number;
}