import React, { useState } from 'react';
import { useWasteApp } from '../context/WasteAppContext';
import { 
  Sliders, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  SlidersHorizontal, 
  Bell, 
  ShieldAlert, 
  Thermometer, 
  Wind, 
  Battery, 
  Sparkles,
  Info
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { thresholds, updateThresholds, resetThresholds, activeRole } = useWasteApp();

  const [fillWarning, setFillWarning] = useState(thresholds.fillWarningThreshold);
  const [overflow, setOverflow] = useState(thresholds.overflowThreshold);
  const [criticalOverflow, setCriticalOverflow] = useState(thresholds.criticalOverflowThreshold);
  const [tempWarning, setTempWarning] = useState(thresholds.tempWarningThreshold);
  const [humidity, setHumidity] = useState(thresholds.humidityThreshold);
  const [gasWarning, setGasWarning] = useState(thresholds.gasWarningThreshold);
  const [gasHazard, setGasHazard] = useState(thresholds.gasHazardThreshold);
  const [batteryLow, setBatteryLow] = useState(thresholds.batteryLowThreshold);
  const [sanInterval, setSanInterval] = useState(thresholds.sanitizationMaxHours);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateThresholds({
      fillWarningThreshold: fillWarning,
      overflowThreshold: overflow,
      criticalOverflowThreshold: criticalOverflow,
      tempWarningThreshold: tempWarning,
      humidityThreshold: humidity,
      gasWarningThreshold: gasWarning,
      gasHazardThreshold: gasHazard,
      batteryLowThreshold: batteryLow,
      sanitizationMaxHours: sanInterval
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    resetThresholds();
    setFillWarning(60);
    setOverflow(80);
    setCriticalOverflow(95);
    setTempWarning(40);
    setHumidity(85);
    setGasWarning(150);
    setGasHazard(220);
    setBatteryLow(20);
    setSanInterval(48);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-emerald-400" />
            Decision Engine & Alert Threshold Configuration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure municipal threshold limits. Modified values dynamically re-evaluate sensor streams and update priority dispatching.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all cursor-pointer"
          >
            {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Thresholds Applied!' : 'Save & Re-evaluate'}</span>
          </button>
        </div>
      </div>

      {/* Role Notice */}
      <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-mono">
        <Info className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Current Active Permission: <strong>{activeRole.toUpperCase()}</strong>. Changes immediately apply to active alerts and priority queues.</span>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Ultrasonic Fill & Overflow Thresholds */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Ultrasonic Fill & Overflow Limits</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Fill Warning Threshold (Nearly Full)</span>
                <span className="font-bold text-amber-400">{fillWarning}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="80"
                value={fillWarning}
                onChange={(e) => setFillWarning(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono block">
                Bins crossing this are placed on tomorrow's collection schedule.
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">High Capacity / Route Trigger</span>
                <span className="font-bold text-orange-400">{overflow}%</span>
              </div>
              <input
                type="range"
                min="65"
                max="90"
                value={overflow}
                onChange={(e) => setOverflow(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono block">
                Triggers active collection dispatch task for municipal fleet.
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Critical Overflow Spill Limit</span>
                <span className="font-bold text-rose-400">{criticalOverflow}%</span>
              </div>
              <input
                type="range"
                min="85"
                max="99"
                value={criticalOverflow}
                onChange={(e) => setCriticalOverflow(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono block">
                Fires immediate high-priority audio & visual spill emergency alert.
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Air Quality (MQ-135) & Sanitization */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold uppercase">
            <Wind className="w-4 h-4" />
            <span>Air Quality (MQ-135) & Odour Limits</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Volatile Gas Warning Threshold</span>
                <span className="font-bold text-purple-400">{gasWarning} PPM</span>
              </div>
              <input
                type="range"
                min="80"
                max="200"
                value={gasWarning}
                onChange={(e) => setGasWarning(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono block">
                Detects early stages of anaerobic organic decomposition.
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Hazardous Ammonia / Bio-Risk Level</span>
                <span className="font-bold text-rose-400">{gasHazard} PPM</span>
              </div>
              <input
                type="range"
                min="180"
                max="300"
                value={gasHazard}
                onChange={(e) => setGasHazard(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono block">
                Automates spray nozzle or dispatches bio-sanitization specialist crew.
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Sanitization Max Cycle (Hours)</span>
                <span className="font-bold text-emerald-400">{sanInterval} Hours</span>
              </div>
              <input
                type="range"
                min="24"
                max="96"
                value={sanInterval}
                onChange={(e) => setSanInterval(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono block">
                Maximum time allowed between mandatory chemical sterilizations.
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Environmental Thermal (DHT22) */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold uppercase">
            <Thermometer className="w-4 h-4" />
            <span>Thermal & Humidity Anomaly Limits</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Internal Temp Spike Warning</span>
                <span className="font-bold text-amber-400">{tempWarning}°C</span>
              </div>
              <input
                type="range"
                min="30"
                max="55"
                value={tempWarning}
                onChange={(e) => setTempWarning(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono block">
                Alerts to intense fermentation heat or smoldering cigarette ash.
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Relative Humidity Warning</span>
                <span className="font-bold text-blue-400">{humidity}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono block">
                Prevents mold spore release in enclosed bin environments.
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: IoT Hardware & Battery Health */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase">
            <Battery className="w-4 h-4" />
            <span>ESP32 Node Power & Hardware</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Low Battery Alert Level</span>
                <span className="font-bold text-rose-400">{batteryLow}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="35"
                value={batteryLow}
                onChange={(e) => setBatteryLow(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono block">
                Alerts municipal technician to inspect solar panel or swap battery.
              </span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div><strong>Gateway Heartbeat:</strong> 15-second deep sleep wakeup</div>
              <div><strong>Protocol:</strong> REST API (HTTP/1.1) + MQTT QOS 1</div>
              <div><strong>Data Persistence:</strong> Local In-Memory + Server Sync</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
