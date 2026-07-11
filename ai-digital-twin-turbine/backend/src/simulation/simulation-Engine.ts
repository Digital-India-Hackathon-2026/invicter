import { SensorData, ControlInputs, AffectedComponent, AIAnalysis, HealthMetrics, SimulationState } from '../types';

export class SimulationEngine {
  private baseState: ControlInputs = {
    load: 75,
    rpm: 3000,
    steamPressure: 165,
    bearingTemperature: 75,
    vibration: 2.5,
  };

  private normalRanges = {
    vibration: { min: 1.5, max: 4.0, warning: 5.5, critical: 7.0 },
    bearingTemperature: { min: 65, max: 85, warning: 95, critical: 110 },
    rpm: { min: 2800, max: 3200, warning: 3400, critical: 3600 },
    steamPressure: { min: 150, max: 180, warning: 200, critical: 220 },
    powerOutput: { min: 400, max: 600, warning: 650, critical: 700 },
    powerConsumption: { min: 20, max: 40, warning: 50, critical: 60 },
    steamFlow: { min: 150, max: 250, warning: 280, critical: 300 },
    oilPressure: { min: 1.5, max: 3.0, warning: 3.5, critical: 4.0 },
    oilTemperature: { min: 45, max: 65, warning: 75, critical: 85 },
  };

  calculateSensors(controls: ControlInputs): SensorData {
    const { load, rpm, steamPressure, bearingTemperature, vibration } = controls;
    const loadFactor = load / 100;

    const powerOutput = 400 + (loadFactor * 250) + (rpm - 3000) * 0.05;
    const powerConsumption = 25 + (loadFactor * 20) + (rpm - 3000) * 0.01;
    const steamFlow = 150 + (loadFactor * 120) + (steamPressure - 165) * 0.5;
    const oilPressure = 2.0 + (loadFactor * 1.2) + (rpm - 3000) * 0.0003;
    const oilTemperature = 50 + (loadFactor * 20) + (bearingTemperature - 75) * 0.3;

    return {
      vibration: this.addVariation(vibration, 0.1),
      bearingTemperature: this.addVariation(bearingTemperature, 0.5),
      rpm: this.addVariation(rpm, 5),
      steamPressure: this.addVariation(steamPressure, 1),
      powerOutput: this.addVariation(powerOutput, 2),
      powerConsumption: this.addVariation(powerConsumption, 0.5),
      steamFlow: this.addVariation(steamFlow, 3),
      oilPressure: this.addVariation(oilPressure, 0.05),
      oilTemperature: this.addVariation(oilTemperature, 0.3),
    };
  }

  private addVariation(value: number, variation: number): number {
    const noise = (Math.random() - 0.5) * 2 * variation;
    return Math.max(0, value + noise);
  }

  calculateHealthMetrics(sensors: SensorData, controls: ControlInputs): HealthMetrics {
    const { vibration, bearingTemperature, rpm, steamPressure } = sensors;
    
    let healthScore = 100;
    let riskLevel: HealthMetrics['riskLevel'] = 'Low';

    const vHealth = this.getHealthFromValue(vibration, this.normalRanges.vibration);
    const tHealth = this.getHealthFromValue(bearingTemperature, this.normalRanges.bearingTemperature);
    const rHealth = this.getHealthFromValue(rpm, this.normalRanges.rpm);
    const pHealth = this.getHealthFromValue(steamPressure, this.normalRanges.steamPressure);

    healthScore = Math.min(100, Math.max(0, (vHealth * 0.3 + tHealth * 0.3 + rHealth * 0.2 + pHealth * 0.2)));

    if (healthScore >= 80) riskLevel = 'Low';
    else if (healthScore >= 60) riskLevel = 'Medium';
    else if (healthScore >= 40) riskLevel = 'High';
    else riskLevel = 'Critical';

    const failureProbability = this.calculateFailureProbability(sensors, controls);
    const remainingUsefulLife = this.calculateRUL(healthScore, vibration, bearingTemperature);
    const { currentFault, possibleFutureFault } = this.diagnoseFault(sensors, controls);
    const confidence = this.calculateConfidence(healthScore, failureProbability);

    return {
      healthScore: Math.round(healthScore * 10) / 10,
      riskLevel,
      remainingUsefulLife,
      currentFault,
      possibleFutureFault,
      failureProbability: Math.round(failureProbability * 10) / 10,
      confidence: Math.round(confidence * 10) / 10,
    };
  }

