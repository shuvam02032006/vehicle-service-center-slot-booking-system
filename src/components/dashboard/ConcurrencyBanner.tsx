import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  ShieldCheck,
  ShieldAlert,
  Zap,
  ArrowRight,
  GitBranch,
  Lock,
  Unlock
} from 'lucide-react';

export const ConcurrencyBanner: React.FC = () => {
  const {
    mutexGlobalState,
    activeLocks,
    conflictsPrevented,
    setActiveTab,
    simulateConcurrentBookings,
    serviceBays,
    selectedDate,
    isSimulatingConcurrency
  } = useApp();

  const handleQuickRaceDemo = async () => {
    const targetBay = serviceBays[0];
    await simulateConcurrentBookings({
      bayId: targetBay.id,
      bayNumber: targetBay.bayNumber,
      date: selectedDate,
      timeSlot: '10:00 AM',
      threadCount: 3,
      mutexEnabled: true
    });
  };

  return (
    <div className="bg-gradient-to-r from-[#0b132b] via-[#101f42] to-[#1c2d5a] rounded-2xl p-5 sm:p-6 text-white shadow-md border border-blue-900/50 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Information */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              OS Concurrency &amp; Synchronization
            </span>
            <span className="text-xs text-blue-300/80">Mutual Exclusion Protocol</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Critical Section Protected via Mutex Synchronization
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            Eliminates race conditions when multiple customer requests attempt to reserve the same service bay and time slot simultaneously. Only one thread acquires the lock, while concurrent attempts are cleanly handled.
          </p>

          {/* Key OS Metrics Inline */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400">Mutex State:</span>
              <span className={`font-bold flex items-center gap-1 ${
                mutexGlobalState === 'LOCKED' ? 'text-red-400' :
                mutexGlobalState === 'CRITICAL_SECTION' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {mutexGlobalState === 'LOCKED' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                {mutexGlobalState}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400">Locked Resources:</span>
              <span className="font-bold text-amber-300">{activeLocks.length}</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400">Conflicts Prevented:</span>
              <span className="font-bold text-emerald-400">{conflictsPrevented}</span>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={handleQuickRaceDemo}
            disabled={isSimulatingConcurrency}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>{isSimulatingConcurrency ? 'Simulating Threads...' : 'Simulate 3-Thread Race'}</span>
          </button>

          <button
            onClick={() => setActiveTab('concurrency-monitor')}
            className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white text-xs font-semibold border border-slate-600/60 flex items-center justify-center gap-2 transition-all"
          >
            <span>Open Mutex Monitor</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
