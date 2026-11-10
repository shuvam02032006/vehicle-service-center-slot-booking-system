import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CarFront,
  Plus,
  CalendarPlus,
  Trash2,
  X,
  CheckCircle2
} from 'lucide-react';

export const MyVehiclesView: React.FC = () => {
  const { currentUser, vehicles, addVehicleDirectly, setIsBookingModalOpen } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [licensePlate, setLicensePlate] = useState('');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'electric' | 'hybrid'>('petrol');

  const myVehicles = vehicles.filter(
    v => v.customerUsername?.toLowerCase() === currentUser?.username.toLowerCase() ||
         v.customerId === currentUser?.id
  );

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licensePlate.trim() || !make.trim() || !model.trim()) return;

    addVehicleDirectly({
      customerId: currentUser?.id || 'cust-user',
      customerUsername: currentUser?.username,
      make: make.trim(),
      model: model.trim(),
      year: Number(year) || new Date().getFullYear(),
      licensePlate: licensePlate.trim().toUpperCase(),
      fuelType
    });

    setMake('');
    setModel('');
    setLicensePlate('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CarFront className="w-5 h-5 text-blue-600" />
              My Registered Vehicles
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Vehicles linked to your profile for quick service slot reservations
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {myVehicles.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <CarFront className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
          <h4 className="text-sm font-bold text-slate-800">No Vehicles Registered</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You haven't linked any vehicles to your account yet. Add your car details for instant slot bookings.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add My Vehicle</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {myVehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CarFront className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 font-mono">
                        {v.licensePlate}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {v.year} {v.make} {v.model}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {v.fuelType}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">ID: {v.id}</span>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Book Service</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CarFront className="w-5 h-5 text-blue-600" />
                Add Vehicle to Profile
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">License Plate Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TX-492-ZPA"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono uppercase font-bold outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Make *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Honda"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Civic Sport"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Year</label>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Powertrain</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500"
                  >
                    <option value="petrol">Petrol / Gas</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric (EV)</option>
                  </select>
                </div>
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
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
