import React from 'react';
import { useWasteApp } from '../context/WasteAppContext';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  ArrowRight, 
  Trash2,
  Lock,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, setActiveRole, setRecentActionNotification } = useWasteApp();

  if (!isLoginModalOpen) return null;

  const handleSelectRole = (role: UserRole) => {
    setActiveRole(role);
    setIsLoginModalOpen(false);
    setRecentActionNotification(`Logged in as: ${role === 'admin' ? 'City Administrator' : role === 'municipal' ? 'Municipal Collection Crew' : 'Sanitization Staff'}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-2">
            <Trash2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Role Selection & Demo Portal
          </h2>
          <p className="text-xs text-slate-400">
            Smart India Hackathon 2026 Prototype Portal · 1-Click Role Login
          </p>
        </div>

        {/* Roles Selection */}
        <div className="space-y-3">
          
          {/* 1. Admin */}
          <button
            onClick={() => handleSelectRole('admin')}
            className="w-full p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors block">
                  City Administrator
                </span>
                <span className="text-xs text-slate-400 block -mt-0.5">
                  Full command, threshold tuning, analytics & audit
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </button>

          {/* 2. Municipal Collection Staff */}
          <button
            onClick={() => handleSelectRole('municipal')}
            className="w-full p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors block">
                  Municipal / Collection Staff
                </span>
                <span className="text-xs text-slate-400 block -mt-0.5">
                  Prioritized task queues, route execution & vehicle dispatch
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </button>

          {/* 3. Sanitization Staff */}
          <button
            onClick={() => handleSelectRole('sanitization')}
            className="w-full p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors block">
                  Sanitization & Bio-Clean Staff
                </span>
                <span className="text-xs text-slate-400 block -mt-0.5">
                  Odour/gas warnings, mist triggers & decontamination logs
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </button>

        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center text-[11px] font-mono text-slate-400">
          Demo Mode: No backend credentials required for evaluation.
        </div>

      </div>
    </div>
  );
};
