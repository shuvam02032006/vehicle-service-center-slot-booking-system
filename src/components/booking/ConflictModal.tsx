import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  Warehouse,
  ArrowRight,
  CheckCircle2,
  X,
  Cpu
} from 'lucide-react';

export const ConflictModal: React.FC = () => {
  const { currentConflict, dismissConflictModal, setPrefilledSlot, setIsBookingModalOpen } = useApp();

  if (!currentConflict) return null;

  const handleSelectAlternative = (alt: { bayId: string; bayNumber: number; timeSlot: string; date: string }) => {
    dismissConflictModal();
    setPrefilledSlot({
      bayId: alt.bayId,
      bayNumber: alt.bayNumber,
      date: alt.date,
      timeSlot: alt.timeSlot
    });
    setIsBookingModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-amber-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with OS Conflict Visual */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 p-5 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                <ShieldAlert className="w-6 h-6 text-amber-100" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/20 text-amber-200">
                  OS Mutex Synchronization Event
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Slot Booking Conflict Prevented
                </h3>
              </div>
            </div>
            <button
              onClick={dismissConflictModal}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conflict Body */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Resource Contested in Critical Section:</p>
              <p className="mt-0.5 text-amber-800">
                Bay #{currentConflict.bayNumber} on {currentConflict.date} at {currentConflict.timeSlot} was already reserved. Mutual Exclusion protocol blocked the duplicate entry.
              </p>
            </div>
          </div>

          {/* OS Thread Details */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2 text-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              Synchronization Telemetry
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 block">Requested Resource:</span>
                <span className="font-semibold text-slate-800">{currentConflict.resourceKey}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Blocked Thread ID:</span>
                <span className="font-semibold text-red-600">{currentConflict.conflictingThreadId}</span>
              </div>
            </div>
          </div>

          {/* Alternative Slots Section */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Alternative Available Slots</span>
              <span className="text-[10px] text-slate-400 font-normal">Direct Rebooking</span>
            </h4>

            {currentConflict.suggestedAlternatives.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                No immediate alternatives on {currentConflict.date}. Please pick a different date.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentConflict.suggestedAlternatives.map((alt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAlternative(alt)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all group flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 group-hover:text-blue-600">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{alt.timeSlot}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Warehouse className="w-3 h-3" />
                        <span>Bay #{alt.bayNumber}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transform group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={dismissConflictModal}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