  private getHealthFromValue(value: number, range: { min: number; max: number; warning: number; critical: number }): number {
    if (value >= range.min && value <= range.max) return 100;
    if (value <= range.warning) return 100 - ((value - range.max) / (range.warning - range.max)) * 20;
    if (value <= range.critical) return 80 - ((value - range.warning) / (range.critical - range.warning)) * 40;
    return 40 - Math.min(40, (value - range.critical) * 10);
  }

  private calculateFailureProbability(sensors: SensorData, controls: ControlInputs): number {
    const { vibration, bearingTemperature } = sensors;
    const baseProb = 5;
    
    const vFactor = Math.max(0, (vibration - 4.0) * 8);
    const tFactor = Math.max(0, (bearingTemperature - 85) * 1.5);
    
    return Math.min(95, baseProb + vFactor + tFactor);
  }

  private calculateRUL(healthScore: number, vibration: number, temperature: number): number {
    const baseRUL = 500;
    const healthFactor = healthScore / 100;
    const vFactor = Math.max(0, (vibration - 4.0) * 20);
    const tFactor = Math.max(0, (temperature - 85) * 5);
    
    return Math.max(1, Math.round(baseRUL * healthFactor - vFactor - tFactor));
  }

  private diagnoseFault(sensors: SensorData, controls: ControlInputs): { currentFault: string; possibleFutureFault: string } {
    const { vibration, bearingTemperature, rpm, steamPressure } = sensors;
    
    let currentFault = 'None';
    let possibleFutureFault = 'None';

    if (vibration > 5.5) {
      currentFault = 'Excessive Vibration';
      possibleFutureFault = 'Bearing Failure';
    } else if (bearingTemperature > 95) {
      currentFault = 'Overheating';
      possibleFutureFault = 'Lubrication Failure';
    } else if (vibration > 4.5 || bearingTemperature > 85) {
      currentFault = 'Early Warning Signs';
      possibleFutureFault = 'Mechanical Wear';
    }

    if (rpm > 3400) {
      possibleFutureFault = 'Overspeed Damage';
    }
    if (steamPressure > 200) {
      possibleFutureFault = 'Pressure Vessel Stress';
    }

    return { currentFault, possibleFutureFault };
  }

  private calculateConfidence(healthScore: number, failureProbability: number): number {
    if (healthScore > 80 && failureProbability < 15) return 92;
    if (healthScore > 60 && failureProbability < 40) return 85;
    if (healthScore > 40) return 78;
    return 70;
  }

  calculateAffectedComponents(sensors: SensorData, controls: ControlInputs): AffectedComponent[] {
    const { vibration, bearingTemperature, rpm, steamPressure, oilTemperature } = sensors;
    
    const components: AffectedComponent[] = [
      { id: 'rotor', name: 'Rotor Assembly', status: 'healthy' },
      { id: 'bearing', name: 'Main Bearing', status: 'healthy' },
      { id: 'blades', name: 'Turbine Blades', status: 'healthy' },
      { id: 'casing', name: 'Casing', status: 'healthy' },
      { id: 'seals', name: 'Seal System', status: 'healthy' },
      { id: 'lubrication', name: 'Lubrication System', status: 'healthy' },
      { id: 'governor', name: 'Governor', status: 'healthy' },
      { id: 'condenser', name: 'Condenser', status: 'healthy' },
    ];

    if (vibration > 5.5) {
      components.find(c => c.id === 'rotor')!.status = 'critical';
      components.find(c => c.id === 'bearing')!.status = 'high-risk';
      components.find(c => c.id === 'blades')!.status = 'warning';
    } else if (vibration > 4.5) {
      components.find(c => c.id === 'rotor')!.status = 'warning';
      components.find(c => c.id === 'bearing')!.status = 'warning';
    }

    if (bearingTemperature > 95) {
      components.find(c => c.id === 'bearing')!.status = 'critical';
      components.find(c => c.id === 'lubrication')!.status = 'high-risk';
    } else if (bearingTemperature > 85) {
      components.find(c => c.id === 'bearing')!.status = 'warning';
      components.find(c => c.id === 'lubrication')!.status = 'warning';
    }

    if (oilTemperature > 75) {
      components.find(c => c.id === 'lubrication')!.status = 'high-risk';
    }

    if (rpm > 3400) {
      components.find(c => c.id === 'governor')!.status = 'warning';
    }

    if (steamPressure > 200) {
      components.find(c => c.id === 'casing')!.status = 'warning';
      components.find(c => c.id === 'seals')!.status = 'warning';
    }

    return components;
  }

