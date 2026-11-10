import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Plus, Check, X, ShieldCheck } from 'lucide-react';

export const SlotManagementView: React.FC = () => {
  const { slotConfigs, toggleSlotConfig, addSlotConfig, enabledSlots } = useApp();

  const [newSlotTime, setNewSlotTime] = useState('');

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotTime.trim()) return;
    addSlotConfig(newSlotTime.trim().toUpperCase());
    setNewSlotTime('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Service Slot Configuration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enable, disable, or create operating hour intervals for synchronized slot reservations
            </p>
          </div>

          <div className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200">
            {enabledSlots.length} Active Slots Enabled
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Slot List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Daily Operational Time Slots
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {slotConfigs.map((slotItem) => (
              <div
                key={slotItem.slot}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  slotItem.isEnabled
                    ? 'bg-white border-slate-200 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                    slotItem.isEnabled ? 'bg-blue-50 text-blue-700' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-sm text-slate-900 block">
                      {slotItem.slot}
                    </span>
                    <span className="text-[10px] text-slate-400">1-Hour Standard Window</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleSlotConfig(slotItem.slot)}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-colors ${
                    slotItem.isEnabled
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {slotItem.isEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Slot Tool */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 h-fit">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" />
            Add Custom Time Window
          </h3>

          <form onSubmit={handleAddSlot} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Time Slot Label</label>
              <input
                type="text"
                required
                placeholder="e.g. 06:00 PM or 07:00 AM"
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono outline-hidden focus:border-blue-500 font-bold"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Format: HH:00 AM/PM
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              Add Slot to Schedule
            </button>
          </form>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
            <span className="font-bold text-slate-800 block">Concurrency Impact:</span>
            Each enabled time slot across configured bays becomes an atomic resource protected by the OS Mutex pipeline.
          </div>
        </div>
      </div>
    </div>
  );
};
