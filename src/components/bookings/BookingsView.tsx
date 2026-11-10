import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, ServiceStatusType } from '../../types';
import {
  CalendarCheck2,
  Search,
  Filter,
  CarFront,
  Clock,
  Warehouse,
  CheckCircle2,
  PlayCircle,
  XCircle,
  CalendarPlus,
  Cpu,
  ChevronDown
} from 'lucide-react';

export const BookingsView: React.FC = () => {
  const {
    bookings,
    searchQuery,
    updateServiceStatus,
    cancelBooking,
    setIsBookingModalOpen
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;

      const q = (searchTerm || searchQuery).toLowerCase().trim();
      if (q) {
        return (
          b.vehiclePlate.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.serviceName.toLowerCase().includes(q) ||
          b.bookingRef.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [bookings, statusFilter, searchTerm, searchQuery]);

  const getStatusBadge = (status: ServiceStatusType) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Scheduled</span>;
      case 'in-bay':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">In Bay</span>;
      case 'in-progress':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse">In Progress</span>;
      case 'quality-check':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">Quality Check</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 line-through">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Search */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck2 className="w-5 h-5 text-blue-600" />
              All Service Bookings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive list of slot reservations dynamically generated through OS Mutex engine
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 outline-hidden cursor-pointer"
            >
              <option value="all">All Statuses ({bookings.length})</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-bay">In Bay</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search booking ref, customer, plate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 outline-hidden focus:border-blue-500 w-52 sm:w-64"
              />
            </div>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>New Booking</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table or Empty State */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Bookings Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              There are currently no bookings matching your filter criteria. Bookings will appear here dynamically.
            </p>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs inline-flex items-center gap-2"
            >
              <CalendarPlus className="w-4 h-4" />
              Create First Booking
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Ref &amp; Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Bay Allocation</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Ref & Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-blue-600 font-mono">{b.bookingRef}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{b.date} @ {b.timeSlot}</span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{b.customerName}</div>
                      {b.customerUsername && (
                        <div className="text-[11px] text-slate-400 font-mono">@{b.customerUsername}</div>
                      )}
                    </td>

                    {/* Vehicle */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                        <CarFront className="w-3.5 h-3.5 text-blue-600" />
                        {b.vehiclePlate}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-36">
                        {b.vehicleModel}
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{b.serviceName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">${b.servicePrice} &bull; {b.durationMinutes}m</div>
                    </td>

                    {/* Bay */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                        <Warehouse className="w-3.5 h-3.5 text-blue-600" />
                        <span>Bay #{b.bayNumber}</span>
                      </div>
                      {b.threadId && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-blue-500" />
                          <span>{b.threadId}</span>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(b.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {b.status === 'scheduled' && (
                          <button
                            onClick={() => updateServiceStatus(b.id, 'in-bay')}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold"
                          >
                            Check-In
                          </button>
                        )}
                        {b.status === 'in-bay' && (
                          <button
                            onClick={() => updateServiceStatus(b.id, 'in-progress')}
                            className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-xs font-semibold flex items-center gap-1"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            Start Work
                          </button>
                        )}
                        {b.status === 'in-progress' && (
                          <button
                            onClick={() => updateServiceStatus(b.id, 'completed')}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-semibold flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Finish
                          </button>
                        )}
                        {b.status !== 'completed' && b.status !== 'cancelled' && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Cancel booking ${b.bookingRef}?`)) {
                                cancelBooking(b.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                            title="Cancel booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
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
