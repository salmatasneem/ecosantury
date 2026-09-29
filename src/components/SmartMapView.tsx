import React, { useState } from 'react';
import { useWasteApp } from '../context/WasteAppContext';
import { 
  MapPin, 
  Layers, 
  Navigation, 
  Trash2, 
  Sparkles, 
  Eye, 
  X, 
  Compass, 
  ZoomIn, 
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { calculateBinStatus } from '../services/decisionEngine';
import { SmartBin } from '../types';

export const SmartMapView: React.FC = () => {
  const { 
    bins, 
    thresholds, 
    currentRoute, 
    setSelectedBinForDetail,
    markTaskCompleted,
    triggerRemoteMistSanitization 
  } = useWasteApp();

  const [selectedPin, setSelectedPin] = useState<SmartBin | null>(bins[0]);
  const [showRouteOverlay, setShowRouteOverlay] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const getMarkerColor = (bin: SmartBin) => {
    const status = calculateBinStatus(bin, thresholds);
    switch (status) {
      case 'overflow_risk':
        return { 
          bg: 'bg-rose-500', 
          border: 'border-rose-300', 
          ring: 'ring-rose-500/50', 
          label: 'Critical Overflow' 
        };
      case 'sanitization_required':
        return { 
          bg: 'bg-purple-500', 
          border: 'border-purple-300', 
          ring: 'ring-purple-500/50', 
          label: 'Sanitization Needed' 
        };
      case 'nearly_full':
        return { 
          bg: 'bg-amber-500', 
          border: 'border-amber-300', 
          ring: 'ring-amber-500/50', 
          label: 'Nearly Full' 
        };
      default:
        return { 
          bg: 'bg-emerald-500', 
          border: 'border-emerald-300', 
          ring: 'ring-emerald-500/50', 
          label: 'Normal' 
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-400" />
            Interactive Smart Bin City Grid Map
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time geospatial layout of municipal smart bins with IoT status, fill telemetry, and route overlay.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono bg-slate-800/80 border border-slate-700 p-2 rounded-lg flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Normal (0-60%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-300">Nearly Full (61-80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-slate-300">Critical (&gt;80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-slate-300">Sanitization</span>
          </div>
        </div>
      </div>

      {/* Map Board Container */}
      <div className="relative bg-slate-950 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl h-[560px]">
        
        {/* Interactive Controls Overlay */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <button
            onClick={() => setShowRouteOverlay(!showRouteOverlay)}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors flex items-center gap-1.5 ${
              showRouteOverlay
                ? 'bg-emerald-600/90 border-emerald-500 text-white'
                : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{showRouteOverlay ? 'Route Overlay: ON' : 'Show Route'}</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 bg-slate-900/90 border border-slate-700 rounded-lg p-1">
          <button 
            onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
            className="p-1 text-slate-300 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.1))}
            className="p-1 text-slate-300 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Vector Schematic City Map Canvas */}
        <div 
          className="w-full h-full relative transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          {/* SVG Grid & City Infrastructure Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.8" />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* City Waterway / Canal */}
            <path
              d="M 0 320 Q 250 280, 500 340 T 1100 310"
              fill="none"
              stroke="#0284c7"
              strokeWidth="16"
              strokeOpacity="0.25"
            />
            <path
              d="M 0 320 Q 250 280, 500 340 T 1100 310"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeOpacity="0.4"
            />

            {/* Arterial Roadways */}
            <line x1="0" y1="180" x2="100%" y2="180" stroke="#334155" strokeWidth="8" strokeOpacity="0.7" />
            <line x1="0" y1="420" x2="100%" y2="420" stroke="#334155" strokeWidth="8" strokeOpacity="0.7" />
            <line x1="280" y1="0" x2="280" y2="100%" stroke="#334155" strokeWidth="8" strokeOpacity="0.7" />
            <line x1="680" y1="0" x2="680" y2="100%" stroke="#334155" strokeWidth="8" strokeOpacity="0.7" />

            {/* Center Road Dash Markings */}
            <line x1="0" y1="180" x2="100%" y2="180" stroke="#64748b" strokeWidth="1" strokeDasharray="6,8" strokeOpacity="0.8" />
            <line x1="0" y1="420" x2="100%" y2="420" stroke="#64748b" strokeWidth="1" strokeDasharray="6,8" strokeOpacity="0.8" />

            {/* Smart Collection Route Spline */}
            {showRouteOverlay && currentRoute.waypoints.length > 1 && (
              <polyline
                points={currentRoute.waypoints.map(w => `${(w.coordinates.x / 100) * 900 + 40},${(w.coordinates.y / 100) * 480 + 30}`).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeDasharray="6,4"
                strokeLinecap="round"
                className="animate-pulse"
                opacity="0.85"
              />
            )}
          </svg>

          {/* Sector Labels on Map */}
          <div className="absolute top-8 left-10 text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase pointer-events-none">
            Sector 1 · Transit Concourse
          </div>
          <div className="absolute top-8 right-20 text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase pointer-events-none">
            Sector 2 · Vegetable & Grain Market
          </div>
          <div className="absolute bottom-16 left-12 text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase pointer-events-none">
            Sector 5 · Recreation & Stadium
          </div>
          <div className="absolute bottom-16 right-16 text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase pointer-events-none">
            Sector 4 · Cyber City Tech Hub
          </div>

          {/* Smart Bin Pins on Map */}
          {bins.map((bin) => {
            const marker = getMarkerColor(bin);
            const isSelected = selectedPin?.id === bin.id;

            return (
              <div
                key={bin.id}
                onClick={() => setSelectedPin(bin)}
                style={{ left: `${bin.coordinates.x}%`, top: `${bin.coordinates.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
              >
                {/* Ping wave for critical bins */}
                {bin.fillLevel > 80 && (
                  <span className={`absolute -inset-2 rounded-full ${marker.bg} opacity-50 animate-ping pointer-events-none`} />
                )}

                {/* Pin Circle Marker */}
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-[11px] text-white shadow-lg border-2 ${marker.border} ${marker.bg} transition-all duration-200 ${
                    isSelected ? 'scale-125 ring-4 ring-emerald-400/60 z-30' : 'group-hover:scale-110'
                  }`}
                >
                  {bin.fillLevel}%
                </div>

                {/* Hover Label */}
                <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-slate-200 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700 pointer-events-none shadow">
                  {bin.id}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Bin Pop-up Card */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 z-30 bg-slate-900/95 border border-slate-700/90 backdrop-blur-md rounded-xl p-4 shadow-2xl space-y-3 animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-white">{selectedPin.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {selectedPin.wasteType}
                  </span>
                </div>
                <h4 className="text-xs font-medium text-slate-300 mt-1 line-clamp-1">{selectedPin.location}</h4>
                <p className="text-[11px] text-slate-400 font-mono">Zone: {selectedPin.zone}</p>
              </div>

              <button
                onClick={() => setSelectedPin(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-center font-mono text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">CAPACITY</span>
                <span className={`font-bold ${selectedPin.fillLevel > 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedPin.fillLevel}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">GAS PPM</span>
                <span className={`font-bold ${selectedPin.gasPpm > 180 ? 'text-purple-400' : 'text-slate-200'}`}>
                  {selectedPin.gasPpm} PPM
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">TEMP</span>
                <span className="font-bold text-amber-400">{selectedPin.temperature}°C</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => setSelectedBinForDetail(selectedPin)}
                className="py-1.5 px-2 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-1"
              >
                <Eye className="w-3 h-3" />
                <span>Inspect</span>
              </button>
              <button
                onClick={() => markTaskCompleted(`task-${selectedPin.id}`)}
                className="py-1.5 px-2 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1 shadow"
              >
                <Trash2 className="w-3 h-3" />
                <span>Empty</span>
              </button>
              <button
                onClick={() => triggerRemoteMistSanitization(selectedPin.id)}
                className="py-1.5 px-2 text-xs font-medium rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Sanitize</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
