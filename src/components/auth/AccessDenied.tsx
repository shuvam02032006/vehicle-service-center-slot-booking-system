import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

interface AccessDeniedProps {
  attemptedTab?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ attemptedTab }) => {
  const { currentUser, setActiveTab } = useApp();

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-red-200 shadow-xl max-w-md w-full p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">Access Denied (403)</h2>
          <p className="text-xs text-slate-500 mt-1">
            Role-Based Authorization Invariant Violation
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 text-left space-y-1 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Current Role:</span>
            <span className="font-bold text-blue-600 uppercase">{currentUser?.role || 'Guest'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Restricted Route:</span>
            <span className="font-bold text-red-600">{attemptedTab || 'Unauthorized View'}</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Your authenticated role is not authorized to access or modify this resource. All navigation and database operations are strictly protected by role policies.
        </p>

        <button
          onClick={() => setActiveTab('dashboard')}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return to My Dashboard</span>
        </button>
      </div>
    </div>
  );
};
