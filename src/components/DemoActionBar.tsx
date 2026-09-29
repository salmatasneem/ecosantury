import React from 'react';
import { useWasteApp } from '../context/WasteAppContext';
import { 
  AlertTriangle, 
  Wind, 
  BatteryLow, 
  RotateCcw, 
  Radio, 
  PlusCircle, 
  CheckCircle2, 
  Info
} from 'lucide-react';

export const DemoActionBar: React.FC = () => {
  const { 
    simulateOverflow, 
    simulateHighOdour, 
    simulateLowBattery, 
    simulateNewWasteDetected, 
    resetAllDemoData,
    isAutoTicking,
    setIsAutoTicking,
    recentActionNotification
  } = useWasteApp();

  return (
    <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Left: Hackathon quick trigger controls */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
          <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            Hackathon Demo Controls:
          </span>

          <button
            onClick={() => simulateOverflow('BIN-102')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors whitespace-nowrap"
            title="Simulates bin fill spiking to 98% with lid open"
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>Simulate Overflow (BIN-102)</span>
          </button>

          <button
            onClick={() => simulateHighOdour('BIN-105')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors whitespace-nowrap"
            title="Simulates VOC gas/ammonia spike to 265 PPM"
          >
            <Wind className="w-3 h-3 text-amber-400" />
            <span>Simulate High Odour (BIN-105)</span>
          </button>

          <button
            onClick={() => simulateLowBattery('BIN-104')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 transition-colors whitespace-nowrap"
            title="Simulates IoT battery drop to 9%"
          >
            <BatteryLow className="w-3 h-3 text-yellow-400" />
            <span>Simulate Low Battery (BIN-104)</span>
          </button>

          <button
            onClick={() => simulateNewWasteDetected('BIN-101', 12)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition-colors whitespace-nowrap"
            title="Simulates user disposing recyclables into BIN-101"
          >
            <PlusCircle className="w-3 h-3 text-blue-400" />
            <span>Simulate Waste Throw (+12%)</span>
          </button>

          <button
            onClick={() => setIsAutoTicking(!isAutoTicking)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors whitespace-nowrap ${
              isAutoTicking
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Continuously simulate real-time telemetry updates every 4 seconds"
          >
            <span className={`w-2 h-2 rounded-full ${isAutoTicking ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <span>{isAutoTicking ? 'Live Telemetry: Active' : 'Live Stream: Paused'}</span>
          </button>

          <button
            onClick={resetAllDemoData}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors whitespace-nowrap"
            title="Reset all smart bins and thresholds to default"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>

        {/* Right: Live Notification banner for user confirmation */}
        {recentActionNotification ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 animate-fade-in shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-mono truncate max-w-xs">{recentActionNotification}</span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 font-mono text-[11px] shrink-0">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>ESP32 REST Gateway: Ready at /api/iot/bin/:id/telemetry</span>
          </div>
        )}

      </div>
    </div>
  );
};
