import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CarFront,
  Plus,
  Search,
  Calendar,
  Fuel,
  Hash,
  X,
  CheckCircle2,
  CalendarPlus
} from 'lucide-react';

export const VehiclesView: React.FC = () => {
  const { vehicles, customers, bookings, addVehicleDirectly, setIsBookingModalOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New vehicle form
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [licensePlate, setLicensePlate] = useState('');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'electric' | 'hybrid'>('petrol');
  const [customerId, setCustomerId] = useState('');

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const q = searchTerm.toLowerCase();
      return (
        v.licensePlate.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q)
      );
    });
  }, [vehicles, searchTerm]);

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licensePlate.trim() || !make.trim() || !model.trim()) return;

    addVehicleDirectly({
      customerId: customerId || 'cust-general',
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
      {/* Top Header & Search */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CarFront className="w-5 h-5 text-blue-600" />
              Vehicle Directory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dynamically recorded vehicles linked to service bookings and bay operations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search plate or model..."
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
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles Grid / Empty State */}
      {filteredVehicles.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <CarFront className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Vehicles Registered</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Vehicles are automatically registered when customers book slots, or you can register one manually.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              + Register First Vehicle
            </button>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Book a Service
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVehicles.map((vehicle) => {
            const vehicleBookings = bookings.filter(b => b.vehiclePlate === vehicle.licensePlate);
            const customer = customers.find(c => c.id === vehicle.customerId);

            return (
              <div
                key={vehicle.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CarFront className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 font-mono tracking-wide">
                        {vehicle.licensePlate}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                    {vehicle.fuelType}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Owner / Customer:</span>
                    <span className="font-medium text-slate-800">{customer ? customer.fullName : 'Direct Guest'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Total Services:</span>
                    <span className="font-bold text-blue-600">{vehicleBookings.length} booking(s)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[10px] font-mono">ID: {vehicle.id}</span>
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="text-blue-600 hover:text-blue-800 font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    Book Service
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CarFront className="w-5 h-5 text-blue-600" />
                Register New Vehicle
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">License Plate Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CA-592-ABC"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono uppercase font-bold outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vehicle Make *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vehicle Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Camry SE"
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
                    <option value="petrol">Petrol / Gasoline</option>
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
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
