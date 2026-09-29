import React, { useState } from 'react';
import { useWasteApp } from '../context/WasteAppContext';
import { 
  Trash2, 
  LayoutDashboard, 
  Boxes, 
  Scan, 
  Cpu, 
  ListOrdered, 
  Sparkles, 
  MapPin, 
  Bell, 
  BarChart3, 
  Navigation, 
  FileText, 
  Sliders, 
  UserCheck, 
  ChevronDown
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    activeRole, 
    setActiveRole, 
    cityStats,
    setIsLoginModalOpen
  } = useWasteApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bins', label: 'Smart Bins', icon: Boxes },
    { id: 'scanner', label: 'AI Scanner', icon: Scan },
    { id: 'sensors', label: 'Live Sensors', icon: Cpu },
    { id: 'priority', label: 'Priority', icon: ListOrdered },
    { id: 'sanitization', label: 'Sanitization', icon: Sparkles },
    { id: 'map', label: 'Smart Map', icon: MapPin },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: cityStats.activeAlertsCount },
    { id: 'route', label: 'Route', icon: Navigation },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Sliders }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setActiveRole(role);
    setIsRoleDropdownOpen(false);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'City Admin';
      case 'municipal': return 'Collection Staff';
      case 'sanitization': return 'Sanitization Staff';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark with clean tech dot */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/25 transition-colors">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  EcoSanctuary IoT
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="IoT Network Online" />
                </span>
                <span className="text-[11px] text-slate-400 block -mt-0.5 font-mono">
                  SIH26212 · Smart Waste
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors relative ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions & Role Switcher */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-slate-200 rounded-md transition-colors"
                title="Switch Demo Role"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline font-mono">{getRoleLabel(activeRole)}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-700/60 text-[11px] text-slate-400 uppercase font-mono">
                    Select Role (Demo)
                  </div>
                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/70 transition-colors ${
                      activeRole === 'admin' ? 'text-emerald-400 font-semibold bg-emerald-500/10' : 'text-slate-200'
                    }`}
                  >
                    <span>City Administrator</span>
                    <span className="text-[10px] text-slate-400 font-mono">All Controls</span>
                  </button>
                  <button
                    onClick={() => handleRoleSelect('municipal')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/70 transition-colors ${
                      activeRole === 'municipal' ? 'text-emerald-400 font-semibold bg-emerald-500/10' : 'text-slate-200'
                    }`}
                  >
                    <span>Municipal Collection</span>
                    <span className="text-[10px] text-slate-400 font-mono">Truck Ops</span>
                  </button>
                  <button
                    onClick={() => handleRoleSelect('sanitization')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/70 transition-colors ${
                      activeRole === 'sanitization' ? 'text-emerald-400 font-semibold bg-emerald-500/10' : 'text-slate-200'
                    }`}
                  >
                    <span>Sanitization Staff</span>
                    <span className="text-[10px] text-slate-400 font-mono">Bio-Clean</span>
                  </button>
                  <div className="border-t border-slate-700/60 p-1">
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        setIsLoginModalOpen(true);
                      }}
                      className="w-full text-center px-2 py-1 text-[11px] text-slate-300 hover:text-white hover:bg-slate-700/50 rounded"
                    >
                      Open Role Login Portal
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Scanner Action */}
            <button
              onClick={() => setActiveTab('scanner')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shadow-sm whitespace-nowrap"
            >
              <Scan className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Waste Scanner</span>
            </button>
          </div>

        </div>

        {/* Mobile secondary tab strip */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
