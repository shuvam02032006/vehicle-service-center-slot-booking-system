import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from './StatCard';
import { ServiceSchedule } from './ServiceSchedule';
import { SlotAvailabilityView } from '../slots/SlotAvailabilityView';
import {
  CalendarPlus,
  Users,
  CarFront,
  Clock,
  CalendarCheck2
} from 'lucide-react';

export const ServiceAdvisorDashboard: React.FC = () => {
  const { customers, vehicles, bookings, enabledSlots, setIsBookingModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'schedule' | 'slots'>('schedule');

  const activeBookings = bookings.filter(b => b.status !== 'cancelled').length;

  return (
    <div className="space-y-6">
      {/* Advisor Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Bookings"
          value={activeBookings}
          subtitle={activeBookings === 0 ? "No active bookings" : `${activeBookings} active booking(s)`}
          icon={<CalendarPlus className="w-5 h-5" />}
          accentColor="blue"
        />

        <StatCard
          title="Registered Clients"
          value={customers.length}
          subtitle={customers.length === 0 ? "No clients registered" : `${customers.length} client record(s)`}
          icon={<Users className="w-5 h-5" />}
          accentColor="indigo"
        />

        <StatCard
          title="Registered Vehicles"
          value={vehicles.length}
          subtitle={vehicles.length === 0 ? "No vehicles registered" : `${vehicles.length} fleet vehicle(s)`}
          icon={<CarFront className="w-5 h-5" />}
          accentColor="purple"
        />

        <StatCard
          title="Daily Slot Capacity"
          value={enabledSlots.length}
          subtitle="Available operating windows"
          icon={<Clock className="w-5 h-5" />}
          accentColor="emerald"
        />
      </div>

      {/* Action Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div>
          <h3 className="font-bold text-base">Advisor Intake &amp; Slot Reservation</h3>
          <p className="text-xs text-blue-200 mt-0.5">
            Book incoming customer vehicles securely using the OS Mutex pipeline.
          </p>
        </div>
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0 flex items-center gap-2"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>+ Book Customer Slot</span>
        </button>
      </div>

      {/* Switch between Schedule and Slot Matrix */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'schedule'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Customer Service Schedule
        </button>
        <button
          onClick={() => setActiveTab('slots')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'slots'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Slot Availability Matrix
        </button>
      </div>

      {/* Content */}
      {activeTab === 'schedule' ? (
        <ServiceSchedule />
      ) : (
        <SlotAvailabilityView />
      )}
    </div>
  );
};
