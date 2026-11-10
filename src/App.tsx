import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { HomeView } from './components/views/HomeView';
import { BookingView } from './components/views/BookingView';
import { MutexSimulationView } from './components/views/MutexSimulationView';
import { NotificationView } from './components/views/NotificationView';
import { ReceiptDownloadView } from './components/views/ReceiptDownloadView';
import { ShieldCheck } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
      case 'dashboard':
        return <HomeView />;

      case 'booking':
      case 'book-service':
        return <BookingView />;

      case 'mutex-simulation':
      case 'with-mutex':
      case 'without-mutex':
        return <MutexSimulationView />;

      case 'receipt-download':
      case 'receipts':
        return <ReceiptDownloadView />;

      case 'notification':
      case 'notifications':
        return <NotificationView />;

      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0b132b] flex">
      {/* 4-Item Fixed Sidebar Navigation (Light Sky Blue) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[205px] transition-all duration-300">
        <TopNav onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto bg-white">
          {renderActiveView()}
        </main>

        {/* Clean Modern Footer */}
        <footer className="border-t border-slate-200 bg-slate-50/60 py-4 px-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#0b132b]">AutoPulse Service Center</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Mutual Exclusion Protected Reservation System
              </span>
            </div>

            <div className="text-slate-400 font-medium text-[11px] text-center sm:text-right">
              Automated Slot Booking Platform &bull; Real-time Concurrency Control
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
