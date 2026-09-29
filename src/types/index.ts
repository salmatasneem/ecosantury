export type UserRole = 'admin' | 'municipal' | 'sanitization';

export type WasteType = 
  | 'Wet / Organic' 
  | 'Dry / Recyclable' 
  | 'Hazardous / E-Waste' 
  | 'General / Mixed';

export type WasteClassificationCategory = 
  | 'Organic' 
  | 'Plastic' 
  | 'Paper' 
  | 'Glass' 
  | 'Metal' 
  | 'E-waste' 
  | 'Hazardous' 
  | 'Other';

export type BinStatus = 'normal' | 'nearly_full' | 'overflow_risk' | 'sanitization_required';

export type SanitizationStatus = 'sanitary' | 'due' | 'urgent_needed';

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface HardwareSpecs {
  mcu: string;
  ultrasonicSensor: string;
  gasSensor: string;
  tempHumiditySensor: string;
  firmwareVersion: string;
  macAddress: string;
  ipAddress: string;
}

export interface SmartBin {
  id: string;
  name: string;
  location: string;
  zone: string;
  coordinates: {
    x: number; // 0-100% on schematic map
    y: number; // 0-100% on schematic map
    lat: number;
    lng: number;
  };
  wasteType: WasteType;
  fillLevel: number; // 0 - 100%
  capacityLiters: number;
  temperature: number; // Celsius
  humidity: number; // %
  gasPpm: number; // MQ-135 reading (NH3, CO2, alcohol, smoke)
  odourLevel: 'Low' | 'Moderate' | 'High' | 'Hazardous';
  batteryLevel: number; // %
  solarCharging: boolean;
  lidStatus: 'closed' | 'open' | 'tampered';
  tiltAlarm: boolean;
  sanitizationStatus: SanitizationStatus;
  lastSanitized: string;
  lastCollected: string;
  lastUpdated: string;
  hardwareSpecs: HardwareSpecs;
  telemetryHistory: {
    timestamp: string;
    fillLevel: number;
    temperature: number;
    gasPpm: number;
  }[];
}

export interface ThresholdSettings {
  fillWarningThreshold: number; // default 60%
  overflowThreshold: number; // default 80%
  criticalOverflowThreshold: number; // default 95%
  tempWarningThreshold: number; // default 42°C
  humidityThreshold: number; // default 85%
  gasWarningThreshold: number; // default 160 PPM
  gasHazardThreshold: number; // default 240 PPM
  batteryLowThreshold: number; // default 20%
  sanitizationMaxHours: number; // default 48h
}

export interface Alert {
  id: string;
  binId: string;
  binLocation: string;
  type: 'fill' | 'overflow' | 'odour' | 'temperature' | 'battery' | 'sanitization' | 'lid' | 'tilt';
  severity: 'critical' | 'high' | 'medium' | 'info';
  title: string;
  message: string;
  timestamp: string;
  recommendedAction: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface CollectionTask {
  id: string;
  binId: string;
  binLocation: string;
  fillLevel: number;
  wasteType: WasteType;
  odourLevel: string;
  priority: PriorityLevel;
  priorityScore: number;
  estimatedWeightKg: number;
  status: 'pending' | 'in_progress' | 'completed';
  assignedVehicle: string;
  assignedCrew: string;
  generatedAt: string;
  completedAt?: string;
}

export interface SanitizationRecord {
  id: string;
  binId: string;
  binLocation: string;
  status: SanitizationStatus;
  reason: string;
  priority: PriorityLevel;
  lastSanitizedTime: string;
  assignedStaff: string;
  disinfectionMethod: string;
  chemicalAgent: string;
  gasLevelPpm: number;
  completed: boolean;
  completedAt?: string;
}

export interface WasteClassificationResult {
  detectedItem: string;
  category: WasteClassificationCategory;
  confidence: number;
  recommendedBin: string;
  binColor: string;
  explanation: string;
  safeHandlingAdvice: string;
  decompositionTime: string;
  recyclable: boolean;
  carbonFootprintReductionKg: number;
  sourceImageUrl?: string;
}

export interface RouteWaypoint {
  binId: string;
  location: string;
  zone: string;
  fillLevel: number;
  priority: PriorityLevel;
  order: number;
  distanceFromPrevKm: number;
  estimatedMinutes: number;
  coordinates: { x: number; y: number };
}

export interface CollectionRoute {
  id: string;
  depotName: string;
  waypoints: RouteWaypoint[];
  totalDistanceKm: number;
  estimatedDurationMins: number;
  fuelSavedLiters: number;
  co2ReducedKg: number;
  optimizedTimestamp: string;
  activeVehicle: string;
}
