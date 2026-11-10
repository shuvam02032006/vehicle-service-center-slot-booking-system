import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Unlock,
  AlertTriangle,
  Play,
  Users,
  XCircle,
  Clock,
  Layers,
  ArrowRight,
  RotateCcw,
  Warehouse,
  Calendar,
  AlertOctagon,
  CopyX,
  FileSpreadsheet
} from 'lucide-react';

export const WithoutMutexView: React.FC = () => {
  const {
    participantsCount,
    setParticipantsCount,
    withoutMutexState,
    runWithoutMutexSimulation,
    resetSimulationState,
    serviceBays,
    selectedDate
  } = useApp();

  const [selectedBayNumber, setSelectedBayNumber] = useState<number>(1);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');

  const selectedBay = serviceBays.find(b => b.bayNumber === selectedBayNumber) || serviceBays[0];

  const handleStartSimulation = async () => {
    if (withoutMutexState.isRunning) return;
    await runWithoutMutexSimulation({
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
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
              Unsynchronized (Race Condition Hazard)
            </span>
            <span className="text-xs text-slate-500 font-mono">Mutex Lock Disabled</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0b132b] mt-1.5 tracking-tight flex items-center gap-2.5">
            <Unlock className="w-6 h-6 text-rose-600" />
            Booking Without Mutex Synchronization
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Demonstrates an Operating Systems <strong>Critical Section Flaw</strong>. Without Mutual Exclusion, multiple threads concurrently check availability simultaneously, all read the slot as available, and multiple duplicate reservations are written to the identical resource.
          </p>
        </div>

        {withoutMutexState.hasRun && (
          <button
            onClick={resetSimulationState}
            disabled={withoutMutexState.isRunning}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Simulation</span>
          </button>
        )}
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-4 h-4 text-rose-600" />
          Simulation Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Number of Participants */}
          <div>
            <label className="block text-xs font-bold text-[#0b132b] mb-1.5">
              Number of Participants
            </label>
            <select
              value={participantsCount}
              disabled={withoutMutexState.isRunning}
              onChange={(e) => setParticipantsCount(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-[#0b132b] focus:bg-white focus:border-rose-500 outline-hidden cursor-pointer"
            >
              {[2, 3, 4, 5, 6, 8, 10].map((num) => (
                <option key={num} value={num}>
                  {num} Concurrent Participants
                </option>
              ))}
            </select>
          </div>

          {/* Target Service Bay */}
          <div>
            <label className="block text-xs font-bold text-[#0b132b] mb-1.5">
              Target Service Bay
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium">
              <Warehouse className="w-4 h-4 text-slate-500" />
              <select
                value={selectedBayNumber}
                disabled={withoutMutexState.isRunning}
                onChange={(e) => setSelectedBayNumber(Number(e.target.value))}
                className="bg-transparent font-bold text-[#0b132b] w-full outline-hidden cursor-pointer"
              >
                {serviceBays.map((bay) => (
                  <option key={bay.id} value={bay.bayNumber}>
                    Bay #{bay.bayNumber} &bull; {bay.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Slot */}
          <div>
            <label className="block text-xs font-bold text-[#0b132b] mb-1.5">
              Target Time Slot
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium">
              <Clock className="w-4 h-4 text-slate-500" />
              <select
                value={selectedTimeSlot}
                disabled={withoutMutexState.isRunning}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="bg-transparent font-bold text-[#0b132b] w-full outline-hidden cursor-pointer"
              >
                {['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map(
                  (slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Trigger Button */}
          <div className="flex items-end">
            <button
              onClick={handleStartSimulation}
              disabled={withoutMutexState.isRunning}
              className="w-full px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:bg-rose-300 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>
                {withoutMutexState.isRunning
                  ? 'Simulating Race Condition...'
                  : 'Start Simulation (No Mutex)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Working Process Flow: Multiple Requests -> Check Availability Simultaneously -> Attempt Booking -> Display Race Condition */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-rose-600" />
          Unsynchronized Concurrency Workflow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
          {/* Step 1 */}
          <div
            className={`p-4 rounded-xl border text-center transition-all ${
              withoutMutexState.step === 'simultaneous_request'
                ? 'bg-rose-50 border-rose-400 shadow-xs ring-2 ring-rose-300'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              1
            </div>
            <div className="text-xs font-bold text-[#0b132b]">Multiple Requests</div>
            <p className="text-[11px] text-slate-500 mt-1">
              {participantsCount} participants arrive concurrently targeting the exact same slot.
            </p>
          </div>

          {/* Step 2 */}
          <div
            className={`p-4 rounded-xl border text-center transition-all ${
              withoutMutexState.step === 'availability_check'
                ? 'bg-amber-50 border-amber-400 shadow-xs ring-2 ring-amber-300'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              2
            </div>
            <div className="text-xs font-bold text-[#0b132b]">Check Simultaneously</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Without a lock, all threads read state at once. All observe: "Available".
            </p>
          </div>

          {/* Step 3 */}
          <div
            className={`p-4 rounded-xl border text-center transition-all ${
              withoutMutexState.step === 'concurrent_execution'
                ? 'bg-rose-50 border-rose-400 shadow-xs ring-2 ring-rose-300'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              3
            </div>
            <div className="text-xs font-bold text-[#0b132b]">Attempt Booking</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Every thread proceeds to write booking records concurrently into the critical section.
            </p>
          </div>

          {/* Step 4 */}
          <div
            className={`p-4 rounded-xl border text-center transition-all ${
              withoutMutexState.step === 'race_detected'
                ? 'bg-rose-100 border-rose-500 shadow-xs ring-2 ring-rose-400 text-rose-950'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-rose-200 text-rose-800 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              4
            </div>
            <div className="text-xs font-bold text-[#0b132b]">Race Condition!</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Double-bookings written. Critical system flaw exposed.
            </p>
          </div>
        </div>
      </div>

      {/* Main Simulation View or Empty State */}
      {!withoutMutexState.hasRun ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Unlock className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#0b132b]">Simulation Not Executed</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
            Select the number of participants and target bay above, then click <strong>"Start Simulation (No Mutex)"</strong> to observe the concurrent availability checks and resulting race condition.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Race Condition Alert Banner */}
          {withoutMutexState.step === 'race_detected' && (
            <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-5 shadow-sm flex items-start gap-4">
              <div className="p-2.5 bg-rose-600 text-white rounded-xl shrink-0">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-rose-950 uppercase tracking-wide">
                    CRITICAL RACE CONDITION OCCURRED
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-900">
                    {withoutMutexState.detectedRaceConditions} Conflicts Detected
                  </span>
                </div>
                <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                  Because no Mutex was acquired before checking availability, all {participantsCount} threads observed Bay #{selectedBay.bayNumber} as available simultaneously. As a consequence, <strong>{withoutMutexState.executionResults.length} duplicate bookings</strong> were registered for the exact same physical slot at {selectedTimeSlot}!
                </p>
              </div>
            </div>
          )}

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Resource</span>
              <div className="text-lg font-black text-[#0b132b] mt-1">
                Bay #{selectedBay.bayNumber} &bull; {selectedTimeSlot}
              </div>
              <span className="text-[11px] text-slate-500">Contested slot</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Simultaneous Checks</span>
              <div className="text-lg font-black text-amber-600 mt-1">
                {withoutMutexState.availabilityChecked ? `${participantsCount} / ${participantsCount} Threads` : 'Pending'}
              </div>
              <span className="text-[11px] text-slate-500">All read status = "Available"</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duplicate Bookings</span>
              <div className="text-lg font-black text-rose-600 mt-1">
                {withoutMutexState.executionResults.length} Reservations
              </div>
              <span className="text-[11px] text-rose-600 font-semibold">Over-allocated capacity!</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mutual Exclusion</span>
              <div className="text-lg font-black text-rose-600 mt-1">
                FAILED (Disabled)
              </div>
              <span className="text-[11px] text-slate-500">Unsynchronized access</span>
            </div>
          </div>

          {/* Participants State Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Concurrent Participants Status</span>
              <span className="text-[11px] font-mono text-slate-500">Simultaneous Execution Pool</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {withoutMutexState.requests.map((req) => (
                <div
                  key={req.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    req.status === 'double_booked'
                      ? 'bg-rose-50/80 border-rose-300'
                      : req.status === 'critical_section'
                      ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200'
                      : req.status === 'checking'
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#0b132b]">{req.participantName}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">{req.threadId}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono mt-1">
                    {req.vehicleNumber}
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Result:</span>
                    <span
                      className={`font-bold ${
                        req.status === 'double_booked'
                          ? 'text-rose-700 flex items-center gap-1'
                          : req.status === 'checking'
                          ? 'text-amber-700'
                          : 'text-slate-600'
                      }`}
                    >
                      {req.status === 'double_booked' && <CopyX className="w-3.5 h-3.5" />}
                      {req.details || req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Duplicate Reservations Table */}
          {withoutMutexState.executionResults.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-rose-600" />
                  Corrupted Resource Registry: Duplicate Bookings for Bay #{selectedBay.bayNumber}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                  {withoutMutexState.executionResults.length} Conflicting Records
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-50">
                      <th className="py-2.5 px-3">Booking Ref</th>
                      <th className="py-2.5 px-3">Customer / Participant</th>
                      <th className="py-2.5 px-3">Vehicle Plate</th>
                      <th className="py-2.5 px-3">Service Bay</th>
                      <th className="py-2.5 px-3">Date &amp; Time Slot</th>
                      <th className="py-2.5 px-3">Thread ID</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {withoutMutexState.executionResults.map((booking) => (
                      <tr key={booking.id} className="hover:bg-rose-50/40 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-rose-800">
                          {booking.bookingRef}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-[#0b132b]">
                          {booking.customerName}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">
                          {booking.vehiclePlate}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">
                          Bay #{booking.bayNumber}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-medium">
                          {booking.date} @ {booking.timeSlot}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                          {booking.threadId}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            Double Booked
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Execution Log */}
          <div className="bg-[#0b132b] text-slate-200 rounded-2xl p-6 shadow-xs font-mono text-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Simulation Execution Log</span>
              <span className="text-[10px] text-slate-500 font-sans">Real-time Thread Events</span>
            </h3>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-2">
              {withoutMutexState.executionLog.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-500 text-[10px] shrink-0 font-mono">[{log.time}]</span>
                  <span
                    className={
                      log.type === 'error'
                        ? 'text-rose-400 font-bold'
                        : log.type === 'warning'
                        ? 'text-amber-400'
                        : 'text-slate-300'
                    }
                  >
                    {log.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
