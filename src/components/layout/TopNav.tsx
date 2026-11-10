import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Menu,
  Clock,
  CalendarPlus,
  ShieldCheck
} from 'lucide-react';

interface TopNavProps {
  onMenuToggle: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onMenuToggle }) => {
  const {
    activeTab,
    setActiveTab,
    unreadNotificationCount
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDateString, setCurrentDateString] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDateString(now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPageInfo = () => {
    switch (activeTab) {
      case 'home':
      case 'dashboard':
        return {
          title: 'Home',
          subtitle: 'A Vehicle Service Center Booking System'
        };
      case 'booking':
      case 'book-service':
        return {
          title: 'Service Slot Booking',
          subtitle: 'Reserve a vehicle maintenance slot'
        };
      case 'mutex-simulation':
      case 'with-mutex':
      case 'without-mutex':
        return {
          title: 'Mutex Concurrency Simulation',
          subtitle: 'Demonstrating synchronization vs race conditions'
        };
      case 'receipt-download':
      case 'receipts':
        return {
          title: 'Receipt Download',
          subtitle: 'View and download verified booking service receipts in PDF'
        };
      case 'notification':
      case 'notifications':
        return {
          title: 'System Notifications',
          subtitle: 'Real-time booking and reservation alerts'
        };
      default:
        return {
          title: 'Home',
          subtitle: 'A Vehicle Service Center Booking System'
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <header className="sticky top-0 z-30 h-20 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle & Page Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#0b132b] tracking-tight leading-tight">
            {pageInfo.title}
          </h1>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls matching the UI mockup */}
      <div className="flex items-center gap-3">
        {/* Date & Time Pill */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentDateString}</span>
          <span className="text-slate-300">|</span>
          <span className="font-mono text-slate-600 font-semibold">{currentTime}</span>
        </div>

        {/* Mutex Status Indicator Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Mutex Exclusive Active</span>
        </div>

        {/* Book Service Action Button */}
        <button
          onClick={() => setActiveTab('booking')}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Book Service</span>
        </button>

        {/* Notification Bell with Badge */}
        <button
          onClick={() => setActiveTab('notification')}
          className="relative p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="View notifications"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
