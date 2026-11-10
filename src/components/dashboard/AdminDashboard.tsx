import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from './StatCard';
import { ServiceSchedule } from './ServiceSchedule';
import { VisualServiceBays } from './VisualServiceBays';
import { RecentActivity } from './RecentActivity';
import { SlotAvailabilityView } from '../slots/SlotAvailabilityView';
import { TIME_SLOTS } from '../../utils/facilityCatalog';
import {
  CalendarCheck2,
  Clock,
  Warehouse,
  CarFront,
  Cpu,
  Lock,
  Unlock,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  BarChart3,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
  CheckCircle,
  XCircle,
  Shield
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    bookings,
    serviceBays,
    selectedDate,
    mutexGlobalState,
    activeLocks,
    conflictsPrevented,
    simulateConcurrentBookings,
    isSimulatingConcurrency,
    serviceCatalog,
    setIsBookingModalOpen
  } = useApp();

  // Active dashboard view section tab
  const [activeSection, setActiveSection] = useState<
    'all' | 'bookings' | 'bays' | 'slots' | 'concurrency' | 'analytics'
  >('all');

  // 1. DYNAMIC VALUES FOR THE 6 OVERVIEW CARDS (Section 2)
  const totalBookingsCount = useMemo(() => {
    return bookings.filter(b => b.status !== 'cancelled').length;
  }, [bookings]);

  const activeServicesCount = useMemo(() => {
    return bookings.filter(b =>
      b.status === 'in-bay' || b.status === 'in-progress' || b.status === 'quality-check'
    ).length;
  }, [bookings]);

  const availableSlotsCount = useMemo(() => {
    const totalPossibleSlotsForDay = serviceBays.length * TIME_SLOTS.length;
    const reservedSlotsOnDate = bookings.filter(
      b => b.date === selectedDate && b.status !== 'cancelled'
    ).length;
    return Math.max(0, totalPossibleSlotsForDay - reservedSlotsOnDate);
  }, [serviceBays.length, bookings, selectedDate]);

  const activeBaysCount = useMemo(() => {
    return serviceBays.filter(bay => bay.status === 'occupied').length;
  }, [serviceBays]);

  // Section 6: Resource Currently Being Reserved
  const currentResourceUnderReservation = useMemo(() => {
    if (activeLocks.length === 0) return 'None (Idle)';
    return activeLocks.map(l => `Bay #${l.bayNumber} • ${l.timeSlot} (${l.date})`).join(', ');
  }, [activeLocks]);

  // Analytics: Bay utilization
  const bayUtilizationData = useMemo(() => {
    return serviceBays.map(bay => {
      const count = bookings.filter(b => b.bayId === bay.id && b.status !== 'cancelled').length;
      const pct = Math.min(100, Math.round((count / (TIME_SLOTS.length || 1)) * 100));
      return { bayNumber: bay.bayNumber, name: bay.name, count, pct };
    });
  }, [bookings, serviceBays]);

  // Analytics: Status Breakdown
  const statusStats = useMemo(() => {
    const scheduled = bookings.filter(b => b.status === 'scheduled').length;
    const inService = bookings.filter(b => b.status === 'in-progress' || b.status === 'in-bay').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    return { scheduled, inService, completed, cancelled };
  }, [bookings]);

  // Quick race condition test handler
  const handleQuickRaceSimulation = async () => {
    const bay = serviceBays[0];
    if (!bay) return;
    await simulateConcurrentBookings({
      bayId: bay.id,
      bayNumber: bay.bayNumber,
      date: selectedDate,
      timeSlot: '10:00 AM',
      threadCount: 3,
      mutexEnabled: true
    });
  };

  return (
    <div className="space-y-6">
      {/* 2. DASHBOARD OVERVIEW (EXACTLY 6 CARDS SPECIFIED IN PROMPT) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            System Overview &amp; Telemetry
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Date: {selectedDate}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* Card 1: Total Bookings */}
          <StatCard
            title="Total Bookings"
            value={totalBookingsCount}
            subtitle={totalBookingsCount === 0 ? "No bookings available" : `${totalBookingsCount} confirmed`}
            icon={<CalendarCheck2 className="w-5 h-5" />}
            accentColor="blue"
          />

          {/* Card 2: Available Time Slots */}
          <StatCard
            title="Available Time Slots"
            value={availableSlotsCount}
            subtitle={`Capacity for ${selectedDate}`}
            icon={<Clock className="w-5 h-5" />}
            accentColor="emerald"
          />

          {/* Card 3: Service Bays */}
          <StatCard
            title="Service Bays"
            value={`${activeBaysCount} / ${serviceBays.length}`}
            subtitle={serviceBays.length === 0 ? "No service bays configured" : `${serviceBays.length - activeBaysCount} bay(s) vacant`}
            icon={<Warehouse className="w-5 h-5" />}
            accentColor="indigo"
          />

          {/* Card 4: Active Services */}
          <StatCard
            title="Active Services"
            value={activeServicesCount}
            subtitle={activeServicesCount === 0 ? "No active services" : "Technician operations"}
            icon={<CarFront className="w-5 h-5" />}
            accentColor="purple"
          />

          {/* Card 5: Booking Conflicts Prevented */}
          <StatCard
            title="Booking Conflicts Prevented"
            value={conflictsPrevented}
            subtitle={conflictsPrevented === 0 ? "No booking conflicts recorded" : "Mutual exclusion enforced"}
            icon={<ShieldCheck className="w-5 h-5" />}
            accentColor="amber"
          />

          {/* Card 6: Mutex Status */}
          <StatCard
            title="Mutex Status"
            value={mutexGlobalState === 'IDLE' ? 'UNLOCKED' : mutexGlobalState}
            subtitle={activeLocks.length > 0 ? `${activeLocks.length} locked resource(s)` : "Shared memory free"}
            icon={<Cpu className="w-5 h-5" />}
            accentColor={mutexGlobalState === 'LOCKED' ? 'rose' : mutexGlobalState === 'CRITICAL_SECTION' ? 'amber' : 'emerald'}
          />
        </div>
      </section>

      {/* 6. CRITICAL SECTION AND MUTEX MONITORING (DEDICATED SECTION) */}
      <section className="bg-[#0b132b] text-white rounded-2xl p-5 sm:p-6 border border-[#1c2d5a] shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                OS Synchronization Engine
              </span>
              <span className="text-xs text-slate-400">Critical Section &amp; Mutual Exclusion</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Concurrency &amp; Mutex Monitoring</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                mutexGlobalState === 'LOCKED'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                  : mutexGlobalState === 'CRITICAL_SECTION'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {mutexGlobalState === 'IDLE' ? 'UNLOCKED' : mutexGlobalState}
              </span>
            </h2>

            {/* Atomic Protocol Pipeline */}
            <div className="bg-[#080d1f] p-3 rounded-xl border border-[#1c2d5a]/80 text-xs font-mono text-slate-300 overflow-x-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                Atomic Reservation Invariant:
              </span>
              <span className="text-blue-300">
                Booking Request &rarr; <strong className="text-amber-400">Acquire Lock</strong> &rarr; <strong className="text-emerald-400">Check Availability</strong> &rarr; <strong className="text-purple-400">Reserve Slot</strong> &rarr; <strong className="text-blue-400">Release Lock</strong> &rarr; Return Result
              </span>
            </div>
          </div>

          {/* Quick Simulation Trigger */}
          <div className="shrink-0 flex flex-col gap-2">
            <button
              onClick={handleQuickRaceSimulation}
              disabled={isSimulatingConcurrency}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSimulatingConcurrency ? 'Simulating Concurrent Threads...' : 'Simulate 3 Concurrent Threads on Same Slot'}</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center max-w-xs">
              Launches simultaneous threads targeting Bay #1 at 10:00 AM to verify mutual exclusion.
            </p>
          </div>
        </div>

        {/* The 6 Explicit Concurrency Monitoring Metrics (Prompt Section 6) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-[#1c2d5a]">
          {/* 1. Mutex / Locking Status */}
          <div className="bg-[#080d1f] p-3 rounded-xl border border-[#1c2d5a]/60 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-blue-400" />
              Mutex Status
            </div>
            <div className={`text-xs sm:text-sm font-mono font-bold mt-1 ${
              mutexGlobalState === 'LOCKED' ? 'text-red-400' :
              mutexGlobalState === 'CRITICAL_SECTION' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {mutexGlobalState === 'IDLE' ? 'UNLOCKED' : mutexGlobalState}
            </div>
          </div>

          {/* 2. Active Booking Requests */}
          <div className="bg-[#080d1f] p-3 rounded-xl border border-[#1c2d5a]/60 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
              <Activity className="w-3 h-3 text-amber-400" />
              Active Requests
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-amber-300 mt-1">
              {activeLocks.length} active
            </div>
          </div>

          {/* 3. Resource Currently Being Reserved */}
          <div className="bg-[#080d1f] p-3 rounded-xl border border-[#1c2d5a]/60 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
              <Layers className="w-3 h-3 text-purple-400" />
              Resource Reserved
            </div>
            <div className="text-[11px] font-mono font-bold text-purple-300 mt-1 truncate" title={currentResourceUnderReservation}>
              {currentResourceUnderReservation}
            </div>
          </div>

          {/* 4. Booking Conflicts Detected */}
          <div className="bg-[#080d1f] p-3 rounded-xl border border-[#1c2d5a]/60 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              Conflicts Detected
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-rose-400 mt-1">
              {conflictsPrevented} detected
            </div>
          </div>

          {/* 5. Successful Reservations */}
          <div className="bg-[#080d1f] p-3 rounded-xl border border-[#1c2d5a]/60 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              Successful
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-emerald-400 mt-1">
              {totalBookingsCount} confirmed
            </div>
          </div>

          {/* 6. Rejected Conflicting Requests */}
          <div className="bg-[#080d1f] p-3 rounded-xl border border-[#1c2d5a]/60 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
              <XCircle className="w-3 h-3 text-amber-400" />
              Rejected Conflicts
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-amber-400 mt-1">
              {conflictsPrevented} rejected
            </div>
          </div>
        </div>

        {/* Active Resource Locks list (if any resource is currently locked) */}
        {activeLocks.length > 0 && (
          <div className="pt-3 border-t border-[#1c2d5a]/60">
            <div className="text-xs font-bold text-amber-300 flex items-center gap-2 mb-2">
              <Lock className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>Active Mutex Locks on Shared Memory Resources:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {activeLocks.map(lock => (
                <div key={lock.resourceKey} className="bg-[#080d1f] p-2.5 rounded-lg border border-amber-500/30 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-200">Bay #{lock.bayNumber} &bull; {lock.timeSlot}</span>
                  <span className="text-amber-400 font-bold">{lock.lockedByThreadId}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* DASHBOARD SECTION TABS NAVIGATION */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSection === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Sections
          </button>
          <button
            onClick={() => setActiveSection('bookings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSection === 'bookings'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Booking Management
          </button>
          <button
            onClick={() => setActiveSection('bays')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSection === 'bays'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Service Bays
          </button>
          <button
            onClick={() => setActiveSection('slots')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSection === 'slots'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Time-Slot Booking
          </button>
          <button
            onClick={() => setActiveSection('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSection === 'analytics'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Analytics &amp; Trends
          </button>
        </div>

        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>New Booking</span>
        </button>
      </div>

      {/* 3. BOOKING MANAGEMENT (ServiceSchedule Table with all 7 fields) */}
      {(activeSection === 'all' || activeSection === 'bookings') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CalendarCheck2 className="w-4 h-4 text-blue-600" />
              Booking Management
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {totalBookingsCount} Record(s) in Database
            </span>
          </div>
          <ServiceSchedule />
        </section>
      )}

      {/* 4. SERVICE BAY MANAGEMENT */}
      {(activeSection === 'all' || activeSection === 'bays') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-blue-600" />
              Service Bay Management &amp; Allocation
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {serviceBays.length} Configured Hardware Bays
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VisualServiceBays />
            </div>
            {/* Recent Activity Log (Dynamic system events) */}
            <div className="lg:col-span-1">
              <RecentActivity />
            </div>
          </div>
        </section>
      )}

      {/* 5. TIME-SLOT BOOKING INTERFACE */}
      {(activeSection === 'all' || activeSection === 'slots') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Time-Slot Booking Interface &amp; Availability
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Date: {selectedDate}
            </span>
          </div>
          <SlotAvailabilityView />
        </section>
      )}

      {/* ANALYTICS & VISUALIZATIONS */}
      {(activeSection === 'all' || activeSection === 'analytics') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Dynamic System Analytics &amp; Bay Utilization
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Derived from live bookings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Bay Utilization Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Service Bay Utilization
                </span>
                <Warehouse className="w-4 h-4 text-blue-600" />
              </div>
              <div className="space-y-2.5">
                {bayUtilizationData.map(bay => (
                  <div key={bay.bayNumber} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Bay #{bay.bayNumber} ({bay.name})</span>
                      <span className="font-mono">{bay.count} jobs ({bay.pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(4, bay.pct)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Status Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Booking Status Distribution
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>

              {bookings.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No bookings available
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50 text-blue-800">
                    <span className="font-semibold">Scheduled</span>
                    <span className="font-mono font-bold">{statusStats.scheduled}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50 text-amber-800">
                    <span className="font-semibold">In Progress</span>
                    <span className="font-mono font-bold">{statusStats.inService}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 text-emerald-800">
                    <span className="font-semibold">Completed</span>
                    <span className="font-mono font-bold">{statusStats.completed}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 text-slate-600">
                    <span className="font-semibold">Cancelled</span>
                    <span className="font-mono font-bold">{statusStats.cancelled}</span>
                  </div>
                </div>
              )}
            </div>

            {/* OS Mutex Concurrency Metrics */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  OS Synchronization Invariants
                </span>
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <span>Race Conditions Blocked</span>
                  <span className="font-mono font-bold text-emerald-600">{conflictsPrevented}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <span>Current Locked Resources</span>
                  <span className="font-mono font-bold text-slate-800">{activeLocks.length}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <span>Mutual Exclusion Policy</span>
                  <span className="font-bold text-blue-600">Strict FIFO Mutex</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
