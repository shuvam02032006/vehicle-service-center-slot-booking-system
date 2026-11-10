import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TIME_SLOTS } from '../../utils/facilityCatalog';
import {
  CalendarCheck,
  Clock,
  CarFront,
  CheckCircle2,
  Settings,
  LayoutGrid,
  Calendar,
  Wrench
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    bookings,
    serviceBays,
    selectedDate,
    setActiveTab
  } = useApp();

  // 1. Total Bookings (retrieved dynamically from database)
  const totalBookingsCount = useMemo(() => {
    return bookings.filter(b => b.status !== 'cancelled').length;
  }, [bookings]);

  // 2. Available Service Bays (retrieved dynamically from database)
  const availableBaysCount = useMemo(() => {
    const occupiedBayIds = new Set(
      bookings
        .filter(b => b.date === selectedDate && b.status === 'scheduled')
        .map(b => b.bayId)
    );
    return serviceBays.filter(bay => !occupiedBayIds.has(bay.id)).length;
  }, [serviceBays, bookings, selectedDate]);

  // 3. Available Time Slots (retrieved dynamically: total capacity minus confirmed bookings for date)
  const availableSlotsCount = useMemo(() => {
    const totalSlotsPerDay = serviceBays.length * TIME_SLOTS.length;
    const reservedToday = bookings.filter(
      b => b.date === selectedDate && b.status !== 'cancelled'
    ).length;
    return Math.max(0, totalSlotsPerDay - reservedToday);
  }, [serviceBays.length, bookings, selectedDate]);

  // 4. Booking Status (retrieved dynamically)
  const bookingStatusText = useMemo(() => {
    if (totalBookingsCount === 0) {
      return 'No Active Bookings';
    }
    return `${totalBookingsCount} Active Confirmed`;
  }, [totalBookingsCount]);

  return (
    <div className="space-y-6 text-[#0b132b]">
      {/* 1. Hero Banner - Clean & Matching Reference */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:py-8 sm:px-8 relative overflow-hidden shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Clear title & action buttons */}
        <div className="flex-1 max-w-4xl z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-[48px] xl:text-[54px] 2xl:text-[58px] font-black text-[#0b132b] tracking-tight leading-[1.12]">
            Vehicle Service Center <span className="text-blue-600">Slot Booking System</span>
          </h1>

          <div className="flex flex-wrap items-center gap-3.5 mt-7">
            <button
              onClick={() => setActiveTab('booking')}
              className="px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer hover:shadow-md"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Book Service Slot</span>
            </button>

            <button
              onClick={() => setActiveTab('mutex-simulation')}
              className="px-7 py-3 rounded-full bg-white hover:bg-slate-50 active:bg-slate-100 text-blue-600 border-2 border-blue-600 font-extrabold text-sm shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-blue-600" />
              <span>Mutex Simulation</span>
            </button>
          </div>
        </div>

        {/* Right: Modern Workshop & White SUV visual (clean sky, no text artifacts) */}
        <div className="w-full lg:w-[460px] xl:w-[500px] shrink-0 relative flex justify-center lg:justify-end">
          <img
            src="/images/hero-suv-building.png"
            alt="Vehicle Service Center"
            className="w-full h-auto max-h-44 sm:max-h-48 object-cover object-right select-none pointer-events-none rounded-xl"
          />
        </div>
      </div>

      {/* 2. Overview Statistics: Total Bookings, Available Service Bays, Available Time Slots, Booking Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
              Total Bookings
            </span>
            <div className="text-2xl font-black text-[#0b132b] mt-0.5">
              {totalBookingsCount}
            </div>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
              {totalBookingsCount === 0 ? 'No bookings recorded' : 'Saved in database'}
            </span>
          </div>
        </div>

        {/* Available Service Bays */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <CarFront className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
              Available Service Bays
            </span>
            <div className="text-2xl font-black text-[#0b132b] mt-0.5">
              {availableBaysCount} / {serviceBays.length}
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
              {serviceBays.length - availableBaysCount} bay(s) allocated
            </span>
          </div>
        </div>

        {/* Available Time Slots */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
              Available Time Slots
            </span>
            <div className="text-2xl font-black text-sky-600 mt-0.5">
              {availableSlotsCount}
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
              Open across bays today
            </span>
          </div>
        </div>

        {/* Booking Status */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
              Booking Status
            </span>
            <div className="text-base font-extrabold text-[#0b132b] mt-0.5 truncate">
              {bookingStatusText}
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Mutex Protected</span>
            </span>
          </div>
        </div>
      </div>

      {/* 4. Service Bay Allocation Matrix (Full Width) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#0b132b] flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-sky-600" />
            <span>Service Bay Allocation Matrix</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Dynamic Live Status</span>
        </div>

        {/* 6 Service Bays rendered dynamically from application state */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceBays.map((bay) => {
            const activeBooking = bookings.find(
              b => b.bayId === bay.id && b.date === selectedDate && b.status === 'scheduled'
            );
            const isOccupied = !!activeBooking;

            return (
              <div
                key={bay.id}
                className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/40 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-xs text-[#0b132b] flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-sky-600" />
                    Bay #{bay.bayNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isOccupied
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {isOccupied ? 'RESERVED' : 'AVAILABLE'}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-700 truncate">
                  {bay.name}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-2 font-medium">
                  <Clock className={`w-3.5 h-3.5 ${isOccupied ? 'text-amber-600' : 'text-emerald-600'}`} />
                  <span>
                    {isOccupied
                      ? `Reserved @ ${activeBooking?.timeSlot}`
                      : 'Ready for booking'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
