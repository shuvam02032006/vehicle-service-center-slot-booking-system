import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TIME_SLOTS } from '../../utils/facilityCatalog';
import {
  Cpu,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Terminal,
  Layers,
  ArrowRight,
  Flame,
  Zap,
  Activity
} from 'lucide-react';

export const ConcurrencyMonitorView: React.FC = () => {
  const {
    mutexGlobalState,
    activeLocks,
    conflictsPrevented,
    concurrencyLogs,
    simulateConcurrentBookings,
    serviceBays,
    selectedDate,
    isSimulatingConcurrency,
    bookings
  } = useApp();

  // Simulator controls
  const [selectedBayId, setSelectedBayId] = useState<string>(serviceBays[0]?.id || '');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM');
  const [threadCount, setThreadCount] = useState<number>(3);
  const [mutexEnabled, setMutexEnabled] = useState<boolean>(true);
  const [activeTabSub, setActiveTabSub] = useState<'monitor' | 'lab'>('lab');

  // Calculate double bookings created (if mutex was disabled)
  const doubleBookingsCount = React.useMemo(() => {
    const slotMap = new Map<string, number>();
    for (const b of bookings) {
      if (b.status === 'cancelled') continue;
      const key = `${b.bayId}:${b.date}:${b.timeSlot}`;
      slotMap.set(key, (slotMap.get(key) || 0) + 1);
    }
    let collisions = 0;
    for (const count of slotMap.values()) {
      if (count > 1) {
        collisions += (count - 1);
      }
    }
    return collisions;
  }, [bookings]);

  const handleRunSimulation = async () => {
    const bay = serviceBays.find(b => b.id === selectedBayId) || serviceBays[0];
    await simulateConcurrentBookings({
      bayId: bay.id,
      bayNumber: bay.bayNumber,
      date: selectedDate,
      timeSlot: selectedSlot,
      threadCount,
      mutexEnabled
    });
  };

  const selectedBayObj = serviceBays.find(b => b.id === selectedBayId) || serviceBays[0];

  return (
    <div className="space-y-6">
      {/* Top Banner explaining OS Synchronization Concept */}
      <div className="bg-[#0b132b] text-white rounded-2xl p-6 border border-[#1c2d5a] shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                OS Synchronization Engine
              </span>
              <span className="text-xs text-slate-400">Process &amp; Thread Concurrency</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Mutual Exclusion (Mutex) &amp; Critical Section Monitor
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              When multiple client threads simultaneously attempt to reserve the same service bay and time slot, the booking operation becomes a <strong>Critical Section</strong>. Without mutual exclusion, an interleaved race condition causes double-booking. Our system enforces the OS invariant:
              <br />
              <span className="font-mono text-blue-300 text-xs mt-1 block">
                Booking Request &rarr; Acquire Mutex &rarr; Atomic Check &amp; Reserve &rarr; Release Mutex
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTabSub('lab')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTabSub === 'lab'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Race Condition Simulator
            </button>
            <button
              onClick={() => setActiveTabSub('monitor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTabSub === 'monitor'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Live Telemetry &amp; Logs
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic OS Telemetry Stat Cards (Exact 6 Metrics from Section 6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* 1. Mutex Status */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mutex Status</span>
            <div className={`p-1.5 rounded-lg ${
              mutexGlobalState === 'LOCKED' ? 'bg-red-50 text-red-600' :
              mutexGlobalState === 'CRITICAL_SECTION' ? 'bg-amber-50 text-amber-600' :
              'bg-emerald-50 text-emerald-600'
            }`}>
              {mutexGlobalState === 'LOCKED' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-2 font-mono">
            <span className={`text-base font-extrabold ${
              mutexGlobalState === 'LOCKED' ? 'text-red-600' :
              mutexGlobalState === 'CRITICAL_SECTION' ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {mutexGlobalState === 'IDLE' ? 'UNLOCKED' : mutexGlobalState}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {mutexGlobalState === 'IDLE' ? 'No lock contention' : 'Thread in critical section'}
          </p>
        </div>

        {/* 2. Active Booking Requests */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Requests</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 font-mono">
            <span className="text-xl font-extrabold text-slate-900">{activeLocks.length}</span>
            <span className="text-xs text-slate-500 ml-1">active</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {activeLocks.length > 0 ? 'Contention in queue' : 'Zero waiting threads'}
          </p>
        </div>

        {/* 3. Resource Currently Being Reserved */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resource Reserved</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 font-mono">
            <span className="text-xs font-bold text-purple-700 truncate block">
              {activeLocks.length > 0 ? `Bay #${activeLocks[0].bayNumber} • ${activeLocks[0].timeSlot}` : 'None (Idle)'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 truncate">
            {activeLocks.length > 0 ? activeLocks[0].resourceKey : 'Shared memory vacant'}
          </p>
        </div>

        {/* 4. Booking Conflicts Detected */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Conflicts Detected</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 font-mono">
            <span className="text-xl font-extrabold text-rose-600">{conflictsPrevented}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {conflictsPrevented === 0 ? 'No conflicts recorded' : 'Collisions intercepted'}
          </p>
        </div>

        {/* 5. Successful Reservations */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Successful Bookings</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 font-mono">
            <span className="text-xl font-extrabold text-emerald-600">
              {bookings.filter(b => b.status !== 'cancelled').length}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Committed atomically
          </p>
        </div>

        {/* 6. Rejected Conflicting Requests */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rejected Requests</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 font-mono">
            <span className="text-xl font-extrabold text-amber-600">{conflictsPrevented}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Mutual exclusion blocked
          </p>
        </div>
      </div>

      {/* Simulator Lab Section */}
      {activeTabSub === 'lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                Race Condition Simulation Harness
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure simultaneous client threads targeting the identical resource.
              </p>
            </div>

            {/* Target Bay */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Service Bay</label>
              <select
                value={selectedBayId}
                onChange={(e) => setSelectedBayId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold outline-hidden"
              >
                {serviceBays.map((bay) => (
                  <option key={bay.id} value={bay.id}>
                    Bay #{bay.bayNumber} - {bay.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Slot */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Time Slot</label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {/* Thread Count */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Concurrent Threads:</span>
                <span className="font-mono text-blue-600 text-sm font-extrabold">{threadCount} Threads</span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={threadCount}
                onChange={(e) => setThreadCount(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>2 Threads</span>
                <span>5 Threads</span>
                <span>8 Threads</span>
              </div>
            </div>

            {/* Toggle Mutex Mode */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Mutual Exclusion (Mutex)</span>
                <button
                  type="button"
                  onClick={() => setMutexEnabled(!mutexEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    mutexEnabled ? 'bg-blue-600' : 'bg-red-500'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      mutexEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <p className={`text-[11px] leading-snug ${mutexEnabled ? 'text-blue-800' : 'text-red-700 font-semibold'}`}>
                {mutexEnabled
                  ? 'PROTECTED: Threads acquire mutex lock before critical section. Only 1 succeeds, others receive conflict notification.'
                  : 'UNPROTECTED (VULNERABILITY DEMO): Mutual exclusion disabled. Race condition will cause double-booking!'}
              </p>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunSimulation}
              disabled={isSimulatingConcurrency}
              className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
                mutexEnabled
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
              }`}
            >
              {isSimulatingConcurrency ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Threads Competing in Critical Section...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Launch {threadCount} Concurrent Threads</span>
                </>
              )}
            </button>
          </div>

          {/* Visualization Diagram */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  Critical Section Execution Pipeline
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  Target: bay:{selectedBayObj.bayNumber}:{selectedDate}:{selectedSlot}
                </span>
              </div>

              {/* Animated Pipeline Stage Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs mb-6">
                {/* Stage 1: Request Queue */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-1">
                  <div className="text-[10px] font-mono uppercase font-bold text-slate-400">Stage 1</div>
                  <div className="font-bold text-slate-900">Request Pool</div>
                  <p className="text-[11px] text-slate-500">Concurrent client thread arrival</p>
                </div>

                {/* Stage 2: Mutex Lock */}
                <div className={`p-3.5 rounded-xl border text-center space-y-1 transition-all ${
                  mutexGlobalState === 'ACQUIRING' || mutexGlobalState === 'LOCKED'
                    ? 'border-amber-400 bg-amber-50 text-amber-900 font-bold animate-pulse'
                    : 'border-slate-200 bg-slate-50 text-slate-900'
                }`}>
                  <div className="text-[10px] font-mono uppercase font-bold text-slate-400">Stage 2</div>
                  <div className="font-bold flex items-center justify-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Mutex Lock</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Exclusive lock acquisition</p>
                </div>

                {/* Stage 3: Critical Section */}
                <div className={`p-3.5 rounded-xl border text-center space-y-1 transition-all ${
                  mutexGlobalState === 'CRITICAL_SECTION'
                    ? 'border-red-400 bg-red-50 text-red-900 font-bold animate-pulse'
                    : 'border-slate-200 bg-slate-50 text-slate-900'
                }`}>
                  <div className="text-[10px] font-mono uppercase font-bold text-slate-400">Stage 3</div>
                  <div className="font-bold flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Critical Section</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Atomic availability check</p>
                </div>

                {/* Stage 4: Commit & Release */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-1">
                  <div className="text-[10px] font-mono uppercase font-bold text-slate-400">Stage 4</div>
                  <div className="font-bold text-slate-900 flex items-center justify-center gap-1">
                    <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Commit &amp; Unlock</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Slot confirmed &amp; lock freed</p>
                </div>
              </div>

              {/* State Explanation Box */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>OS Synchronization Invariant</span>
                </div>
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  Mutual Exclusion (P1): Only one thread may execute inside the critical section at any moment.
                  <br />
                  Progress (P2): If no thread is in the critical section, pending threads are not indefinitely delayed.
                  <br />
                  Bounded Waiting (P3): Every requesting thread receives either a granted slot or a defined conflict rejection without starvation.
                </div>
              </div>
            </div>

            {/* Currently Locked Resources Table */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                Active Locked Resources ({activeLocks.length})
              </h4>
              {activeLocks.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">
                  No locks currently active. System is in IDLE synchronization state.
                </p>
              ) : (
                <div className="space-y-1.5 font-mono text-xs">
                  {activeLocks.map((lock, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
                      <span className="font-bold">{lock.resourceKey}</span>
                      <span className="text-[11px] text-amber-800">Thread: {lock.lockedByThreadId}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live Telemetry Terminal Logs Section */}
      <div className="bg-slate-950 text-slate-200 rounded-xl p-5 border border-slate-800 shadow-xl font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-100">OS Concurrency Execution Stream</span>
            <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {concurrencyLogs.length} events logged
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Real-time thread trace</span>
        </div>

        <div className="max-h-72 overflow-y-auto space-y-1.5 pr-2">
          {concurrencyLogs.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              No concurrency events recorded yet. Run the Race Condition Simulator above or book a slot to observe Mutex logs.
            </div>
          ) : (
            concurrencyLogs.map((log) => {
              const levelColor = {
                info: 'text-slate-300',
                success: 'text-emerald-400',
                warning: 'text-amber-400 font-semibold',
                error: 'text-red-400 font-bold bg-red-950/40 p-1 rounded'
              }[log.level];

              return (
                <div key={log.id} className="flex items-start gap-3 py-1 border-b border-slate-900/60 hover:bg-slate-900/40 px-1 rounded transition-colors">
                  <span className="text-slate-500 shrink-0 text-[11px]">{log.timestamp}</span>
                  <span className="text-blue-400 font-bold shrink-0 text-[11px]">{log.threadId}</span>
                  <span className="text-slate-500 shrink-0 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800">
                    {log.event}
                  </span>
                  <span className={`flex-1 break-all text-[11px] ${levelColor}`}>
                    {log.details}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
