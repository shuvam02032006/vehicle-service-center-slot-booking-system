import { ServiceBay, ServiceCatalogItem, TimeSlotConfig } from '../types';

export const DEFAULT_FACILITY_BAYS: ServiceBay[] = [
  {
    id: 'bay-1',
    bayNumber: 1,
    name: 'Express Lube & Quick Inspection',
    type: 'Hydraulic Post Lift',
    isAvailable: true,
    currentBookingId: null,
    assignedVehiclePlate: null,
    assignedVehicleModel: null,
    currentServiceType: null,
    status: 'idle',
    estimatedCompletionTime: null,
    equipmentStatus: 'optimal'
  },
  {
    id: 'bay-2',
    bayNumber: 2,
    name: 'Computer Diagnostics & Electrical',
    type: 'OBD-II High-Speed Telemetry Station',
    isAvailable: true,
    currentBookingId: null,
    assignedVehiclePlate: null,
    assignedVehicleModel: null,
    currentServiceType: null,
    status: 'idle',
    estimatedCompletionTime: null,
    equipmentStatus: 'optimal'
  },
  {
    id: 'bay-3',
    bayNumber: 3,
    name: 'Heavy Mechanical & Powertrain',
    type: '4-Post Heavy Duty 6-Ton Lift',
    isAvailable: true,
    currentBookingId: null,
    assignedVehiclePlate: null,
    assignedVehicleModel: null,
    currentServiceType: null,
    status: 'idle',
    estimatedCompletionTime: null,
    equipmentStatus: 'calibrated'
  },
  {
    id: 'bay-4',
    bayNumber: 4,
    name: '3D Laser Wheel Alignment & Suspension',
    type: 'Digital HawkEye Optical Alignment Rack',
    isAvailable: true,
    currentBookingId: null,
    assignedVehiclePlate: null,
    assignedVehicleModel: null,
    currentServiceType: null,
    status: 'idle',
    estimatedCompletionTime: null,
    equipmentStatus: 'optimal'
  },
  {
    id: 'bay-5',
    bayNumber: 5,
    name: 'Brake Servicing & Hydraulic Lathe',
    type: 'Pro-Cut On-Car Brake Lathe Bay',
    isAvailable: true,
    currentBookingId: null,
    assignedVehiclePlate: null,
    assignedVehicleModel: null,
    currentServiceType: null,
    status: 'idle',
    estimatedCompletionTime: null,
    equipmentStatus: 'optimal'
  },
  {
    id: 'bay-6',
    bayNumber: 6,
    name: 'Detailing, AC & Multi-Point Inspection',
    type: 'Climate & Wash Prep Bay',
    isAvailable: true,
    currentBookingId: null,
    assignedVehiclePlate: null,
    assignedVehicleModel: null,
    currentServiceType: null,
    status: 'idle',
    estimatedCompletionTime: null,
    equipmentStatus: 'calibrated'
  }
];

export const DEFAULT_SERVICE_CATALOG: ServiceCatalogItem[] = [
  {
    id: 'srv-1',
    name: 'Full Synthetic Engine Oil & Filter Change',
    category: 'maintenance',
    durationMinutes: 45,
    price: 85,
    description: 'Complete drain & refill with OEM synthetic oil, high-flow filter replacement, fluid top-offs.',
    recommendedBayType: 'Hydraulic Post Lift',
    isActive: true
  },
  {
    id: 'srv-2',
    name: 'Comprehensive ECU Diagnostics & Electrical Scan',
    category: 'diagnostics',
    durationMinutes: 60,
    price: 110,
    description: 'Full OEM computer diagnostic scan, error DTC clearance, alternator & battery load testing.',
    recommendedBayType: 'OBD-II High-Speed Telemetry Station',
    isActive: true
  },
  {
    id: 'srv-3',
    name: 'Brake Rotor Resurfacing & Ceramic Pad Replacement',
    category: 'repairs',
    durationMinutes: 90,
    price: 195,
    description: 'Precision rotor turning, ceramic brake pads installation, brake fluid moisture analysis & bleed.',
    recommendedBayType: 'Pro-Cut On-Car Brake Lathe Bay',
    isActive: true
  },
  {
    id: 'srv-4',
    name: '3D Laser 4-Wheel Alignment & Road-Force Balancing',
    category: 'maintenance',
    durationMinutes: 60,
    price: 130,
    description: 'Digital 3D camera alignment geometry calibration, tire balancing, steering angle sensor reset.',
    recommendedBayType: 'Digital HawkEye Optical Alignment Rack',
    isActive: true
  },
  {
    id: 'srv-5',
    name: 'Transmission Flush & Powertrain Inspection',
    category: 'repairs',
    durationMinutes: 120,
    price: 240,
    description: 'Transmission fluid exchange, filter replacement, driveshaft and differential leak testing.',
    recommendedBayType: '4-Post Heavy Duty 6-Ton Lift',
    isActive: true
  },
  {
    id: 'srv-6',
    name: 'Air Conditioning Climate System Evac & Recharge',
    category: 'maintenance',
    durationMinutes: 60,
    price: 145,
    description: 'R134a/R1234yf vacuum leak testing, refrigerant recharge, pollen cabin filter replacement.',
    recommendedBayType: 'Climate & Wash Prep Bay',
    isActive: true
  }
];

export const INITIAL_SLOT_CONFIGS: TimeSlotConfig[] = [
  { slot: '08:00 AM', isEnabled: true },
  { slot: '09:00 AM', isEnabled: true },
  { slot: '10:00 AM', isEnabled: true },
  { slot: '11:00 AM', isEnabled: true },
  { slot: '12:00 PM', isEnabled: true },
  { slot: '01:00 PM', isEnabled: true },
  { slot: '02:00 PM', isEnabled: true },
  { slot: '03:00 PM', isEnabled: true },
  { slot: '04:00 PM', isEnabled: true },
  { slot: '05:00 PM', isEnabled: true }
];

export const TIME_SLOTS: string[] = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM'
];

