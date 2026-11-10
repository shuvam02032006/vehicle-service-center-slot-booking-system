import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Warehouse,
  CarFront,
  Clock,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Activity,
  Plus,
  RotateCcw,
  Shield,
  Ban
} from 'lucide-react';

export const VisualServiceBays: React.FC = () => {
  const {
    serviceBays,
    setPrefilledSlot,
    setIsBookingModalOpen,
    selectedDate,
    updateBayStatus,
    currentUser
  } = useApp();

  const isAuthorized = currentUser?.role === 'admin' || currentUser?.role === 'service-manager';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-blue-600" />
            Service Bay Infrastructure &amp; Allocation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time physical bay occupancy and telemetry dynamically updated
          </p>
        </div>

        {/* Status Indicators Legend */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-slate-600 font-medium">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span className="text-slate-600 font-medium">Unavailable</span>
          </div>
        </div>
      </div>

      {/* Grid of Service Bays */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {serviceBays.map((bay) => {
          const isOccupied = bay.status === 'occupied';
          const isUnavailable = bay.status === 'unavailable' || bay.status === 'maintenance';
          const isAvailable = bay.status === 'idle' || bay.isAvailable;

          return (
            <div
              key={bay.id}
              className={`rounded-xl border p-4.5 transition-all relative overflow-hidden flex flex-col justify-between ${
                isOccupied
                  ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                  : isUnavailable
                  ? 'bg-slate-100/70 border-slate-300 shadow-2xs'
                  : 'bg-slate-50/50 hover:bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Top Bar: Bay Number & Status Indicator */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isOccupied
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isUnavailable
                      ? 'bg-slate-400 text-white'
                      : 'bg-emerald-600 text-white shadow-xs'
                  }`}>
                    #{bay.bayNumber}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug truncate max-w-44">
                      {bay.name}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {bay.type}
                    </span>
                  </div>
                </div>

                {/* Status Indicator Badge */}
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isAvailable
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : isOccupied
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-slate-200 text-slate-700 border border-slate-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isAvailable
                      ? 'bg-emerald-500'
                      : isOccupied
                      ? 'bg-blue-600 animate-ping'
                      : 'bg-slate-500'
                  }`} />
                  {isAvailable ? 'Available' : isOccupied ? 'Occupied' : 'Unavailable'}
                </span>
              </div>

              {/* Dynamic Content: Vehicle, Service, Completion */}
              <div className="my-2 p-3 rounded-lg bg-white border border-slate-200/80 space-y-2 text-xs">
                {isOccupied ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Assigned Vehicle:</span>
                      <span className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                        <CarFront className="w-3.5 h-3.5 text-blue-600" />
                        {bay.assignedVehiclePlate || 'In Service'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Vehicle Model:</span>
                      <span className="font-medium text-slate-700 truncate max-w-36 text-right">
                        {bay.assignedVehicleModel || 'Standard Service'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Active Service:</span>
                      <span className="font-semibold text-blue-700 truncate max-w-40 text-right">
                        {bay.currentServiceType || 'Maintenance Operation'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-slate-400 text-[11px]">Est. Completion:</span>
                      <span className="font-mono font-bold text-amber-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {bay.estimatedCompletionTime || 'In Progress'}
                      </span>
                    </div>
                  </>
                ) : isUnavailable ? (
                  <div className="py-4 text-center">
                    <p className="text-xs text-slate-500 font-medium">Bay temporarily taken out of service</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Under maintenance calibration</p>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-xs text-slate-400 font-medium">Bay is currently vacant and ready</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Ready for synchronized slot allocation</p>
                  </div>
                )}
              </div>

              {/* Bottom Footer: Bay Equipment Status & Authorized Actions */}
              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-500" />
                  Lift: <span className="font-medium text-slate-700 capitalize">{bay.equipmentStatus || 'Hydraulic Ready'}</span>
                </span>

                <div className="flex items-center gap-2">
                  {/* Authorized user actions: Assign or Release Bay */}
                  {isOccupied && isAuthorized && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Release Bay #${bay.bayNumber}? This will mark the bay available for incoming appointments.`)) {
                          updateBayStatus(bay.id, 'idle');
                        }
                      }}
                      className="text-amber-700 hover:text-amber-800 font-bold inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded transition-colors"
                      title="Release this service bay"
                    >
                      <RotateCcw className="w-3 h-3 text-amber-600" />
                      Release Bay
                    </button>
                  )}

                  {isAvailable && (
                    <button
                      onClick={() => {
                        setPrefilledSlot({
                          bayId: bay.id,
                          bayNumber: bay.bayNumber,
                          date: selectedDate,
                          timeSlot: '09:00 AM'
                        });
                        setIsBookingModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3 h-3" />
                      Assign Bay
                    </button>
                  )}

                  {isAuthorized && !isOccupied && (
                    <button
                      onClick={() => {
                        updateBayStatus(bay.id, isUnavailable ? 'idle' : 'unavailable');
                      }}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200 transition-colors"
                      title={isUnavailable ? "Mark bay as available" : "Mark bay as unavailable"}
                    >
                      {isUnavailable ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Ban className="w-3.5 h-3.5 text-slate-500" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
