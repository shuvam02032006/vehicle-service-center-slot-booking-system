import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  RotateCcw,
  Warehouse,
  ShieldCheck,
  Cpu,
  Clock,
  Trash2,
  HardDrive
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    resetAllDataToCleanState,
    serviceBays,
    bookings,
    customers,
    vehicles,
    conflictsPrevented
  } = useApp();

  const handleHardReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This will clear all customer records, vehicles, and bookings back to pristine state.')) {
      resetAllDataToCleanState();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          System Settings &amp; Configuration
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Service center parameters, OS concurrency controls, and state management
        </p>
      </div>

      {/* Facility Configuration */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Warehouse className="w-4 h-4 text-blue-600" />
          Facility &amp; Bay Setup
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block mb-1">Physical Bays Installed:</span>
            <span className="text-lg font-bold text-slate-900">{serviceBays.length} Diagnostic &amp; Lift Bays</span>
            <p className="text-[11px] text-slate-500 mt-1">Configured for 1-hour slots from 08:00 AM to 06:00 PM</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block mb-1">Operating Schedule:</span>
            <span className="text-lg font-bold text-slate-900">10 Daily Time Slots</span>
            <p className="text-[11px] text-slate-500 mt-1">Total daily facility capacity: 60 slot reservations</p>
          </div>
        </div>
      </div>

      {/* OS Synchronization Parameters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600" />
          Operating Systems Synchronization Parameters
        </h3>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Synchronization Primitive:</span>
            <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Binary Mutex (Mutual Exclusion Lock)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Lock Granularity:</span>
            <span className="font-mono text-slate-800">
              Fine-Grained Resource Level (bay:bayId:date:timeSlot)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Lock Acquisition Timeout:</span>
            <span className="font-mono text-slate-800">8000 ms</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Total Conflicts Successfully Prevented:</span>
            <span className="font-mono font-bold text-emerald-600">{conflictsPrevented}</span>
          </div>
        </div>
      </div>

      {/* State & Reset Controls */}
      <div className="bg-white rounded-xl border border-red-200 shadow-xs p-6 space-y-4">
        <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-red-600" />
          Reset State &amp; Clean Data
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Clear all current dynamic bookings, vehicles, and customer entries stored in the system. The application will return to its pristine clean state with 0 bookings and 0 customer records.
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500 font-mono">
            Current: {bookings.length} Bookings &bull; {vehicles.length} Vehicles &bull; {customers.length} Customers
          </div>

          <button
            onClick={handleHardReset}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-500/20 flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Data to Clean State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
