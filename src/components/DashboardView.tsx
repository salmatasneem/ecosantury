import React from 'react';
import { useWasteApp } from '../context/WasteAppContext';
import { 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Truck, 
  Scale, 
  Gauge, 
  Bell, 
  ArrowUpRight, 
  ArrowRight, 
  Thermometer, 
  Wind, 
  Battery, 
  MapPin, 
  Scan, 
  Navigation
} from 'lucide-react';
import { calculateBinStatus } from '../services/decisionEngine';

export const DashboardView: React.FC = () => {
  const { 
    bins, 
    thresholds, 
    cityStats, 
    alerts, 
    collectionTasks, 
    setActiveTab, 
    setSelectedBinForDetail,
    dispatchTruckToBin,
    triggerRemoteMistSanitization
  } = useWasteApp();

  const criticalBins = bins.filter(b => {
    const status = calculateBinStatus(b, thresholds);
    return status === 'overflow_risk' || status === 'sanitization_required';
  });

  const getStatusBadge = (bin: typeof bins[0]) => {
    const status = calculateBinStatus(bin, thresholds);
    switch (status) {
      case 'overflow_risk':
        return { text: 'Overflow Risk', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
      case 'sanitization_required':
        return { text: 'Sanitization Due', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'nearly_full':
        return { text: 'Nearly Full', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      default:
        return { text: 'Nominal', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Banner strictly communicating project purpose */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                SIH 2026 · PS-SIH26212
              </span>
              <span>Hardware Category · Clean & Green Technology</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              AI + IoT Powered Smart Waste Management & Sanitization
            </h1>
            <p className="text-sm text-slate-300">
              Real-time ultrasonic bin level tracking, bio-hazardous odour detection (MQ-135), Gemini vision waste segregation, and predictive municipal route dispatching.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => setActiveTab('scanner')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors"
            >
              <Scan className="w-4 h-4" />
              <span>Launch AI Waste Scanner</span>
            </button>
            <button
              onClick={() => setActiveTab('route')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Optimized Route</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 8-Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        
        {/* 1. Total Smart Bins */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Smart Bins</span>
            <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center text-slate-300">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {cityStats.totalBins}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              8 Online · ESP32 Gateways Active
            </div>
          </div>
        </div>

        {/* 2. Normal Bins */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Normal Capacity</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
              {cityStats.normalBins}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              0% - 60% fill volume
            </div>
          </div>
        </div>

        {/* 3. Nearly Full Bins */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Nearly Full Bins</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-amber-400">
              {cityStats.nearlyFullBins}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              61% - 80% volume threshold
            </div>
          </div>
        </div>

        {/* 4. Overflowing Bins */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Overflow Risk</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-rose-400">
              {cityStats.overflowBins}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              &gt;80% capacity (Critical)
            </div>
          </div>
        </div>

        {/* 5. Sanitization Required */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Sanitization Needed</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-purple-400">
              {cityStats.sanitizationRequiredBins}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Gas PPM &gt; 180 or Due
            </div>
          </div>
        </div>

        {/* 6. Today's Collection Tasks */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Collection Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {cityStats.todayCompletedTasksCount} / {cityStats.todayCollectionTasksCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Completed vs Assigned today
            </div>
          </div>
        </div>

        {/* 7. Waste Collected Today */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Waste Collected</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {cityStats.wasteCollectedTodayKg} <span className="text-xs font-normal text-slate-400">kg</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">
              ~{(cityStats.wasteCollectedTodayKg / 1000).toFixed(2)} Metric Tonnes
            </div>
          </div>
        </div>

        {/* 8. Average Bin Fill Level */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Average Fill Level</span>
            <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center text-slate-300">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {cityStats.averageFillLevel}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden inline-block">
                <span 
                  className={`h-full block transition-all ${
                    cityStats.averageFillLevel > 75 ? 'bg-rose-500' : 'bg-emerald-500'
                  }`} 
                  style={{ width: `${cityStats.averageFillLevel}%` }}
                />
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Critical Action Items + Zone Telemetry Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 cols): Smart Bins Telemetry Live Matrix */}
        <div className="lg:col-span-2 bg-slate-800/70 border border-slate-700/70 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Live Smart Bins Telemetry</h2>
              <p className="text-xs text-slate-400">Continuous ultrasonic depth & MQ-135 air quality streams</p>
            </div>
            <button
              onClick={() => setActiveTab('bins')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>View All 8 Bins</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {bins.slice(0, 6).map((bin) => {
              const badge = getStatusBadge(bin);
              return (
                <div 
                  key={bin.id}
                  onClick={() => setSelectedBinForDetail(bin)}
                  className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-3.5 hover:border-slate-600 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {bin.id}
                      </span>
                      <span className="text-[11px] text-slate-400">· {bin.zone}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${badge.color}`}>
                      {badge.text}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium truncate mb-2.5">
                    {bin.location}
                  </p>

                  {/* Fill progress meter */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400 font-mono">Fill: {bin.fillLevel}%</span>
                      <span className="text-slate-400 font-mono">{bin.wasteType}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          bin.fillLevel > 80 ? 'bg-rose-500' :
                          bin.fillLevel > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${bin.fillLevel}%` }}
                      />
                    </div>
                  </div>

                  {/* Telemetry Sensor Badges */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800">
                    <span className="flex items-center gap-1" title="Temperature">
                      <Thermometer className="w-3 h-3 text-slate-400" />
                      {bin.temperature}°C
                    </span>
                    <span className="flex items-center gap-1" title="MQ-135 Gas PPM">
                      <Wind className="w-3 h-3 text-slate-400" />
                      {bin.gasPpm} PPM
                    </span>
                    <span className="flex items-center gap-1" title="IoT Battery">
                      <Battery className="w-3 h-3 text-slate-400" />
                      {bin.batteryLevel}%
                    </span>
                    <span className="text-slate-400">
                      {bin.lastUpdated}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (1 col): Urgent Attention Queue & Active Alerts */}
        <div className="space-y-4">
          
          {/* Critical Bins Requiring Action */}
          <div className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-semibold text-white">Urgent Action Required</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                {criticalBins.length} Bins
              </span>
            </div>

            {criticalBins.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 font-mono bg-slate-900/40 rounded-lg border border-slate-800">
                All city smart bins within safe operational limits.
              </div>
            ) : (
              <div className="space-y-2.5">
                {criticalBins.slice(0, 3).map((bin) => (
                  <div key={bin.id} className="p-3 bg-slate-900/80 border border-slate-700 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white">{bin.id}</span>
                      <span className="text-[11px] font-mono text-rose-400 font-semibold">{bin.fillLevel}% Full</span>
                    </div>
                    <p className="text-xs text-slate-300 truncate">{bin.location}</p>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
                      <span>Gas: {bin.gasPpm} PPM</span>
                      <span>Odour: {bin.odourLevel}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => dispatchTruckToBin(bin.id)}
                        className="flex-1 py-1 px-2 text-[11px] font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors text-center"
                      >
                        Dispatch Truck
                      </button>
                      <button
                        onClick={() => triggerRemoteMistSanitization(bin.id)}
                        className="py-1 px-2 text-[11px] font-medium bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 rounded transition-colors text-center"
                        title="Remotely trigger automated bio-neutralizer mist"
                      >
                        Trigger Mist
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Route Card */}
          <div className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Smart Collection Route</h3>
              </div>
              <button 
                onClick={() => setActiveTab('route')}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
              >
                <span>Navigate</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              AI Traveling Salesperson algorithm has sequenced 4 prioritized bins to reduce fuel burn.
            </p>
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">TOTAL ROUTE</span>
                <span className="text-white font-bold text-sm">14.8 km</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">EST. TIME</span>
                <span className="text-white font-bold text-sm">42 mins</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">FUEL SAVED</span>
                <span className="text-emerald-400 font-bold text-sm">31%</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
