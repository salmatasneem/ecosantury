import React from 'react';
import { useWasteApp } from '../context/WasteAppContext';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Recycle, 
  ShieldCheck, 
  Leaf, 
  Truck, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { bins, cityStats } = useWasteApp();

  // 7-day daily waste collection demo data
  const weeklyCollection = [
    { day: 'Mon', kg: 1320, height: '65%' },
    { day: 'Tue', kg: 1480, height: '74%' },
    { day: 'Wed', kg: 1210, height: '60%' },
    { day: 'Thu', kg: 1650, height: '82%' },
    { day: 'Fri', kg: 1890, height: '94%' },
    { day: 'Sat', kg: 2040, height: '100%' },
    { day: 'Sun (Today)', kg: cityStats.wasteCollectedTodayKg, height: '70%' },
  ];

  // Category breakdown
  const categories = [
    { name: 'Organic / Wet Waste', percent: 38, color: '#16A34A', kg: 540 },
    { name: 'Dry Recyclable Plastic', percent: 28, color: '#2563EB', kg: 398 },
    { name: 'Paper & Cardboard', percent: 16, color: '#0284C7', kg: 227 },
    { name: 'Metals & Cans', percent: 8, color: '#D97706', kg: 114 },
    { name: 'Glass Containers', percent: 6, color: '#7C3AED', kg: 85 },
    { name: 'E-Waste & Batteries', percent: 4, color: '#DC2626', kg: 56 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            CleanTech Analytics & Sustainability Metrics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Data insights on municipal waste tonnage, segregation compliance, predictive spill prevention, and carbon offsets.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
          <Leaf className="w-3.5 h-3.5" />
          <span>Net Carbon Savings: 1,840 kg CO₂e</span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Collection Efficiency</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            96.4%
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            +8.2% vs baseline static routes
          </span>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Spills Prevented</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            42 Spills
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1">
            Early threshold alert triggers
          </span>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Fuel Saved</span>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
            31.2%
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1">
            Traveling Salesperson Route
          </span>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Sanitization Frequency</span>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
            18 Cycles
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1">
            Zero anaerobic odor reports
          </span>
        </div>

      </div>

      {/* Main Charts: 7-Day Collection Bar Chart + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (7 cols): Daily Collection Bar Chart */}
        <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Daily Waste Collected (Last 7 Days)</h3>
              <p className="text-xs text-slate-400">Total municipal weight in kilograms</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              Avg: 1,518 kg/day
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-56 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-700/80">
            {weeklyCollection.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.kg}kg
                </span>
                <div className="w-full max-w-[42px] bg-slate-700/40 rounded-t-md h-full flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-t-md transition-all duration-700 ${
                      idx === weeklyCollection.length - 1
                        ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]'
                        : 'bg-emerald-600/70 group-hover:bg-emerald-500'
                    }`}
                    style={{ height: item.height }}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400 text-center truncate max-w-[50px]">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
            <span>Minimum: 1,210 kg (Wed)</span>
            <span>Peak: 2,040 kg (Sat Weekend Rush)</span>
          </div>
        </div>

        {/* Right (5 cols): Waste Category Segregation Distribution */}
        <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Waste Category Segregation Ratio</h3>
            <p className="text-xs text-slate-400">Citizen sorting accuracy monitored by AI Scanner</p>
          </div>

          {/* Stacked Progress Bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex shadow-inner">
            {categories.map((c, i) => (
              <div
                key={i}
                style={{ width: `${c.percent}%`, backgroundColor: c.color }}
                title={`${c.name}: ${c.percent}%`}
              />
            ))}
          </div>

          {/* Category Rows */}
          <div className="space-y-2 pt-1">
            {categories.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-slate-300">{c.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">~{c.kg} kg</span>
                  <span className="font-bold text-white w-8 text-right">{c.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Grid: Bin Utilization & Spill Prevention Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Capacity & Fill Distribution</h3>
            <span className="text-xs font-mono text-slate-400">Active Bins</span>
          </div>

          <p className="text-xs text-slate-300">
            Current fill volume across all 8 deployed smart bins. Bins exceeding 80% are automatically escalated to high priority dispatch.
          </p>

          <div className="space-y-2.5 pt-2">
            {bins.slice(0, 5).map(b => (
              <div key={b.id} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{b.id} ({b.zone})</span>
                  <span className={`font-bold ${b.fillLevel > 80 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {b.fillLevel}% Full
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      b.fillLevel > 80 ? 'bg-rose-500' :
                      b.fillLevel > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${b.fillLevel}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Environmental Health & Sanitization</h3>
            <span className="text-xs font-mono text-purple-400">Hygiene Score</span>
          </div>

          <p className="text-xs text-slate-300">
            Continuous MQ-135 volatile gas monitoring prevents anaerobic decomposition odors and bacterial growth before citizen complaints occur.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">AIR QUALITY INDEX</span>
              <span className="text-sm font-bold text-emerald-400 mt-1 block">
                92 / 100 (Optimal)
              </span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">UV/MIST INJECTIONS</span>
              <span className="text-sm font-bold text-purple-400 mt-1 block">
                24 Cycles Today
              </span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">PREDICTIVE SPILLS SAVED</span>
              <span className="text-sm font-bold text-white mt-1 block">
                98.8%
              </span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">LANDFILL DIVERSION</span>
              <span className="text-sm font-bold text-emerald-400 mt-1 block">
                44.6% Segregated
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
