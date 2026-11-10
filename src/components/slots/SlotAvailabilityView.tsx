import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TIME_SLOTS } from '../../utils/facilityCatalog';
import {
  Clock,
  Warehouse,
  Wrench,
  Check,
  X,
  AlertTriangle,
  Calendar,
  Lock,
  Plus,
  CarFront
} from 'lucide-react';

export const SlotAvailabilityView: React.FC = () => {
  const {
    serviceBays,
    serviceCatalog,
    bookings,
    selectedDate,
    setSelectedDate,
    setPrefilledSlot,
    setIsBookingModalOpen,
    activeLocks
  } = useApp();

  const [selectedServiceId, setSelectedServiceId] = useState<string>(serviceCatalog[0]?.id || '');
  const [selectedBayFilter, setSelectedBayFilter] = useState<string>('all');

  const visibleBays = useMemo(() => {
    if (selectedBayFilter === 'all') return serviceBays;
    return serviceBays.filter(b => b.id === selectedBayFilter);
  }, [serviceBays, selectedBayFilter]);

  // Check state of a specific slot for a bay on selectedDate
  const getSlotState = (bayId: string, timeSlot: string) => {
    // 1. Is there an active mutex lock currently held on this resource?
    const isLocked = activeLocks.some(
      lock => lock.bayId === bayId && lock.date === selectedDate && lock.timeSlot === timeSlot
    );
    if (isLocked) {
      return { status: 'LOCKED', booking: null };
    }

    // 2. Is there an active confirmed booking for this slot?
    const booking = bookings.find(
      b => b.bayId === bayId && b.date === selectedDate && b.timeSlot === timeSlot && b.status !== 'cancelled'
    );

    if (booking) {
      return { status: 'BOOKED', booking };
    }

    return { status: 'AVAILABLE', booking: null };
  };

  const handleSelectSlot = (bayId: string, bayNumber: number, timeSlot: string) => {
    const slotState = getSlotState(bayId, timeSlot);
    if (slotState.status === 'AVAILABLE') {
      setPrefilledSlot({
        bayId,
        bayNumber,
        date: selectedDate,
        timeSlot
      });
      setIsBookingModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Service Slot Availability Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live matrix across all physical bays. Select any available slot to initiate synchronized booking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Date Selector */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
              <Calendar className="w-4 h-4 text-blue-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent outline-hidden cursor-pointer"
              />
            </div>

            {/* Service Type Selector */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
              <Wrench className="w-4 h-4 text-slate-500" />
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-transparent outline-hidden cursor-pointer"
              >
                {serviceCatalog.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} ({srv.durationMinutes}m)
                  </option>
                ))}
              </select>
            </div>

            {/* Bay Filter Selector */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
              <Warehouse className="w-4 h-4 text-slate-500" />
              <select
                value={selectedBayFilter}
                onChange={(e) => setSelectedBayFilter(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-transparent outline-hidden cursor-pointer"
              >
                <option value="all">All Service Bays ({serviceBays.length})</option>
                {serviceBays.map((bay) => (
                  <option key={bay.id} value={bay.id}>
                    Bay #{bay.bayNumber} - {bay.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs">
          <span className="text-slate-400 font-medium">Slot Status:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-50 border border-emerald-300 inline-block" />
            <span className="text-slate-700 font-medium">Available (Click to Book)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-800 border border-slate-900 inline-block" />
            <span className="text-slate-700 font-medium">Reserved / Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-400 border border-amber-500 inline-block animate-pulse" />
            <span className="text-slate-700 font-medium">Locked (OS Mutex Active)</span>
          </div>
        </div>
      </div>

      {/* Grid Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[760px]">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px] font-bold">
            <tr>
              <th className="py-3.5 px-4 sticky left-0 bg-slate-50 z-10 w-44">
                Service Bay
              </th>
              {TIME_SLOTS.map((slot) => (
                <th key={slot} className="py-3.5 px-2 text-center font-mono font-bold whitespace-nowrap">
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleBays.map((bay) => (
              <tr key={bay.id} className="hover:bg-slate-50/50 transition-colors">
                {/* Bay Header Column */}
                <td className="py-3 px-4 sticky left-0 bg-white z-10 border-r border-slate-100 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                      #{bay.bayNumber}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate max-w-36">
                        {bay.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-36">
                        {bay.type}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Slots per Bay */}
                {TIME_SLOTS.map((slot) => {
                  const { status, booking } = getSlotState(bay.id, slot);

                  if (status === 'LOCKED') {
                    return (
                      <td key={slot} className="py-2.5 px-1.5 text-center">
                        <div
                          className="h-14 rounded-lg bg-amber-100 border border-amber-300 p-1 flex flex-col items-center justify-center text-amber-900 shadow-2xs animate-pulse"
                          title="Mutex Lock held by active OS transaction"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-600 mb-0.5" />
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider">LOCKED</span>
                        </div>
                      </td>
                    );
                  }

                  if (status === 'BOOKED' && booking) {
                    return (
                      <td key={slot} className="py-2.5 px-1.5 text-center">
                        <div
                          className="h-14 rounded-lg bg-slate-900 text-white p-1 flex flex-col items-center justify-center shadow-2xs group relative overflow-hidden"
                          title={`Booked: ${booking.vehiclePlate} (${booking.serviceName})`}
                        >
                          <CarFront className="w-3 h-3 text-blue-400 mb-0.5" />
                          <span className="text-[10px] font-mono font-bold truncate max-w-16">
                            {booking.vehiclePlate}
                          </span>
                          <span className="text-[9px] text-slate-400 truncate max-w-16">
                            {booking.status}
                          </span>
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={slot} className="py-2.5 px-1.5 text-center">
                      <button
                        onClick={() => handleSelectSlot(bay.id, bay.bayNumber, slot)}
                        className="w-full h-14 rounded-lg bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/80 hover:border-emerald-400 p-1 flex flex-col items-center justify-center text-emerald-800 transition-all group shadow-2xs cursor-pointer"
                        title="Available slot. Click to book."
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-125 transition-transform mb-0.5" />
                        <span className="text-[10px] font-semibold text-emerald-700">Free</span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
