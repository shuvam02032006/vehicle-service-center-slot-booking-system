import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarPlus,
  CheckCircle2,
  XCircle,
  Clock,
  Warehouse,
  CarFront,
  User,
  Wrench,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';

export const BookingView: React.FC = () => {
  const {
    serviceBays,
    serviceCatalog,
    bookings,
    checkSlotAvailability,
    bookSingleService,
    selectedDate: globalDate
  } = useApp();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [serviceId, setServiceId] = useState(serviceCatalog[0]?.id || '');
  const [bayId, setBayId] = useState(serviceBays[0]?.id || '');
  const [bookingDate, setBookingDate] = useState(globalDate || new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:00 AM');

  // Availability Check feedback state
  const [availabilityStatus, setAvailabilityStatus] = useState<{
    checked: boolean;
    isAvailable: boolean;
    message: string;
  } | null>(null);

  // Submission feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    bookingRef?: string;
  } | null>(null);

  // Time Slots list
  const availableTimeSlots = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM'
  ];

  const handleCheckAvailability = () => {
    setSubmitResult(null);
    const selectedBay = serviceBays.find(b => b.id === bayId) || serviceBays[0];
    const isFree = checkSlotAvailability({ bayId, date: bookingDate, timeSlot });

    if (isFree) {
      setAvailabilityStatus({
        checked: true,
        isAvailable: true,
        message: `Bay #${selectedBay.bayNumber} on ${bookingDate} @ ${timeSlot} is AVAILABLE and ready for reservation.`
      });
    } else {
      setAvailabilityStatus({
        checked: true,
        isAvailable: false,
        message: `Bay #${selectedBay.bayNumber} on ${bookingDate} @ ${timeSlot} is ALREADY OCCUPIED. Please choose another bay or time.`
      });
    }
  };

  const handleReset = () => {
    setCustomerName('');
    setVehiclePlate('');
    setVehicleModel('');
    setServiceId(serviceCatalog[0]?.id || '');
    setBayId(serviceBays[0]?.id || '');
    setTimeSlot('10:00 AM');
    setAvailabilityStatus(null);
    setSubmitResult(null);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !vehiclePlate.trim() || !vehicleModel.trim()) {
      setSubmitResult({
        success: false,
        message: 'Please provide Customer Name, Vehicle Number, and Vehicle Model.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const result = await bookSingleService({
        customerName: customerName.trim(),
        vehiclePlate: vehiclePlate.trim(),
        vehicleModel: vehicleModel.trim(),
        serviceId,
        bayId,
        date: bookingDate,
        timeSlot
      });

      setSubmitResult({
        success: result.success,
        message: result.message,
        bookingRef: result.booking?.bookingRef
      });

      if (result.success) {
        setCustomerName('');
        setVehiclePlate('');
        setVehicleModel('');
        setAvailabilityStatus(null);
      }
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: err.message || 'An unexpected booking error occurred.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-[#0b132b]">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
              Customer Booking
            </span>
            <span className="text-xs text-slate-500 font-mono">Mutual Exclusion Guaranteed</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0b132b] mt-1.5 tracking-tight flex items-center gap-2.5">
            <CalendarPlus className="w-6 h-6 text-sky-600" />
            Book Service Slot
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Fill out the form below to book a service bay slot. All confirmed bookings are protected by a <strong>Mutex Lock</strong> to eliminate race conditions and double-bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="w-4 h-4 text-sky-600" />
          <span>Reset Form</span>
        </button>
      </div>

      {/* Booking Form Card */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleConfirmBooking} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Customer Name */}
            <div>
              <label className="block text-xs font-bold text-[#0b132b] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sky-600" />
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium bg-sky-50/40 border border-sky-200 rounded-xl text-[#0b132b] placeholder-slate-400 focus:bg-white focus:border-sky-500 outline-hidden transition-all"
                required
              />
            </div>

            {/* 2. Vehicle Number */}
            <div>
              <label className="block text-xs font-bold text-[#0b132b] mb-1.5 flex items-center gap-1.5">
                <CarFront className="w-3.5 h-3.5 text-sky-600" />
                Vehicle Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. MH-12-AB-1234"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium uppercase font-mono bg-sky-50/40 border border-sky-200 rounded-xl text-[#0b132b] placeholder-slate-400 focus:bg-white focus:border-sky-500 outline-hidden transition-all"
                required
              />
            </div>

            {/* 3. Vehicle Model */}
            <div>
              <label className="block text-xs font-bold text-[#0b132b] mb-1.5 flex items-center gap-1.5">
                <CarFront className="w-3.5 h-3.5 text-sky-600" />
                Vehicle Model <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Honda Civic or Hyundai Creta"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium bg-sky-50/40 border border-sky-200 rounded-xl text-[#0b132b] placeholder-slate-400 focus:bg-white focus:border-sky-500 outline-hidden transition-all"
                required
              />
            </div>

            {/* 4. Service Type */}
            <div>
              <label className="block text-xs font-bold text-[#0b132b] mb-1.5 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-sky-600" />
                Service Type
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-sky-50/40 border border-sky-200 rounded-xl text-[#0b132b] focus:bg-white focus:border-sky-500 outline-hidden cursor-pointer"
              >
                {serviceCatalog.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} &bull; ${srv.price} ({srv.durationMinutes} min)
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Service Bay */}
            <div>
              <label className="block text-xs font-bold text-[#0b132b] mb-1.5 flex items-center gap-1.5">
                <Warehouse className="w-3.5 h-3.5 text-sky-600" />
                Service Bay
              </label>
              <select
                value={bayId}
                onChange={(e) => setBayId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-sky-50/40 border border-sky-200 rounded-xl text-[#0b132b] focus:bg-white focus:border-sky-500 outline-hidden cursor-pointer"
              >
                {serviceBays.map((bay) => (
                  <option key={bay.id} value={bay.id}>
                    Bay #{bay.bayNumber} &bull; {bay.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Booking Date */}
            <div>
              <label className="block text-xs font-bold text-[#0b132b] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                Booking Date
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium bg-sky-50/40 border border-sky-200 rounded-xl text-[#0b132b] focus:bg-white focus:border-sky-500 outline-hidden cursor-pointer"
                required
              />
            </div>

            {/* 7. Time Slot */}
            <div>
              <label className="block text-xs font-bold text-[#0b132b] mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-sky-50/40 border border-sky-200 rounded-xl text-[#0b132b] focus:bg-white focus:border-sky-500 outline-hidden cursor-pointer"
              >
                {availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Availability Feedback Banner */}
          {availabilityStatus && (
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                availabilityStatus.isAvailable
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              {availabilityStatus.isAvailable ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <div className="text-xs font-bold leading-relaxed">{availabilityStatus.message}</div>
            </div>
          )}

          {/* Submission Result Banner */}
          {submitResult && (
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                submitResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              {submitResult.success ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <div className="text-xs font-bold leading-relaxed">
                {submitResult.message}
                {submitResult.bookingRef && (
                  <span className="block font-mono text-[11px] text-emerald-800 mt-0.5">
                    Reservation Reference: {submitResult.bookingRef}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons: Check Availability | Confirm Booking | Cancel */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleCheckAvailability}
              className="w-full sm:w-auto px-5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold rounded-xl border border-sky-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span>Check Availability</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:bg-sky-300 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Reserving with Mutex...' : 'Confirm Booking'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-4 py-2.5 text-slate-500 hover:text-slate-800 text-xs font-medium rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Confirmed Bookings Table */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-sky-600" />
            Confirmed Bookings Registry
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800">
            {bookings.length} Total Bookings
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-[#0b132b]">No Bookings Available</h3>
            <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              No service slots have been booked yet. Fill out the reservation form above to book a service bay.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sky-100 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-sky-50/40">
                  <th className="py-2.5 px-3">Booking Ref</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Vehicle</th>
                  <th className="py-2.5 px-3">Service Bay</th>
                  <th className="py-2.5 px-3">Date &amp; Time</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Thread ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100/50">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-sky-50/30 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-sky-800">
                      {booking.bookingRef}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#0b132b]">
                      {booking.customerName}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-mono text-slate-800 font-bold">{booking.vehiclePlate}</div>
                      <div className="text-[10px] text-slate-400">{booking.vehicleModel}</div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">
                      Bay #{booking.bayNumber}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium">
                      {booking.date} @ {booking.timeSlot}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                      {booking.threadId || 'Direct'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
