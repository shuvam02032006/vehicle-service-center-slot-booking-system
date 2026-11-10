import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCatalogItem } from '../../types';
import {
  Wrench,
  Plus,
  Trash2,
  Clock,
  Warehouse,
  CheckCircle2,
  X,
  RotateCcw
} from 'lucide-react';

export const ServiceManagementView: React.FC = () => {
  const {
    serviceCatalog,
    addServiceOffering,
    toggleServiceActive,
    deleteServiceOffering,
    initializeFacilityServices
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCatalogItem['category']>('maintenance');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [price, setPrice] = useState(100);
  const [description, setDescription] = useState('');
  const [recommendedBayType, setRecommendedBayType] = useState('Hydraulic Post Lift');

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addServiceOffering({
      name: name.trim(),
      category,
      durationMinutes: Number(durationMinutes) || 60,
      price: Number(price) || 50,
      description: description.trim(),
      recommendedBayType: recommendedBayType.trim()
    });

    setName('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-600" />
              Service Offerings Catalog
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage automotive services, duration allocations, pricing, and required bay types
            </p>
          </div>

          <div className="flex items-center gap-2">
            {serviceCatalog.length === 0 && (
              <button
                onClick={initializeFacilityServices}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Load Standard Catalog</span>
              </button>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service Offering</span>
            </button>
          </div>
        </div>
      </div>

      {serviceCatalog.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <Wrench className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
          <h4 className="text-sm font-bold text-slate-800">No Services Configured</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Your facility does not have any active service offerings defined. Add your first service or initialize the standard catalog.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              + Create Service
            </button>
            <button
              onClick={initializeFacilityServices}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Load Standard Catalog
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {serviceCatalog.map((s) => (
            <div
              key={s.id}
              className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                s.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {s.name}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      {s.category}
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-blue-600 font-mono">
                    ${s.price}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {s.description}
                </p>

                <div className="mt-3.5 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duration: <strong className="text-slate-800">{s.durationMinutes} minutes</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Warehouse className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">Bay: <strong className="text-slate-800">{s.recommendedBayType}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => toggleServiceActive(s.id)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                    s.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {s.isActive ? 'Active' : 'Disabled'}
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Delete ${s.name}?`)) {
                      deleteServiceOffering(s.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Service Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                Add Service Offering
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brake Fluid Flush"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden font-medium"
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="diagnostics">Diagnostics</option>
                  <option value="repairs">Repairs</option>
                  <option value="inspection">Inspection</option>
                  <option value="detailing">Detailing</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed description of labor and parts..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
