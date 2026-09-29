import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  SmartBin, 
  UserRole, 
  ThresholdSettings, 
  Alert, 
  CollectionTask, 
  SanitizationRecord, 
  CollectionRoute, 
  PriorityLevel 
} from '../types';
import { INITIAL_BINS } from '../services/iotSimulator';
import { 
  calculateBinStatus, 
  calculateCollectionPriority, 
  detectSanitizationRequirement, 
  generateAlerts, 
  generateCollectionRoute 
} from '../services/decisionEngine';

const DEFAULT_THRESHOLDS: ThresholdSettings = {
  fillWarningThreshold: 60,
  overflowThreshold: 80,
  criticalOverflowThreshold: 95,
  tempWarningThreshold: 40,
  humidityThreshold: 85,
  gasWarningThreshold: 150,
  gasHazardThreshold: 220,
  batteryLowThreshold: 20,
  sanitizationMaxHours: 48
};

interface CityStats {
  totalBins: number;
  normalBins: number;
  nearlyFullBins: number;
  overflowBins: number;
  sanitizationRequiredBins: number;
  todayCollectionTasksCount: number;
  todayCompletedTasksCount: number;
  wasteCollectedTodayKg: number;
  averageFillLevel: number;
  activeAlertsCount: number;
  criticalAlertsCount: number;
}

