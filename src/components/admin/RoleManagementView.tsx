import React from 'react';
import { useApp } from '../../context/AppContext';
import { ROLE_PERMISSIONS, ROLE_DISPLAY_NAMES } from '../../utils/permissions';
import { UserRole } from '../../types';
import { ShieldCheck, Users, Check, Lock } from 'lucide-react';

export const RoleManagementView: React.FC = () => {
  const { users } = useApp();

  const roles: UserRole[] = [
    'admin',
    'service-manager',
    'service-advisor',
    'service-technician',
    'customer'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          Role-Based Access Control (RBAC) Matrix
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          System authorization policies governing routes, views, and database operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roles.map((role) => {
          const count = users.filter(u => u.role === role).length;
          const permissions = ROLE_PERMISSIONS[role];

          return (
            <div
              key={role}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {ROLE_DISPLAY_NAMES[role]}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Role ID: {role}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {count} User(s)
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Permitted Views &amp; Features ({permissions.length})
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {permissions.map((perm) => (
                      <div key={perm} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="capitalize">{perm.replace(/-/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3 text-slate-400" />
                  Protected
                </span>
                <span>Active Policy</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
