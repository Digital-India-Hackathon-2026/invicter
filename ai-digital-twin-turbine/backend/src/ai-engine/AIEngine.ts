import { SensorData, ControlInputs, HealthMetrics, HistoricalDataPoint } from '../types';

export class PredictionEngine {
  private failureThresholds = {
    vibration: 7.0,
    bearingTemperature: 110,
    rpm: 3600,
    steamPressure: 220,
  };

  predictTimeToFailure(sensors: SensorData, health: HealthMetrics): number {
    const { vibration, bearingTemperature } = sensors;
    const { healthScore } = health;

    if (healthScore < 20) {
      return Math.max(1, Math.round(healthScore * 0.5));
    }

    const vFactor = Math.max(0, (vibration - 4.0) * 15);
    const tFactor = Math.max(0, (bearingTemperature - 85) * 3);
    
    const baseTime = 500;
    const adjustedTime = baseTime - vFactor - tFactor;
    
    return Math.max(1, Math.round(adjustedTime * (healthScore / 100)));
  }

  predictFailureMode(sensors: SensorData, controls: ControlInputs): {
    primary: string;
    secondary: string;
    confidence: number;
  } {
    const { vibration, bearingTemperature, rpm, oilTemperature } = sensors;
    
    let primary = 'Normal Operation';
    let secondary = 'No secondary failure mode';
    let confidence = 95;

    if (vibration > 5.5) {
      primary = 'Bearing Failure';
      secondary = 'Rotor Imbalance';
      confidence = 85;
    } else if (vibration > 4.5) {
      primary = 'Mechanical Wear';
      secondary = 'Lubrication Degradation';
      confidence = 75;
    }

    if (bearingTemperature > 95) {
      primary = 'Thermal Overload';
      secondary = 'Lubrication Failure';
      confidence = 90;
    } else if (bearingTemperature > 85) {
      primary = 'Overheating';
      secondary = 'Bearing Degradation';
      confidence = 80;
    }

    if (oilTemperature > 75) {
      secondary = 'Oil Degradation';
      confidence -= 10;
    }

    if (rpm > 3400) {
      primary = 'Overspeed Damage';
      confidence = 88;
    }

    return { primary, secondary, confidence: Math.max(50, confidence) };
  }

  calculateOptimalMaintenanceWindow(
    health: HealthMetrics,
    sensors: SensorData
  ): {
    recommendedHours: number;
    urgency: 'immediate' | 'soon' | 'scheduled' | 'routine';
    reason: string;
  } {
    const { healthScore, remainingUsefulLife, failureProbability } = health;

    if (healthScore < 40 || failureProbability > 70) {
      return {
        recommendedHours: 0,
        urgency: 'immediate',
        reason: 'Critical condition detected. Immediate maintenance required to prevent failure.',
      };
    }

    if (healthScore < 60 || failureProbability > 40) {
      return {
        recommendedHours: 24,
        urgency: 'soon',
        reason: 'Elevated risk detected. Schedule maintenance within 24 hours.',
      };
    }

    if (healthScore < 80 || remainingUsefulLife < 200) {
      return {
        recommendedHours: 168,
        urgency: 'scheduled',
        reason: 'Degradation trends observed. Plan maintenance within 1 week.',
      };
    }

    return {
      recommendedHours: 500,
      urgency: 'routine',
      reason: 'Normal operating conditions. Continue regular maintenance schedule.',
    };
  }

  generateAnomalyScore(sensors: SensorData): {
    overall: number;
    bySensor: Record<string, number>;
  } {
    const normalRanges = {
      vibration: { mean: 2.75, std: 1.25 },
      bearingTemperature: { mean: 75, std: 10 },
      rpm: { mean: 3000, std: 200 },
      steamPressure: { mean: 165, std: 15 },
      powerOutput: { mean: 500, std: 75 },
      oilTemperature: { mean: 55, std: 10 },
    };

    const bySensor: Record<string, number> = {};
    let totalAnomaly = 0;

    Object.entries(normalRanges).forEach(([key, { mean, std }]) => {
      const value = sensors[key as keyof SensorData] as number;
      const zScore = Math.abs((value - mean) / std);
      const anomalyScore = Math.min(100, zScore * 30);
      
      bySensor[key] = Math.round(anomalyScore * 10) / 10;
      totalAnomaly += anomalyScore;
    });

    const overall = Math.round((totalAnomaly / Object.keys(normalRanges).length) * 10) / 10;

    return {
      overall,
      bySensor,
    };
  }

  predictComponentLifespan(sensors: SensorData): Record<string, number> {
    const { vibration, bearingTemperature, oilTemperature } = sensors;

    const baseLifespan = 10000; // hours
    
    const bearingLifespan = baseLifespan * 
      (1 - (bearingTemperature - 65) / 100) * 
      (1 - (vibration - 1.5) / 10);

    const rotorLifespan = baseLifespan * 
      (1 - (vibration - 1.5) / 8) *
      (1 - (bearingTemperature - 65) / 150);

    const sealLifespan = baseLifespan * 
      (1 - (oilTemperature - 45) / 120) *
      (1 - (vibration - 1.5) / 12);

    const lubricationLifespan = baseLifespan * 
      (1 - (oilTemperature - 45) / 100);

    return {
      bearing: Math.max(100, Math.round(bearingLifespan)),
      rotor: Math.max(100, Math.round(rotorLifespan)),
      seal: Math.max(100, Math.round(sealLifespan)),
      lubrication: Math.max(100, Math.round(lubricationLifespan)),
    };
  }
}