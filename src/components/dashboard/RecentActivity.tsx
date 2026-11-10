import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityEvent } from '../../types';
import {
  Activity,
  CalendarCheck2,
  XCircle,
  Warehouse,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Radio
} from 'lucide-react';

export const RecentActivity: React.FC = () => {
  const { activityLogs } = useApp();

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'booking_created':
        return <CalendarCheck2 className="w-4 h-4 text-blue-600" />;
      case 'booking_cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'bay_allocated':
        return <Warehouse className="w-4 h-4 text-indigo-600" />;
      case 'service_completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'booking_conflict':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'resource_locked':
        return <Lock className="w-4 h-4 text-amber-600" />;
      case 'resource_unlocked':
        return <Unlock className="w-4 h-4 text-slate-500" />;
      default:
        return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          Live System Activity
        </h2>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span>Real-time</span>
        </div>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto max-h-[380px] space-y-3 pr-1">
        {activityLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
            <p className="text-xs font-semibold text-slate-600">No System Events Recorded</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
              Events will dynamically populate as booking requests, mutex lock acquisitions, and service completions occur.
            </p>
          </div>
        ) : (
          activityLogs.map((event) => (
            <div
              key={event.id}
              className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-white border border-slate-200 shrink-0 shadow-2xs">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-slate-900 truncate">
                      {event.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5 leading-snug break-words">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
