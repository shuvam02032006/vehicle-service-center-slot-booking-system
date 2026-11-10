import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Play,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  ArrowRight,
  RotateCcw,
  Warehouse,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const WithMutexView: React.FC = () => {
  const {
    participantsCount,
    setParticipantsCount,
    withMutexState,
    runWithMutexSimulation,
    resetSimulationState,
    serviceBays,
    selectedDate
  } = useApp();

  const [selectedBayNumber, setSelectedBayNumber] = useState<number>(1);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');

  const selectedBay = serviceBays.find(b => b.bayNumber === selectedBayNumber) || serviceBays[0];

  const handleStartSimulation = async () => {
    if (withMutexState.isRunning) return;
    await runWithMutexSimulation({
      bayId: selectedBay.id,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      participants: participantsCount
    });
  };

  return (
    <div className="space-y-6 text-[#0b132b]">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              Synchronized Pipeline
            </span>
            <span className="text-xs text-slate-500 font-mono">Mutual Exclusion Protocol</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0b132b] mt-1.5 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            Booking With Mutex Synchronization
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Demonstrates how an operating systems Mutex lock serializes concurrent booking requests, protecting the <strong>Critical Section</strong> so only one reservation succeeds.
          </p>
        </div>

        {withMutexState.hasRun && (
          <button
            onClick={resetSimulationState}
            disabled={withMutexState.isRunning}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Simulation</span>
          </button>
        )}
      </div>

      {/* Control Panel: Number of Participants & Target Slot */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-4 h-4 text-emerald-600" />
          Simulation Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Number of Participants Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0b132b] mb-1.5">
              Number of Participants
            </label>
            <div className="flex items-center gap-2">
              <select
                value={participantsCount}
                disabled={withMutexState.isRunning}
                onChange={(e) => setParticipantsCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-[#0b132b] focus:bg-white focus:border-emerald-500 outline-hidden cursor-pointer"
              >
                {[2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} Concurrent Participants
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Simultaneous client threads attempting reservation.
            </p>
          </div>

          {/* Target Service Bay */}
          <div>
            <label className="block text-xs font-bold text-[#0b132b] mb-1.5">
              Target Service Bay
            </label>
            <select
              value={selectedBayNumber}
              disabled={withMutexState.isRunning}
              onChange={(e) => setSelectedBayNumber(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-[#0b132b] focus:bg-white focus:border-emerald-500 outline-hidden cursor-pointer"
            >
              {serviceBays.map((bay) => (
                <option key={bay.id} value={bay.bayNumber}>
                  Bay #{bay.bayNumber} - {bay.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Shared hardware resource contested.
            </p>
          </div>

          {/* Target Time Slot */}
          <div>
            <label className="block text-xs font-bold text-[#0b132b] mb-1.5">
              Contested Time Slot
            </label>
            <select
              value={selectedTimeSlot}
              disabled={withMutexState.isRunning}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl text-[#0b132b] focus:bg-white focus:border-emerald-500 outline-hidden cursor-pointer"
            >
              {['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'].map((slot) => (
                <option key={slot} value={slot}>
                  {slot} ({selectedDate})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Exact time slot requested by all participants.
            </p>
          </div>

          {/* Start Simulation Button */}
          <div className="flex flex-col justify-end">
            <button
              onClick={handleStartSimulation}
              disabled={withMutexState.isRunning}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{withMutexState.isRunning ? 'Executing Simulation...' : 'Start Booking Simulation'}</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-1">
              Executes the protected mutex pipeline.
            </p>
          </div>
        </div>

        {/* Working Process Formula */}
        <div className="bg-[#0b132b] p-3 rounded-xl text-xs font-mono text-white flex flex-wrap items-center gap-2 border border-[#1c2d5a]">
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">Working Process:</span>
          <span className="text-slate-300">Request</span>
          <span className="text-emerald-400">&rarr;</span>
          <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">Acquire Mutex</span>
          <span className="text-emerald-400">&rarr;</span>
          <span className="text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">Check Slot</span>
          <span className="text-emerald-400">&rarr;</span>
          <span className="text-purple-300 font-bold bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/40">Book Slot</span>
          <span className="text-emerald-400">&rarr;</span>
          <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">Release Mutex</span>
        </div>
      </div>

      {/* Main Monitoring Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mutex Lock Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Mutex Lock Status
            </span>
            <div className={`p-2 rounded-xl ${
              withMutexState.mutexLockStatus === 'LOCKED'
                ? 'bg-rose-50 text-rose-600'
                : withMutexState.mutexLockStatus === 'CRITICAL_SECTION'
                ? 'bg-amber-50 text-amber-600'
                : 'bg-emerald-50 text-emerald-600'
            }`}>
              {withMutexState.mutexLockStatus === 'LOCKED' ? (
                <Lock className="w-5 h-5" />
              ) : (
                <Unlock className="w-5 h-5" />
              )}
            </div>
          </div>
          <div className="font-mono text-2xl font-extrabold text-[#0b132b]">
            {withMutexState.mutexLockStatus === 'IDLE' ? 'UNLOCKED / IDLE' : withMutexState.mutexLockStatus}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {withMutexState.mutexLockStatus === 'LOCKED'
              ? 'Mutex acquired: shared slot resource locked exclusively.'
              : withMutexState.mutexLockStatus === 'CRITICAL_SECTION'
              ? 'Lock active: participant executing inside atomic critical section.'
              : 'Resource free: lock ready for next contender.'}
          </p>
        </div>

        {/* Critical Section Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Critical Section Status
            </span>
            <div className={`p-2 rounded-xl ${
              withMutexState.criticalSectionStatus !== 'EMPTY'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-slate-100 text-slate-600'
            }`}>
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="font-mono text-lg font-bold text-[#0b132b] truncate">
            {withMutexState.criticalSectionStatus || 'EMPTY (No thread inside)'}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Only <strong>1 participant</strong> can execute availability check &amp; slot booking concurrently.
          </p>
        </div>
      </div>

      {/* Booking Requests & Execution State */}
      {!withMutexState.hasRun && !withMutexState.isRunning ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#0b132b]">
            No simulation executed yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Select the number of participants above (currently <strong>{participantsCount} participants</strong>) and click <strong>&quot;Start Booking Simulation&quot;</strong> to watch mutex synchronization in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Requests Status Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0b132b] flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Participant Booking Requests ({withMutexState.requests.length})
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Target: Bay #{selectedBayNumber} @ {selectedTimeSlot}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {withMutexState.requests.map((req) => (
                <div
                  key={req.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    req.status === 'success'
                      ? 'bg-emerald-50 border-emerald-300'
                      : req.status === 'rejected'
                      ? 'bg-rose-50 border-rose-200 opacity-90'
                      : req.status === 'critical_section'
                      ? 'bg-amber-50 border-amber-300 animate-pulse'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[#0b132b]">{req.participantName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'success'
                        ? 'bg-emerald-600 text-white'
                        : req.status === 'rejected'
                        ? 'bg-rose-600 text-white'
                        : req.status === 'critical_section'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {req.status === 'success' ? 'Booked (Success)' : req.status === 'rejected' ? 'Rejected' : req.status === 'critical_section' ? 'In Critical Section' : 'Waiting Lock'}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600 space-y-0.5">
                    <div>Vehicle: {req.vehicleNumber} ({req.vehicleModel})</div>
                    <div>Target: Bay #{req.bayNumber} &bull; {req.timeSlot}</div>
                    {req.details && <div className="text-slate-500 text-[10px] italic mt-1">{req.details}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Summary: Successful vs Rejected */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Successful Reservations */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Successful Reservations ({withMutexState.successfulReservations.length})
                </h3>
                <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Guaranteed 1
                </span>
              </div>

              {withMutexState.successfulReservations.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Simulation executing...
                </p>
              ) : (
                withMutexState.successfulReservations.map((b) => (
                  <div key={b.id} className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1.5">
                    <div className="flex justify-between font-bold text-[#0b132b]">
                      <span>{b.customerName}</span>
                      <span className="font-mono text-emerald-700">{b.bookingRef}</span>
                    </div>
                    <div className="text-slate-600">
                      Vehicle: <span className="font-mono font-semibold">{b.vehiclePlate}</span> ({b.vehicleModel})
                    </div>
                    <div className="text-slate-600">
                      Service Bay: <strong>Bay #{b.bayNumber}</strong> &bull; {b.date} @ {b.timeSlot}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium">
                      Status: Exclusively reserved inside critical section. Lock safely released.
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Rejected Requests */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  Rejected Requests ({withMutexState.rejectedRequests.length})
                </h3>
                <span className="text-xs font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                  Conflict Prevented
                </span>
              </div>

              {withMutexState.rejectedRequests.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  {withMutexState.isRunning ? 'Processing wait queue...' : 'None rejected.'}
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {withMutexState.rejectedRequests.map((rej, i) => (
                    <div key={i} className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-rose-900">
                        <span>{rej.name}</span>
                        <span className="text-[10px] uppercase font-bold text-rose-700">Slot Unavailable</span>
                      </div>
                      <p className="text-[11px] text-rose-700">
                        {rej.reason}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Execution Log & Conclusion */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#0b132b] flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Detailed Execution Results &amp; OS Mutex Analysis
            </h3>
            <div className="bg-[#0b132b] rounded-xl p-4 text-xs font-mono text-slate-200 space-y-1.5 max-h-56 overflow-y-auto">
              {withMutexState.executionLog.map((log) => (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-slate-500 shrink-0">[{log.time}]</span>
                  <span className={
                    log.type === 'success'
                      ? 'text-emerald-400'
                      : log.type === 'error'
                      ? 'text-rose-400'
                      : log.type === 'warning'
                      ? 'text-amber-300'
                      : 'text-slate-200'
                  }>
                    {log.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
              <strong>Operating Systems Demonstration Conclusion:</strong> Because the Mutex enforces mutual exclusion, only <strong>one</strong> participant could acquire the lock and enter the Critical Section at a time. The slot was checked and booked atomically. All other {participantsCount - 1} contenders observed that the slot had already been claimed and were safely rejected without double booking.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
