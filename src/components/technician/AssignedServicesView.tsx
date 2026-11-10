import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  CarFront,
  Clock,
  Warehouse,
  PlayCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AssignedServicesView: React.FC = () => {
  const { currentUser, bookings, updateServiceStatus, serviceBays } = useApp();

  const assigned = bookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    if (b.assignedTechnicianId === currentUser?.id) return true;
    const bay = serviceBays.find(bay => bay.id === b.bayId);
    if (bay?.assignedTechnicianId === currentUser?.id) return true;
    return b.status === 'in-bay' || b.status === 'in-progress' || b.status === 'quality-check';
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-blue-600" />
          My Assigned Services
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Work orders and diagnostic jobs assigned directly to your technician profile
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {assigned.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Wrench className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
            <h4 className="text-sm font-bold text-slate-800">No Services Assigned</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You do not have any vehicles currently in your assignment queue.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {assigned.map((b) => (
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
                    {b.serviceName}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {b.date} @ {b.timeSlot} ({b.durationMinutes} min)
                    </span>
                    <span className="flex items-center gap-1">
                      <Warehouse className="w-3.5 h-3.5 text-blue-600" />
                      Bay #{b.bayNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {b.status === 'scheduled' && (
                    <button
                      onClick={() => updateServiceStatus(b.id, 'in-bay')}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                    >
                      Receive into Bay
                    </button>
                  )}
                  {b.status === 'in-bay' && (
                    <button
                      onClick={() => updateServiceStatus(b.id, 'in-progress')}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Start Work</span>
                    </button>
                  )}
                  {b.status === 'in-progress' && (
                    <button
                      onClick={() => updateServiceStatus(b.id, 'quality-check')}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
                    >
                      Submit to QC
                    </button>
                  )}
                  {b.status === 'quality-check' && (
                    <button
                      onClick={() => updateServiceStatus(b.id, 'completed')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Complete</span>
                    </button>
                  )}
                  {b.status === 'completed' && (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                      Completed
                    </span>
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
