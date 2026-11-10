import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TIME_SLOTS } from '../../utils/facilityCatalog';
import {
  BarChart3,
  TrendingUp,
  Warehouse,
  PieChart,
  Clock,
  ShieldCheck,
  CalendarCheck2
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { bookings, serviceBays, serviceCatalog, conflictsPrevented } = useApp();

  // 1. Service Demand Breakdown (Actual counts per service)
  const serviceDemandData = useMemo(() => {
    return serviceCatalog.map((service) => {
      const count = bookings.filter(b => b.serviceId === service.id && b.status !== 'cancelled').length;
      return {
        name: service.name,
        count,
        revenue: count * service.price
      };
    });
  }, [bookings, serviceCatalog]);

  const maxServiceCount = Math.max(1, ...serviceDemandData.map(d => d.count));

  // 2. Service Bay Utilization (Actual bookings per bay)
  const bayUtilizationData = useMemo(() => {
    return serviceBays.map((bay) => {
      const count = bookings.filter(b => b.bayId === bay.id && b.status !== 'cancelled').length;
      return {
        bayNumber: bay.bayNumber,
        name: bay.name,
        count,
        percentage: Math.min(100, Math.round((count / (TIME_SLOTS.length || 1)) * 100))
      };
    });
  }, [bookings, serviceBays]);

  // 3. Peak Booking Periods (Actual counts per hour)
  const peakTimeData = useMemo(() => {
    return TIME_SLOTS.map((slot) => {
      const count = bookings.filter(b => b.timeSlot === slot && b.status !== 'cancelled').length;
      return {
        slot,
        count
      };
    });
  }, [bookings]);

  const maxTimeCount = Math.max(1, ...peakTimeData.map(d => d.count));

  // 4. Booking Status Breakdown
  const statusCounts = useMemo(() => {
    const scheduled = bookings.filter(b => b.status === 'scheduled').length;
    const inBay = bookings.filter(b => b.status === 'in-bay').length;
    const inProgress = bookings.filter(b => b.status === 'in-progress').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    return { scheduled, inBay, inProgress, completed, cancelled, total: bookings.length };
  }, [bookings]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Service Center Performance &amp; Analytics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dynamically calculated metrics derived entirely from live booking transactions
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-lg border border-emerald-200 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Race Conditions Blocked: <strong>{conflictsPrevented}</strong></span>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Peak Booking Periods */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Peak Booking Periods
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Hourly Volume</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-200">
            {peakTimeData.map((item) => {
              const heightPercent = Math.max(8, (item.count / maxTimeCount) * 100);
              return (
                <div key={item.slot} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[28px] rounded-t-md transition-all duration-500 ${
                      item.count > 0 ? 'bg-blue-600 group-hover:bg-blue-500' : 'bg-slate-100'
                    }`}
                  />
                  <span className="text-[9px] font-mono text-slate-400 truncate max-w-10">
                    {item.slot.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-[11px] text-slate-400 text-center font-mono">
            {bookings.length === 0 ? 'No booking activity recorded yet' : `Peak volume calculated across ${bookings.length} reservations`}
          </div>
        </div>

        {/* Chart 2: Service Bay Utilization */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Warehouse className="w-4 h-4 text-blue-600" />
              Service Bay Utilization
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Capacity %</span>
          </div>

          <div className="space-y-3.5">
            {bayUtilizationData.map((bay) => (
              <div key={bay.bayNumber} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    Bay #{bay.bayNumber}: {bay.name}
                  </span>
                  <span className="font-mono font-bold text-blue-600">
                    {bay.count} jobs ({bay.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    style={{ width: `${Math.max(2, bay.percentage)}%` }}
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Service Demand by Category */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Service Demand &amp; Offerings
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Bookings</span>
          </div>

          <div className="space-y-3">
            {serviceDemandData.map((srv) => (
              <div key={srv.name} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div className="min-w-0 pr-3">
                  <div className="font-semibold text-slate-800 truncate">{srv.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Revenue: ${srv.revenue}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold font-mono text-xs shrink-0">
                  {srv.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Booking Status Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-blue-600" />
              Booking Status Distribution
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Total: {statusCounts.total}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <span className="text-2xl font-bold font-mono text-blue-700">{statusCounts.scheduled}</span>
              <p className="text-[11px] font-semibold text-blue-600 mt-0.5">Scheduled</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-2xl font-bold font-mono text-amber-700">{statusCounts.inBay}</span>
              <p className="text-[11px] font-semibold text-amber-600 mt-0.5">In Bay</p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
              <span className="text-2xl font-bold font-mono text-indigo-700">{statusCounts.inProgress}</span>
              <p className="text-[11px] font-semibold text-indigo-600 mt-0.5">In Progress</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-2xl font-bold font-mono text-emerald-700">{statusCounts.completed}</span>
              <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">Completed</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-2xl font-bold font-mono text-slate-600">{statusCounts.cancelled}</span>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Cancelled</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-center">
              <span className="text-2xl font-bold font-mono text-purple-700">{conflictsPrevented}</span>
              <p className="text-[11px] font-semibold text-purple-600 mt-0.5">Race Blocks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
