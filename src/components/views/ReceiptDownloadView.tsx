import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { generateBookingReceiptPdf } from '../../utils/generateReceiptPdf';
import {
  FileDown,
  Receipt,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  CarFront,
  Wrench,
  Lock,
  Download,
  Eye,
  X,
  CreditCard,
  ShieldCheck,
  CalendarPlus
} from 'lucide-react';

export const ReceiptDownloadView: React.FC = () => {
  const { bookings, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Booking | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter to valid confirmed/completed bookings (excluding cancelled ones)
  const validBookings = useMemo(() => {
    return bookings.filter(b => b.status !== 'cancelled');
  }, [bookings]);

  // Search filtering
  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) return validBookings;
    const q = searchQuery.toLowerCase();
    return validBookings.filter(b =>
      b.customerName.toLowerCase().includes(q) ||
      b.vehiclePlate.toLowerCase().includes(q) ||
      b.vehicleModel.toLowerCase().includes(q) ||
      b.serviceName.toLowerCase().includes(q) ||
      b.bookingRef.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q)
    );
  }, [validBookings, searchQuery]);

  const handleDownloadPdf = (booking: Booking) => {
    setDownloadingId(booking.id);
    try {
      generateBookingReceiptPdf(booking);
    } catch (err) {
      console.error('Failed to generate PDF receipt', err);
    } finally {
      setTimeout(() => setDownloadingId(null), 600);
    }
  };

  return (
    <div className="space-y-6 text-[#0b132b]">
      {/* 1. Header Card */}
      <div className="bg-gradient-to-r from-sky-50 via-blue-50/70 to-slate-50 border border-sky-100 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1.5">
              <FileDown className="w-3.5 h-3.5 text-blue-700" />
              <span>Official Invoices & Receipts</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {validBookings.length} {validBookings.length === 1 ? 'Receipt' : 'Receipts'} Available
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b132b] tracking-tight">
            Booking <span className="text-blue-600">Receipt Download</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Download verified PDF service receipts with atomic Mutex reservation certification.
          </p>
        </div>

        {/* Quick action button to book service */}
        <button
          onClick={() => setActiveTab('booking')}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* 2. Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by customer, plate, or ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs placeholder:text-slate-400"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>All receipts are digitally validated & signed</span>
        </div>
      </div>

      {/* 3. Receipts List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mx-auto mb-4">
            <Receipt className="w-8 h-8 text-sky-600" />
          </div>
          <h3 className="text-base font-extrabold text-[#0b132b]">
            {searchQuery ? 'No matching receipts found' : 'No Booking Receipts Recorded Yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
            {searchQuery
              ? `No records match "${searchQuery}". Try searching with another keyword.`
              : 'Once a customer books a vehicle service slot through the Booking page, verified receipts with itemized pricing and Mutex authorization will be displayed here.'}
          </p>

          {!searchQuery && (
            <div className="mt-5">
              <button
                onClick={() => setActiveTab('booking')}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Book Service Now</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBookings.map((booking) => {
            const receiptNumber = `RCP-${booking.date.replace(/-/g, '')}-${(booking.bookingRef || booking.id.slice(0, 6)).toUpperCase()}`;
            const price = booking.servicePrice > 0 ? booking.servicePrice : 85.00;
            const isDownloading = downloadingId === booking.id;

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-sky-300 transition-all p-5 shadow-xs flex flex-col justify-between group hover:shadow-md"
              >
                <div>
                  {/* Top Header of Card */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Receipt No.
                      </span>
                      <span className="font-mono text-xs font-bold text-sky-700 block">
                        {receiptNumber}
                      </span>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>PAID</span>
                    </span>
                  </div>

                  {/* Customer & Vehicle Info */}
                  <div className="mt-3.5 space-y-2">
                    <div>
                      <span className="text-[11px] text-slate-500 font-medium block">
                        Customer
                      </span>
                      <span className="text-sm font-extrabold text-[#0b132b] block truncate">
                        {booking.customerName}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100/90 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <CarFront className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="truncate">{booking.vehicleModel}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 pl-5">
                        Plate: {booking.vehiclePlate}
                      </div>
                    </div>

                    {/* Service & Bay */}
                    <div className="space-y-1 text-xs pt-1">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Wrench className="w-3.5 h-3.5 text-slate-400" />
                          <span>Service</span>
                        </span>
                        <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                          {booking.serviceName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Lock className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Service Bay</span>
                        </span>
                        <span className="font-bold text-blue-700">
                          Bay #{booking.bayNumber}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Date & Time</span>
                        </span>
                        <span className="font-medium text-slate-700 text-[11px]">
                          {booking.date} @ {booking.timeSlot}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-extrabold">
                        <span className="text-xs text-slate-700">Total Charged</span>
                        <span className="text-sm text-sky-700 font-mono">
                          ${(price + 15 + (price + 15) * 0.08).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedReceipt(booking)}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:text-sky-700 hover:border-sky-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-white"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPdf(booking)}
                    disabled={isDownloading}
                    className="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloading ? 'Downloading...' : 'PDF'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Modal: View Official Receipt Preview */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Modal Content */}
            <div className="space-y-5">
              {/* Receipt Header */}
              <div className="text-center pb-4 border-b border-slate-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 mb-2 border border-sky-100">
                  <FileDown className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-black text-[#0b132b]">
                  AutoPulse Service Center
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Official Service Slot Booking Receipt
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>Mutex Exclusive Allocation Verified</span>
                </div>
              </div>

              {/* Summary Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Receipt Number
                  </span>
                  <span className="font-mono font-bold text-sky-800">
                    RCP-{selectedReceipt.date.replace(/-/g, '')}-{(selectedReceipt.bookingRef || selectedReceipt.id.slice(0, 6)).toUpperCase()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Booking Reference
                  </span>
                  <span className="font-mono font-bold text-slate-700">
                    {selectedReceipt.bookingRef}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Customer Name
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedReceipt.customerName}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Vehicle
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedReceipt.vehicleModel} ({selectedReceipt.vehiclePlate})
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Service Bay
                  </span>
                  <span className="font-bold text-blue-700">
                    Bay #{selectedReceipt.bayNumber}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Date & Time
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedReceipt.date} @ {selectedReceipt.timeSlot}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs border-t border-b border-slate-100 py-3">
                <div className="flex justify-between text-slate-600">
                  <span>{selectedReceipt.serviceName}</span>
                  <span className="font-mono font-semibold">
                    ${(selectedReceipt.servicePrice > 0 ? selectedReceipt.servicePrice : 85.00).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Service Bay Facility Allocation</span>
                  <span className="font-mono font-semibold">$15.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>VAT / Local Tax (8%)</span>
                  <span className="font-mono font-semibold">
                    ${(((selectedReceipt.servicePrice > 0 ? selectedReceipt.servicePrice : 85.00) + 15) * 0.08).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-black text-sm text-[#0b132b] pt-1 border-t border-slate-100">
                  <span>Total Amount Paid</span>
                  <span className="text-sky-700 font-mono">
                    ${(((selectedReceipt.servicePrice > 0 ? selectedReceipt.servicePrice : 85.00) + 15) * 1.08).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Status Pill */}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Payment Status: Complete</span>
                </div>
                <span className="font-mono text-emerald-700 font-bold">PAID</span>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    handleDownloadPdf(selectedReceipt);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
