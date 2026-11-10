import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from './StatCard';
import { ConcurrencyBanner } from './ConcurrencyBanner';
import { ServiceSchedule } from './ServiceSchedule';
import { VisualServiceBays } from './VisualServiceBays';
import { RecentActivity } from './RecentActivity';
import { TIME_SLOTS } from '../../utils/facilityCatalog';
import {
  CalendarCheck2,
  Clock,
  Warehouse,
  CarFront,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { bookings, serviceBays, selectedDate, conflictsPrevented, mutexGlobalState, activeLocks } = useApp();

  // Dynamic statistics
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
      {/* OS Concurrency Callout Banner */}
      <ConcurrencyBanner />

      {/* 2. Dynamic Statistics Cards (Exact 6 Cards) */}
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

      {/* Main Grid: Service Schedule & Service Bays */}
      <div className="space-y-6">
        <ServiceSchedule />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VisualServiceBays />
          </div>
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};
