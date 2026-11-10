export type UserRole =
  | 'admin'
  | 'service-manager'
  | 'service-advisor'
  | 'service-technician'
  | 'customer';

export type NavigationTab =
  | 'home'
  | 'booking'
  | 'mutex-simulation'
  | 'receipt-download'
  | 'notification'
  // Legacy aliases
  | 'receipts'
  | 'with-mutex'
  | 'without-mutex'
  | 'dashboard'
  | 'notifications'
  | 'book-service'
  | 'my-bookings'
  | 'my-vehicles'
  | 'service-slots'
  | 'service-bays'
  | 'vehicles'
  | 'customers'
  | 'bookings'
  | 'service-status'
  | 'service-schedule'
  | 'assigned-services'
  | 'service-history'
  | 'user-management'
  | 'role-management'
  | 'service-management'
  | 'slot-management'
  | 'concurrency-monitor'
  | 'reports'
  | 'settings'
  | 'profile'
  | 'help';

export interface User {
  id: string;
  fullName: string;
  username: string;
  role: UserRole;
  createdAt: string;
  assignedBayIds?: string[];
}

export type ServiceStatusType =
  | 'scheduled'
  | 'in-bay'
  | 'in-progress'
  | 'quality-check'
  | 'completed'
  | 'cancelled';

export interface ServiceBay {
  id: string;
  bayNumber: number;
  name: string;
  type: string;
  isAvailable: boolean;
  currentBookingId?: string | null;
  assignedVehiclePlate?: string | null;
  assignedVehicleModel?: string | null;
  currentServiceType?: string | null;
  status: 'idle' | 'occupied' | 'maintenance' | 'unavailable';
  estimatedCompletionTime?: string | null;
  assignedTechnicianId?: string | null;
  equipmentStatus: 'optimal' | 'calibrated' | 'routine-check';
}

export interface ServiceCatalogItem {
  id: string;
  name: string;
  category: 'maintenance' | 'repairs' | 'diagnostics' | 'inspection' | 'detailing';
  durationMinutes: number;
  price: number;
  description: string;
  recommendedBayType: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  userId?: string;
  fullName: string;
  username?: string;
  address?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  customerUsername?: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  mileageKm?: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingRef: string;
  customerId: string;
  customerName: string;
  customerUsername?: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  bayId: string;
  bayNumber: number;
  assignedTechnicianId?: string | null;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:00 AM/PM
  durationMinutes: number;
  notes?: string;
  status: ServiceStatusType;
  createdAt: string;
  threadId?: string; // OS thread ID that acquired the mutex
  mutexAcquiredAt?: string;
  mutexReleasedAt?: string;
}

export type MutexLockState = 'IDLE' | 'ACQUIRING' | 'LOCKED' | 'CRITICAL_SECTION' | 'RELEASED';

export interface ResourceLock {
  resourceKey: string; // e.g. "bay:1:2026-10-06:09:00"
  bayId: string;
  bayNumber: number;
  date: string;
  timeSlot: string;
  lockedByThreadId: string;
  requesterName: string;
  acquiredAt: number;
  expiresAt: number;
}

export interface BookingConflictEvent {
  id: string;
  timestamp: string;
  resourceKey: string;
  bayNumber: number;
  date: string;
  timeSlot: string;
  conflictingThreadId: string;
  winnerThreadId: string;
  conflictingRequester: string;
  message: string;
  suggestedAlternatives: {
    bayId: string;
    bayNumber: number;
    timeSlot: string;
    date: string;
  }[];
}

export interface ConcurrencyLogItem {
  id: string;
  timestamp: string;
  threadId: string;
  event:
    | 'REQUEST_RECEIVED'
    | 'MUTEX_ACQUIRED'
    | 'CRITICAL_SECTION_ENTER'
    | 'SLOT_RESERVED'
    | 'MUTEX_RELEASED'
    | 'CONFLICT_DETECTED'
    | 'RACE_CONDITION_BLOCKED'
    | 'DOUBLE_BOOKING_PREVENTED';
  resourceKey: string;
  details: string;
  level: 'info' | 'success' | 'warning' | 'error';
}

export interface NotificationItem {
  id: string;
  userId?: string | null;
  title: string;
  message: string;
  type: 'confirmation' | 'conflict' | 'availability' | 'completion' | 'bay-status' | 'system';
  timestamp: string;
  read: boolean;
  metadata?: {
    bookingId?: string;
    bayNumber?: number;
    threadId?: string;
    conflictId?: string;
  };
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  userId?: string;
  type:
    | 'booking_created'
    | 'booking_cancelled'
    | 'bay_allocated'
    | 'service_completed'
    | 'slot_availability_changed'
    | 'booking_conflict'
    | 'resource_locked'
    | 'resource_unlocked'
    | 'user_created'
    | 'bay_added';
  title: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface TimeSlotConfig {
  slot: string;
  isEnabled: boolean;
}

export interface SimulationRequestItem {
  id: string;
  participantId: string;
  participantName: string;
  vehicleNumber: string;
  vehicleModel: string;
  bayNumber: number;
  timeSlot: string;
  date: string;
  status: 'queued' | 'requesting' | 'checking' | 'critical_section' | 'success' | 'rejected' | 'double_booked';
  timestamp: string;
  details?: string;
  threadId?: string;
}

export interface WithMutexSimulationState {
  hasRun: boolean;
  isRunning: boolean;
  step: 'idle' | 'requesting' | 'locking' | 'critical_section' | 'completed';
  activeParticipantId: string | null;
  requests: SimulationRequestItem[];
  mutexLockStatus: MutexLockState;
  criticalSectionStatus: string;
  successfulReservations: Booking[];
  rejectedRequests: Array<{ participantId: string; name: string; reason: string }>;
  executionLog: Array<{ id: string; time: string; text: string; type: 'info' | 'success' | 'warning' | 'error' }>;
}

export interface WithoutMutexSimulationState {
  hasRun: boolean;
  isRunning: boolean;
  step: 'idle' | 'simultaneous_request' | 'availability_check' | 'concurrent_execution' | 'race_detected';
  requests: SimulationRequestItem[];
  availabilityChecked: boolean;
  executionResults: Booking[];
  detectedRaceConditions: number;
  executionLog: Array<{ id: string; time: string; text: string; type: 'info' | 'error' | 'warning' }>;
}
