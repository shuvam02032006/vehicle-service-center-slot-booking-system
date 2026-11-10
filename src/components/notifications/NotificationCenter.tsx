import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Warehouse,
  Clock,
  Trash2,
  CheckCheck,
  Filter
} from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    markNotificationsAsRead,
    clearNotifications
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifications = useMemo(() => {
    if (filterType === 'all') return notifications;
    return notifications.filter(n => n.type === filterType);
  }, [notifications, filterType]);

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'confirmation':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'conflict':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'completion':
        return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'bay-status':
        return <Warehouse className="w-5 h-5 text-indigo-500" />;
      default:
        return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Notifications Center
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              System alerts, booking confirmations, and OS mutex conflict logs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 outline-hidden"
            >
              <option value="all">All Notifications ({notifications.length})</option>
              <option value="confirmation">Confirmations</option>
              <option value="conflict">Mutex Conflicts</option>
              <option value="completion">Completions</option>
              <option value="bay-status">Bay Telemetry</option>
              <option value="system">System Alerts</option>
            </select>

            <button
              onClick={markNotificationsAsRead}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark Read</span>
            </button>

            <button
              onClick={clearNotifications}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
            <h3 className="text-sm font-bold text-slate-800">No Notifications</h3>
            <p className="text-xs text-slate-500 mt-1">
              Notifications will appear as booking events, mutex locks, and conflicts occur.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4.5 hover:bg-slate-50/80 transition-colors flex items-start gap-4 ${
                !notif.read ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-slate-900 truncate">
                    {notif.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
