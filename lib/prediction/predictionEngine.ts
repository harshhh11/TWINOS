import { PredictionPoint } from '@/types';

export interface TelemetryAnomaly {
  id: string;
  metric: 'ENERGY' | 'TEMPERATURE' | 'VIBRATION' | 'POWER_DRAW';
  currentValue: number;
  expectedBaseline: number;
  percentageDeviation: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  location: string;
  description: string;
}

/**
 * Operational Telemetry & Asset Degradation Prediction Engine
 * Generates forward projections for equipment load and operational degradation trends.
 */
export function getAssetDegradationPrediction(
  currentLoad: number,
  isHighLoadEvent: boolean
): {
  points: PredictionPoint[];
  forecastSummary: string;
  peakLoadPercent: number;
  timeToPeakMinutes: number;
  confidencePercent: number;
} {
  const peak = isHighLoadEvent ? 92 : Math.min(85, currentLoad + 6);
  const timeToPeak = 25;
  const confidence = 88;

  const points: PredictionPoint[] = [
    { timeLabel: 'Now', timestamp: 0, actual: currentLoad, predicted: currentLoad, upperConfidence: currentLoad + 2, lowerConfidence: currentLoad - 2 },
    { timeLabel: '15m', timestamp: 15, predicted: Math.round(currentLoad + (peak - currentLoad) * 0.6), upperConfidence: peak + 3, lowerConfidence: peak - 5 },
    { timeLabel: '30m', timestamp: 30, predicted: peak, upperConfidence: peak + 4, lowerConfidence: peak - 6 },
    { timeLabel: '45m', timestamp: 45, predicted: Math.round(peak * 0.94), upperConfidence: peak, lowerConfidence: peak - 8 },
    { timeLabel: '1h', timestamp: 60, predicted: Math.round(peak * 0.82), upperConfidence: peak - 6, lowerConfidence: peak - 14 },
    { timeLabel: '2h', timestamp: 120, predicted: 65, upperConfidence: 70, lowerConfidence: 58 },
  ];

  const forecastSummary = isHighLoadEvent
    ? `Thermal and power load projected to reach ${peak}% within ${timeToPeak} minutes with ${confidence}% confidence under current flight operations bank.`
    : `System operational load expected to stabilize near ${Math.round(currentLoad * 0.92)}% over the next 2 hours.`;

  return {
    points,
    forecastSummary,
    peakLoadPercent: peak,
    timeToPeakMinutes: timeToPeak,
    confidencePercent: confidence,
  };
}

/**
 * Evaluates real-time sensor streams against rolling expected baselines
 */
export function detectAnomalies(
  energyKwh: number,
  temperatureC: number,
  vibrationMmS: number = 2.4
): TelemetryAnomaly[] {
  const anomalies: TelemetryAnomaly[] = [];

  // Energy baseline: 19,000 kWh
  if (energyKwh > 23000) {
    const deviation = Math.round(((energyKwh - 19000) / 19000) * 100);
    anomalies.push({
      id: 'anom-energy',
      metric: 'ENERGY',
      currentValue: energyKwh,
      expectedBaseline: 19000,
      percentageDeviation: deviation,
      severity: deviation > 25 ? 'HIGH' : 'MEDIUM',
      location: 'Terminal B Main Power Feed & HVAC Chiller Loop',
      description: `Energy consumption ${deviation}% above normal operational baseline.`,
    });
  }

  // Temperature baseline: 24°C
  if (temperatureC > 28) {
    const deviation = Math.round(((temperatureC - 24) / 24) * 100);
    anomalies.push({
      id: 'anom-temp',
      metric: 'TEMPERATURE',
      currentValue: temperatureC,
      expectedBaseline: 24,
      percentageDeviation: deviation,
      severity: 'MEDIUM',
      location: 'HVAC Air Handler 03 (Zone B2 Technical Room)',
      description: `Coil temperature running ${temperatureC.toFixed(1)}°C, risk of thermal throttling.`,
    });
  }

  // Vibration baseline: 1.5 mm/s
  if (vibrationMmS > 2.0) {
    const deviation = Math.round(((vibrationMmS - 1.5) / 1.5) * 100);
    anomalies.push({
      id: 'anom-vib',
      metric: 'VIBRATION',
      currentValue: vibrationMmS,
      expectedBaseline: 1.5,
      percentageDeviation: deviation,
      severity: 'HIGH',
      location: 'Baggage Conveyor Motor Carousel 03',
      description: `Bearing vibration velocity at ${vibrationMmS.toFixed(1)} mm/s indicating mechanical friction.`,
    });
  }

  return anomalies;
}
