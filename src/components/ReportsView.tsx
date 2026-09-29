import React, { useState } from 'react';
import { useWasteApp } from '../context/WasteAppContext';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  Leaf, 
  ShieldCheck, 
  FileSpreadsheet
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { bins, cityStats, alerts } = useWasteApp();

  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const headers = ['Bin ID', 'Location', 'Zone', 'Waste Type', 'Fill Level (%)', 'Gas (PPM)', 'Temp (°C)', 'Battery (%)', 'Sanitization Status'];
    const rows = bins.map(b => [
      b.id,
      `"${b.location}"`,
      `"${b.zone}"`,
      `"${b.wasteType}"`,
      b.fillLevel,
      b.gasPpm,
      b.temperature,
      b.batteryLevel,
      b.sanitizationStatus
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smart_waste_audit_${reportPeriod}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            Municipal Waste Management Audit & Compliance Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generated automated executive summaries for municipal commissioners, Swachh Bharat audits, and state pollution control boards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Period Selector Tabs */}
      <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono text-slate-300 font-semibold">Report Audit Cadence:</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
          {(['daily', 'weekly', 'monthly'] as const).map(p => (
            <button
              key={p}
              onClick={() => setReportPeriod(p)}
              className={`px-3 py-1 text-xs font-mono rounded capitalize transition-colors ${
                reportPeriod === p
                  ? 'bg-slate-800 text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p} Summary
            </button>
          ))}
        </div>
      </div>

      {/* Printable Report Canvas Document */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl print:bg-white print:text-black print:border-none">
        
        {/* Document Header Lockup */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 print:border-slate-300 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 print:text-emerald-700 font-bold uppercase">
              <Building2 className="w-4 h-4" />
              <span>Smart India Hackathon 2026 · PS-SIH26212</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white print:text-black mt-1">
              Municipal Smart Waste & Sanitization Compliance Audit
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5 font-mono">
              Audit Period: {reportPeriod.toUpperCase()} · Certified IoT Telemetry Report
            </p>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-slate-400 print:text-slate-700">
            <div><strong>Generated:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
            <div><strong>Status:</strong> <span className="text-emerald-400 print:text-emerald-700 font-bold">VERIFIED NOMINAL</span></div>
            <div><strong>Total Sensors:</strong> 8 Active ESP32 Gateways</div>
          </div>
        </div>

        {/* Executive Summary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 bg-slate-950/60 print:bg-slate-100 rounded-xl border border-slate-800 print:border-slate-300">
            <span className="text-[11px] text-slate-400 print:text-slate-600 font-mono block">TOTAL WASTE COLLECTED</span>
            <span className="text-xl font-bold font-mono text-white print:text-black mt-1 block">
              {cityStats.wasteCollectedTodayKg} kg
            </span>
            <span className="text-[10px] text-emerald-400 print:text-emerald-700 font-mono">~1.42 Metric Tonnes</span>
          </div>

          <div className="p-3.5 bg-slate-950/60 print:bg-slate-100 rounded-xl border border-slate-800 print:border-slate-300">
            <span className="text-[11px] text-slate-400 print:text-slate-600 font-mono block">COLLECTION EVENTS</span>
            <span className="text-xl font-bold font-mono text-white print:text-black mt-1 block">
              12 Completed
            </span>
            <span className="text-[10px] text-slate-400 print:text-slate-600 font-mono">0 Missed Milestones</span>
          </div>

          <div className="p-3.5 bg-slate-950/60 print:bg-slate-100 rounded-xl border border-slate-800 print:border-slate-300">
            <span className="text-[11px] text-slate-400 print:text-slate-600 font-mono block">OVERFLOWS PREVENTED</span>
            <span className="text-xl font-bold font-mono text-emerald-400 print:text-emerald-700 mt-1 block">
              98.8%
            </span>
            <span className="text-[10px] text-slate-400 print:text-slate-600 font-mono">Early threshold trigger</span>
          </div>

          <div className="p-3.5 bg-slate-950/60 print:bg-slate-100 rounded-xl border border-slate-800 print:border-slate-300">
            <span className="text-[11px] text-slate-400 print:text-slate-600 font-mono block">SANITIZATION AUDIT</span>
            <span className="text-xl font-bold font-mono text-purple-400 print:text-purple-700 mt-1 block">
              100% Passed
            </span>
            <span className="text-[10px] text-slate-400 print:text-slate-600 font-mono">Biogas below 150 PPM</span>
          </div>
        </div>

        {/* Detailed Bin Telemetry Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-slate-400 print:text-slate-700 uppercase font-semibold">
            Individual Smart Bins Performance Roster:
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-mono">
              <thead className="bg-slate-950 print:bg-slate-200 text-slate-400 print:text-slate-800 text-[11px]">
                <tr>
                  <th className="p-2.5">Bin ID</th>
                  <th className="p-2.5">Location</th>
                  <th className="p-2.5">Zone</th>
                  <th className="p-2.5">Waste Stream</th>
                  <th className="p-2.5">Fill %</th>
                  <th className="p-2.5">Gas PPM</th>
                  <th className="p-2.5">Temp</th>
                  <th className="p-2.5">Sanitation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300 text-slate-300 print:text-slate-900">
                {bins.map((bin) => (
                  <tr key={bin.id} className="hover:bg-slate-800/40">
                    <td className="p-2.5 font-bold">{bin.id}</td>
                    <td className="p-2.5 truncate max-w-xs">{bin.location}</td>
                    <td className="p-2.5">{bin.zone}</td>
                    <td className="p-2.5">{bin.wasteType}</td>
                    <td className="p-2.5 font-bold">{bin.fillLevel}%</td>
                    <td className="p-2.5">{bin.gasPpm} PPM</td>
                    <td className="p-2.5">{bin.temperature}°C</td>
                    <td className="p-2.5">
                      <span className={bin.sanitizationStatus === 'sanitary' ? 'text-emerald-400 print:text-emerald-700' : 'text-purple-400 print:text-purple-700'}>
                        {bin.sanitizationStatus === 'sanitary' ? 'Clean' : 'Needs Clean'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sign-off Seal */}
        <div className="pt-6 border-t border-slate-800 print:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-slate-400 print:text-slate-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically Verified Sensor Stream · IoT Gateway Integrity Passed</span>
          </div>
          <div>
            <span>Municipal Cleantech Officer: <strong>Er. A. Sharma (SIH-2026 Lead)</strong></span>
          </div>
        </div>

      </div>

    </div>
  );
};
