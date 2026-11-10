import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';
import {
  Home,
  Calendar,
  Layers,
  Bell,
  Lock,
  RotateCcw,
  FileDown
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    unreadNotificationCount,
    resetAllDataToCleanState
  } = useApp();

  // 5 specified options including Receipt Download in requested order
  const navItems: Array<{
    tab: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }> = [
    {
      tab: 'home',
      label: 'Home',
      icon: <Home className="w-4 h-4 shrink-0" />
    },
    {
      tab: 'booking',
      label: 'Booking',
      icon: <Calendar className="w-4 h-4 shrink-0" />
    },
    {
      tab: 'mutex-simulation',
      label: 'Mutex Simulation',
      icon: <Layers className="w-4 h-4 shrink-0" />
    },
    {
      tab: 'receipt-download',
      label: 'Receipt Download',
      icon: <FileDown className="w-4 h-4 shrink-0" />
    },
    {
      tab: 'notification',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4 shrink-0" />,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined
    }
  ];

  // Map legacy tabs cleanly to active item
  const normalizedActiveTab: NavigationTab = (() => {
    if (activeTab === 'home' || activeTab === 'dashboard') return 'home';
    if (activeTab === 'booking' || activeTab === 'book-service') return 'booking';
    if (activeTab === 'mutex-simulation' || activeTab === 'with-mutex' || activeTab === 'without-mutex') {
      return 'mutex-simulation';
    }
    if (activeTab === 'receipt-download' || activeTab === 'receipts') {
      return 'receipt-download';
    }
    if (activeTab === 'notification' || activeTab === 'notifications') return 'notification';
    return 'home';
  })();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Fixed Vertical Sidebar (Width: ~205px, Full 100vh height) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[205px] h-screen bg-gradient-to-b from-[#011438] via-[#031d4e] to-[#010e2c] text-white flex flex-col justify-between border-r border-[#0d276b]/60 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top & Navigation Section */}
        <div className="pt-4 px-3 flex flex-col items-center">
          {/* 1. AutoPulse Branding */}
          <div className="w-full flex flex-col items-center text-center">
            {/* Car & Wrench Logo */}
            <div className="h-10 flex items-center justify-center mb-0.5">
              <img
                src="/images/sidebar-logo.png"
                alt="AutoPulse Logo"
                className="max-h-9 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(56,189,248,0.7)]"
              />
            </div>

            {/* AutoPulse Title */}
            <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
              AutoPulse
            </h1>

            {/* Subtitle */}
            <div className="text-[10.5px] text-sky-100/90 font-medium tracking-wide mt-1 leading-tight text-center">
              Service Center
              <br />
              Booking System
            </div>

            {/* 2. Mutex Protection Badge (Neon Green Glow) */}
            <div className="mt-3.5 w-full py-1.5 px-2.5 rounded-xl bg-[#021d27]/90 border border-emerald-400 text-emerald-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_14px_rgba(52,211,153,0.35)] ring-1 ring-emerald-400/30">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="tracking-wide">Mutex Protected</span>
            </div>
          </div>

          {/* 3. Navigation Menu */}
          <div className="mt-4 w-full">
            <div className="text-[9.5px] font-extrabold uppercase tracking-widest text-sky-300/75 px-3 mb-1.5 select-none">
              DASHBOARD
            </div>
            <nav className="w-full space-y-1.5">
            {navItems.map((item) => {
              const isActive = normalizedActiveTab === item.tab;

              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    setActiveTab(item.tab);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1d63ed] via-[#2f80ed] to-[#38b6ff] text-white font-bold shadow-[0_0_16px_rgba(47,128,237,0.55)] ring-1 ring-white/20'
                      : 'text-slate-100/85 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`${
                        isActive ? 'text-white' : 'text-sky-300 group-hover:text-white'
                      } transition-colors shrink-0`}
                    >
                      {item.icon}
                    </span>
                    <span className="tracking-wide text-[12.5px] truncate font-medium">
                      {item.label}
                    </span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-white text-blue-700'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

        {/* Reset Option (At bottom, slightly above the workshop image) */}
        <div className="px-3 pb-2.5 mt-auto z-10 w-full">
          <button
            onClick={() => {
              if (window.confirm('Reset all bookings and simulation history back to clean state?')) {
                resetAllDataToCleanState();
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-sky-200 hover:text-white bg-[#02183d]/85 hover:bg-[#052b6b] border border-sky-400/30 hover:border-sky-400/70 shadow-sm transition-all cursor-pointer group backdrop-blur-xs"
            title="Reset system data to initial clean state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-400 group-hover:rotate-[-180deg] transition-transform duration-500 shrink-0" />
            <span className="truncate tracking-wide text-[11.5px] font-medium">Reset System</span>
          </button>
        </div>

        {/* 5. Bottom Background Image (Modern Workshop with visible "SERVICE CENTER" sign and cinematic lighting) */}
        <div className="relative w-full overflow-hidden shrink-0 mt-auto">
          {/* Smooth transition from navy sidebar into the garage image */}
          <div className="relative w-full">
            <img
              src="/images/sidebar-building-hd.png"
              alt="Service Center Workshop"
              className="w-full h-44 object-cover object-top"
            />
            {/* Top downward fade to blend seamlessly with sidebar navy gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#010e2c]/30 to-[#010e2c] pointer-events-none" />
          </div>
        </div>
      </aside>
    </>
  );
};
