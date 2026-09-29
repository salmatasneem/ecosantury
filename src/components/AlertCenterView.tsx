import React, { useState } from 'react';
import { useWasteApp } from '../context/WasteAppContext';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  ShieldAlert, 
  Filter, 
  Check, 
  BatteryLow, 
  Wind, 
  Thermometer,
  Layers
} from 'lucide-react';
import { Alert } from '../types';

export const AlertCenterView: React.FC = () => {
  const { 
    alerts, 
    resolveAlert, 
    clearAllResolvedAlerts, 
    dispatchTruckToBin, 
    triggerRemoteMistSanitization 
  } = useWasteApp();

  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'info'>('all');
  const [showResolved, setShowResolved] = useState<boolean>(false);

  const filteredAlerts = alerts.filter(alert => {
    if (!showResolved && alert.resolved) return false;
    if (showResolved && !alert.resolved) return false;
    if (severityFilter === 'all') return true;
    return alert.severity === severityFilter;
  });

  const activeCount = alerts.filter(a => !a.resolved).length;
  const criticalCount = alerts.filter(a => !a.resolved && a.severity === 'critical').length;
  const highCount = alerts.filter(a => !a.resolved && a.severity === 'high').length;

  const getSeverityBadge = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return { label: 'CRITICAL', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'high':
        return { label: 'HIGH', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' };
      case 'medium':
        return { label: 'MEDIUM', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      default:
        return { label: 'INFO', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'overflow':
      case 'fill':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'odour':
      case 'sanitization':
        return <Wind className="w-4 h-4 text-purple-400" />;
      case 'temperature':
        return <Thermometer className="w-4 h-4 text-amber-400" />;
      case 'battery':
        return <BatteryLow className="w-4 h-4 text-yellow-400" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-400" />
            Automated IoT Alert & Incident Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time rule engine alerts triggered by ultrasonic overflow, volatile gas concentrations, and hardware thresholds.
          </p>
        </div>

        {/* Status Counts */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30">
            {criticalCount} Critical
          </span>
          <span className="px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30">
            {highCount} High
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            {activeCount} Active Total
          </span>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="text-xs text-slate-400 font-mono flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Severity:</span>
          </div>
          {(['all', 'critical', 'high', 'medium', 'info'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 text-xs font-mono rounded capitalize transition-colors ${
                severityFilter === sev
                  ? 'bg-slate-900 text-emerald-400 font-bold border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* View Toggle (Active vs Resolved) */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 p-1 rounded-lg border border-slate-700 flex items-center gap-1">
            <button
              onClick={() => setShowResolved(false)}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                !showResolved ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
              }`}
            >
              Active Alerts ({activeCount})
            </button>
            <button
              onClick={() => setShowResolved(true)}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                showResolved ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
              }`}
            >
              Resolved History
            </button>
          </div>

          {showResolved && (
            <button
              onClick={clearAllResolvedAlerts}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-rose-400 font-mono transition-colors"
            >
              Clear
            </button>
          )}
        </div>

      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-slate-800/40 border border-dashed border-slate-700 rounded-xl space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No Matching Alerts</h3>
            <p className="text-xs text-slate-400 font-mono">
              All monitored smart bins are within threshold parameters for this filter.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const badge = getSeverityBadge(alert.severity);
            const icon = getAlertIcon(alert.type);

            return (
              <div
                key={alert.id}
                className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  alert.resolved
                    ? 'bg-slate-900/40 border-slate-800 opacity-60'
                    : alert.severity === 'critical'
                    ? 'bg-rose-950/20 border-rose-500/40'
                    : 'bg-slate-800/80 border-slate-700/80'
                }`}
              >
                {/* Left Detail */}
                <div className="flex items-start gap-3.5 max-w-2xl">
                  <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {icon}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">{alert.binId}</span>
                      <span className="text-xs text-slate-400 font-mono">· {alert.binLocation}</span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-semibold text-slate-200">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="text-[11px] text-emerald-400 font-mono pt-1">
                      <span>Protocol: </span>
                      <span className="text-slate-300">{alert.recommendedAction}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {!alert.resolved && (
                    <>
                      {alert.type === 'overflow' && (
                        <button
                          onClick={() => dispatchTruckToBin(alert.binId)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                        >
                          Dispatch Compactor
                        </button>
                      )}

                      {alert.type === 'odour' && (
                        <button
                          onClick={() => triggerRemoteMistSanitization(alert.binId)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 transition-colors"
                        >
                          Trigger Mist
                        </button>
                      )}

                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    </>
                  )}

                  {alert.resolved && (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolved
                    </span>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
