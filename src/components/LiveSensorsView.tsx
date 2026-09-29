import React, { useState } from 'react';
import { useWasteApp } from '../context/WasteAppContext';
import { 
  Cpu, 
  Sliders, 
  Send, 
  Code, 
  Check, 
  Copy, 
  Radio, 
  Thermometer, 
  Wind, 
  Battery, 
  Activity, 
  Droplets, 
  Terminal,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { ESP32_ARDUINO_SNIPPET } from '../services/iotSimulator';

export const LiveSensorsView: React.FC = () => {
  const { 
    bins, 
    updateBinTelemetry, 
    isAutoTicking, 
    setIsAutoTicking,
    setRecentActionNotification
  } = useWasteApp();

  const [selectedBinId, setSelectedBinId] = useState<string>('BIN-101');
  const targetBin = bins.find(b => b.id === selectedBinId) || bins[0];

  // Simulator controls
  const [fillLevel, setFillLevel] = useState<number>(targetBin.fillLevel);
  const [temperature, setTemperature] = useState<number>(targetBin.temperature);
  const [humidity, setHumidity] = useState<number>(targetBin.humidity);
  const [gasPpm, setGasPpm] = useState<number>(targetBin.gasPpm);
  const [batteryLevel, setBatteryLevel] = useState<number>(targetBin.batteryLevel);
  const [lidStatus, setLidStatus] = useState<'closed' | 'open' | 'tampered'>(targetBin.lidStatus);
  const [solarCharging, setSolarCharging] = useState<boolean>(targetBin.solarCharging);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);

  // Sync simulator state when target bin changes
  const handleBinChange = (id: string) => {
    setSelectedBinId(id);
    const b = bins.find(bin => bin.id === id);
    if (b) {
      setFillLevel(b.fillLevel);
      setTemperature(b.temperature);
      setHumidity(b.humidity);
      setGasPpm(b.gasPpm);
      setBatteryLevel(b.batteryLevel);
      setLidStatus(b.lidStatus);
      setSolarCharging(b.solarCharging);
    }
  };

  const handleTransmitTelemetry = async () => {
    setIsTransmitting(true);
    
    // Simulate network latency of 300ms
    setTimeout(async () => {
      // 1. Update state
      updateBinTelemetry(selectedBinId, {
        fillLevel,
        temperature,
        humidity,
        gasPpm,
        batteryLevel,
        lidStatus,
        solarCharging
      });

      // 2. Also attempt real server POST if backend is up
      try {
        await fetch(`/api/iot/bin/${selectedBinId}/telemetry`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fillLevel,
            temperature,
            humidity,
            gasPpm,
            batteryLevel,
            lidStatus
          })
        });
      } catch (e) {
        // ignore in client preview
      }

      setIsTransmitting(false);
      setRecentActionNotification(`ESP32 Telemetry transmitted for ${selectedBinId}. Decision engine updated.`);
    }, 280);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ESP32_ARDUINO_SNIPPET);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const outgoingPayload = JSON.stringify({
    nodeId: selectedBinId,
    timestamp: new Date().toISOString(),
    sensors: {
      ultrasonic: {
        fillPercentage: fillLevel,
        rawDistanceCm: Math.round((100 - fillLevel) * 0.9 + 10),
        status: fillLevel > 95 ? 'CRITICAL_OVERFLOW' : fillLevel > 80 ? 'HIGH_CAPACITY' : 'NOMINAL'
      },
      airQualityMQ135: {
        gasConcentrationPpm: gasPpm,
        compounds: ['NH3', 'VOC', 'CO2'],
        odourHazard: gasPpm > 220 ? 'HAZARDOUS' : gasPpm > 150 ? 'ELEVATED' : 'SAFE'
      },
      dht22: {
        temperatureCelsius: temperature,
        relativeHumidityPercent: humidity
      },
      power: {
        batteryPercent: batteryLevel,
        solarHarvesterActive: solarCharging,
        estimatedDaysLeft: Math.round((batteryLevel / 100) * 14)
      },
      lidSwitch: {
        state: lidStatus,
        tamperDetected: lidStatus === 'tampered'
      }
    }
  }, null, 2);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-emerald-400" />
            Live IoT Sensor Simulation & Hardware Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate ESP32 sensor values or connect physical microcontrollers via REST API / MQTT.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoTicking(!isAutoTicking)}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors flex items-center gap-2 ${
              isAutoTicking
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isAutoTicking ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <span>{isAutoTicking ? 'Auto-Tick Live (3s)' : 'Start Auto-Tick'}</span>
          </button>
        </div>
      </div>

      {/* Simulator Control Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Sliders (7 cols) */}
        <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">Step 1: Select Smart Bin Node</span>
              <p className="text-xs text-slate-300">Choose which simulated bin to override</p>
            </div>

            <select
              value={selectedBinId}
              onChange={(e) => handleBinChange(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs font-mono text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              {bins.map(b => (
                <option key={b.id} value={b.id}>
                  {b.id} — {b.location} ({b.wasteType})
                </option>
              ))}
            </select>
          </div>

          {/* Sliders Grid */}
          <div className="space-y-4">
            
            {/* 1. Fill Level Slider */}
            <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Ultrasonic Fill Level (JSN-SR04T)
                </span>
                <span className="font-bold text-white text-sm tabular-nums">{fillLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={fillLevel}
                onChange={(e) => setFillLevel(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0% (Empty)</span>
                <span className="text-amber-400">60% (Warning)</span>
                <span className="text-rose-400">80% (Collection Due)</span>
                <span className="text-rose-500 font-bold">95% (Overflow!)</span>
              </div>
            </div>

            {/* 2. Temperature & Humidity Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-amber-400" />
                    Temp (°C)
                  </span>
                  <span className="font-bold text-white tabular-nums">{temperature}°C</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 font-mono block">
                  &gt;40°C triggers thermal fermentation alert
                </span>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    Humidity (%)
                  </span>
                  <span className="font-bold text-white tabular-nums">{humidity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="99"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 font-mono block">
                  High humidity accelerates organic decay
                </span>
              </div>
            </div>

            {/* 3. MQ-135 Gas / Odour Slider */}
            <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-purple-400" />
                  Volatile Gas / Ammonia (MQ-135 Sensor)
                </span>
                <span className={`font-bold tabular-nums text-sm ${gasPpm > 180 ? 'text-rose-400' : 'text-white'}`}>
                  {gasPpm} PPM
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="350"
                value={gasPpm}
                onChange={(e) => setGasPpm(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0-80 (Nominal)</span>
                <span className="text-amber-400">80-160 (Moderate)</span>
                <span className="text-rose-400">&gt;220 (Sanitization Urgent!)</span>
              </div>
            </div>

            {/* 4. Battery Level */}
            <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  18650 Battery State of Charge
                </span>
                <span className={`font-bold tabular-nums ${batteryLevel <= 20 ? 'text-rose-400' : 'text-white'}`}>
                  {batteryLevel}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={batteryLevel}
                onChange={(e) => setBatteryLevel(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono block">
                &lt;20% triggers IoT Gateway Low Battery Alert
              </span>
            </div>

            {/* 5. Toggles (Lid Status & Solar) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg">
                <label className="text-xs text-slate-300 font-mono block mb-1.5">Lid Sensor Status</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['closed', 'open', 'tampered'] as const).map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setLidStatus(status)}
                      className={`py-1 text-[11px] font-mono rounded capitalize transition-colors ${
                        lidStatus === status
                          ? status === 'closed' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-300 font-mono block">Solar Harvesting</span>
                  <span className="text-[10px] text-slate-400 font-mono">TP4056 Photovoltaic Circuit</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSolarCharging(!solarCharging)}
                  className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                    solarCharging ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {solarCharging ? 'Active' : 'Offline'}
                </button>
              </div>
            </div>

          </div>

          {/* Transmit Button */}
          <div className="pt-2">
            <button
              onClick={handleTransmitTelemetry}
              disabled={isTransmitting}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${isTransmitting ? 'animate-spin' : ''}`} />
              <span>{isTransmitting ? 'Transmitting to Decision Engine...' : `Transmit Sensor Telemetry to ${selectedBinId}`}</span>
            </button>
          </div>

        </div>

        {/* Right Column: Outgoing Payload & ESP32 Integration (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* JSON Payload Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Outgoing ESP32 JSON Body
              </span>
              <span className="text-[10px] text-emerald-400">POST /api/iot/bin/{selectedBinId}/telemetry</span>
            </div>
            
            <pre className="max-h-60 overflow-y-auto text-[11px] text-emerald-300/90 leading-relaxed scrollbar-thin">
              {outgoingPayload}
            </pre>
          </div>

          {/* ESP32 Hardware Integration Guide Box */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-white font-mono uppercase">
                  ESP32 Arduino Firmware C++
                </h3>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Tested for ESP32-WROOM-32 with waterproof JSN-SR04T ultrasonic sensor, MQ-135 gas sensor, and DHT22. Ready to upload in Arduino IDE.
            </p>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
              <div><strong className="text-emerald-400">REST Endpoint:</strong> /api/iot/bin/:id/telemetry</div>
              <div><strong className="text-blue-400">MQTT Topic:</strong> city/smartbins/:id/telemetry</div>
              <div><strong className="text-purple-400">Interval:</strong> 15s deep-sleep cycles</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
