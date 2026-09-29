import React, { useState } from 'react';
import { useWasteApp } from '../context/WasteAppContext';
import { 
  X, 
  Cpu, 
  Thermometer, 
  Droplets, 
  Wind, 
  Battery, 
  Activity, 
  Sparkles, 
  Trash2, 
  Wifi, 
  ShieldCheck, 
  History,
  Sliders
} from 'lucide-react';
import { calculateBinStatus } from '../services/decisionEngine';

export const BinDetailModal: React.FC = () => {
  const { 
    selectedBinForDetail, 
    setSelectedBinForDetail, 
    updateBinTelemetry, 
    thresholds,
    markTaskCompleted,
    triggerRemoteMistSanitization
  } = useWasteApp();

  if (!selectedBinForDetail) return null;

  const bin = selectedBinForDetail;
  const status = calculateBinStatus(bin, thresholds);

  // Live tester sliders state
  const [testFill, setTestFill] = useState(bin.fillLevel);
  const [testTemp, setTestTemp] = useState(bin.temperature);
  const [testGas, setTestGas] = useState(bin.gasPpm);

  const applyTestValues = () => {
    updateBinTelemetry(bin.id, {
      fillLevel: testFill,
      temperature: testTemp,
      gasPpm: testGas
    });
    // refresh current view
    setSelectedBinForDetail({
      ...bin,
      fillLevel: testFill,
      temperature: testTemp,
      gasPpm: testGas,
      lastUpdated: 'Just now (Tester)'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold font-mono text-white">{bin.id}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                {bin.wasteType}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                Zone: {bin.zone}
              </span>
            </div>
            <p className="text-sm text-slate-300">{bin.location}</p>
          </div>
          
          <button
            onClick={() => setSelectedBinForDetail(null)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Gauges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Fill Capacity
            </span>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {bin.fillLevel}%
            </div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full ${bin.fillLevel > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${bin.fillLevel}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-mono block mt-1">
              {Math.round((bin.fillLevel / 100) * bin.capacityLiters)}L / {bin.capacityLiters}L
            </span>
          </div>

          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              Internal Temp
            </span>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {bin.temperature}°C
            </div>
            <span className="text-[10px] text-slate-400 font-mono block mt-2">
              DHT22 Ambient Sensor
            </span>
          </div>

          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-blue-400" />
              Gas / Odour
            </span>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {bin.gasPpm} <span className="text-xs font-normal text-slate-400">PPM</span>
            </div>
            <span className={`text-[10px] font-mono block mt-2 ${
              bin.gasPpm > 180 ? 'text-rose-400 font-bold' : 'text-slate-400'
            }`}>
              Level: {bin.odourLevel}
            </span>
          </div>

          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
              LiFePO4 Power
            </span>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {bin.batteryLevel}%
            </div>
            <span className="text-[10px] text-emerald-400 font-mono block mt-2">
              {bin.solarCharging ? 'Solar Harvesting On' : 'Battery Discharge'}
            </span>
          </div>

        </div>

        {/* Live Interactive Telemetry Injector for this Bin */}
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-semibold text-white font-mono uppercase tracking-wide">
                Live Sensor Override Simulator
              </h3>
            </div>
            <button
              onClick={applyTestValues}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded transition-colors"
            >
              Inject Sensor Telemetry
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                <span>Fill Level</span>
                <span className="text-emerald-400">{testFill}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={testFill}
                onChange={(e) => setTestFill(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                <span>Temperature</span>
                <span className="text-amber-400">{testTemp}°C</span>
              </div>
              <input
                type="range"
                min="15"
                max="55"
                value={testTemp}
                onChange={(e) => setTestTemp(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                <span>Gas (MQ-135)</span>
                <span className="text-rose-400">{testGas} PPM</span>
              </div>
              <input
                type="range"
                min="20"
                max="350"
                value={testGas}
                onChange={(e) => setTestGas(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          </div>
        </div>

        {/* ESP32 Hardware Specs Breakdown */}
        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Connected Hardware Node Specifications</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] block">MICROCONTROLLER</span>
              <span className="text-slate-200">{bin.hardwareSpecs.mcu}</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] block">ULTRASONIC SENSOR</span>
              <span className="text-slate-200">{bin.hardwareSpecs.ultrasonicSensor}</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] block">AIR QUALITY / GAS</span>
              <span className="text-slate-200">{bin.hardwareSpecs.gasSensor}</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] block">MAC ADDRESS</span>
              <span className="text-slate-200">{bin.hardwareSpecs.macAddress}</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] block">GATEWAY IP</span>
              <span className="text-slate-200">{bin.hardwareSpecs.ipAddress}</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] block">FIRMWARE</span>
              <span className="text-emerald-400">{bin.hardwareSpecs.firmwareVersion}</span>
            </div>
          </div>
        </div>

        {/* Telemetry Log */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Recent Sensor Telemetry Ingestion (Today)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300 font-mono">
              <thead className="bg-slate-800/80 text-slate-400 text-[11px]">
                <tr>
                  <th className="p-2">Time</th>
                  <th className="p-2">Fill Level</th>
                  <th className="p-2">Temperature</th>
                  <th className="p-2">Gas PPM</th>
                  <th className="p-2">Lid Sensor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {bin.telemetryHistory.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-2">{entry.timestamp}</td>
                    <td className="p-2 font-bold">{entry.fillLevel}%</td>
                    <td className="p-2">{entry.temperature}°C</td>
                    <td className="p-2">{entry.gasPpm} PPM</td>
                    <td className="p-2 text-emerald-400">Closed (Nominal)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => setSelectedBinForDetail(null)}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
          >
            Close Details
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerRemoteMistSanitization(bin.id);
                setSelectedBinForDetail(null);
              }}
              className="px-3 py-1.5 text-xs font-medium bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trigger Mist Sanitizer</span>
            </button>
            <button
              onClick={() => {
                markTaskCompleted(`task-${bin.id}`);
                setSelectedBinForDetail(null);
              }}
              className="px-3.5 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Empty Bin Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
