/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WasteAppProvider, useWasteApp } from './context/WasteAppContext';
import { Navbar } from './components/Navbar';
import { DemoActionBar } from './components/DemoActionBar';
import { DashboardView } from './components/DashboardView';
import { SmartBinsView } from './components/SmartBinsView';
import { AiWasteScannerView } from './components/AiWasteScannerView';
import { LiveSensorsView } from './components/LiveSensorsView';
import { CollectionPriorityView } from './components/CollectionPriorityView';
import { SanitizationView } from './components/SanitizationView';
import { SmartMapView } from './components/SmartMapView';
import { AlertCenterView } from './components/AlertCenterView';
import { AnalyticsView } from './components/AnalyticsView';
import { CollectionRouteView } from './components/CollectionRouteView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { BinDetailModal } from './components/BinDetailModal';
import { LoginModal } from './components/LoginModal';

const AppContent: React.FC = () => {
  const { activeTab } = useWasteApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'bins':
        return <SmartBinsView />;
      case 'scanner':
        return <AiWasteScannerView />;
      case 'sensors':
        return <LiveSensorsView />;
      case 'priority':
        return <CollectionPriorityView />;
      case 'sanitization':
        return <SanitizationView />;
      case 'map':
        return <SmartMapView />;
      case 'alerts':
        return <AlertCenterView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'route':
        return <CollectionRouteView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Fixed Navigation & Demo Bar */}
      <Navbar />
      <DemoActionBar />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveView()}
      </main>

      {/* Modals */}
      <BinDetailModal />
      <LoginModal />

      {/* Minimal Clean Footer adhering to Anti-Slop Discipline */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Smart India Hackathon 2026 · Problem Statement ID: SIH26212</span>
          <span>Theme: Clean and Green Technology (Hardware / IoT + AI)</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <WasteAppProvider>
      <AppContent />
    </WasteAppProvider>
  );
}
