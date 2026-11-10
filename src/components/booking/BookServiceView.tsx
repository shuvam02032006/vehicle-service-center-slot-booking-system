import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
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

export const BookServiceView: React.FC = () => {
  const {
    serviceBays,
    serviceCatalog,
    bookServiceWithMutex,
    selectedDate,
    setSelectedDate,
    currentUser,
    enabledSlots
  } = useApp();

  const [customerName, setCustomerName] = useState(currentUser?.fullName || '');
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
  const [confirmedBookingRef, setConfirmedBookingRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !vehiclePlate.trim() || !vehicleModel.trim()) {
      setErrorMessage('Please fill in all required customer and vehicle fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      setBookingStep('ACQUIRING_MUTEX');
      await new Promise(r => setTimeout(r, 350));
      setBookingStep('CRITICAL_SECTION');

      const booking = await bookServiceWithMutex({
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

      setConfirmedBookingRef(booking.bookingRef);
      setBookingStep('SUCCESS');
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch {}
    } catch (err: any) {
      setBookingStep('IDLE');
      setErrorMessage(err.message || 'Slot could not be booked due to conflict.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setCustomerName(currentUser?.fullName || '');
    setVehiclePlate('');
    setVehicleModel('');
    setNotes('');
    setBookingStep('IDLE');
    setErrorMessage(null);
    setConfirmedBookingRef(null);
  };

  const selectedService = serviceCatalog.find(s => s.id === serviceId);
  const selectedBay = serviceBays.find(b => b.id === bayId);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CalendarPlus className="w-6 h-6 text-blue-600" />
              Book Service Slot
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Synchronized reservation protected by OS Mutual Exclusion protocol
            </p>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 text-blue-800 text-xs px-3 py-1.5 rounded-lg border border-blue-200">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>Target Resource: <strong className="font-mono">bay:{selectedBay?.bayNumber}:{date}:{timeSlot}</strong></span>
          </div>
        </div>

        {bookingStep === 'SUCCESS' ? (
          <div className="py-12 max-w-lg mx-auto text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">Booking Confirmed!</h3>
            <p className="text-xs text-slate-500">
              Your service slot has been securely booked through the OS Mutex pipeline with mutual exclusion verified.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Reference:</span>
                <span className="font-bold text-blue-600">{confirmedBookingRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle:</span>
                <span className="font-bold text-slate-900">{vehiclePlate.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bay &amp; Schedule:</span>
                <span className="font-bold text-slate-900">Bay #{selectedBay?.bayNumber} on {date} @ {timeSlot}</span>
              </div>
            </div>

            <button
              onClick={handleResetForm}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
            >
              Book Another Service Slot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>{errorMessage}</div>
                </div>
              )}

              {/* Customer Information (No email, no phone) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  1. Customer Name
                </h3>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name of customer"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CarFront className="w-3.5 h-3.5 text-blue-600" />
                  2. Vehicle Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 mb-1 block">License Plate *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NY-982-XYZ"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono font-bold uppercase bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Make &amp; Model *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Audi A4 2.0T"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Model Year</label>
                    <input
                      type="number"
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Service & Bay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 block flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-blue-600" />
                    3. Service Catalog
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden font-medium"
                  >
                    {serviceCatalog.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (${s.price} &bull; {s.durationMinutes}m)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 block flex items-center gap-1.5">
                    <Warehouse className="w-3.5 h-3.5 text-blue-600" />
                    4. Service Bay
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

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 block flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    5. Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setSelectedDate(e.target.value);
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden font-semibold cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 block flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    6. Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden cursor-pointer"
                  >
                    {enabledSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 block flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  7. Additional Service Information
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional notes for technicians, requested checks..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                />
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Atomic Check &amp; Reserve via Mutex</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Acquiring Mutex Lock...' : 'Confirm Booking'}</span>
                </button>
              </div>
            </form>

            {/* Architecture Card */}
            <div className="space-y-4">
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 space-y-4">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>OS Booking Protocol Flow</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className={`p-2.5 rounded-lg border flex items-center gap-2 transition-all ${
                    bookingStep === 'ACQUIRING_MUTEX'
                      ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold animate-pulse'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    <span>Booking Request &rarr; Acquire Mutex</span>
                  </div>

                  <div className={`p-2.5 rounded-lg border flex items-center gap-2 transition-all ${
                    bookingStep === 'CRITICAL_SECTION'
                      ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold animate-pulse'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    <span>Enter Critical Section &amp; Check Availability</span>
                  </div>

                  <div className="p-2.5 rounded-lg border bg-white border-slate-200 text-slate-700 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                    <span>Atomic Slot Reservation</span>
                  </div>

                  <div className="p-2.5 rounded-lg border bg-white border-slate-200 text-slate-700 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">4</span>
                    <span>Exit Critical Section &rarr; Release Mutex</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
