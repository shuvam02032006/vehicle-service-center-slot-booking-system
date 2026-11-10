import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from './StatCard';
import {
  CalendarPlus,
  CalendarCheck2,
  CarFront,
  Clock,
  Warehouse,
  XCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    currentUser,
    bookings,
    vehicles,
    setIsBookingModalOpen,
    cancelBooking,
    setActiveTab
  } = useApp();

  // Filter ONLY this customer's bookings and vehicles
  const myBookings = bookings.filter(
    b => b.customerUsername?.toLowerCase() === currentUser?.username.toLowerCase() ||
         b.customerId === currentUser?.id
  );

  const activeBookings = myBookings.filter(b => b.status !== 'cancelled' && b.status !== 'completed');
  const completedBookings = myBookings.filter(b => b.status === 'completed');
  const myVehicles = vehicles.filter(
    v => v.customerUsername?.toLowerCase() === currentUser?.username.toLowerCase() ||
         v.customerId === currentUser?.id
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0b132b] via-[#101f42] to-[#1c2d5a] rounded-2xl p-6 text-white shadow-lg border border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
            Customer Portal
          </span>
          <h2 className="text-xl font-bold mt-1 text-white">
            Customer Service &amp; Booking Portal
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Book synchronized service slots, track maintenance status, and view past history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all shrink-0"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Book Service Slot</span>
          </button>
        </div>
      </div>

      {/* Customer Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Bookings"
          value={activeBookings.length}
          subtitle={activeBookings.length === 0 ? "No active appointments" : "Upcoming service visits"}
          icon={<CalendarCheck2 className="w-5 h-5" />}
          accentColor="blue"
        />

        <StatCard
          title="My Vehicles"
          value={myVehicles.length}
          subtitle={myVehicles.length === 0 ? "No vehicles registered" : "Vehicles on record"}
          icon={<CarFront className="w-5 h-5" />}
          accentColor="indigo"
        />

        <StatCard
          title="Completed Services"
          value={completedBookings.length}
          subtitle="Past maintenance history"
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="emerald"
        />
      </div>

      {/* Active Appointments Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            My Active Service Appointments
          </h3>
          <button
            onClick={() => setActiveTab('my-bookings')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            View All &rarr;
          </button>
        </div>

        {activeBookings.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CalendarCheck2 className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
            <h4 className="text-sm font-bold text-slate-800">No Active Bookings</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You do not have any upcoming service bookings. Click below to reserve a service slot.
            </p>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-2"
            >
              <CalendarPlus className="w-4 h-4" />
              Book a Service Slot
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activeBookings.map((b) => (
              <div key={b.id} className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{b.vehiclePlate}</span>
                    <span className="text-xs text-slate-500">({b.vehicleModel})</span>
                    <span className="text-[10px] font-mono text-slate-400">{b.bookingRef}</span>
                  </div>

                  <div className="text-xs font-semibold text-blue-700">
                    {b.serviceName}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {b.date} @ {b.timeSlot}
                    </span>
                    <span className="flex items-center gap-1">
                      <Warehouse className="w-3.5 h-3.5 text-blue-600" />
                      Bay #{b.bayNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                    {b.status}
                  </span>

                  {b.status === 'scheduled' && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to cancel booking ${b.bookingRef}?`)) {
                          cancelBooking(b.id);
                        }
                      }}
                      className="px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
