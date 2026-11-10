import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Warehouse,
  CarFront,
  Clock,
  Wrench,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Activity,
  Plus,
  Filter
} from 'lucide-react';

export const ServiceBayManagementView: React.FC = () => {
  const {
    serviceBays,
    bookings,
    selectedDate,
    setPrefilledSlot,
    setIsBookingModalOpen,
    updateServiceStatus
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'available' | 'occupied'>('all');

  const filteredBays = serviceBays.filter((bay) => {
    if (filter === 'available') return bay.isAvailable;
    if (filter === 'occupied') return !bay.isAvailable;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-blue-600" />
              Service Bay Fleet Management
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status, equipment telemetry, and vehicle assignments for all 6 bays
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter Bays:</span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  filter === 'all' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({serviceBays.length})
              </button>
              <button
                onClick={() => setFilter('available')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  filter === 'available' ? 'bg-white text-emerald-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Available ({serviceBays.filter(b => b.isAvailable).length})
              </button>
              <button
                onClick={() => setFilter('occupied')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  filter === 'occupied' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Occupied ({serviceBays.filter(b => !b.isAvailable).length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bay Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBays.map((bay) => {
          const isOccupied = bay.status === 'occupied';
          const activeBooking = bookings.find(b => b.id === bay.currentBookingId);

          return (
            <div
              key={bay.id}
              className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                isOccupied
                  ? 'bg-blue-50/30 border-blue-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isOccupied
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    #{bay.bayNumber}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {bay.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                      {bay.type}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                    bay.isAvailable
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${bay.isAvailable ? 'bg-emerald-500' : 'bg-blue-600 animate-ping'}`} />
                  {bay.isAvailable ? 'Available' : 'In Service'}
                </span>
              </div>

              {/* Dynamic Bay Data Section */}
              <div className="p-5 space-y-3.5 text-xs flex-1">
                {isOccupied ? (
                  <>
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Assigned Vehicle:</span>
                        <span className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                          <CarFront className="w-3.5 h-3.5 text-blue-600" />
                          {bay.assignedVehiclePlate}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Model:</span>
                        <span className="font-medium text-slate-700">
                          {bay.assignedVehicleModel || 'Standard Passenger Vehicle'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Service Type:</span>
                        <span className="font-semibold text-blue-700 truncate max-w-44 text-right">
                          {bay.currentServiceType}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                        <span className="text-slate-400 text-[11px]">Est. Completion:</span>
                        <span className="font-mono font-bold text-amber-700 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          {bay.estimatedCompletionTime || 'Ongoing'}
                        </span>
                      </div>
                    </div>

                    {/* Service Workflow Action */}
                    {activeBooking && (
                      <div className="flex items-center gap-2">
                        {activeBooking.status === 'in-bay' && (
                          <button
                            onClick={() => updateServiceStatus(activeBooking.id, 'in-progress')}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <PlayCircle className="w-4 h-4" />
                            Start Work in Bay
                          </button>
                        )}
                        {activeBooking.status === 'in-progress' && (
                          <button
                            onClick={() => updateServiceStatus(activeBooking.id, 'completed')}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Complete Service &amp; Free Bay
                          </button>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-6">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">Bay is Ready &amp; Unoccupied</p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                      No active vehicle currently in this bay. Available for atomic allocation.
                    </p>
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
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Assign Booking
                    </button>
                  </div>
                )}
              </div>

              {/* Bay Hardware Footer */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  Telemetry: <strong className="text-slate-700 capitalize">{bay.equipmentStatus}</strong>
                </span>
                <span className="font-mono text-slate-400">ID: {bay.id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
