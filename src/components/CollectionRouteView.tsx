import React, { useState } from 'react';
import { useWasteApp } from '../context/WasteAppContext';
import { 
  Navigation, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  Clock, 
  Fuel, 
  Leaf, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export const CollectionRouteView: React.FC = () => {
  const { 
    currentRoute, 
    regenerateRoute, 
    markTaskCompleted, 
    bins, 
    setRecentActionNotification 
  } = useWasteApp();

  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [isSimulatingRun, setIsSimulatingRun] = useState<boolean>(false);

  const startRouteSimulation = () => {
    setIsSimulatingRun(true);
    setActiveStepIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      if (current < currentRoute.waypoints.length) {
        const wp = currentRoute.waypoints[current];
        markTaskCompleted(`task-${wp.binId}`);
        setActiveStepIndex(current);
        current++;
      } else {
        clearInterval(interval);
        setIsSimulatingRun(false);
        setRecentActionNotification('Full municipal collection route completed! All waypoints cleared.');
      }
    }, 2500);
  };

  const resetRouteSimulation = () => {
    setActiveStepIndex(-1);
    setIsSimulatingRun(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Navigation className="w-6 h-6 text-emerald-400" />
            AI Smart Collection Route Optimization
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic Traveling Salesperson sequencing prioritizes high fill volumes, reduces idle transit times, and minimizes municipal fleet emissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={regenerateRoute}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-optimize AI Sequence</span>
          </button>

          <button
            onClick={startRouteSimulation}
            disabled={isSimulatingRun}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulatingRun ? 'animate-spin' : ''}`} />
            <span>{isSimulatingRun ? 'Navigating Route...' : 'Simulate Collection Run'}</span>
          </button>
        </div>
      </div>

      {/* Route Summary KPI Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Route Distance</span>
            <Truck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {currentRoute.totalDistanceKm} <span className="text-xs font-normal text-slate-400">km</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
            -28% shorter than static milk-runs
          </span>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Estimated Duration</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {currentRoute.estimatedDurationMins} <span className="text-xs font-normal text-slate-400">mins</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Includes 5m bin hoist clearance time
          </span>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Diesel Fuel Saved</span>
            <Fuel className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
            {currentRoute.fuelSavedLiters} <span className="text-xs font-normal text-slate-400">Liters</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Saved per collection shift
          </span>
        </div>

        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>CO₂ Emissions Avoided</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {currentRoute.co2ReducedKg} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
            Clean Tech fleet impact
          </span>
        </div>

      </div>

      {/* Route Waypoints Order Breakdown */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Optimized Collection Waypoints ({currentRoute.waypoints.length} Stops)
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Depot Origin: {currentRoute.depotName} · Vehicle: {currentRoute.activeVehicle}
            </p>
          </div>

          {activeStepIndex >= 0 && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Simulated Vehicle At Stop #{activeStepIndex + 1}</span>
            </span>
          )}
        </div>

        {/* Sequential List */}
        <div className="space-y-3">
          {currentRoute.waypoints.map((wp, index) => {
            const isCompleted = activeStepIndex > index;
            const isCurrent = activeStepIndex === index;

            return (
              <div
                key={wp.binId}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCurrent
                    ? 'bg-emerald-950/30 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                    : isCompleted
                    ? 'bg-slate-900/40 border-slate-800 opacity-60'
                    : 'bg-slate-900/80 border-slate-700/80'
                }`}
              >
                {/* Order Indicator + Bin Info */}
                <div className="flex items-start gap-3.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950'
                      : isCurrent
                      ? 'bg-emerald-500 text-slate-950 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : wp.order}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-white">{wp.binId}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                        wp.priority === 'HIGH'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}>
                        {wp.priority}
                      </span>
                      <span className="text-xs font-mono text-slate-400">· {wp.zone}</span>
                    </div>
                    <h4 className="text-xs font-medium text-slate-200 mt-1">{wp.location}</h4>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-6 font-mono text-xs text-slate-300 shrink-0">
                  <div>
                    <span className="text-slate-500 text-[10px] block">FILL CAPACITY</span>
                    <span className={`font-bold ${wp.fillLevel > 80 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {wp.fillLevel}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">LEG DISTANCE</span>
                    <span>+{wp.distanceFromPrevKm} km</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">LEG TIME</span>
                    <span>~{wp.estimatedMinutes} mins</span>
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => markTaskCompleted(`task-${wp.binId}`)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    Clear Stop
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
