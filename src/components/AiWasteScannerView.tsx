import React, { useState, useRef } from 'react';
import { useWasteApp } from '../context/WasteAppContext';
import { 
  Scan, 
  Upload, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Recycle, 
  Leaf, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  Info,
  Clock,
  Check
} from 'lucide-react';
import { DEMO_WASTE_SAMPLES, classifyWasteImage, DemoWasteSample } from '../services/aiService';
import { WasteClassificationResult } from '../types';

export const AiWasteScannerView: React.FC = () => {
  const { bins, simulateNewWasteDetected, setActiveTab } = useWasteApp();

  const [selectedSample, setSelectedSample] = useState<DemoWasteSample | null>(DEMO_WASTE_SAMPLES[0]);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);
  const [textHint, setTextHint] = useState<string>('Clear PET mineral water bottle');
  
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<WasteClassificationResult | null>(null);
  const [sortedSuccessBinId, setSortedSuccessBinId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeImagePreview = customImageBase64 || selectedSample?.imageUrl || DEMO_WASTE_SAMPLES[0].imageUrl;

  const handleSelectDemoSample = (sample: DemoWasteSample) => {
    setSelectedSample(sample);
    setCustomImageBase64(null);
    setCustomImageFile(null);
    setTextHint(sample.defaultDescriptor);
    setScanResult(null);
    setSortedSuccessBinId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomImageFile(file);
    setSelectedSample(null);
    setScanResult(null);
    setSortedSuccessBinId(null);

    const reader = new FileReader();
    reader.onload = () => {
      setCustomImageBase64(reader.result as string);
      setTextHint(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    };
    reader.readAsDataURL(file);
  };

  const handleRunAiClassification = async () => {
    setIsScanning(true);
    setScanResult(null);
    setSortedSuccessBinId(null);

    try {
      const result = await classifyWasteImage(
        customImageBase64 || undefined,
        customImageFile?.type || 'image/jpeg',
        textHint || selectedSample?.defaultDescriptor || 'Waste item'
      );
      setScanResult(result);
    } catch (err) {
      console.error('Classification error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSortIntoBin = (binId: string) => {
    simulateNewWasteDetected(binId, 8);
    setSortedSuccessBinId(binId);
    setTimeout(() => setSortedSuccessBinId(null), 3500);
  };

  // Find candidate bins matching the recommendation
  const recommendedBins = bins.filter(b => {
    if (!scanResult) return false;
    if (scanResult.category === 'Organic') return b.wasteType === 'Wet / Organic';
    if (scanResult.category === 'Hazardous' || scanResult.category === 'E-waste') return b.wasteType === 'Hazardous / E-Waste';
    return b.wasteType === 'Dry / Recyclable';
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Scan className="w-6 h-6 text-emerald-400" />
            AI Waste Vision Classifier & Segregation Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multimodal Gemini Vision inference classifies items into 8 waste streams, prevents landfill contamination, and guides citizen disposal.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 3.8 Flash Vision Ready</span>
        </div>
      </div>

      {/* Main Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Selection & Scanner Viewport (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Visual Scanner Viewport */}
          <div className="bg-slate-850 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg relative">
            <div className="p-3 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                Input Visual Stream
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {customImageBase64 ? 'Uploaded File' : selectedSample?.name || 'Selected Sample'}
              </span>
            </div>

            {/* Image Preview Container with Scanner Laser Overlay */}
            <div className="relative aspect-4/3 bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={activeImagePreview}
                alt="Waste item candidate"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />

              {/* Scanning Laser Animation */}
              {isScanning && (
                <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none flex flex-col justify-center">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-pulse" />
                  <div className="text-center font-mono text-xs font-bold text-emerald-300 mt-2">
                    Running Deep Neural Feature Extraction...
                  </div>
                </div>
              )}

              {/* Viewport Reticle Box */}
              <div className="absolute inset-4 border border-dashed border-emerald-500/40 rounded-lg pointer-events-none flex items-center justify-center">
                <span className="text-[10px] font-mono text-emerald-400/80 bg-slate-950/70 px-2 py-0.5 rounded">
                  Bounding Box: Object Detection
                </span>
              </div>
            </div>

            {/* Contextual Descriptor / Hint */}
            <div className="p-3 border-t border-slate-800 space-y-2">
              <label className="text-[11px] text-slate-400 font-mono block">Context / Item Name (Optional):</label>
              <input
                type="text"
                value={textHint}
                onChange={(e) => setTextHint(e.target.value)}
                placeholder="e.g. Plastic mineral water bottle, banana peel..."
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Action Bar */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Image</span>
              </button>

              <button
                onClick={handleRunAiClassification}
                disabled={isScanning}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-md transition-all cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Classifying with AI...' : 'Classify Waste Item'}</span>
              </button>
            </div>
          </div>

          {/* Curated Demo Samples Gallery */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-3">
            <span className="text-xs font-mono text-slate-300 font-semibold uppercase block">
              1-Click Demo Waste Test Samples:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_WASTE_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectDemoSample(sample)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    selectedSample?.id === sample.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-white'
                      : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <img
                    src={sample.imageUrl}
                    alt={sample.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-12 object-cover rounded mb-1.5"
                  />
                  <div className="text-[11px] font-medium leading-tight truncate">{sample.name}</div>
                  <div className="text-[9px] text-emerald-400 font-mono mt-0.5">{sample.category}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Inference Results Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {scanResult ? (
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 space-y-5 animate-fade-in shadow-xl">
              
              {/* Header: Detected Item & Category */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Category: {scanResult.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {scanResult.confidence}% Model Confidence
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {scanResult.detectedItem}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Model Verdict</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {scanResult.recyclable ? '100% Recyclable' : 'Special Handling'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Bin Highlight Card */}
              <div 
                className="p-4 rounded-xl border flex items-center justify-between gap-4"
                style={{ 
                  backgroundColor: `${scanResult.binColor}15`, 
                  borderColor: `${scanResult.binColor}50` 
                }}
              >
                <div className="flex items-center gap-3.5">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                    style={{ backgroundColor: scanResult.binColor }}
                  >
                    <Recycle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block">
                      Recommended Disposal Destination:
                    </span>
                    <span className="text-base sm:text-lg font-bold text-white">
                      {scanResult.recommendedBin}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:block text-right font-mono text-xs text-slate-300">
                  <span className="block text-[10px] text-slate-400">DECOMPOSITION</span>
                  <span className="font-bold text-white">{scanResult.decompositionTime}</span>
                </div>
              </div>

              {/* Explanation & Material Science */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
                  Material Composition & Scientific Rationale:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  {scanResult.explanation}
                </p>
              </div>

              {/* Safe Handling & Citizen Protocol */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Citizen Safe Handling Protocol:
                </span>
                <p className="text-xs text-emerald-300/90 leading-relaxed bg-emerald-950/30 p-3 rounded-lg border border-emerald-900/50">
                  {scanResult.safeHandlingAdvice}
                </p>
              </div>

              {/* Environmental Metrics (Decomposition & CO2 Avoided) */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    DECOMPOSITION TIME
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5 block">
                    {scanResult.decompositionTime}
                  </span>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-emerald-400" />
                    CARBON AVOIDED
                  </span>
                  <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                    +{scanResult.carbonFootprintReductionKg} kg CO₂e
                  </span>
                </div>
              </div>

              {/* Sort into Simulated Bin Action */}
              <div className="pt-2 border-t border-slate-700/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-300 font-semibold">
                    Simulate Disposal into Municipal Bin:
                  </span>
                  {sortedSuccessBinId && (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Disposed into {sortedSuccessBinId}!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recommendedBins.slice(0, 2).map(bin => (
                    <button
                      key={bin.id}
                      onClick={() => handleSortIntoBin(bin.id)}
                      className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-700 text-left transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-mono font-bold text-white group-hover:text-emerald-400">
                          {bin.id} ({bin.fillLevel}% Full)
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {bin.location}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-800/50 border border-dashed border-slate-700 rounded-xl p-10 text-center space-y-4 flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Scan className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h3 className="text-base font-semibold text-white">
                  Awaiting Waste Input
                </h3>
                <p className="text-xs text-slate-400">
                  Select one of the sample images on the left or upload your own photo of waste to run real-time AI classification, recommended bin assignment, and material breakdown.
                </p>
              </div>
              <button
                onClick={handleRunAiClassification}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors"
              >
                Scan Current Sample
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
