import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ROLE_DISPLAY_NAMES } from '../../utils/permissions';
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  ShieldCheck,
  X,
  User,
  CheckCircle2
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { users, registerUser, deleteUser, updateUserRole, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New user form state (No email, no phone)
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('customer');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      const q = searchTerm.toLowerCase().trim();
      if (q) {
        return (
          u.fullName.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [users, roleFilter, searchTerm]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) return;

    await registerUser({
      fullName: fullName.trim(),
      username: username.trim().toLowerCase(),
      role
    });

    setFullName('');
    setUsername('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              User &amp; Credential Management
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Administer system accounts, assign role permissions, and provision staff access
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 outline-hidden"
            >
              <option value="all">All Roles ({users.length})</option>
              <option value="admin">Admin</option>
              <option value="service-manager">Service Manager</option>
              <option value="service-advisor">Service Advisor</option>
              <option value="service-technician">Service Technician</option>
              <option value="customer">Customer</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 outline-hidden focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table / Empty State */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
            <h4 className="text-sm font-bold text-slate-800">No Users Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No registered user accounts match the current filter. Click below to provision a new user.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Provision User</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{u.fullName}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      @{u.username}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                        disabled={u.id === currentUser?.id}
                        className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 outline-hidden cursor-pointer disabled:opacity-50"
                      >
                        <option value="admin">Administrator</option>
                        <option value="service-manager">Service Manager</option>
                        <option value="service-advisor">Service Advisor</option>
                        <option value="service-technician">Service Technician</option>
                        <option value="customer">Customer</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {u.id !== currentUser?.id ? (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete user ${u.fullName}?`)) {
                              deleteUser(u.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                          Current Session
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Provision System User
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Connor"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Username *</label>
                <input
                  type="text"
                  required
                  placeholder="sconnor"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden font-semibold"
                >
                  <option value="admin">Administrator</option>
                  <option value="service-manager">Service Manager</option>
                  <option value="service-advisor">Service Advisor</option>
                  <option value="service-technician">Service Technician</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
