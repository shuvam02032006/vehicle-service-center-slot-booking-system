import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, ServiceStatusType } from '../../types';
import {
  Calendar,
  Search,
  Filter,
  ArrowUpDown,
  CarFront,
  Clock,
  Warehouse,
  CheckCircle2,
  PlayCircle,
  XCircle,
  MoreVertical,
  CalendarPlus,
  AlertCircle
} from 'lucide-react';

export const ServiceSchedule: React.FC = () => {
  const {
    bookings,
    selectedDate,
    setSelectedDate,
    searchQuery,
    updateServiceStatus,
    cancelBooking,
    setIsBookingModalOpen
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [bayFilter, setBayFilter] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [sortField, setSortField] = useState<'timeSlot' | 'vehiclePlate' | 'bayNumber' | 'status' | 'date' | 'customerName'>('timeSlot');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);

  // Filter and sort bookings dynamically
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        // Date match
        if (b.date !== selectedDate) return false;

        // Status match
        if (statusFilter !== 'all' && b.status !== statusFilter) return false;

        // Bay match
        if (bayFilter !== 'all' && b.bayId !== bayFilter) return false;

        // Search match (plate, customer, service, ref)
        const query = (localSearch || searchQuery).toLowerCase().trim();
        if (query) {
          const matchPlate = b.vehiclePlate.toLowerCase().includes(query);
          const matchModel = b.vehicleModel.toLowerCase().includes(query);
          const matchService = b.serviceName.toLowerCase().includes(query);
          const matchRef = b.bookingRef.toLowerCase().includes(query);
          const matchCustomer = b.customerName.toLowerCase().includes(query);
          if (!matchPlate && !matchModel && !matchService && !matchRef && !matchCustomer) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
        }
        return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [bookings, selectedDate, statusFilter, bayFilter, localSearch, searchQuery, sortField, sortAsc]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getStatusBadge = (status: ServiceStatusType) => {
    switch (status) {
      case 'scheduled':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Scheduled</span>;
      case 'in-bay':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">In Bay</span>;
      case 'in-progress':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse">In Progress</span>;
      case 'quality-check':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">Quality Check</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 line-through">Cancelled</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Service Schedule
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live bookings dynamically managed with OS mutual exclusion locking
            </p>
          </div>

          {/* Controls: Date Picker, Status Filter, Search */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Date Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs font-semibold text-slate-700 outline-hidden bg-transparent cursor-pointer"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-medium bg-white border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-slate-700 outline-hidden shadow-2xs cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-bay">In Bay</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Local Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter schedule..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 outline-hidden focus:border-blue-500 shadow-2xs w-36 sm:w-44"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th
                onClick={() => toggleSort('timeSlot')}
                className="py-3.5 px-4 cursor-pointer hover:text-blue-600 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Time Slot</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('date')}
                className="py-3.5 px-4 cursor-pointer hover:text-blue-600 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Booking Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('vehiclePlate')}
                className="py-3.5 px-4 cursor-pointer hover:text-blue-600 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Vehicle Details</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('customerName')}
                className="py-3.5 px-4 cursor-pointer hover:text-blue-600 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Customer Details</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">Service Type</th>
              <th
                onClick={() => toggleSort('bayNumber')}
                className="py-3.5 px-4 cursor-pointer hover:text-blue-600 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Service Bay</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('status')}
                className="py-3.5 px-4 cursor-pointer hover:text-blue-600 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Booking Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 px-4 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">No Bookings Scheduled</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      No service slots reserved for {selectedDate}. Slots are dynamically populated as reservations are made.
                    </p>
                    <button
                      onClick={() => setIsBookingModalOpen(true)}
                      className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      Book a Slot Now
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Time Slot Column */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{booking.timeSlot}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({booking.durationMinutes}m)</span>
                    </div>
                  </td>

                  {/* Booking Date Column */}
                  <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                    {booking.date}
                  </td>

                  {/* Vehicle Details Column */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <CarFront className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 font-mono tracking-wide">
                          {booking.vehiclePlate}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-36">
                          {booking.vehicleModel}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Customer Details Column */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{booking.customerName}</div>
                    {booking.customerUsername && (
                      <div className="text-[10px] text-slate-400 font-mono">@{booking.customerUsername}</div>
                    )}
                  </td>

                  {/* Service Type Column */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{booking.serviceName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Ref: {booking.bookingRef}</div>
                  </td>

                  {/* Service Bay Column */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                      <Warehouse className="w-3.5 h-3.5 text-blue-600" />
                      <span>Bay #{booking.bayNumber}</span>
                    </div>
                  </td>

                  {/* Booking Status Column */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>

                  {/* Action Column */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      {booking.status === 'scheduled' && (
                        <button
                          onClick={() => updateServiceStatus(booking.id, 'in-bay')}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold transition-colors"
                          title="Move vehicle to bay"
                        >
                          Check-In
                        </button>
                      )}

                      {booking.status === 'in-bay' && (
                        <button
                          onClick={() => updateServiceStatus(booking.id, 'in-progress')}
                          className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-xs font-semibold transition-colors flex items-center gap-1"
                          title="Start service work"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          Start
                        </button>
                      )}

                      {booking.status === 'in-progress' && (
                        <button
                          onClick={() => updateServiceStatus(booking.id, 'completed')}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-semibold transition-colors flex items-center gap-1"
                          title="Complete service"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Complete
                        </button>
                      )}

                      {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Cancel booking ${booking.bookingRef} for ${booking.vehiclePlate}?`)) {
                              cancelBooking(booking.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                          title="Cancel Booking"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Summary */}
      {filteredBookings.length > 0 && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredBookings.length} dynamic booking(s) for {selectedDate}</span>
          <span className="font-mono text-[11px] text-slate-400">All transactions synchronized via Mutex</span>
        </div>
      )}
    </div>
  );
};
