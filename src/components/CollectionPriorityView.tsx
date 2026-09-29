import React, { useState } from 'react';
import { useWasteApp } from '../context/WasteAppContext';
import { 
  ListOrdered, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  Trash2, 
  Sparkles, 
  Filter, 
  Clock, 
  Navigation,
  Info
} from 'lucide-react';
import { calculateCollectionPriority } from '../services/decisionEngine';
import { PriorityLevel } from '../types';

export const CollectionPriorityView: React.FC = () => {
  const { 
    bins, 
    thresholds, 
    markTaskCompleted, 
    dispatchTruckToBin, 
    triggerRemoteMistSanitization,
    setActiveTab 
  } = useWasteApp();

  const [selectedFilter, setSelectedFilter] = useState<'all' | PriorityLevel>('all');

  const prioritizedBins = bins.map(bin => {
    const calc = calculateCollectionPriority(bin, thresholds);
    const estKg = Math.round((bin.fillLevel / 100) * bin.capacityLiters * 0.35);
    return {
      bin,
      priority: calc.priority,
      score: calc.score,
      reason: calc.reason,
      estimatedKg: estKg
    };
  }).sort((a, b) => b.score - a.score);

  const filtered = prioritizedBins.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.priority === selectedFilter;
  });

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'HIGH':
        return { text: 'HIGH PRIORITY', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
      case 'MEDIUM':
        return { text: 'MEDIUM PRIORITY', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'LOW':
        return { text: 'LOW PRIORITY', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ListOrdered className="w-6 h-6 text-emerald-400" />
            AI Smart Collection Priority Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic algorithmic scoring factoring fill capacity (45%), bio-decomposition gases (20%), and collection elapsed time (15%).
          </p>
        </div>

        <button
          onClick={() => setActiveTab('route')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors shrink-0"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Launch Optimized Route</span>
        </button>
      </div>

      {/* Decision Engine Formula Explainer Card */}
      <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">Decision Engine Scoring Formula</span>
            <p className="text-xs text-slate-300">
              Priority Score = (Fill% × 0.45) + (Gas PPM / 220 × 20) + (Hours Since Last Empty / 48 × 15) + (Organic Multiplier 1.2x)
            </p>
          </div>
        </div>

        {/* Priority Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700/80 shrink-0">
          {(['all', 'HIGH', 'MEDIUM', 'LOW'] as const).map(f => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                selectedFilter === f
                  ? 'bg-slate-800 text-emerald-400 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All Bins' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Cards List */}
      <div className="space-y-3">
        {filtered.map((item, index) => {
          const { bin, priority, score, reason, estimatedKg } = item;
          const badge = getPriorityBadge(priority);
          
          return (
            <div
              key={bin.id}
              className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 sm:p-5 hover:border-slate-600 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Order + Bin Info */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-300 shrink-0">
                  #{index + 1}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold font-mono text-white">{bin.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${badge.color}`}>
                      {badge.text} · Score: {score}/100
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      · {bin.zone} ({bin.wasteType})
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-medium text-slate-200">
                    {bin.location}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                    <strong className="text-slate-300 font-mono">AI Assessment:</strong> {reason}
                  </p>
                </div>
              </div>

              {/* Metrics Columns */}
              <div className="flex items-center gap-6 font-mono text-xs border-y lg:border-y-0 lg:border-x border-slate-700/80 py-3 lg:py-0 lg:px-6 shrink-0 justify-between sm:justify-start">
                <div>
                  <span className="text-slate-400 text-[10px] block">CAPACITY</span>
                  <span className={`text-sm font-bold tabular-nums ${bin.fillLevel > 80 ? 'text-rose-400' : 'text-white'}`}>
                    {bin.fillLevel}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">ODOUR / GAS</span>
                  <span className={`text-sm font-bold tabular-nums ${bin.gasPpm > 180 ? 'text-purple-400' : 'text-slate-200'}`}>
                    {bin.gasPpm} PPM
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">EST. WEIGHT</span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    ~{estimatedKg} kg
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => dispatchTruckToBin(bin.id)}
                  className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dispatch Truck</span>
                </button>

                <button
                  onClick={() => markTaskCompleted(`task-${bin.id}`)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Mark Collected</span>
                </button>

                {bin.gasPpm > 180 && (
                  <button
                    onClick={() => triggerRemoteMistSanitization(bin.id)}
                    className="p-2 text-xs rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 transition-colors"
                    title="Sanitize immediately"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