  generateAIAnalysis(sensors: SensorData, controls: ControlInputs, health: HealthMetrics): AIAnalysis {
    const { vibration, bearingTemperature, rpm, steamPressure, oilTemperature } = sensors;
    const { load } = controls;

    const trends: string[] = [];
    let rootCause = 'Normal operating conditions';
    let explanation = 'All parameters within normal ranges. Turbine operating efficiently.';
    let futureRisk = 'Low risk of failure in the next 100 hours';
    let recommendation = 'Continue regular maintenance schedule. No immediate action required.';

    if (vibration > 4.5) {
      trends.push(`Vibration elevated at ${vibration.toFixed(1)} mm/s (normal: <4.0)`);
    }
    if (bearingTemperature > 85) {
      trends.push(`Bearing temperature rising: ${bearingTemperature.toFixed(1)}°C (normal: <85°C)`);
    }
    if (oilTemperature > 65) {
      trends.push(`Oil temperature increased to ${oilTemperature.toFixed(1)}°C`);
    }

    if (vibration > 5.5) {
      rootCause = 'Excessive mechanical vibration detected, likely due to rotor imbalance or bearing wear';
      explanation = `Vibration levels at ${vibration.toFixed(1)} mm/s exceed safe thresholds. This indicates potential mechanical issues in the rotor assembly or bearing system. Immediate inspection recommended.`;
      futureRisk = 'High risk of bearing failure within 24-48 hours if not addressed';
      recommendation = 'IMMEDIATE: Schedule emergency inspection. Check rotor balance, bearing clearance, and lubrication system. Consider reducing load by 20% until inspection.';
    } else if (bearingTemperature > 95) {
      rootCause = 'Bearing overheating due to inadequate lubrication or excessive friction';
      explanation = `Bearing temperature at ${bearingTemperature.toFixed(1)}°C indicates severe overheating. This can lead to bearing material degradation and potential seizure.`;
      futureRisk = 'Critical risk of bearing failure within 12-24 hours';
      recommendation = 'URGENT: Check oil pressure and flow rate. Inspect oil cooler. Verify oil viscosity and contamination levels. Prepare for bearing replacement.';
    } else if (vibration > 4.5 || bearingTemperature > 85) {
      rootCause = 'Early signs of mechanical wear developing';
      explanation = `Parameters showing degradation trends. Vibration at ${vibration.toFixed(1)} mm/s and temperature at ${bearingTemperature.toFixed(1)}°C indicate developing issues.`;
      futureRisk = 'Moderate risk of failure within 50-100 hours';
      recommendation = 'Increase monitoring frequency. Schedule inspection within 48 hours. Check lubrication system and alignment.';
    }

    if (load > 90) {
      trends.push(`Operating at ${load}% load - near maximum capacity`);
      if (trends.length === 0) {
        futureRisk = 'Elevated risk due to high load operation';
        recommendation = 'Monitor closely. Consider load reduction if vibration or temperature increases further.';
      }
    }

    return {
      rootCause,
      observedTrends: trends.length > 0 ? trends : ['All parameters stable', 'No significant trends detected'],
      explanation,
      futureRisk,
      maintenanceRecommendation: recommendation,
    };
  }

  updateState(controls: Partial<ControlInputs>): SimulationState {
    const currentControls = { ...this.baseState, ...controls };
    const sensors = this.calculateSensors(currentControls);
    const health = this.calculateHealthMetrics(sensors, currentControls);
    const affectedComponents = this.calculateAffectedComponents(sensors, currentControls);
    const aiAnalysis = this.generateAIAnalysis(sensors, currentControls, health);

    return {
      controls: currentControls,
      sensors,
      health,
      affectedComponents,
      aiAnalysis,
      timestamp: Date.now(),
    };
  }

  getInitialState(): SimulationState {
    return this.updateState({});
  }
}