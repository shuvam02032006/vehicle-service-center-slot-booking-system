import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Plus,
  Search,
  CalendarCheck2,
  X,
  User,
  CalendarPlus
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, bookings, addCustomerDirectly, setIsBookingModalOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New customer form state (No email, no phone)
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const q = searchTerm.toLowerCase();
      return (
        c.fullName.toLowerCase().includes(q) ||
        (c.username && c.username.toLowerCase().includes(q))
      );
    });
  }, [customers, searchTerm]);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    addCustomerDirectly({
      fullName: fullName.trim(),
      username: username.trim().toLowerCase() || fullName.trim().toLowerCase().replace(/\s+/g, '_'),
      address: address.trim()
    });

    setFullName('');
    setUsername('');
    setAddress('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Customer Registry
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dynamically populated clients registered via OS booking slots or direct intake
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 outline-hidden focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Cards Grid / Empty State */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Customers Registered</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Customers are dynamically added when reserving a service bay slot, or you can register a client directly.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              + Register Customer
            </button>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Reserve a Slot
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCustomers.map((customer) => {
            const customerBookings = bookings.filter(b => b.customerId === customer.id || b.customerName === customer.fullName);

            return (
              <div
                key={customer.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      {customer.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {customer.fullName}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {customer.username ? `@${customer.username}` : `Customer #${customer.id.replace('cust-', '').slice(-6)}`}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>

                {customer.address && (
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 truncate">
                    Address: {customer.address}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {customerBookings.length} booking(s)
                  </span>
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="text-blue-600 hover:text-blue-800 font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    Book Slot
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Register New Customer
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Username (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. alexj"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Delivery / Service Address (Optional)</label>
                <input
                  type="text"
                  placeholder="Street address, city, zip"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500"
                />
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
                  Register Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
