import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck2,
  Clock,
  CarFront,
  Warehouse,
  CheckCircle2
} from 'lucide-react';

export const ServiceHistoryView: React.FC = () => {
  const { bookings, currentUser } = useApp();

  const historyBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (currentUser?.role === 'customer') {
        return (
          b.customerUsername?.toLowerCase() === currentUser?.username.toLowerCase() ||
          b.customerId === currentUser?.id
        );
      }
      return b.status === 'completed';
    });
  }, [bookings, currentUser]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CalendarCheck2 className="w-5 h-5 text-blue-600" />
          Service Records &amp; History
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Archived and completed maintenance procedures and vehicle service logs
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {historyBookings.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CalendarCheck2 className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
            <h4 className="text-sm font-bold text-slate-800">No Service History Recorded</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Completed services will be archived and logged here dynamically.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {historyBookings.map((b) => (
              <div key={b.id} className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <CarFront className="w-4 h-4 text-blue-600" />
                      {b.vehiclePlate}
                    </span>
                    <span className="text-xs text-slate-500">({b.vehicleModel})</span>
                    <span className="text-[10px] font-mono text-slate-400">Ref: {b.bookingRef}</span>
                  </div>

                  <div className="text-xs font-semibold text-slate-800">
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

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