interface WasteAppContextType {
  bins: SmartBin[];
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  thresholds: ThresholdSettings;
  updateThresholds: (settings: Partial<ThresholdSettings>) => void;
  resetThresholds: () => void;
  alerts: Alert[];
  resolveAlert: (alertId: string) => void;
  clearAllResolvedAlerts: () => void;
  collectionTasks: CollectionTask[];
  markTaskCompleted: (taskId: string) => void;
  dispatchTruckToBin: (binId: string) => void;
  sanitizationRecords: SanitizationRecord[];
  markSanitizationCompleted: (recordId: string) => void;
  triggerRemoteMistSanitization: (binId: string) => void;
  updateBinTelemetry: (binId: string, updates: Partial<SmartBin>) => void;
  currentRoute: CollectionRoute;
  regenerateRoute: () => void;
  simulateOverflow: (binId?: string) => void;
  simulateHighOdour: (binId?: string) => void;
  simulateLowBattery: (binId?: string) => void;
  simulateNewWasteDetected: (binId: string, addedFillPercent: number) => void;
  resetAllDemoData: () => void;
  selectedBinForDetail: SmartBin | null;
  setSelectedBinForDetail: (bin: SmartBin | null) => void;
  isAutoTicking: boolean;
  setIsAutoTicking: (ticking: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  cityStats: CityStats;
  recentActionNotification: string | null;
  setRecentActionNotification: (msg: string | null) => void;
}

const WasteAppContext = createContext<WasteAppContextType | undefined>(undefined);

export const WasteAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bins, setBins] = useState<SmartBin[]>(() => {
    const saved = localStorage.getItem('sih_bins_state');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BINS;
  });

  const [activeRole, setActiveRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [thresholds, setThresholds] = useState<ThresholdSettings>(DEFAULT_THRESHOLDS);
  const [selectedBinForDetail, setSelectedBinForDetail] = useState<SmartBin | null>(null);
  const [isAutoTicking, setIsAutoTicking] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [recentActionNotification, setRecentActionNotification] = useState<string | null>(null);
  const [wasteCollectedTodayKg, setWasteCollectedTodayKg] = useState<number>(1420);

  // Auto clear notification after 4s
  useEffect(() => {
    if (recentActionNotification) {
      const timer = setTimeout(() => setRecentActionNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [recentActionNotification]);

  // Persist bins state
  useEffect(() => {
    localStorage.setItem('sih_bins_state', JSON.stringify(bins));
  }, [bins]);

  // Generate automated alerts whenever bins or thresholds change
  const [alerts, setAlerts] = useState<Alert[]>(() => generateAlerts(INITIAL_BINS, DEFAULT_THRESHOLDS));

  const syncAlerts = useCallback(() => {
    setAlerts((prevAlerts) => {
      const freshAlerts = generateAlerts(bins, thresholds);
      const resolvedIds = new Set(prevAlerts.filter(a => a.resolved).map(a => a.id));
      return freshAlerts.map(fa => ({
        ...fa,
        resolved: resolvedIds.has(fa.id)
      }));
    });
  }, [bins, thresholds]);

  useEffect(() => {
    syncAlerts();
  }, [bins, thresholds, syncAlerts]);

  // Collection tasks generation
  const collectionTasks = useMemo<CollectionTask[]>(() => {
    return bins
      .filter(b => b.fillLevel >= thresholds.fillWarningThreshold)
      .map(b => {
        const priorityCalc = calculateCollectionPriority(b, thresholds);
        const estKg = Math.round((b.fillLevel / 100) * b.capacityLiters * 0.35);
        return {
          id: `task-${b.id}`,
          binId: b.id,
          binLocation: b.location,
          fillLevel: b.fillLevel,
          wasteType: b.wasteType,
          odourLevel: b.odourLevel,
          priority: priorityCalc.priority,
          priorityScore: priorityCalc.score,
          estimatedWeightKg: estKg,
          status: (b.fillLevel < 20 ? 'completed' : 'pending') as 'pending' | 'in_progress' | 'completed',
          assignedVehicle: b.fillLevel > 90 ? 'Compactor Unit #01' : 'Electric Van #04',
          assignedCrew: 'Municipal Crew Alpha',
          generatedAt: 'Today 07:30'
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }, [bins, thresholds]);

  // Sanitization records generation
  const sanitizationRecords = useMemo<SanitizationRecord[]>(() => {
    return bins.map(b => {
      const detect = detectSanitizationRequirement(b, thresholds);
      return {
        id: `san-rec-${b.id}`,
        binId: b.id,
        binLocation: b.location,
        status: detect.status,
        reason: detect.primaryReason,
        priority: detect.urgency,
        lastSanitizedTime: new Date(b.lastSanitized).toLocaleString([], { 
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        }),
        assignedStaff: b.zone.includes('Healthcare') ? 'Specialist Bio-Ops Unit' : 'Zone Sanitization Team #3',
        disinfectionMethod: detect.recommendedDisinfectant,
        chemicalAgent: 'Quaternary NH4 / Sodium Hypochlorite 0.5%',
        gasLevelPpm: b.gasPpm,
        completed: detect.status === 'sanitary'
      };
    });
  }, [bins, thresholds]);

  // Route calculation
  const [currentRoute, setCurrentRoute] = useState<CollectionRoute>(() => 
    generateCollectionRoute(INITIAL_BINS, DEFAULT_THRESHOLDS)
  );

  const regenerateRoute = useCallback(() => {
    const route = generateCollectionRoute(bins, thresholds);
    setCurrentRoute(route);
    setRecentActionNotification('AI Smart Collection Route re-optimized for highest priority bins.');
  }, [bins, thresholds]);

  // Update a single bin's telemetry
  const updateBinTelemetry = useCallback((binId: string, updates: Partial<SmartBin>) => {
    setBins(prev => prev.map(bin => {
      if (bin.id !== binId) return bin;
      
      const newFill = updates.fillLevel !== undefined ? updates.fillLevel : bin.fillLevel;
      const newGas = updates.gasPpm !== undefined ? updates.gasPpm : bin.gasPpm;
      const newTemp = updates.temperature !== undefined ? updates.temperature : bin.temperature;

      // Recalculate odour level
      let odour: 'Low' | 'Moderate' | 'High' | 'Hazardous' = 'Low';
      if (newGas > 220) odour = 'Hazardous';
      else if (newGas > 150) odour = 'High';
      else if (newGas > 80) odour = 'Moderate';

      // Recalculate sanitization status
      let sanStatus = bin.sanitizationStatus;
      if (updates.sanitizationStatus !== undefined) {
        sanStatus = updates.sanitizationStatus;
      } else if (newGas > 200) {
        sanStatus = 'urgent_needed';
      }

      const updatedHistory = [
        ...bin.telemetryHistory.slice(-7),
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fillLevel: newFill,
          temperature: newTemp,
          gasPpm: newGas
        }
      ];

      return {
        ...bin,
        ...updates,
        fillLevel: newFill,
        gasPpm: newGas,
        temperature: newTemp,
        odourLevel: odour,
        sanitizationStatus: sanStatus,
        telemetryHistory: updatedHistory,
        lastUpdated: 'Just now'
      };
    }));
  }, []);

  // Mark task completed (empties bin)
  const markTaskCompleted = useCallback((taskId: string) => {
    const binId = taskId.replace('task-', '');
    const targetBin = bins.find(b => b.id === binId);
    if (!targetBin) return;

    const collectedKg = Math.round((targetBin.fillLevel / 100) * targetBin.capacityLiters * 0.35);
    setWasteCollectedTodayKg(prev => prev + collectedKg);

    updateBinTelemetry(binId, {
      fillLevel: 5,
      lastCollected: new Date().toISOString()
    });

    setRecentActionNotification(`Bin ${binId} successfully emptied! Collected ${collectedKg} kg waste.`);
  }, [bins, updateBinTelemetry]);

  // Dispatch municipal truck
  const dispatchTruckToBin = useCallback((binId: string) => {
    setRecentActionNotification(`Compactor Truck dispatched to ${binId}. Arrival ETA ~12 mins.`);
  }, []);

  // Mark sanitization completed
  const markSanitizationCompleted = useCallback((recordId: string) => {
    const binId = recordId.replace('san-rec-', '');
    updateBinTelemetry(binId, {
      sanitizationStatus: 'sanitary',
      gasPpm: Math.min(45, Math.round(Math.random() * 20 + 25)),
      lastSanitized: new Date().toISOString()
    });
    setRecentActionNotification(`Bin ${binId} sanitized, disinfected & VOC gas neutralized.`);
  }, [updateBinTelemetry]);

  // Automated remote UV/mist sanitization
  const triggerRemoteMistSanitization = useCallback((binId: string) => {
    updateBinTelemetry(binId, {
      gasPpm: 35,
      temperature: 24,
      sanitizationStatus: 'sanitary',
      lastSanitized: new Date().toISOString()
    });
    setRecentActionNotification(`Smart Mist Nozzle triggered on ${binId}. 100ml bio-neutralizer dispensed.`);
  }, [updateBinTelemetry]);

  // Resolve alert
  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true, resolvedAt: new Date().toISOString() } : a));
    setRecentActionNotification('Alert marked as resolved.');
  }, []);

  const clearAllResolvedAlerts = useCallback(() => {
    setAlerts(prev => prev.filter(a => !a.resolved));
    setRecentActionNotification('Resolved alerts cleared.');
  }, []);

  // Threshold controls
  const updateThresholds = useCallback((settings: Partial<ThresholdSettings>) => {
    setThresholds(prev => ({ ...prev, ...settings }));
    setRecentActionNotification('Municipal threshold settings updated. Decision engine re-evaluating.');
  }, []);

  const resetThresholds = useCallback(() => {
    setThresholds(DEFAULT_THRESHOLDS);
    setRecentActionNotification('Thresholds reset to municipal defaults.');
  }, []);

  // Hackathon Demo Action Triggers
  const simulateOverflow = useCallback((binId = 'BIN-102') => {
    updateBinTelemetry(binId, {
      fillLevel: 98,
      temperature: 42,
      gasPpm: 290,
      lidStatus: 'open'
    });
    setRecentActionNotification(`Demo Trigger: ${binId} simulated to 98% Critical Overflow!`);
  }, [updateBinTelemetry]);

  const simulateHighOdour = useCallback((binId = 'BIN-105') => {
    updateBinTelemetry(binId, {
      gasPpm: 265,
      temperature: 39,
      sanitizationStatus: 'urgent_needed'
    });
    setRecentActionNotification(`Demo Trigger: ${binId} hazardous odour & ammonia spike simulated!`);
  }, [updateBinTelemetry]);

  const simulateLowBattery = useCallback((binId = 'BIN-104') => {
    updateBinTelemetry(binId, {
      batteryLevel: 9,
      solarCharging: false
    });
    setRecentActionNotification(`Demo Trigger: ${binId} battery dropped to 9% (Low Battery Warning)!`);
  }, [updateBinTelemetry]);

  const simulateNewWasteDetected = useCallback((binId: string, addedFillPercent: number) => {
    const bin = bins.find(b => b.id === binId);
    if (!bin) return;
    const newFill = Math.min(100, bin.fillLevel + addedFillPercent);
    updateBinTelemetry(binId, { fillLevel: newFill });
    setRecentActionNotification(`Waste sorted into ${binId}! Fill increased by +${addedFillPercent}% (now ${newFill}%).`);
  }, [bins, updateBinTelemetry]);

  const resetAllDemoData = useCallback(() => {
    setBins(INITIAL_BINS);
    setThresholds(DEFAULT_THRESHOLDS);
    setAlerts(generateAlerts(INITIAL_BINS, DEFAULT_THRESHOLDS));
    setCurrentRoute(generateCollectionRoute(INITIAL_BINS, DEFAULT_THRESHOLDS));
    setRecentActionNotification('Demo environment reset to initial municipal baseline.');
  }, []);

  // Auto-tick simulation (continuous live stream)
  useEffect(() => {
    if (!isAutoTicking) return;
    const interval = setInterval(() => {
      // Pick random bin and jitter fill by +1% occasionally or temperature by 0.5C
      const randomIdx = Math.floor(Math.random() * bins.length);
      const target = bins[randomIdx];
      const deltaFill = Math.random() > 0.6 ? 1 : 0;
      const newFill = Math.min(100, target.fillLevel + deltaFill);
      const jitterTemp = Math.round(target.temperature + (Math.random() * 1 - 0.5));
      updateBinTelemetry(target.id, {
        fillLevel: newFill,
        temperature: jitterTemp
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoTicking, bins, updateBinTelemetry]);

  // Calculated city stats
  const cityStats = useMemo<CityStats>(() => {
    let normal = 0;
    let nearlyFull = 0;
    let overflow = 0;
    let sanitizationReq = 0;
    let totalFill = 0;

    bins.forEach(bin => {
      totalFill += bin.fillLevel;
      const status = calculateBinStatus(bin, thresholds);
      if (status === 'normal') normal++;
      else if (status === 'nearly_full') nearlyFull++;
      else if (status === 'overflow_risk') overflow++;
      else if (status === 'sanitization_required') sanitizationReq++;
    });

    const activeAlerts = alerts.filter(a => !a.resolved);
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');

    return {
      totalBins: bins.length,
      normalBins: normal,
      nearlyFullBins: nearlyFull,
      overflowBins: overflow,
      sanitizationRequiredBins: sanitizationReq,
      todayCollectionTasksCount: collectionTasks.length,
      todayCompletedTasksCount: collectionTasks.filter(t => t.status === 'completed').length,
      wasteCollectedTodayKg,
      averageFillLevel: Math.round(totalFill / bins.length),
      activeAlertsCount: activeAlerts.length,
      criticalAlertsCount: criticalAlerts.length
    };
  }, [bins, alerts, thresholds, collectionTasks, wasteCollectedTodayKg]);

  return (
    <WasteAppContext.Provider
      value={{
        bins,
        activeRole,
        setActiveRole,
        activeTab,
        setActiveTab,
        thresholds,
        updateThresholds,
        resetThresholds,
        alerts,
        resolveAlert,
        clearAllResolvedAlerts,
        collectionTasks,
        markTaskCompleted,
        dispatchTruckToBin,
        sanitizationRecords,
        markSanitizationCompleted,
        triggerRemoteMistSanitization,
        updateBinTelemetry,
        currentRoute,
        regenerateRoute,
        simulateOverflow,
        simulateHighOdour,
        simulateLowBattery,
        simulateNewWasteDetected,
        resetAllDemoData,
        selectedBinForDetail,
        setSelectedBinForDetail,
        isAutoTicking,
        setIsAutoTicking,
        isLoginModalOpen,
        setIsLoginModalOpen,
        cityStats,
        recentActionNotification,
        setRecentActionNotification
      }}
    >
      {children}
    </WasteAppContext.Provider>
  );
};

export const useWasteApp = () => {
  const context = useContext(WasteAppContext);
  if (!context) {
    throw new Error('useWasteApp must be used within a WasteAppProvider');
  }
  return context;
};
