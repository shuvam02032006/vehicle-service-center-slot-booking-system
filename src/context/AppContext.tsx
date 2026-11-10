import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  User,
  UserRole,
  NavigationTab,
  Customer,
  Vehicle,
  Booking,
  ServiceBay,
  ServiceCatalogItem,
  ActivityEvent,
  NotificationItem,
  BookingConflictEvent,
  ServiceStatusType,
  ResourceLock,
  ConcurrencyLogItem,
  MutexLockState,
  TimeSlotConfig,
  SimulationRequestItem,
  WithMutexSimulationState,
  WithoutMutexSimulationState
} from '../types';
import {
  DEFAULT_FACILITY_BAYS,
  DEFAULT_SERVICE_CATALOG,
  INITIAL_SLOT_CONFIGS
} from '../utils/facilityCatalog';
import { globalMutexManager } from '../utils/mutex';
import { isTabAllowedForRole, ROLE_DISPLAY_NAMES } from '../utils/permissions';

interface BookingFormData {
  customerName: string;
  customerUsername?: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleYear: number;
  serviceId: string;
  bayId: string;
  date: string;
  timeSlot: string;
  notes?: string;
}

export const DEFAULT_ROLE_USERS: Record<UserRole, User> = {
  admin: {
    id: 'usr-admin-01',
    username: 'admin',
    fullName: 'System Administrator',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  'service-manager': {
    id: 'usr-mgr-01',
    username: 'manager',
    fullName: 'Service Manager',
    role: 'service-manager',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  'service-advisor': {
    id: 'usr-adv-01',
    username: 'advisor',
    fullName: 'Service Advisor',
    role: 'service-advisor',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  'service-technician': {
    id: 'usr-tech-01',
    username: 'technician',
    fullName: 'Service Technician',
    role: 'service-technician',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  customer: {
    id: 'usr-cust-01',
    username: 'customer',
    fullName: 'Customer Portal',
    role: 'customer',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
};

interface AppContextType {
  currentUser: User | null;
  users: User[];
  login: (username: string, password?: string) => Promise<User>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  registerUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<User>;
  deleteUser: (userId: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;

  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  customers: Customer[];
  vehicles: Vehicle[];
  bookings: Booking[];
  serviceBays: ServiceBay[];
  serviceCatalog: ServiceCatalogItem[];
  slotConfigs: TimeSlotConfig[];
  enabledSlots: string[];
  activityLogs: ActivityEvent[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;

  mutexGlobalState: MutexLockState;
  activeLocks: ResourceLock[];
  conflictsPrevented: number;
  concurrencyLogs: ConcurrencyLogItem[];
  currentConflict: BookingConflictEvent | null;
  isSimulatingConcurrency: boolean;

  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  prefilledSlot: { bayId: string; bayNumber: number; date: string; timeSlot: string } | null;
  setPrefilledSlot: (slot: { bayId: string; bayNumber: number; date: string; timeSlot: string } | null) => void;

  addServiceBay: (bayData: { name: string; type: string; bayNumber: number }) => void;
  updateBayStatus: (bayId: string, status: ServiceBay['status']) => void;
  deleteServiceBay: (bayId: string) => void;
  initializeFacilityBays: () => void;

  addServiceOffering: (item: { name: string; category: ServiceCatalogItem['category']; durationMinutes: number; price: number; description: string; recommendedBayType: string }) => void;
  toggleServiceActive: (serviceId: string) => void;
  deleteServiceOffering: (serviceId: string) => void;
  initializeFacilityServices: () => void;

  toggleSlotConfig: (slot: string) => void;
  addSlotConfig: (slot: string) => void;

  bookServiceWithMutex: (formData: BookingFormData, customThreadId?: string) => Promise<Booking>;
  simulateConcurrentBookings: (params: {
    bayId: string;
    bayNumber: number;
    date: string;
    timeSlot: string;
    threadCount: number;
    mutexEnabled: boolean;
  }) => Promise<void>;
  updateServiceStatus: (bookingId: string, status: ServiceStatusType) => void;
  cancelBooking: (bookingId: string) => void;
  assignTechnicianToBooking: (bookingId: string, technicianId: string) => void;
  dismissConflictModal: () => void;

  addCustomerDirectly: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  addVehicleDirectly: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => Vehicle;
  updateCustomerProfile: (fullName: string, address?: string) => void;

  markNotificationsAsRead: () => void;
  clearNotifications: () => void;
  resetAllDataToCleanState: () => void;

  getAvailableSlotsForDateAndBay: (date: string, bayId: string) => string[];
  findAlternativeSlots: (preferredDate: string, currentBayId: string, currentTimeSlot: string) => {
    bayId: string;
    bayNumber: number;
    timeSlot: string;
    date: string;
  }[];

  participantsCount: number;
  setParticipantsCount: (count: number) => void;
  withMutexState: WithMutexSimulationState;
  withoutMutexState: WithoutMutexSimulationState;
  runWithMutexSimulation: (params: {
    bayId: string;
    date: string;
    timeSlot: string;
    participants: number;
  }) => Promise<void>;
  runWithoutMutexSimulation: (params: {
    bayId: string;
    date: string;
    timeSlot: string;
    participants: number;
  }) => Promise<void>;
  resetSimulationState: () => void;
  checkSlotAvailability: (params: { bayId: string; date: string; timeSlot: string }) => boolean;
  bookSingleService: (params: {
    customerName: string;
    vehiclePlate: string;
    vehicleModel: string;
    serviceId: string;
    bayId: string;
    date: string;
    timeSlot: string;
  }) => Promise<{ success: boolean; message: string; booking?: Booking }>;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  CURRENT_USER: 'vsc_auth_user_v4',
  USERS: 'vsc_users_v4',
  CUSTOMERS: 'vsc_customers_v4',
  VEHICLES: 'vsc_vehicles_v4',
  BOOKINGS: 'vsc_bookings_v4',
  ACTIVITY: 'vsc_activity_v4',
  NOTIFICATIONS: 'vsc_notifications_v4',
  BAYS: 'vsc_bays_v4',
  SERVICES: 'vsc_services_v4',
  SLOTS: 'vsc_slots_v4'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role) return parsed;
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_ROLE_USERS.customer;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [participantsCount, setParticipantsCount] = useState<number>(4);

  const initialWithMutex: WithMutexSimulationState = {
    hasRun: false,
    isRunning: false,
    step: 'idle',
    activeParticipantId: null,
    requests: [],
    mutexLockStatus: 'IDLE',
    criticalSectionStatus: 'EMPTY (No thread inside)',
    successfulReservations: [],
    rejectedRequests: [],
    executionLog: []
  };

  const initialWithoutMutex: WithoutMutexSimulationState = {
    hasRun: false,
    isRunning: false,
    step: 'idle',
    requests: [],
    availabilityChecked: false,
    executionResults: [],
    detectedRaceConditions: 0,
    executionLog: []
  };

  const [withMutexState, setWithMutexState] = useState<WithMutexSimulationState>(initialWithMutex);
  const [withoutMutexState, setWithoutMutexState] = useState<WithoutMutexSimulationState>(initialWithoutMutex);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    return saved ? JSON.parse(saved) : [];
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [serviceBays, setServiceBays] = useState<ServiceBay[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BAYS);
    return saved ? JSON.parse(saved) : DEFAULT_FACILITY_BAYS;
  });

  const [serviceCatalog, setServiceCatalog] = useState<ServiceCatalogItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return saved ? JSON.parse(saved) : DEFAULT_SERVICE_CATALOG;
  });

  const [slotConfigs, setSlotConfigs] = useState<TimeSlotConfig[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SLOTS);
    return saved ? JSON.parse(saved) : INITIAL_SLOT_CONFIGS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [mutexGlobalState, setMutexGlobalState] = useState<MutexLockState>('IDLE');
  const [activeLocks, setActiveLocks] = useState<ResourceLock[]>([]);
  const [conflictsPrevented, setConflictsPrevented] = useState<number>(0);
  const [concurrencyLogs, setConcurrencyLogs] = useState<ConcurrencyLogItem[]>([]);
  const [currentConflict, setCurrentConflict] = useState<BookingConflictEvent | null>(null);
  const [isSimulatingConcurrency, setIsSimulatingConcurrency] = useState<boolean>(false);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [prefilledSlot, setPrefilledSlot] = useState<{ bayId: string; bayNumber: number; date: string; timeSlot: string } | null>(null);

  useEffect(() => {
    const unsubscribe = globalMutexManager.subscribe(() => {
      setMutexGlobalState(globalMutexManager.getGlobalState());
      setActiveLocks(globalMutexManager.getActiveLocks());
      setConflictsPrevented(globalMutexManager.getConflictsPreventedCount());
      setConcurrencyLogs(globalMutexManager.getLogs());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BAYS, JSON.stringify(serviceBays));
  }, [serviceBays]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(serviceCatalog));
  }, [serviceCatalog]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slotConfigs));
  }, [slotConfigs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const enabledSlots = useMemo(() => {
    return slotConfigs.filter(s => s.isEnabled).map(s => s.slot);
  }, [slotConfigs]);

  const refreshBayStatus = useCallback((currentBookings: Booking[]) => {
    const today = new Date().toISOString().split('T')[0];
    setServiceBays(prevBays => {
      return prevBays.map(bay => {
        if (bay.status === 'unavailable' || bay.status === 'maintenance') {
          return bay;
        }

        const activeBooking = currentBookings.find(
          b => b.bayId === bay.id &&
               b.date === today &&
               (b.status === 'in-bay' || b.status === 'in-progress' || b.status === 'quality-check')
        );

        if (activeBooking) {
          return {
            ...bay,
            isAvailable: false,
            currentBookingId: activeBooking.id,
            assignedVehiclePlate: activeBooking.vehiclePlate,
            assignedVehicleModel: activeBooking.vehicleModel,
            currentServiceType: activeBooking.serviceName,
            status: 'occupied',
            estimatedCompletionTime: `${activeBooking.timeSlot} + ${activeBooking.durationMinutes}m`
          };
        }

        return {
          ...bay,
          isAvailable: true,
          currentBookingId: null,
          assignedVehiclePlate: null,
          assignedVehicleModel: null,
          currentServiceType: null,
          status: 'idle',
          estimatedCompletionTime: null
        };
      });
    });
  }, []);

  useEffect(() => {
    refreshBayStatus(bookings);
  }, [bookings, refreshBayStatus]);

  const addActivity = useCallback((type: ActivityEvent['type'], title: string, description: string, metadata?: Record<string, any>) => {
    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      userId: currentUser?.id,
      type,
      title,
      description,
      metadata
    };
    setActivityLogs(prev => [newEvent, ...prev].slice(0, 50));
  }, [currentUser]);

  const addNotification = useCallback((type: NotificationItem['type'], title: string, message: string, userId?: string | null, metadata?: NotificationItem['metadata']) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: userId || null,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
      read: false,
      metadata
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50));
  }, []);

  // Authentication by Username
  const login = useCallback(async (usernameInput: string, password?: string): Promise<User> => {
    const cleanUsername = usernameInput.trim().toLowerCase();
    const user = users.find(u => u.username.toLowerCase() === cleanUsername);

    if (!user) {
      throw new Error(`User '@${cleanUsername}' not found. Please register or verify the username.`);
    }

    setCurrentUser(user);
    setActiveTab('dashboard');
    addActivity('user_created', `User Logged In`, `${user.fullName} logged in as ${user.role}`);
    return user;
  }, [users, addActivity]);

  const switchRole = useCallback((newRole: UserRole) => {
    const newUser = DEFAULT_ROLE_USERS[newRole];
    setCurrentUser(newUser);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    if (!isTabAllowedForRole(newRole, activeTab)) {
      setActiveTab('dashboard');
    }
    addActivity(
      'user_created',
      'Role Perspective Switched',
      `Active view switched to ${ROLE_DISPLAY_NAMES[newRole]}`
    );
  }, [activeTab, addActivity]);

  const logout = useCallback(() => {
    switchRole('admin');
  }, [switchRole]);

  const registerUser = useCallback(async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const exists = users.some(u => u.username.toLowerCase() === userData.username.toLowerCase());
    if (exists) {
      throw new Error(`Username '@${userData.username}' is already taken.`);
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);

    if (newUser.role === 'customer') {
      const existingCustomer = customers.find(c => c.username?.toLowerCase() === newUser.username.toLowerCase());
      if (!existingCustomer) {
        const newCustomer: Customer = {
          id: `cust-${Date.now()}`,
          userId: newUser.id,
          fullName: newUser.fullName,
          username: newUser.username,
          createdAt: new Date().toISOString()
        };
        setCustomers(prev => [...prev, newCustomer]);
      }
    }

    addActivity('user_created', `New User Registered`, `${newUser.fullName} (@${newUser.username}) registered with role: ${newUser.role}`);
    addNotification('system', `User Account Created`, `Welcome ${newUser.fullName} (@${newUser.username}). Account is active.`, newUser.id);

    return newUser;
  }, [users, customers, addActivity, addNotification]);

  const deleteUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    addActivity('user_created', `User Deleted`, `User ID ${userId} removed`);
  }, [addActivity]);

  const updateUserRole = useCallback((userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role: newRole } : null);
    }
    addActivity('user_created', `User Role Updated`, `User ${userId} reassigned to ${newRole}`);
  }, [currentUser, addActivity]);

  const addServiceBay = useCallback((bayData: { name: string; type: string; bayNumber: number }) => {
    const newBay: ServiceBay = {
      id: `bay-${Date.now()}`,
      bayNumber: bayData.bayNumber,
      name: bayData.name,
      type: bayData.type,
      isAvailable: true,
      status: 'idle',
      equipmentStatus: 'optimal'
    };
    setServiceBays(prev => [...prev, newBay]);
    addActivity('bay_added', `New Service Bay Added`, `Bay #${newBay.bayNumber} (${newBay.name}) added.`);
  }, [addActivity]);

  const updateBayStatus = useCallback((bayId: string, status: ServiceBay['status']) => {
    setServiceBays(prev => prev.map(b => b.id === bayId ? {
      ...b,
      status,
      isAvailable: status === 'idle'
    } : b));
    addActivity('bay_allocated', `Bay Status Updated`, `Bay ID ${bayId} status changed to ${status}`);
  }, [addActivity]);

  const deleteServiceBay = useCallback((bayId: string) => {
    setServiceBays(prev => prev.filter(b => b.id !== bayId));
  }, []);

  const initializeFacilityBays = useCallback(() => {
    setServiceBays(DEFAULT_FACILITY_BAYS);
    addActivity('bay_added', `Facility Bays Initialized`, `Configured 6 standard service bays.`);
  }, [addActivity]);

  const addServiceOffering = useCallback((item: { name: string; category: ServiceCatalogItem['category']; durationMinutes: number; price: number; description: string; recommendedBayType: string }) => {
    const newService: ServiceCatalogItem = {
      id: `srv-${Date.now()}`,
      ...item,
      isActive: true
    };
    setServiceCatalog(prev => [...prev, newService]);
  }, []);

  const toggleServiceActive = useCallback((serviceId: string) => {
    setServiceCatalog(prev => prev.map(s => s.id === serviceId ? { ...s, isActive: !s.isActive } : s));
  }, []);

  const deleteServiceOffering = useCallback((serviceId: string) => {
    setServiceCatalog(prev => prev.filter(s => s.id !== serviceId));
  }, []);

  const initializeFacilityServices = useCallback(() => {
    setServiceCatalog(DEFAULT_SERVICE_CATALOG);
  }, []);

  const toggleSlotConfig = useCallback((slot: string) => {
    setSlotConfigs(prev => prev.map(s => s.slot === slot ? { ...s, isEnabled: !s.isEnabled } : s));
  }, []);

  const addSlotConfig = useCallback((slot: string) => {
    setSlotConfigs(prev => {
      if (prev.some(s => s.slot === slot)) return prev;
      return [...prev, { slot, isEnabled: true }];
    });
  }, []);

  const updateCustomerProfile = useCallback((fullName: string, address?: string) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, fullName } : null);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, fullName } : u));
    setCustomers(prev => prev.map(c => c.username === currentUser.username || c.userId === currentUser.id ? {
      ...c,
      fullName,
      address
    } : c));
  }, [currentUser]);

  const addCustomerDirectly = useCallback((customerData: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      ...customerData,
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer;
  }, []);

  const addVehicleDirectly = useCallback((vehicleData: Omit<Vehicle, 'id' | 'createdAt'>): Vehicle => {
    const newVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      ...vehicleData,
      customerUsername: vehicleData.customerUsername || currentUser?.username,
      createdAt: new Date().toISOString()
    };
    setVehicles(prev => [...prev, newVehicle]);
    return newVehicle;
  }, [currentUser]);

  const getAvailableSlotsForDateAndBay = useCallback((date: string, bayId: string): string[] => {
    const bookedTimes = bookings
      .filter(b => b.date === date && b.bayId === bayId && b.status !== 'cancelled')
      .map(b => b.timeSlot);

    return enabledSlots.filter(slot => !bookedTimes.includes(slot));
  }, [bookings, enabledSlots]);

  const findAlternativeSlots = useCallback((preferredDate: string, currentBayId: string, currentTimeSlot: string) => {
    const alternatives: { bayId: string; bayNumber: number; timeSlot: string; date: string }[] = [];

    const sameBayOtherTimes = getAvailableSlotsForDateAndBay(preferredDate, currentBayId);
    for (const time of sameBayOtherTimes.slice(0, 2)) {
      const bay = serviceBays.find(b => b.id === currentBayId);
      if (bay) {
        alternatives.push({
          bayId: currentBayId,
          bayNumber: bay.bayNumber,
          timeSlot: time,
          date: preferredDate
        });
      }
    }

    for (const otherBay of serviceBays) {
      if (otherBay.id !== currentBayId && otherBay.status !== 'unavailable') {
        const isSlotAvailable = !bookings.some(
          b => b.bayId === otherBay.id && b.date === preferredDate && b.timeSlot === currentTimeSlot && b.status !== 'cancelled'
        );
        if (isSlotAvailable && alternatives.length < 4) {
          alternatives.push({
            bayId: otherBay.id,
            bayNumber: otherBay.bayNumber,
            timeSlot: currentTimeSlot,
            date: preferredDate
          });
        }
      }
    }

    return alternatives;
  }, [bookings, serviceBays, getAvailableSlotsForDateAndBay]);

  // MUTEX BOOKING ROUTINE
  const bookServiceWithMutex = useCallback(async (
    formData: BookingFormData,
    customThreadId?: string
  ): Promise<Booking> => {
    const threadId = customThreadId || `THR-${Math.floor(1000 + Math.random() * 9000)}`;
    const bay = serviceBays.find(b => b.id === formData.bayId) || serviceBays[0];
    if (!bay) {
      throw new Error('No service bays configured. Please add a bay first.');
    }

    const resourceKey = `bay:${bay.id}:${formData.date}:${formData.timeSlot}`;
    addActivity('resource_locked', `Thread ${threadId} Acquiring Mutex`, `Attempting exclusive lock for Bay #${bay.bayNumber} on ${formData.date} at ${formData.timeSlot}`);

    // 1. ACQUIRE MUTEX
    try {
      await globalMutexManager.acquire(
        bay.id,
        bay.bayNumber,
        formData.date,
        formData.timeSlot,
        threadId,
        formData.customerName
      );
    } catch (err: any) {
      globalMutexManager.recordConflictPrevented();
      const conflictEvent: BookingConflictEvent = {
        id: `conf-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        resourceKey,
        bayNumber: bay.bayNumber,
        date: formData.date,
        timeSlot: formData.timeSlot,
        conflictingThreadId: threadId,
        winnerThreadId: 'BUSY_THREAD',
        conflictingRequester: formData.customerName,
        message: `Resource [${resourceKey}] is locked by an ongoing transaction. Mutex timeout reached.`,
        suggestedAlternatives: findAlternativeSlots(formData.date, bay.id, formData.timeSlot)
      };
      setCurrentConflict(conflictEvent);
      addNotification('conflict', 'Mutual Exclusion Conflict Detected', `Simultaneous request rejected for Bay #${bay.bayNumber} @ ${formData.timeSlot}.`, currentUser?.id, { threadId });
      throw new Error(`Slot is currently contested under OS Mutex protection: ${err.message}`);
    }

    // 2. CRITICAL SECTION
    const mutexAcquiredTime = new Date().toISOString();
    try {
      await new Promise(res => setTimeout(res, 350));

      const isAlreadyBooked = bookings.some(
        b => b.bayId === bay.id &&
             b.date === formData.date &&
             b.timeSlot === formData.timeSlot &&
             b.status !== 'cancelled'
      );

      if (isAlreadyBooked) {
        globalMutexManager.recordConflictPrevented();
        globalMutexManager.logEvent(
          threadId,
          'RACE_CONDITION_BLOCKED',
          resourceKey,
          `Critical Section check detected Bay #${bay.bayNumber} @ ${formData.timeSlot} was already reserved. Double-booking prevented.`,
          'warning'
        );

        const conflictEvent: BookingConflictEvent = {
          id: `conf-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          resourceKey,
          bayNumber: bay.bayNumber,
          date: formData.date,
          timeSlot: formData.timeSlot,
          conflictingThreadId: threadId,
          winnerThreadId: bookings.find(b => b.bayId === bay.id && b.date === formData.date && b.timeSlot === formData.timeSlot)?.threadId || 'PRIOR_THREAD',
          conflictingRequester: formData.customerName,
          message: `Mutual Exclusion prevented a race condition! Bay #${bay.bayNumber} at ${formData.timeSlot} on ${formData.date} has just been reserved.`,
          suggestedAlternatives: findAlternativeSlots(formData.date, bay.id, formData.timeSlot)
        };

        setCurrentConflict(conflictEvent);
        addActivity('booking_conflict', 'Mutual Exclusion: Booking Conflict Prevented', `Thread ${threadId} prevented from duplicate booking of Bay #${bay.bayNumber} @ ${formData.timeSlot}`);
        addNotification('conflict', 'Slot Unavailable - Conflict Prevented', `Another process acquired the slot before Thread ${threadId}. Showing alternatives.`, currentUser?.id);

        throw new Error(`SLOT_CONFLICT: Bay #${bay.bayNumber} @ ${formData.timeSlot} is already booked.`);
      }

      // Customer Record
      let customer = customers.find(c => c.fullName.toLowerCase() === formData.customerName.toLowerCase() || (formData.customerUsername && c.username?.toLowerCase() === formData.customerUsername.toLowerCase()));
      if (!customer) {
        customer = {
          id: `cust-${Date.now()}`,
          userId: currentUser?.id,
          fullName: formData.customerName,
          username: formData.customerUsername || currentUser?.username,
          createdAt: new Date().toISOString()
        };
        setCustomers(prev => [...prev, customer!]);
      }

      // Vehicle Record
      let vehicle = vehicles.find(v => v.licensePlate.toUpperCase() === formData.vehiclePlate.toUpperCase());
      if (!vehicle) {
        vehicle = {
          id: `veh-${Date.now()}`,
          customerId: customer.id,
          customerUsername: formData.customerUsername || currentUser?.username,
          make: formData.vehicleModel.split(' ')[0] || 'Unknown',
          model: formData.vehicleModel,
          year: formData.vehicleYear || new Date().getFullYear(),
          licensePlate: formData.vehiclePlate.toUpperCase(),
          fuelType: 'petrol',
          createdAt: new Date().toISOString()
        };
        setVehicles(prev => [...prev, vehicle!]);
      }

      const service = serviceCatalog.find(s => s.id === formData.serviceId) || serviceCatalog[0] || {
        id: 'srv-gen',
        name: 'General Inspection',
        price: 50,
        durationMinutes: 45
      };

      // 3. RESERVE SLOT
      const newBooking: Booking = {
        id: `bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        bookingRef: `VSC-${Math.floor(100000 + Math.random() * 900000)}`,
        customerId: customer.id,
        customerName: customer.fullName,
        customerUsername: formData.customerUsername || currentUser?.username,
        vehicleId: vehicle.id,
        vehiclePlate: vehicle.licensePlate,
        vehicleModel: vehicle.model,
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.price,
        bayId: bay.id,
        bayNumber: bay.bayNumber,
        date: formData.date,
        timeSlot: formData.timeSlot,
        durationMinutes: service.durationMinutes,
        notes: formData.notes,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        threadId,
        mutexAcquiredAt: mutexAcquiredTime,
        mutexReleasedAt: new Date().toISOString()
      };

      setBookings(prev => [newBooking, ...prev]);

      globalMutexManager.logEvent(
        threadId,
        'SLOT_RESERVED',
        resourceKey,
        `Reservation confirmed for ${newBooking.bookingRef} [${newBooking.vehiclePlate}] in Bay #${bay.bayNumber} by Thread ${threadId}`,
        'success'
      );

      addActivity(
        'booking_created',
        `Booking ${newBooking.bookingRef} Created`,
        `Vehicle ${newBooking.vehiclePlate} reserved Bay #${bay.bayNumber} on ${newBooking.date} @ ${newBooking.timeSlot} via Thread ${threadId}`,
        { bookingId: newBooking.id, threadId }
      );

      addNotification(
        'confirmation',
        `Booking Confirmed: ${newBooking.bookingRef}`,
        `Service slot confirmed for Bay #${bay.bayNumber} at ${newBooking.timeSlot}.`,
        customer.userId || currentUser?.id,
        { bookingId: newBooking.id, bayNumber: bay.bayNumber }
      );

      return newBooking;
    } finally {
      // 4. RELEASE MUTEX
      globalMutexManager.release(resourceKey, threadId);
      addActivity('resource_unlocked', `Mutex Released on Bay #${bay.bayNumber}`, `Thread ${threadId} exited critical section and released lock on [${resourceKey}]`);
    }
  }, [serviceBays, bookings, customers, vehicles, serviceCatalog, currentUser, findAlternativeSlots, addActivity, addNotification]);

  // Concurrency Race Simulation
  const simulateConcurrentBookings = useCallback(async ({
    bayId,
    bayNumber,
    date,
    timeSlot,
    threadCount,
    mutexEnabled
  }: {
    bayId: string;
    bayNumber: number;
    date: string;
    timeSlot: string;
    threadCount: number;
    mutexEnabled: boolean;
  }) => {
    setIsSimulatingConcurrency(true);
    const service = serviceCatalog[0] || { id: 'srv-1', name: 'Standard Service', price: 90, durationMinutes: 45 };
    const threadLabels = ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT', 'GOLF', 'HOTEL'];

    addNotification(
      'system',
      'Concurrency Simulation Started',
      `Spawning ${threadCount} concurrent threads targeting Bay #${bayNumber} on ${date} @ ${timeSlot}. Mutex: ${mutexEnabled ? 'ENABLED' : 'DISABLED'}.`,
      currentUser?.id
    );

    const simulationPromises = Array.from({ length: threadCount }).map(async (_, idx) => {
      const threadId = `THR-${threadLabels[idx % threadLabels.length]}-${Math.floor(100 + Math.random() * 900)}`;
      const customerName = `Client Thread ${idx + 1}`;
      const customerUsername = `client_${idx + 1}`;
      const plate = `SIM-${Math.floor(1000 + Math.random() * 9000)}`;

      await new Promise(res => setTimeout(res, Math.random() * 60));

      if (mutexEnabled) {
        try {
          await bookServiceWithMutex({
            customerName,
            customerUsername,
            vehiclePlate: plate,
            vehicleModel: `Simulated Sedan ${idx + 1}`,
            vehicleYear: 2024,
            serviceId: service.id,
            bayId,
            date,
            timeSlot,
            notes: `Simulated concurrent booking thread ${threadId}`
          }, threadId);
        } catch {
          // Expected conflict
        }
      } else {
        const resourceKey = `bay:${bayId}:${date}:${timeSlot}`;
        globalMutexManager.logEvent(
          threadId,
          'CRITICAL_SECTION_ENTER',
          resourceKey,
          `Thread ${threadId} entered UNPROTECTED critical section (Mutex DISABLED)! Race condition imminent.`,
          'error'
        );

        await new Promise(res => setTimeout(res, 200));

        const conflictingBooking: Booking = {
          id: `bk-race-${Date.now()}-${idx}`,
          bookingRef: `RACE-${Math.floor(10000 + Math.random() * 90000)}`,
          customerId: `cust-sim-${idx}`,
          customerName,
          customerUsername,
          vehicleId: `veh-sim-${idx}`,
          vehiclePlate: plate,
          vehicleModel: `Simulated Racer ${idx + 1}`,
          serviceId: service.id,
          serviceName: service.name,
          servicePrice: service.price,
          bayId,
          bayNumber,
          date,
          timeSlot,
          durationMinutes: 45,
          notes: 'CRITICAL OS FLAW: Double-booked due to disabled Mutex',
          status: 'scheduled',
          createdAt: new Date().toISOString(),
          threadId
        };

        setBookings(prev => [conflictingBooking, ...prev]);
        globalMutexManager.logEvent(
          threadId,
          'DOUBLE_BOOKING_PREVENTED',
          resourceKey,
          `DOUBLE BOOKING CREATED for Bay #${bayNumber} @ ${timeSlot} by Thread ${threadId} due to lack of Mutual Exclusion!`,
          'error'
        );
      }
    });

    await Promise.allSettled(simulationPromises);
    setIsSimulatingConcurrency(false);

    addNotification(
      'system',
      'Concurrency Simulation Complete',
      `All ${threadCount} threads completed execution. Review Concurrency Monitor logs.`,
      currentUser?.id
    );
  }, [bookServiceWithMutex, serviceCatalog, currentUser, addNotification]);

  const updateServiceStatus = useCallback((bookingId: string, newStatus: ServiceStatusType) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      addActivity(
        newStatus === 'completed' ? 'service_completed' : 'bay_allocated',
        `Service Status Changed: ${newStatus.toUpperCase()}`,
        `Booking ${booking.bookingRef} (${booking.vehiclePlate}) updated to ${newStatus}`
      );

      if (newStatus === 'completed') {
        addNotification(
          'completion',
          `Service Completed: ${booking.bookingRef}`,
          `Vehicle ${booking.vehiclePlate} has finished service in Bay #${booking.bayNumber}. Bay is now free.`,
          booking.customerId
        );
      }
    }
  }, [bookings, addActivity, addNotification]);

  const assignTechnicianToBooking = useCallback((bookingId: string, technicianId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, assignedTechnicianId: technicianId } : b));
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    addActivity('booking_cancelled', `Booking ${booking.bookingRef} Cancelled`, `Cancelled booking for vehicle ${booking.vehiclePlate} in Bay #${booking.bayNumber}`);
    addNotification('bay-status', `Booking Cancelled`, `Slot on ${booking.date} @ ${booking.timeSlot} in Bay #${booking.bayNumber} is now available again.`, booking.customerId);
  }, [bookings, addActivity, addNotification]);

  const dismissConflictModal = useCallback(() => {
    setCurrentConflict(null);
  }, []);

  const markNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const resetSimulationState = useCallback(() => {
    setWithMutexState(initialWithMutex);
    setWithoutMutexState(initialWithoutMutex);
  }, []);

  const runWithMutexSimulation = useCallback(async ({
    bayId,
    date,
    timeSlot,
    participants
  }: {
    bayId: string;
    date: string;
    timeSlot: string;
    participants: number;
  }) => {
    const targetBay = serviceBays.find(b => b.id === bayId) || serviceBays[0];
    const targetBayNumber = targetBay.bayNumber;
    const resourceKey = `bay:${bayId}:${date}:${timeSlot}`;
    const service = serviceCatalog[0] || { id: 'srv-1', name: 'General Service Inspection', price: 65, durationMinutes: 45 };

    const initialRequests: SimulationRequestItem[] = Array.from({ length: participants }).map((_, idx) => ({
      id: `req-wm-${idx + 1}-${Date.now()}`,
      participantId: `P${idx + 1}`,
      participantName: `Participant ${idx + 1}`,
      vehicleNumber: `VEH-OS-00${idx + 1}`,
      vehicleModel: `Sedan Model ${idx + 1}`,
      bayNumber: targetBayNumber,
      timeSlot,
      date,
      status: 'queued',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      threadId: `THR-MUTEX-${101 + idx}`
    }));

    setWithMutexState({
      hasRun: true,
      isRunning: true,
      step: 'requesting',
      activeParticipantId: null,
      requests: initialRequests,
      mutexLockStatus: 'IDLE',
      criticalSectionStatus: 'EMPTY (No thread inside)',
      successfulReservations: [],
      rejectedRequests: [],
      executionLog: [{
        id: `log-${Date.now()}-1`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: `Initialized ${participants} concurrent participant requests targeting Bay #${targetBayNumber} on ${date} @ ${timeSlot}`,
        type: 'info'
      }]
    });

    await new Promise(r => setTimeout(r, 600));

    const currentLogs: Array<{ id: string; time: string; text: string; type: 'info' | 'success' | 'warning' | 'error' }> = [{
      id: `log-${Date.now()}-1`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text: `Initialized ${participants} concurrent participant requests targeting Bay #${targetBayNumber} on ${date} @ ${timeSlot}`,
      type: 'info'
    }];
    let updatedRequests = [...initialRequests];
    const successfulList: Booking[] = [];
    const rejectedList: Array<{ participantId: string; name: string; reason: string }> = [];

    for (let i = 0; i < participants; i++) {
      const p = updatedRequests[i];
      const threadId = p.threadId!;

      // 1. Attempt to acquire mutex
      setWithMutexState(prev => ({
        ...prev,
        step: 'locking',
        activeParticipantId: p.participantId,
        mutexLockStatus: 'ACQUIRING',
        requests: prev.requests.map((r, idx) => idx === i ? { ...r, status: 'requesting' } : r)
      }));

      currentLogs.push({
        id: `log-${Date.now()}-${i}-lock`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: `[${p.participantName}] Thread ${threadId} attempting to acquire Mutex on ${resourceKey}`,
        type: 'info'
      });

      await new Promise(r => setTimeout(r, 450));

      // 2. Lock Acquired -> Enter Critical Section
      setWithMutexState(prev => ({
        ...prev,
        step: 'critical_section',
        mutexLockStatus: 'LOCKED',
        criticalSectionStatus: `OCCUPIED by ${p.participantName} (${threadId})`,
        requests: prev.requests.map((r, idx) => idx === i ? { ...r, status: 'critical_section' } : r),
        executionLog: [...currentLogs]
      }));

      addNotification(
        'system',
        'Mutex Lock Acquired',
        `Thread ${threadId} (${p.participantName}) acquired exclusive lock on Bay #${targetBayNumber} (${date} @ ${timeSlot}).`,
        currentUser?.id,
        { threadId, bayNumber: targetBayNumber }
      );

      await new Promise(r => setTimeout(r, 550));

      // 3. Slot Availability Check inside Critical Section
      const isAlreadyBooked = bookings.some(b => b.bayId === bayId && b.date === date && b.timeSlot === timeSlot && b.status !== 'cancelled') || successfulList.length > 0;

      if (!isAlreadyBooked) {
        const newBooking: Booking = {
          id: `bk-wm-${Date.now()}-${i}`,
          bookingRef: `MUTEX-${Math.floor(10000 + Math.random() * 90000)}`,
          customerId: `cust-wm-${i}`,
          customerName: p.participantName,
          customerUsername: `user_p${i+1}`,
          vehicleId: `veh-wm-${i}`,
          vehiclePlate: p.vehicleNumber,
          vehicleModel: p.vehicleModel,
          serviceId: service.id,
          serviceName: service.name,
          servicePrice: service.price,
          bayId,
          bayNumber: targetBayNumber,
          date,
          timeSlot,
          durationMinutes: service.durationMinutes,
          notes: `Reserved with strict Mutex mutual exclusion by ${threadId}`,
          status: 'scheduled',
          createdAt: new Date().toISOString(),
          threadId,
          mutexAcquiredAt: new Date().toISOString(),
          mutexReleasedAt: new Date().toISOString()
        };

        successfulList.push(newBooking);
        setBookings(prev => [newBooking, ...prev]);

        updatedRequests = updatedRequests.map((r, idx) => idx === i ? {
          ...r,
          status: 'success',
          details: `Confirmed Reservation (${newBooking.bookingRef})`
        } : r);

        currentLogs.push({
          id: `log-${Date.now()}-${i}-success`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          text: `[${p.participantName}] Critical Section: Slot is genuine AVAILABLE. Confirmed reservation ${newBooking.bookingRef}`,
          type: 'success'
        });

        addNotification(
          'confirmation',
          'Booking Successful',
          `Reservation ${newBooking.bookingRef} confirmed for ${p.participantName} (${p.vehicleNumber}) in Bay #${targetBayNumber}.`,
          currentUser?.id,
          { bookingId: newBooking.id, bayNumber: targetBayNumber }
        );
      } else {
        const winner = successfulList[0]?.customerName || 'Participant 1';
        const reason = `Slot occupied by ${winner}. Mutual exclusion prevented conflict.`;

        rejectedList.push({
          participantId: p.participantId,
          name: p.participantName,
          reason
        });

        updatedRequests = updatedRequests.map((r, idx) => idx === i ? {
          ...r,
          status: 'rejected',
          details: 'Rejected: Bay occupied'
        } : r);

        currentLogs.push({
          id: `log-${Date.now()}-${i}-reject`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          text: `[${p.participantName}] Critical Section: Slot is ALREADY OCCUPIED. Safely rejected request to prevent race condition.`,
          type: 'warning'
        });

        addNotification(
          'conflict',
          'Booking Rejected (Protected)',
          `Request for ${p.participantName} rejected: Bay #${targetBayNumber} @ ${timeSlot} already held by ${winner}.`,
          currentUser?.id,
          { threadId, bayNumber: targetBayNumber }
        );
      }

      // 4. Release Mutex
      setWithMutexState(prev => ({
        ...prev,
        mutexLockStatus: 'RELEASED',
        criticalSectionStatus: 'EMPTY (Mutex released)',
        requests: updatedRequests,
        successfulReservations: [...successfulList],
        rejectedRequests: [...rejectedList],
        executionLog: [...currentLogs]
      }));

      addNotification(
        'system',
        'Mutex Lock Released',
        `Thread ${threadId} released lock on Bay #${targetBayNumber}. Critical section vacated.`,
        currentUser?.id,
        { threadId, bayNumber: targetBayNumber }
      );

      await new Promise(r => setTimeout(r, 350));
    }

    setWithMutexState(prev => ({
      ...prev,
      step: 'completed',
      isRunning: false,
      activeParticipantId: null,
      mutexLockStatus: 'IDLE',
      criticalSectionStatus: 'IDLE - All requests processed',
      executionLog: [
        ...currentLogs,
        {
          id: `log-end-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          text: `Mutual Exclusion Simulation Completed. 1 booking confirmed, ${rejectedList.length} conflicts safely rejected. 0 double bookings.`,
          type: 'success'
        }
      ]
    }));
  }, [serviceBays, serviceCatalog, bookings, currentUser, addNotification]);

  const runWithoutMutexSimulation = useCallback(async ({
    bayId,
    date,
    timeSlot,
    participants
  }: {
    bayId: string;
    date: string;
    timeSlot: string;
    participants: number;
  }) => {
    const targetBay = serviceBays.find(b => b.id === bayId) || serviceBays[0];
    const targetBayNumber = targetBay.bayNumber;
    const service = serviceCatalog[0] || { id: 'srv-1', name: 'General Service Inspection', price: 65, durationMinutes: 45 };

    const initialRequests: SimulationRequestItem[] = Array.from({ length: participants }).map((_, idx) => ({
      id: `req-wom-${idx + 1}-${Date.now()}`,
      participantId: `P${idx + 1}`,
      participantName: `Participant ${idx + 1}`,
      vehicleNumber: `VEH-NO-MUTEX-00${idx + 1}`,
      vehicleModel: `Race Sedan ${idx + 1}`,
      bayNumber: targetBayNumber,
      timeSlot,
      date,
      status: 'queued',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      threadId: `THR-RACE-${201 + idx}`
    }));

    setWithoutMutexState({
      hasRun: true,
      isRunning: true,
      step: 'simultaneous_request',
      requests: initialRequests,
      availabilityChecked: false,
      executionResults: [],
      detectedRaceConditions: 0,
      executionLog: [{
        id: `log-wom-init-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: `[MUTEX DISABLED] Spawning ${participants} concurrent threads for Bay #${targetBayNumber} on ${date} @ ${timeSlot}`,
        type: 'info'
      }]
    });

    await new Promise(r => setTimeout(r, 650));

    // Step 2: Check Availability Simultaneously
    setWithoutMutexState(prev => ({
      ...prev,
      step: 'availability_check',
      availabilityChecked: true,
      requests: prev.requests.map(r => ({
        ...r,
        status: 'checking',
        details: 'Checked: Available (Simultaneous read)'
      })),
      executionLog: [
        ...prev.executionLog,
        {
          id: `log-wom-check-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          text: `All ${participants} participants queried slot availability simultaneously without synchronization. Every thread read: "SLOT AVAILABLE".`,
          type: 'warning'
        }
      ]
    }));

    await new Promise(r => setTimeout(r, 800));

    // Step 3: Concurrent Execution
    setWithoutMutexState(prev => ({
      ...prev,
      step: 'concurrent_execution',
      requests: prev.requests.map(r => ({
        ...r,
        status: 'critical_section',
        details: 'Writing booking concurrently without lock!'
      })),
      executionLog: [
        ...prev.executionLog,
        {
          id: `log-wom-exec-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          text: `Concurrent write executed! Multiple threads entered critical section simultaneously with no Mutual Exclusion.`,
          type: 'error'
        }
      ]
    }));

    await new Promise(r => setTimeout(r, 800));

    // Step 4: Race condition detected
    const duplicateBookings: Booking[] = initialRequests.map((req, idx) => ({
      id: `bk-race-${Date.now()}-${idx}`,
      bookingRef: `RACE-${Math.floor(10000 + Math.random() * 90000)}`,
      customerId: `cust-race-${idx}`,
      customerName: req.participantName,
      customerUsername: `user_p${idx+1}`,
      vehicleId: `veh-race-${idx}`,
      vehiclePlate: req.vehicleNumber,
      vehicleModel: req.vehicleModel,
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      bayId,
      bayNumber: targetBayNumber,
      date,
      timeSlot,
      durationMinutes: service.durationMinutes,
      notes: `CRITICAL OS RACE CONDITION: Double-booked Bay #${targetBayNumber} due to missing Mutex!`,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      threadId: req.threadId
    }));

    setBookings(prev => [...duplicateBookings, ...prev]);

    const raceCount = participants - 1;

    setWithoutMutexState(prev => ({
      ...prev,
      step: 'race_detected',
      isRunning: false,
      executionResults: duplicateBookings,
      detectedRaceConditions: raceCount,
      requests: prev.requests.map((r, idx) => ({
        ...r,
        status: 'double_booked',
        details: `Duplicate Booking Confirmed (${duplicateBookings[idx].bookingRef})`
      })),
      executionLog: [
        ...prev.executionLog,
        {
          id: `log-wom-race-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          text: `CRITICAL FAULT: Race condition occurred! ${participants} duplicate bookings were successfully written to identical Bay #${targetBayNumber} at ${timeSlot}!`,
          type: 'error'
        }
      ]
    }));

    addNotification(
      'conflict',
      'Booking Conflict Detected (Race Condition)',
      `CRITICAL OS RACE CONDITION: ${participants} participants concurrently booked Bay #${targetBayNumber} for ${date} @ ${timeSlot} without Mutex synchronization!`,
      currentUser?.id,
      { bayNumber: targetBayNumber }
    );
  }, [serviceBays, serviceCatalog, currentUser, addNotification]);

  const checkSlotAvailability = useCallback(({ bayId, date, timeSlot }: { bayId: string; date: string; timeSlot: string }) => {
    return !bookings.some(b => b.bayId === bayId && b.date === date && b.timeSlot === timeSlot && b.status !== 'cancelled');
  }, [bookings]);

  const bookSingleService = useCallback(async ({
    customerName,
    vehiclePlate,
    vehicleModel,
    serviceId,
    bayId,
    date,
    timeSlot
  }: {
    customerName: string;
    vehiclePlate: string;
    vehicleModel: string;
    serviceId: string;
    bayId: string;
    date: string;
    timeSlot: string;
  }): Promise<{ success: boolean; message: string; booking?: Booking }> => {
    const bay = serviceBays.find(b => b.id === bayId) || serviceBays[0];
    const service = serviceCatalog.find(s => s.id === serviceId) || serviceCatalog[0];
    const resourceKey = `bay:${bay.id}:${date}:${timeSlot}`;
    const threadId = `THR-DIRECT-${Math.floor(1000 + Math.random() * 9000)}`;

    addNotification(
      'system',
      'Mutex Lock Requested',
      `Direct booking thread ${threadId} requesting lock on [${resourceKey}].`,
      currentUser?.id,
      { threadId, bayNumber: bay.bayNumber }
    );

    try {
      await globalMutexManager.acquire(
        bay.id,
        bay.bayNumber,
        date,
        timeSlot,
        threadId,
        customerName,
        3000
      );
    } catch (err: any) {
      addNotification(
        'conflict',
        'Booking Conflict Detected',
        `Mutex lock busy: Another process is currently reserving Bay #${bay.bayNumber} on ${date} @ ${timeSlot}.`,
        currentUser?.id,
        { threadId, bayNumber: bay.bayNumber }
      );
      return { success: false, message: 'Resource is currently locked by another concurrent thread. Please try again.' };
    }

    try {
      addNotification(
        'system',
        'Mutex Lock Acquired',
        `Thread ${threadId} entered critical section for Bay #${bay.bayNumber}.`,
        currentUser?.id,
        { threadId, bayNumber: bay.bayNumber }
      );

      const isOccupied = bookings.some(b => b.bayId === bay.id && b.date === date && b.timeSlot === timeSlot && b.status !== 'cancelled');
      if (isOccupied) {
        addNotification(
          'conflict',
          'Slot Unavailable',
          `Bay #${bay.bayNumber} on ${date} @ ${timeSlot} has already been reserved.`,
          currentUser?.id,
          { bayNumber: bay.bayNumber }
        );
        return { success: false, message: `Slot on ${date} @ ${timeSlot} in Bay #${bay.bayNumber} is already reserved.` };
      }

      const newBooking: Booking = {
        id: `bk-direct-${Date.now()}`,
        bookingRef: `VSC-${Math.floor(100000 + Math.random() * 900000)}`,
        customerId: `cust-dir-${Date.now()}`,
        customerName,
        customerUsername: currentUser?.username || 'direct_user',
        vehicleId: `veh-dir-${Date.now()}`,
        vehiclePlate: vehiclePlate.toUpperCase(),
        vehicleModel,
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.price,
        bayId: bay.id,
        bayNumber: bay.bayNumber,
        date,
        timeSlot,
        durationMinutes: service.durationMinutes,
        notes: `Confirmed via direct user reservation. Mutex thread ${threadId}.`,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        threadId,
        mutexAcquiredAt: new Date().toISOString(),
        mutexReleasedAt: new Date().toISOString()
      };

      setBookings(prev => [newBooking, ...prev]);

      addNotification(
        'confirmation',
        'Booking Successful',
        `Slot reserved successfully for ${customerName} (${vehiclePlate}) in Bay #${bay.bayNumber} @ ${timeSlot}.`,
        currentUser?.id,
        { bookingId: newBooking.id, bayNumber: bay.bayNumber }
      );

      return { success: true, message: `Successfully reserved Bay #${bay.bayNumber} for ${date} @ ${timeSlot}!`, booking: newBooking };
    } finally {
      globalMutexManager.release(resourceKey, threadId);
      addNotification(
        'system',
        'Mutex Lock Released',
        `Thread ${threadId} exited critical section and released lock on Bay #${bay.bayNumber}.`,
        currentUser?.id,
        { threadId, bayNumber: bay.bayNumber }
      );
    }
  }, [serviceBays, serviceCatalog, bookings, currentUser, addNotification]);

  const resetAllDataToCleanState = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.VEHICLES);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.BAYS);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.SLOTS);

    setCurrentUser(null);
    setUsers([]);
    setCustomers([]);
    setVehicles([]);
    setBookings([]);
    setServiceBays(DEFAULT_FACILITY_BAYS);
    setServiceCatalog(DEFAULT_SERVICE_CATALOG);
    setSlotConfigs(INITIAL_SLOT_CONFIGS);
    setActivityLogs([]);
    setNotifications([]);
    setWithMutexState(initialWithMutex);
    setWithoutMutexState(initialWithoutMutex);
    globalMutexManager.resetAll();
  }, []);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(n => !n.read && (!n.userId || n.userId === currentUser?.id)).length;
  }, [notifications, currentUser]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        login,
        logout,
        switchRole,
        registerUser,
        deleteUser,
        updateUserRole,
        activeTab,
        setActiveTab,
        selectedDate,
        setSelectedDate,
        searchQuery,
        setSearchQuery,
        customers,
        vehicles,
        bookings,
        serviceBays,
        serviceCatalog,
        slotConfigs,
        enabledSlots,
        activityLogs,
        notifications,
        unreadNotificationCount,
        mutexGlobalState,
        activeLocks,
        conflictsPrevented,
        concurrencyLogs,
        currentConflict,
        isSimulatingConcurrency,
        isBookingModalOpen,
        setIsBookingModalOpen,
        prefilledSlot,
        setPrefilledSlot,
        addServiceBay,
        updateBayStatus,
        deleteServiceBay,
        initializeFacilityBays,
        addServiceOffering,
        toggleServiceActive,
        deleteServiceOffering,
        initializeFacilityServices,
        toggleSlotConfig,
        addSlotConfig,
        bookServiceWithMutex,
        simulateConcurrentBookings,
        updateServiceStatus,
        cancelBooking,
        assignTechnicianToBooking,
        dismissConflictModal,
        addCustomerDirectly,
        addVehicleDirectly,
        updateCustomerProfile,
        markNotificationsAsRead,
        clearNotifications,
        resetAllDataToCleanState,
        getAvailableSlotsForDateAndBay,
        findAlternativeSlots,
        participantsCount,
        setParticipantsCount,
        withMutexState,
        withoutMutexState,
        runWithMutexSimulation,
        runWithoutMutexSimulation,
        resetSimulationState,
        checkSlotAvailability,
        bookSingleService
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
