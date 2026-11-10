import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Unlock,
  Play,
  RotateCcw,
  Users,
  Warehouse,
  Clock,
  Layers,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  CopyX,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const MutexSimulationView: React.FC = () => {
  const {
    participantsCount,
    setParticipantsCount,
    withMutexState,
    withoutMutexState,
    runWithMutexSimulation,
    runWithoutMutexSimulation,
    resetSimulationState,
    serviceBays,
    selectedDate
  } = useApp();

  // Mode: 'with-mutex' | 'without-mutex'
  const [activeMode, setActiveMode] = useState<'with-mutex' | 'without-mutex'>('with-mutex');

  // Shared Target Bay & Time Slot for fair comparison
  const [selectedBayNumber, setSelectedBayNumber] = useState<number>(1);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');

  const selectedBay = serviceBays.find(b => b.bayNumber === selectedBayNumber) || serviceBays[0];

  const handleStartWithMutex = async () => {
    if (withMutexState.isRunning) return;
    await runWithMutexSimulation({
      bayId: selectedBay.id,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      participants: participantsCount
    });
  };

  const handleStartWithoutMutex = async () => {
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
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
              Interactive OS Lab
            </span>
            <span className="text-xs text-slate-500 font-mono">Mutual Exclusion Comparison</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0b132b] mt-1.5 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-sky-600" />
            Mutex Concurrency Simulation
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Compare concurrent booking behaviors <strong>With Mutex</strong> vs <strong>Without Mutex</strong> for the same service bay and time slot.
          </p>
        </div>

        <button
          onClick={resetSimulationState}
          disabled={withMutexState.isRunning || withoutMutexState.isRunning}
          className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4 text-sky-600" />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Mode Selector Tabs (With Mutex / Without Mutex) */}
      <div className="bg-white rounded-2xl border border-sky-100 p-2 shadow-xs flex items-center justify-center">
        <div className="grid grid-cols-2 max-w-md w-full bg-sky-50 p-1 rounded-xl border border-sky-200/60">
          <button
            onClick={() => setActiveMode('with-mutex')}
            className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'with-mutex'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-sky-900 hover:text-sky-950 hover:bg-sky-100/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>With Mutex (Protected)</span>
          </button>

          <button
            onClick={() => setActiveMode('without-mutex')}
            className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'without-mutex'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-sky-900 hover:text-sky-950 hover:bg-sky-100/60'
            }`}
          >
            <Unlock className="w-4 h-4" />
            <span>Without Mutex (Hazard)</span>
          </button>
        </div>
      </div>

      {/* Shared Simulation Configuration Panel */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-sky-600" />
            Shared Test Parameters
          </h2>
          <span className="text-[11px] font-mono text-slate-500">
            Identical resource used for both modes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Number of Participants */}
          <div>
            <label className="block text-xs font-bold text-[#0b132b] mb-1.5">
              Number of Participants
            </label>
            <select
              value={participantsCount}
              disabled={withMutexState.isRunning || withoutMutexState.isRunning}
              onChange={(e) => setParticipantsCount(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-bold bg-sky-50/50 border border-sky-200 rounded-xl text-[#0b132b] focus:bg-white focus:border-sky-500 outline-hidden cursor-pointer"
            >
              {[2, 3, 4, 5, 6, 8].map((num) => (
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
            <div className="flex items-center gap-2 px-3 py-2 bg-sky-50/50 border border-sky-200 rounded-xl text-xs">
              <Warehouse className="w-4 h-4 text-slate-400" />
              <select
                value={selectedBayNumber}
                disabled={withMutexState.isRunning || withoutMutexState.isRunning}
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

          {/* Target Time Slot */}
          <div>
            <label className="block text-xs font-bold text-[#0b132b] mb-1.5">
              Target Time Slot
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-sky-50/50 border border-sky-200 rounded-xl text-xs">
              <Clock className="w-4 h-4 text-slate-400" />
              <select
                value={selectedTimeSlot}
                disabled={withMutexState.isRunning || withoutMutexState.isRunning}
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

          {/* Start Simulation Button */}
          <div className="flex items-end">
            {activeMode === 'with-mutex' ? (
              <button
                onClick={handleStartWithMutex}
                disabled={withMutexState.isRunning}
                className="w-full px-4 py-2.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:bg-sky-300 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {withMutexState.isRunning ? 'Executing Pipeline...' : 'Start With Mutex'}
                </span>
              </button>
            ) : (
              <button
                onClick={handleStartWithoutMutex}
                disabled={withoutMutexState.isRunning}
                className="w-full px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:bg-rose-300 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {withoutMutexState.isRunning ? 'Executing Race...' : 'Start Without Mutex'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODE 1: WITH MUTEX MODE                                        */}
      {/* ============================================================== */}
      {activeMode === 'with-mutex' && (
        <div className="space-y-6">
          {/* Execution Flow: Request → Acquire Mutex → Check Availability → Reserve Slot → Release Mutex */}
          <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600" />
              With Mutex Execution Sequence
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-center">
              <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-150">
                <div className="text-[10px] font-bold uppercase text-sky-700">Step 1</div>
                <div className="text-xs font-bold text-[#0b132b] mt-0.5">Request</div>
                <p className="text-[10px] text-slate-500 mt-1">Threads submit requests</p>
              </div>

              <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-150">
                <div className="text-[10px] font-bold uppercase text-sky-700">Step 2</div>
                <div className="text-xs font-bold text-[#0b132b] mt-0.5">Acquire Mutex</div>
                <p className="text-[10px] text-slate-500 mt-1">Locks critical section</p>
              </div>

              <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-150">
                <div className="text-[10px] font-bold uppercase text-sky-700">Step 3</div>
                <div className="text-xs font-bold text-[#0b132b] mt-0.5">Check Availability</div>
                <p className="text-[10px] text-slate-500 mt-1">Verified exclusively</p>
              </div>

              <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-150">
                <div className="text-[10px] font-bold uppercase text-sky-700">Step 4</div>
                <div className="text-xs font-bold text-[#0b132b] mt-0.5">Reserve Slot</div>
                <p className="text-[10px] text-slate-500 mt-1">Only 1 booking succeeds</p>
              </div>

              <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-150">
                <div className="text-[10px] font-bold uppercase text-sky-700">Step 5</div>
                <div className="text-xs font-bold text-[#0b132b] mt-0.5">Release Mutex</div>
                <p className="text-[10px] text-slate-500 mt-1">Vacates lock for others</p>
              </div>
            </div>
          </div>

          {/* Empty State before simulation */}
          {!withMutexState.hasRun ? (
            <div className="bg-white rounded-2xl border border-sky-100 p-12 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#0b132b]">Simulation Not Executed</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                Click <strong>"Start With Mutex"</strong> above to see how mutual exclusion serializes concurrent booking attempts.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mutex Lock Status</span>
                  <div className="text-lg font-black text-sky-700 mt-1 font-mono">
                    {withMutexState.mutexLockStatus}
                  </div>
                  <span className="text-[11px] text-slate-500">Binary Lock</span>
                </div>

                <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Critical Section</span>
                  <div className="text-xs font-bold text-[#0b132b] mt-2 truncate">
                    {withMutexState.criticalSectionStatus}
                  </div>
                  <span className="text-[11px] text-slate-500">1 Thread at a time</span>
                </div>

                <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Successful Bookings</span>
                  <div className="text-lg font-black text-emerald-600 mt-1">
                    {withMutexState.successfulReservations.length} Reservation
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold">100% Mutual Exclusion</span>
                </div>

                <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rejected Requests</span>
                  <div className="text-lg font-black text-slate-700 mt-1">
                    {withMutexState.rejectedRequests.length} Requests
                  </div>
                  <span className="text-[11px] text-slate-500">Safely prevented conflicts</span>
                </div>
              </div>

              {/* Participant Cards */}
              <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>Booking Request Status</span>
                  <span className="text-[11px] font-mono text-slate-500">Serialized Threads</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {withMutexState.requests.map((req) => (
                    <div
                      key={req.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        req.status === 'success'
                          ? 'bg-emerald-50/80 border-emerald-300'
                          : req.status === 'rejected'
                          ? 'bg-amber-50/70 border-amber-300'
                          : req.status === 'critical_section'
                          ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-200'
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
                      <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Result:</span>
                        <span
                          className={`font-bold ${
                            req.status === 'success'
                              ? 'text-emerald-700 flex items-center gap-1'
                              : req.status === 'rejected'
                              ? 'text-amber-800'
                              : 'text-sky-700'
                          }`}
                        >
                          {req.status === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {req.details || req.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Booking Result Table */}
              {withMutexState.successfulReservations.length > 0 && (
                <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    Final Booking Result: Exactly 1 Winner Confirmed
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-sky-100 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-sky-50/40">
                          <th className="py-2 px-3">Booking Ref</th>
                          <th className="py-2 px-3">Confirmed Customer</th>
                          <th className="py-2 px-3">Vehicle Plate</th>
                          <th className="py-2 px-3">Service Bay</th>
                          <th className="py-2 px-3">Slot Time</th>
                          <th className="py-2 px-3">Acquired By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {withMutexState.successfulReservations.map((b) => (
                          <tr key={b.id} className="bg-emerald-50/30">
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-900">{b.bookingRef}</td>
                            <td className="py-2.5 px-3 font-bold text-[#0b132b]">{b.customerName}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-700">{b.vehiclePlate}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">Bay #{b.bayNumber}</td>
                            <td className="py-2.5 px-3 text-slate-600">{b.date} @ {b.timeSlot}</td>
                            <td className="py-2.5 px-3 font-mono text-sky-700 font-bold">{b.threadId}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Rejected Reservations (Protected by Mutual Exclusion) */}
              {withMutexState.rejectedRequests.length > 0 && (
                <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-amber-600" />
                    Rejected Reservations ({withMutexState.rejectedRequests.length} Conflicts Safely Blocked)
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-sky-100 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-sky-50/40">
                          <th className="py-2 px-3">Participant</th>
                          <th className="py-2 px-3">Contested Resource</th>
                          <th className="py-2 px-3">Reason for Rejection</th>
                          <th className="py-2 px-3">Mutual Exclusion State</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sky-100/50">
                        {withMutexState.rejectedRequests.map((rej) => (
                          <tr key={rej.participantId} className="hover:bg-amber-50/30 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-[#0b132b]">{rej.name}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-700">Bay #{selectedBay.bayNumber} @ {selectedTimeSlot}</td>
                            <td className="py-2.5 px-3 text-slate-600">{rej.reason}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                Safely Blocked
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 2: WITHOUT MUTEX MODE                                     */}
      {/* ============================================================== */}
      {activeMode === 'without-mutex' && (
        <div className="space-y-6">
          {/* Execution Flow: Multiple Requests → Simultaneous Availability Check → Booking Attempts → Possible Duplicate Reservations */}
          <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-600" />
              Without Mutex Execution Sequence
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-150">
                <div className="text-[10px] font-bold uppercase text-rose-700">Step 1</div>
                <div className="text-xs font-bold text-[#0b132b] mt-0.5">Multiple Requests</div>
                <p className="text-[10px] text-slate-500 mt-1">{participantsCount} requests hit concurrently</p>
              </div>

              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-150">
                <div className="text-[10px] font-bold uppercase text-amber-700">Step 2</div>
                <div className="text-xs font-bold text-[#0b132b] mt-0.5">Simultaneous Check</div>
                <p className="text-[10px] text-slate-500 mt-1">All threads read: "Available"</p>
              </div>

              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-150">
                <div className="text-[10px] font-bold uppercase text-rose-700">Step 3</div>
                <div className="text-xs font-bold text-[#0b132b] mt-0.5">Booking Attempts</div>
                <p className="text-[10px] text-slate-500 mt-1">Simultaneous uncoordinated writes</p>
              </div>

              <div className="p-3 bg-rose-100/60 rounded-xl border border-rose-200">
                <div className="text-[10px] font-bold uppercase text-rose-900">Step 4</div>
                <div className="text-xs font-bold text-rose-950 mt-0.5">Double Booking!</div>
                <p className="text-[10px] text-rose-700 mt-1">Race condition hazard exposed</p>
              </div>
            </div>
          </div>

          {/* Empty State before simulation */}
          {!withoutMutexState.hasRun ? (
            <div className="bg-white rounded-2xl border border-sky-100 p-12 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <Unlock className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#0b132b]">Simulation Not Executed</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                Click <strong>"Start Without Mutex"</strong> above to observe the simultaneous availability checks and the resulting duplicate booking flaw.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Race Condition Alert Banner */}
              {withoutMutexState.step === 'race_detected' && (
                <div className="bg-rose-50 border border-rose-300 rounded-2xl p-5 shadow-xs flex items-start gap-4">
                  <div className="p-2.5 bg-rose-600 text-white rounded-xl shrink-0">
                    <AlertOctagon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-rose-950 uppercase tracking-wide">
                      Race Condition Flaw Detected: Duplicate Bookings Created
                    </h3>
                    <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                      Without a Mutex, all {participantsCount} threads checked availability at the exact same instant and all saw that Bay #{selectedBay.bayNumber} was free. Consequently, <strong>{withoutMutexState.executionResults.length} duplicate reservations</strong> were written for the identical time slot at {selectedTimeSlot}!
                    </p>
                  </div>
                </div>
              )}

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Resource</span>
                  <div className="text-base font-bold text-[#0b132b] mt-1">
                    Bay #{selectedBay.bayNumber} @ {selectedTimeSlot}
                  </div>
                  <span className="text-[11px] text-slate-500">Contested slot</span>
                </div>

                <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Simultaneous Checks</span>
                  <div className="text-base font-bold text-amber-600 mt-1">
                    {participantsCount} / {participantsCount} Threads
                  </div>
                  <span className="text-[11px] text-slate-500">All read "Available"</span>
                </div>

                <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duplicate Bookings</span>
                  <div className="text-base font-black text-rose-600 mt-1">
                    {withoutMutexState.executionResults.length} Conflicting Records
                  </div>
                  <span className="text-[11px] text-rose-600 font-semibold">Capacity violated!</span>
                </div>

                <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Race Condition Status</span>
                  <div className="text-base font-bold text-rose-600 mt-1">
                    ACTIVE COLLISION
                  </div>
                  <span className="text-[11px] text-slate-500">Missing Mutual Exclusion</span>
                </div>
              </div>

              {/* Participant Cards showing simultaneous read and double booking */}
              <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>Participant Attempts &amp; Collisions</span>
                  <span className="text-[11px] font-mono text-slate-500">Unsynchronized Pool</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {withoutMutexState.requests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl border bg-rose-50/70 border-rose-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#0b132b]">{req.participantName}</span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">{req.threadId}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono mt-1">
                        {req.vehicleNumber}
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-rose-200 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Status:</span>
                        <span className="font-bold text-rose-700 flex items-center gap-1">
                          <CopyX className="w-3.5 h-3.5" />
                          Double Booked
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duplicate Records Table */}
              {withoutMutexState.executionResults.length > 0 && (
                <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-rose-600" />
                    Duplicate Reservations Created for the Same Bay and Slot
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-sky-100 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-rose-50/40">
                          <th className="py-2 px-3">Booking Ref</th>
                          <th className="py-2 px-3">Customer</th>
                          <th className="py-2 px-3">Vehicle Plate</th>
                          <th className="py-2 px-3">Contested Bay</th>
                          <th className="py-2 px-3">Time Slot</th>
                          <th className="py-2 px-3">Collision State</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-rose-100/50">
                        {withoutMutexState.executionResults.map((b) => (
                          <tr key={b.id} className="hover:bg-rose-50/30 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-bold text-rose-800">{b.bookingRef}</td>
                            <td className="py-2.5 px-3 font-bold text-[#0b132b]">{b.customerName}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-700">{b.vehiclePlate}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">Bay #{b.bayNumber}</td>
                            <td className="py-2.5 px-3 text-slate-600">{b.date} @ {b.timeSlot}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                Double-Booked
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
