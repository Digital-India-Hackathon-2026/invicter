import { Router } from 'express';
import { SimulationEngine } from '../simulation/SimulationEngine';
import { AIEngine } from '../ai-engine/AIEngine';
import { PredictionEngine } from '../ai-engine/PredictionEngine';
import { ApiResponse, ControlInputs } from '../types';

const router = Router();
const simulationEngine = new SimulationEngine();
const aiEngine = new AIEngine();
const predictionEngine = new PredictionEngine();

let currentState = simulationEngine.getInitialState();

router.get('/state', (req, res) => {
  const history = aiEngine.getHistory();
  
  const response: ApiResponse = {
    success: true,
    data: currentState,
    history: history,
  };
  res.json(response);
});

router.post('/update', (req, res) => {
  try {
    const updates: Partial<ControlInputs> = req.body;
    currentState = simulationEngine.updateState(updates);
    
    const aiAnalysis = aiEngine.analyze(
      currentState.sensors,
      currentState.controls,
      currentState.health,
      currentState.affectedComponents
    );
    
    currentState.aiAnalysis = aiAnalysis;
    
    const response: ApiResponse = {
      success: true,
      data: currentState,
    };
    res.json(response);
  } catch (error) {
    console.error('Update error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update state',
    };
    res.status(500).json(response);
  }
});

router.post('/reset', (req, res) => {
  try {
    currentState = simulationEngine.getInitialState();
    
    const response: ApiResponse = {
      success: true,
      data: currentState,
    };
    res.json(response);
  } catch (error) {
    console.error('Reset error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to reset state',
    };
    res.status(500).json(response);
  }
});

router.get('/predictions', (req, res) => {
  try {
    const predictions = {
      currentFault: currentState.health.currentFault,
      possibleFutureFault: currentState.health.possibleFutureFault,
      failureProbability: currentState.health.failureProbability,
      remainingUsefulLife: currentState.health.remainingUsefulLife,
      confidence: currentState.health.confidence,
      rootCause: currentState.aiAnalysis.rootCause,
      trends: currentState.aiAnalysis.observedTrends,
      recommendation: currentState.aiAnalysis.maintenanceRecommendation,
      timestamp: currentState.timestamp,
    };
    
    res.json({
      success: true,
      predictions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get predictions',
    });
  }
});

router.get('/history', (req, res) => {
  try {
    const history = aiEngine.getHistory();
    
    res.json({
      success: true,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get history',
    });
  }
});

router.get('/predictions/detailed', (req, res) => {
  try {
    const failureMode = predictionEngine.predictFailureMode(
      currentState.sensors,
      currentState.controls
    );
    
    const timeToFailure = predictionEngine.predictTimeToFailure(
      currentState.sensors,
      currentState.health
    );
    
    const maintenanceWindow = predictionEngine.calculateOptimalMaintenanceWindow(
      currentState.health,
      currentState.sensors
    );
    
    const anomalyScore = predictionEngine.generateAnomalyScore(currentState.sensors);
    
    const componentLifespan = predictionEngine.predictComponentLifespan(currentState.sensors);

    res.json({
      success: true,
      predictions: {
        currentHealth: currentState.health,
        failureMode,
        timeToFailure,
        maintenanceWindow,
        anomalyScore,
        componentLifespan,
        aiAnalysis: currentState.aiAnalysis,
        timestamp: currentState.timestamp,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get detailed predictions',
    });
  }
});

export default router;