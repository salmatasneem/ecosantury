import React, { useState, useMemo } from 'react';
import { useWasteApp } from '../context/WasteAppContext';
import { 
  Boxes, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Thermometer, 
  Wind, 
  Battery, 
  Sparkles, 
  Trash2, 
  Eye, 
  AlertTriangle,
  RotateCcw,
  X,
  ArrowUpDown,
  AlertCircle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { calculateBinStatus } from '../services/decisionEngine';
import { SmartBin, BinStatus } from '../types';

export const SmartBinsView: React.FC = () => {
  const { 
    bins, 
    thresholds, 
    setSelectedBinForDetail, 
    markTaskCompleted,
    triggerRemoteMistSanitization,
  } = useWasteApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedWasteType, setSelectedWasteType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'fill-desc' | 'fill-asc' | 'gas-desc' | 'id-asc'>('fill-desc');

  const zones = useMemo(() => Array.from(new Set(bins.map(b => b.zone))), [bins]);
  const wasteTypes = useMemo(() => Array.from(new Set(bins.map(b => b.wasteType))), [bins]);

  // Compute status counts for fast-filter tabs
  const statusCounts = useMemo(() => {
    let overflow = 0;
    let nearlyFull = 0;
    let sanitization = 0;
    let normal = 0;

    bins.forEach(b => {
      const s = calculateBinStatus(b, thresholds);
      if (s === 'overflow_risk') overflow++;
      else if (s === 'nearly_full') nearlyFull++;
      else if (s === 'sanitization_required') sanitization++;
      else normal++;
    });

    return {
      all: bins.length,
      overflow_risk: overflow,
      nearly_full: nearlyFull,
      sanitization_required: sanitization,
      normal: normal
    };
  }, [bins, thresholds]);

  // Filter and sort bins
  const filteredBins = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return bins
      .filter(bin => {
        const binStatus = calculateBinStatus(bin, thresholds);

        // Smart text search across ID, location, zone, waste type, and status name
        let matchesSearch = true;
        if (query) {
          const statusText = binStatus === 'overflow_risk' ? 'overflow critical' :
            binStatus === 'nearly_full' ? 'nearly full' :
            binStatus === 'sanitization_required' ? 'sanitization required' : 'normal nominal';

          matchesSearch = 
            bin.id.toLowerCase().includes(query) ||
            bin.location.toLowerCase().includes(query) ||
            bin.zone.toLowerCase().includes(query) ||
            bin.wasteType.toLowerCase().includes(query) ||
            statusText.includes(query) ||
            (query === 'overflow' && (binStatus === 'overflow_risk' || bin.fillLevel > 80)) ||
            (query === 'full' && bin.fillLevel > 60);
        }

        // Zone filter
        const matchesZone = selectedZone === 'all' || bin.zone === selectedZone;

        // Status filter
        const matchesStatus = selectedStatus === 'all' || binStatus === selectedStatus;

        // Waste type filter
        const matchesWasteType = selectedWasteType === 'all' || bin.wasteType === selectedWasteType;

        return matchesSearch && matchesZone && matchesStatus && matchesWasteType;
      })
      .sort((a, b) => {
        if (sortBy === 'fill-desc') return b.fillLevel - a.fillLevel;
        if (sortBy === 'fill-asc') return a.fillLevel - b.fillLevel;
        if (sortBy === 'gas-desc') return b.gasPpm - a.gasPpm;
        if (sortBy === 'id-asc') return a.id.localeCompare(b.id);
        return 0;
      });
  }, [bins, searchQuery, selectedZone, selectedStatus, selectedWasteType, sortBy, thresholds]);

  const hasActiveFilters = searchQuery !== '' || selectedZone !== 'all' || selectedStatus !== 'all' || selectedWasteType !== 'all';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedZone('all');
    setSelectedStatus('all');
    setSelectedWasteType('all');
    setSortBy('fill-desc');
  };

  const getStatusBadge = (bin: SmartBin) => {
    const status = calculateBinStatus(bin, thresholds);
    switch (status) {
      case 'overflow_risk':
        return { label: 'Critical / Overflow Risk', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
      case 'sanitization_required':
        return { label: 'Sanitization Required', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'nearly_full':
        return { label: 'Nearly Full', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      default:
        return { label: 'Normal Operation', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
    }
  };

  const getWasteTypeColor = (type: string) => {
    if (type.includes('Organic')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (type.includes('Recyclable')) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (type.includes('Hazardous')) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    return 'text-slate-300 bg-slate-800 border-slate-700';
  };

  const statusQuickFilters: { id: string; label: string; count: number; icon: React.ComponentType<{ className?: string }>; activeColor: string }[] = [
    { 
      id: 'all', 
      label: 'All Bins', 
      count: statusCounts.all, 
      icon: Boxes, 
      activeColor: 'bg-slate-700 text-white border-slate-600' 
    },
    { 
      id: 'overflow_risk', 
      label: 'Overflowing Bins', 
      count: statusCounts.overflow_risk, 
      icon: AlertTriangle, 
      activeColor: 'bg-rose-500/25 text-rose-200 border-rose-500/60 shadow-sm shadow-rose-900/40' 
    },
    { 
      id: 'nearly_full', 
      label: 'Nearly Full (61-80%)', 
      count: statusCounts.nearly_full, 
      icon: Clock, 
      activeColor: 'bg-amber-500/25 text-amber-200 border-amber-500/60 shadow-sm shadow-amber-900/40' 
    },
    { 
      id: 'sanitization_required', 
      label: 'Sanitization Due', 
      count: statusCounts.sanitization_required, 
      icon: Sparkles, 
      activeColor: 'bg-purple-500/25 text-purple-200 border-purple-500/60 shadow-sm shadow-purple-900/40' 
    },
    { 
      id: 'normal', 
      label: 'Normal (0-60%)', 
      count: statusCounts.normal, 
      icon: CheckCircle, 
      activeColor: 'bg-emerald-500/25 text-emerald-200 border-emerald-500/60 shadow-sm shadow-emerald-900/40' 
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-emerald-400" />
            Smart Waste Bins Network
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time ultrasonic fill monitoring, ambient temperature, humidity, and volatile odour detection across municipal sectors.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{filteredBins.length} of {bins.length} Active Nodes Visible</span>
        </div>
      </div>

      {/* Primary Search & Fast Filter Dashboard Bar */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-3.5 shadow-md">
        
        {/* Top Row: Search Input + Sorting */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Universal Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Bin ID (e.g. BIN-102), location, zone, waste type, or status ('overflow', 'critical')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-between md:justify-start">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="fill-desc">Fill Level (Highest First)</option>
              <option value="fill-asc">Fill Level (Lowest First)</option>
              <option value="gas-desc">Gas/Odour PPM (Highest)</option>
              <option value="id-asc">Bin ID (A to Z)</option>
            </select>
          </div>

        </div>

        {/* Middle Row: Segmented Status Filter Buttons (e.g., 'only show overflowing bins') */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Filter by Operational Status:</span>
            {selectedStatus !== 'all' && (
              <span className="text-emerald-400 font-medium">
                Active Filter: {statusQuickFilters.find(f => f.id === selectedStatus)?.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {statusQuickFilters.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedStatus === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? `${tab.activeColor} font-semibold ring-1 ring-white/10`
                      : 'bg-slate-900/80 hover:bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                  <span className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    isSelected 
                      ? 'bg-black/30 text-white' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Row: Zone and Waste Type Dropdowns + Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-700/80">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Zone Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-mono">Zone:</span>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">All City Zones ({zones.length})</option>
                {zones.map(z => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>

            {/* Waste Type Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-mono">Waste Type:</span>
              <select
                value={selectedWasteType}
                onChange={(e) => setSelectedWasteType(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">All Waste Streams</option>
                {wasteTypes.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Tags & Reset Action */}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors font-mono"
                title="Reset all filters to show all bins"
              >
                <RotateCcw className="w-3 h-3 text-emerald-400" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Smart Bins Grid */}
      {filteredBins.length === 0 ? (
        <div className="p-12 text-center bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
            <AlertCircle className="w-6 h-6 text-amber-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">No Smart Bins Matched Your Filter</h3>
            <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
              No bins currently meet the criteria "{searchQuery || selectedStatus || selectedZone}". Try clearing your search query or selecting a different status.
            </p>
          </div>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors inline-flex items-center gap-1.5 shadow"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Show All {bins.length} Smart Bins</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBins.map((bin) => {
            const badge = getStatusBadge(bin);
            const wasteStyle = getWasteTypeColor(bin.wasteType);
            
            return (
              <div
                key={bin.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 hover:border-slate-600 transition-all flex flex-col justify-between group shadow-sm"
              >
                {/* Top Row: Bin ID + Status Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-white group-hover:text-emerald-400 transition-colors">
                        {bin.id}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${wasteStyle}`}>
                        {bin.wasteType}
                      </span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Location */}
                  <h3 className="text-sm font-semibold text-slate-200 line-clamp-1 mb-1" title={bin.location}>
                    {bin.location}
                  </h3>
                  <p className="text-[11px] text-slate-400 mb-4 font-mono">
                    Zone: {bin.zone} · Cap: {bin.capacityLiters}L
                  </p>

                  {/* Fill Level Meter */}
                  <div className="space-y-1.5 mb-4 p-3 bg-slate-900/60 rounded-lg border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono font-medium">Ultrasonic Fill Level</span>
                      <span className="font-mono font-bold text-white tabular-nums">{bin.fillLevel}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          bin.fillLevel > 80 ? 'bg-rose-500' :
                          bin.fillLevel > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${bin.fillLevel}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                      <span>Lid: {bin.lidStatus}</span>
                      <span>Updated: {bin.lastUpdated}</span>
                    </div>
                  </div>

                  {/* Sensor Metrics Quad */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-700/60 text-center font-mono text-[11px]">
                    <div className="p-1.5 bg-slate-900/40 rounded">
                      <span className="text-slate-400 block text-[10px]">TEMP</span>
                      <span className="text-white font-semibold flex items-center justify-center gap-1">
                        <Thermometer className="w-3 h-3 text-amber-400" />
                        {bin.temperature}°C
                      </span>
                    </div>
                    <div className="p-1.5 bg-slate-900/40 rounded">
                      <span className="text-slate-400 block text-[10px]">GAS / ODOUR</span>
                      <span className={`font-semibold flex items-center justify-center gap-1 ${
                        bin.gasPpm > 180 ? 'text-rose-400' : 'text-slate-200'
                      }`}>
                        <Wind className="w-3 h-3 text-slate-400" />
                        {bin.gasPpm} PPM
                      </span>
                    </div>
                    <div className="p-1.5 bg-slate-900/40 rounded">
                      <span className="text-slate-400 block text-[10px]">BATTERY</span>
                      <span className={`font-semibold flex items-center justify-center gap-1 ${
                        bin.batteryLevel <= 20 ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        <Battery className="w-3 h-3" />
                        {bin.batteryLevel}%
                      </span>
                    </div>
                  </div>

                  {/* Sanitization Row */}
                  <div className="flex items-center justify-between text-xs py-2.5 text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Hygiene:</span>
                    </span>
                    <span className={bin.sanitizationStatus === 'sanitary' ? 'text-emerald-400' : 'text-purple-300'}>
                      {bin.sanitizationStatus === 'sanitary' ? 'Sanitary / Clean' : 'Needs Decontamination'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-700/60">
                  <button
                    onClick={() => setSelectedBinForDetail(bin)}
                    className="py-1.5 px-2 text-xs font-medium rounded bg-slate-700/60 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-1"
                    title="Inspect raw ESP32 sensor telemetry"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => markTaskCompleted(`task-${bin.id}`)}
                    className="py-1.5 px-2 text-xs font-medium rounded bg-emerald-600/80 hover:bg-emerald-600 text-white transition-colors flex items-center justify-center gap-1"
                    title="Empty bin and log collection"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Empty</span>
                  </button>

                  <button
                    onClick={() => triggerRemoteMistSanitization(bin.id)}
                    className="py-1.5 px-2 text-xs font-medium rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 transition-colors flex items-center justify-center gap-1"
                    title="Activate mist sanitizer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Sanitize</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

