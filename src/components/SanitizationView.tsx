import React from 'react';
import { useWasteApp } from '../context/WasteAppContext';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Wind, 
  Droplet, 
  UserCheck, 
  Flame, 
  RotateCcw
} from 'lucide-react';

export const SanitizationView: React.FC = () => {
  const { 
    sanitizationRecords, 
    markSanitizationCompleted, 
    triggerRemoteMistSanitization,
    cityStats 
  } = useWasteApp();

  const urgentCount = sanitizationRecords.filter(r => r.status === 'urgent_needed').length;
  const dueCount = sanitizationRecords.filter(r => r.status === 'due').length;
  const sanitaryCount = sanitizationRecords.filter(r => r.status === 'sanitary').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Smart Sanitization & Hygiene Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated monitoring of organic decomposition, volatile ammonia/gas build-up, and chemical disinfection scheduling.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
          <span>Biogas & Microbial Protection Active</span>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Sanitary / Clean</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {sanitaryCount} Bins
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Passed air quality & time threshold
          </span>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Routine Clean Due</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {dueCount} Bins
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            &gt;48h since last disinfection
          </span>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Urgent Bio-Clean Risk</span>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
            {urgentCount} Bins
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            MQ-135 Gas &gt; 220 PPM or thermal spike
          </span>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Sanitization Compliance</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            94.2%
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
            Exceeds Municipal Health Standard
          </span>
        </div>

      </div>

      {/* Sanitization Tasks Cards */}
      <div className="space-y-3">
        {sanitizationRecords.map((record) => {
          const isUrgent = record.status === 'urgent_needed';
          const isDue = record.status === 'due';
          const isClean = record.status === 'sanitary';

          return (
            <div
              key={record.id}
              className={`p-5 rounded-xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                isUrgent
                  ? 'bg-rose-950/20 border-rose-500/40'
                  : isDue
                  ? 'bg-slate-800/80 border-amber-500/40'
                  : 'bg-slate-800/60 border-slate-700/70'
              }`}
            >
              {/* Left Details */}
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold font-mono text-white">{record.binId}</span>
                  
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                    isUrgent
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : isDue
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {isUrgent ? 'URGENT BIO-CLEAN' : isDue ? 'SANITIZATION DUE' : 'SANITARY'}
                  </span>

                  <span className="text-xs text-slate-400 font-mono">
                    · Staff: {record.assignedStaff}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-medium text-slate-200">
                  {record.binLocation}
                </h3>

                <p className="text-xs text-slate-300">
                  <strong className="text-slate-400 font-mono">Trigger Reason:</strong> {record.reason}
                </p>

                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  <span>Recommended Chemical Agent: </span>
                  <span className="text-purple-300 font-medium">{record.disinfectionMethod}</span>
                </div>
              </div>

              {/* Middle Metrics */}
              <div className="flex items-center gap-6 font-mono text-xs border-y lg:border-y-0 lg:border-x border-slate-700/80 py-3 lg:py-0 lg:px-6 shrink-0 justify-between sm:justify-start">
                <div>
                  <span className="text-slate-400 text-[10px] block">AIR QUALITY</span>
                  <span className={`text-sm font-bold tabular-nums ${record.gasLevelPpm > 180 ? 'text-rose-400' : 'text-white'}`}>
                    {record.gasLevelPpm} PPM
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">LAST SANITIZED</span>
                  <span className="text-xs font-semibold text-slate-200">
                    {record.lastSanitizedTime}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => triggerRemoteMistSanitization(record.binId)}
                  className="px-3 py-2 text-xs font-medium rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 transition-colors flex items-center gap-1.5"
                  title="Remotely trigger ESP32 spray nozzle"
                >
                  <Droplet className="w-3.5 h-3.5" />
                  <span>Remote Mist Spray</span>
                </button>

                <button
                  onClick={() => markSanitizationCompleted(record.id)}
                  disabled={isClean}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    isClean
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isClean ? 'Sanitized' : 'Mark as Sanitized'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
