import React from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, ServiceStatusType } from '../../types';
import {
  Workflow,
  Clock,
  CarFront,
  Warehouse,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  CalendarPlus
} from 'lucide-react';

export const ServiceStatusView: React.FC = () => {
  const { bookings, updateServiceStatus, setIsBookingModalOpen } = useApp();

  const columns: { status: ServiceStatusType; title: string; color: string; dotColor: string }[] = [
    { status: 'scheduled', title: 'Scheduled (Awaiting)', color: 'border-blue-200 bg-blue-50/30', dotColor: 'bg-blue-500' },
    { status: 'in-bay', title: 'Checked-In to Bay', color: 'border-amber-200 bg-amber-50/30', dotColor: 'bg-amber-500' },
    { status: 'in-progress', title: 'In Progress (Active)', color: 'border-indigo-200 bg-indigo-50/30', dotColor: 'bg-indigo-500' },
    { status: 'completed', title: 'Completed & Delivered', color: 'border-emerald-200 bg-emerald-50/30', dotColor: 'bg-emerald-500' }
  ];

  const getNextStatus = (current: ServiceStatusType): ServiceStatusType | null => {
    switch (current) {
      case 'scheduled': return 'in-bay';
      case 'in-bay': return 'in-progress';
      case 'in-progress': return 'completed';
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-blue-600" />
              Service Status Pipeline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual Kanban workflow of vehicles transitioning from arrival to completion
            </p>
          </div>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colBookings = bookings.filter(b => b.status === col.status);

          return (
            <div
              key={col.status}
              className={`rounded-xl border ${col.color} p-4 flex flex-col h-[600px] shadow-xs`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                  <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    {col.title}
                  </h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  {colBookings.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colBookings.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center p-4 text-xs text-slate-400">
                    No vehicles in this stage
                  </div>
                ) : (
                  colBookings.map((b) => {
                    const next = getNextStatus(b.status);

                    return (
                      <div
                        key={b.id}
                        className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-xs hover:shadow-md transition-all space-y-2.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                            <CarFront className="w-3.5 h-3.5 text-blue-600" />
                            {b.vehiclePlate}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {b.bookingRef}
                          </span>
                        </div>

                        <div className="text-slate-600 text-[11px]">
                          <div className="font-semibold text-slate-800">{b.serviceName}</div>
                          <div className="text-slate-400">{b.vehicleModel}</div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <Warehouse className="w-3 h-3 text-blue-600" />
                            Bay #{b.bayNumber}
                          </span>
                          <span className="flex items-center gap-1 text-slate-500 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {b.timeSlot}
                          </span>
                        </div>

                        {next && (
                          <button
                            onClick={() => updateServiceStatus(b.id, next)}
                            className="w-full mt-1 py-1.5 px-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-blue-700 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                          >
                            <span>Advance to {next.toUpperCase()}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
