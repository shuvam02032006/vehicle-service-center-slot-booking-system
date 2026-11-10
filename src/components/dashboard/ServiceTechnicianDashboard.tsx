import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from './StatCard';
import {
  Wrench,
  PlayCircle,
  CheckCircle2,
  Clock,
  CarFront,
  Warehouse,
  AlertCircle
} from 'lucide-react';

export const ServiceTechnicianDashboard: React.FC = () => {
  const { bookings, currentUser, updateServiceStatus, serviceBays } = useApp();

  // Filter bookings assigned to this technician or in bays currently assigned to technician
  const assignedBookings = bookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    if (b.assignedTechnicianId === currentUser?.id) return true;
    // Or if technician is assigned to the bay
    const bay = serviceBays.find(bay => bay.id === b.bayId);
    if (bay?.assignedTechnicianId === currentUser?.id) return true;
    // If not explicitly assigned, technician can see active queue
    return b.status === 'in-bay' || b.status === 'in-progress' || b.status === 'quality-check';
  });

  const inProgressCount = assignedBookings.filter(b => b.status === 'in-progress').length;
  const completedTodayCount = bookings.filter(b => b.status === 'completed').length;
  const pendingCount = assignedBookings.filter(b => b.status === 'scheduled' || b.status === 'in-bay').length;

  return (
    <div className="space-y-6">
      {/* Technician Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Assigned to Me"
          value={assignedBookings.length}
          subtitle={assignedBookings.length === 0 ? "Queue currently clear" : "Active technician workload"}
          icon={<Wrench className="w-5 h-5" />}
          accentColor="blue"
        />

        <StatCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Currently on lift / bay"
          icon={<PlayCircle className="w-5 h-5" />}
          accentColor="amber"
        />

        <StatCard
          title="Completed Today"
          value={completedTodayCount}
          subtitle="Finished and verified"
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="emerald"
        />
      </div>

      {/* Active Work Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              Technician Service Queue
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Services allocated to your station. Update progress in real time.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
            {assignedBookings.length} Assigned
          </span>
        </div>

        {assignedBookings.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Wrench className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
            <h4 className="text-sm font-bold text-slate-800">No Services Currently Assigned</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Your service queue is clear. When appointments are checked in or assigned to your bay, they will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {assignedBookings.map((b) => (
              <div key={b.id} className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <CarFront className="w-4 h-4 text-blue-600" />
                      {b.vehiclePlate}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {b.vehicleModel}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {b.bookingRef}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 font-medium">
                    Service: <span className="font-bold text-blue-700">{b.serviceName}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Warehouse className="w-3.5 h-3.5 text-blue-600" />
                      Bay #{b.bayNumber}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {b.timeSlot} ({b.durationMinutes} min)
                    </span>
                  </div>

                  {b.notes && (
                    <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-lg">
                      Note: {b.notes}
                    </p>
                  )}
                </div>

                {/* Status Advancement Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  {b.status === 'scheduled' && (
                    <button
                      onClick={() => updateServiceStatus(b.id, 'in-bay')}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                    >
                      Receive into Bay
                    </button>
                  )}
                  {b.status === 'in-bay' && (
                    <button
                      onClick={() => updateServiceStatus(b.id, 'in-progress')}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Start Work</span>
                    </button>
                  )}
                  {b.status === 'in-progress' && (
                    <button
                      onClick={() => updateServiceStatus(b.id, 'quality-check')}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                    >
                      Submit to Quality Check
                    </button>
                  )}
                  {b.status === 'quality-check' && (
                    <button
                      onClick={() => updateServiceStatus(b.id, 'completed')}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Completed &amp; Free Bay</span>
                    </button>
                  )}
                  {b.status === 'completed' && (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
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
