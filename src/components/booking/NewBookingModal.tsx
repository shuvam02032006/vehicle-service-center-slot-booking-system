import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CalendarPlus,
  CarFront,
  User,
  Clock,
  Warehouse,
  Wrench,
  FileText,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Lock,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const NewBookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    prefilledSlot,
    setPrefilledSlot,
    serviceBays,
    serviceCatalog,
    bookServiceWithMutex,
    selectedDate,
    currentUser,
    enabledSlots,
    bookings,
    vehicles
  } = useApp();

  const [customerName, setCustomerName] = useState(currentUser?.fullName || '');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('custom');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState<number>(new Date().getFullYear());
  const [serviceId, setServiceId] = useState(serviceCatalog[0]?.id || '');
  const [bayId, setBayId] = useState(serviceBays[0]?.id || '');
  const [date, setDate] = useState(selectedDate);
  const [timeSlot, setTimeSlot] = useState(enabledSlots[0] || '09:00 AM');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingStep, setBookingStep] = useState<'IDLE' | 'ACQUIRING_MUTEX' | 'CRITICAL_SECTION' | 'SUCCESS'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBookingRef, setSuccessBookingRef] = useState<string | null>(null);

  // 4. Calculate genuinely available slots for this bay and date (Strict Requirement 5)
  const genuinelyAvailableSlots = useMemo(() => {
    return enabledSlots.filter(slot => {
      return !bookings.some(
        b => b.bayId === bayId && b.date === date && b.timeSlot === slot && b.status !== 'cancelled'
      );
    });
  }, [enabledSlots, bookings, bayId, date]);

  useEffect(() => {
    if (currentUser?.fullName && !customerName) {
      setCustomerName(currentUser.fullName);
    }
  }, [currentUser]);

  useEffect(() => {
    if (prefilledSlot) {
      setBayId(prefilledSlot.bayId);
      setDate(prefilledSlot.date);
      setTimeSlot(prefilledSlot.timeSlot);
    }
  }, [prefilledSlot]);

  // Keep timeSlot synced with genuinely available slots
  useEffect(() => {
    if (genuinelyAvailableSlots.length > 0 && !genuinelyAvailableSlots.includes(timeSlot)) {
      setTimeSlot(genuinelyAvailableSlots[0]);
    }
  }, [genuinelyAvailableSlots, timeSlot]);

  // Handle selecting an existing vehicle from database
  const handleVehicleSelect = (vId: string) => {
    setSelectedVehicleId(vId);
    if (vId === 'custom') {
      setVehiclePlate('');
      setVehicleModel('');
      setVehicleYear(new Date().getFullYear());
    } else {
      const v = vehicles.find(item => item.id === vId);
      if (v) {
        setVehiclePlate(v.licensePlate);
        setVehicleModel(v.model);
        setVehicleYear(v.year);
      }
    }
  };

  if (!isBookingModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Please enter the customer name.');
      return;
    }
    if (!vehiclePlate.trim()) {
      setErrorMessage('Please enter the vehicle license plate.');
      return;
    }
    if (!vehicleModel.trim()) {
      setErrorMessage('Please enter the vehicle make and model.');
      return;
    }

    // Revalidate slot availability before initiating locking pipeline
    if (!genuinelyAvailableSlots.includes(timeSlot)) {
      setErrorMessage(`Slot ${timeSlot} on ${date} for this bay is already reserved. Please choose another available slot.`);
      return;
    }

    try {
      setIsSubmitting(true);
      setBookingStep('ACQUIRING_MUTEX');

      // Visual delay to allow user to observe OS Mutex acquisition step
      await new Promise(r => setTimeout(r, 350));
      setBookingStep('CRITICAL_SECTION');

      const confirmedBooking = await bookServiceWithMutex({
        customerName: customerName.trim(),
        customerUsername: currentUser?.username,
        vehiclePlate: vehiclePlate.trim().toUpperCase(),
        vehicleModel: vehicleModel.trim(),
        vehicleYear: Number(vehicleYear) || new Date().getFullYear(),
        serviceId,
        bayId,
        date,
        timeSlot,
        notes: notes.trim()
      });

      setSuccessBookingRef(confirmedBooking.bookingRef);
      setBookingStep('SUCCESS');

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
    } catch (err: any) {
      setBookingStep('IDLE');
      setErrorMessage(err.message || 'Slot could not be booked due to a mutual exclusion conflict.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setIsBookingModalOpen(false);
    setPrefilledSlot(null);
    setBookingStep('IDLE');
    setErrorMessage(null);
    setSuccessBookingRef(null);
  };

  const selectedService = serviceCatalog.find(s => s.id === serviceId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0b132b] text-white p-5 border-b border-[#1c2d5a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Reserve Service Slot</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Mutex Protected
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Operating System Critical Section Booking Protocol
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen */}
        {bookingStep === 'SUCCESS' ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider">
                Mutual Exclusion Guaranteed
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Booking Confirmed &amp; Slot Locked
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your reservation was processed inside an atomic Critical Section with Mutex lock acquisition.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto text-xs space-y-2 text-left font-medium">
              <div className="flex justify-between">
                <span className="text-slate-400">Booking Reference:</span>
                <span className="font-mono font-bold text-blue-700">{successBookingRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">License Plate:</span>
                <span className="font-mono font-bold text-slate-800">{vehiclePlate.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Service Bay:</span>
                <span className="font-bold text-slate-800">
                  Bay #{serviceBays.find(b => b.id === bayId)?.bayNumber} ({serviceBays.find(b => b.id === bayId)?.name})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled Date &amp; Time:</span>
                <span className="font-mono font-bold text-slate-800">{date} @ {timeSlot}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
            >
              Done &amp; View Schedule
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Realtime Mutex Status Indicator */}
            {isSubmitting && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1.5 animate-pulse">
                <div className="flex items-center gap-2 font-mono font-bold">
                  <Cpu className="w-4 h-4 text-blue-600 animate-spin" />
                  <span>
                    {bookingStep === 'ACQUIRING_MUTEX' && 'Step 1/3: Acquiring Mutex Lock on Shared Resource...'}
                    {bookingStep === 'CRITICAL_SECTION' && 'Step 2/3: Executing Critical Section (Atomic Availability Check & Commit)...'}
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
                  <div className={`bg-blue-600 h-1.5 transition-all duration-300 ${bookingStep === 'ACQUIRING_MUTEX' ? 'w-1/2' : 'w-5/6'}`} />
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Reservation Conflict:</strong> {errorMessage}
                </div>
              </div>
            )}

            {/* 1. Customer Details */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Customer Name *
              </label>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Enter customer full name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>

            {/* 2. Vehicle Selection / Details (Requirement 5.1) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CarFront className="w-3.5 h-3.5 text-blue-600" />
                  Vehicle Details *
                </span>
                {vehicles.length > 0 && (
                  <span className="text-[10px] text-slate-400 font-normal">
                    {vehicles.length} vehicle(s) on record
                  </span>
                )}
              </label>

              {vehicles.length > 0 && (
                <div className="mb-2">
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => handleVehicleSelect(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden mb-2"
                  >
                    <option value="custom">-- Enter New Vehicle Details --</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.licensePlate} &bull; {v.make} {v.model} ({v.year})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="License Plate *"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden font-bold"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Make &amp; Model (e.g. BMW 330i) *"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    placeholder="Model Year"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* 3. Service Type & Bay Selection (Requirement 5.2, 5.5) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-blue-600" />
                  Service Type *
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden font-medium"
                >
                  {serviceCatalog.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} (${service.price} &bull; {service.durationMinutes}m)
                    </option>
                  ))}
                </select>
                {selectedService && (
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                    {selectedService.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Warehouse className="w-3.5 h-3.5 text-blue-600" />
                  Service Bay Allocation *
                </label>
                <select
                  value={bayId}
                  onChange={(e) => setBayId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden font-medium"
                >
                  {serviceBays.map((bay) => (
                    <option key={bay.id} value={bay.id}>
                      Bay #{bay.bayNumber} - {bay.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Preferred Date & Available Time Slot (Requirement 5.3, 5.4) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden font-semibold cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    Available Time Slot *
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">
                    {genuinelyAvailableSlots.length} Open
                  </span>
                </label>

                {genuinelyAvailableSlots.length === 0 ? (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
                    All slots for this bay on {date} are reserved.
                  </div>
                ) : (
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden cursor-pointer"
                  >
                    {genuinelyAvailableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot} (Available)
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* 5. Additional Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Additional Service Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Special diagnostic requests, symptoms, instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Atomic Mutex Lock Acquired on Submit
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || genuinelyAvailableSlots.length === 0}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Acquiring Mutex...' : 'Confirm Reservation'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
