import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CustomerProfileView: React.FC = () => {
  const { currentUser, updateCustomerProfile } = useApp();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [address, setAddress] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile(fullName, address);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          My Customer Profile
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your personal details and service address
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        {isSaved && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile details updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Username (Account Identifier)</label>
            <input
              type="text"
              disabled
              value={`@${currentUser?.username || ''}`}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 outline-hidden cursor-not-allowed font-mono font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500 font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Service / Delivery Address</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your street address, city, zip code..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Verified Customer Account</span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
