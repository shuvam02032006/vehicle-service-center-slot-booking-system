import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck2,
  Clock,
  Warehouse,
  CarFront,
  CalendarPlus,
  XCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const MyBookingsView: React.FC = () => {
  const { currentUser, bookings, cancelBooking, setIsBookingModalOpen } = useApp();

  const myBookings = bookings.filter(
    b => b.customerUsername?.toLowerCase() === currentUser?.username.toLowerCase() ||
         b.customerId === currentUser?.id
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck2 className="w-5 h-5 text-blue-600" />
              My Service Bookings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Personal service history, active bay reservations, and scheduling status
            </p>
          </div>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Book New Service</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {myBookings.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CalendarCheck2 className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
            <h4 className="text-sm font-bold text-slate-800">No Bookings Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't reserved any service slots yet. Reserve an appointment with our technicians today.
            </p>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-2"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Reserve a Service Slot</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myBookings.map((b) => (
              <div key={b.id} className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <CarFront className="w-4 h-4 text-blue-600" />
                      {b.vehiclePlate}
                    </span>
                    <span className="text-xs text-slate-500">({b.vehicleModel})</span>
                    <span className="text-[10px] font-mono text-slate-400">Ref: {b.bookingRef}</span>
                  </div>

                  <div className="text-xs font-semibold text-blue-700">
                    {b.serviceName} (${b.servicePrice})
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
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    b.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : b.status === 'cancelled'
                      ? 'bg-slate-100 text-slate-500 line-through'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {b.status}
                  </span>

                  {b.status === 'scheduled' && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Cancel booking ${b.bookingRef}?`)) {
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
