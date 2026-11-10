import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from './StatCard';
import { ServiceSchedule } from './ServiceSchedule';
import { VisualServiceBays } from './VisualServiceBays';
import { RecentActivity } from './RecentActivity';
import { TIME_SLOTS } from '../../utils/facilityCatalog';
import {
  Warehouse,
  CalendarCheck2,
  Clock,
  CarFront,
  Cpu,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const ServiceManagerDashboard: React.FC = () => {
  const { serviceBays, bookings, conflictsPrevented, selectedDate, mutexGlobalState, activeLocks } = useApp();

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

  return (
    <div className="space-y-6">
      {/* Service Manager Mutex Banner */}
      <div className="bg-[#0b132b] text-white rounded-2xl p-5 border border-[#1c2d5a] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Operations Control
            </span>
            <span className="text-xs text-slate-400 font-mono">Date: {selectedDate}</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Service Manager Operations &amp; Allocation Hub
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time management of active bays, technicians, service flow, and mutual exclusion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-[#080d1f] border border-[#1c2d5a] text-center">
            <div className="text-[10px] font-bold uppercase text-slate-400">Blocked Races</div>
            <div className="text-sm font-bold font-mono text-emerald-400">{conflictsPrevented}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#080d1f] border border-[#1c2d5a] text-center">
            <div className="text-[10px] font-bold uppercase text-slate-400">Mutex State</div>
            <div className="text-xs font-bold font-mono text-blue-300">{mutexGlobalState}</div>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Overview Cards (Exact 6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Bookings"
          value={totalBookingsCount}
          subtitle={totalBookingsCount === 0 ? "No bookings available" : `${totalBookingsCount} confirmed`}
          icon={<CalendarCheck2 className="w-5 h-5" />}
          accentColor="blue"
        />

        <StatCard
          title="Available Time Slots"
          value={availableSlotsCount}
          subtitle={`Capacity on ${selectedDate}`}
          icon={<Clock className="w-5 h-5" />}
          accentColor="emerald"
        />

        <StatCard
          title="Service Bays"
          value={`${activeBaysCount} / ${serviceBays.length}`}
          subtitle={serviceBays.length === 0 ? "No bays configured" : `${serviceBays.length - activeBaysCount} bay(s) available`}
          icon={<Warehouse className="w-5 h-5" />}
          accentColor="indigo"
        />

        <StatCard
          title="Active Services"
          value={activeServicesCount}
          subtitle={activeServicesCount === 0 ? "No active services" : "Technician operations"}
          icon={<CarFront className="w-5 h-5" />}
          accentColor="purple"
        />

        <StatCard
          title="Booking Conflicts Prevented"
          value={conflictsPrevented}
          subtitle={conflictsPrevented === 0 ? "No booking conflicts recorded" : "Mutual exclusion enforced"}
          icon={<ShieldCheck className="w-5 h-5" />}
          accentColor="amber"
        />

        <StatCard
          title="Mutex Status"
          value={mutexGlobalState === 'IDLE' ? 'UNLOCKED' : mutexGlobalState}
          subtitle={activeLocks.length > 0 ? `${activeLocks.length} locked resource(s)` : "Shared memory free"}
          icon={<Cpu className="w-5 h-5" />}
          accentColor={mutexGlobalState === 'LOCKED' ? 'rose' : mutexGlobalState === 'CRITICAL_SECTION' ? 'amber' : 'emerald'}
        />
      </div>

      {/* 3. Service Schedule Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <CalendarCheck2 className="w-4 h-4 text-blue-600" />
          Service Schedules &amp; Assigned Bays
        </h3>
        <ServiceSchedule />
      </div>

      {/* 4. Grid: Bays & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VisualServiceBays />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};
