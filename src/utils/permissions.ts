import { UserRole, NavigationTab } from '../types';

export const ALL_TABS: NavigationTab[] = [
  'home',
  'notification',
  'with-mutex',
  'without-mutex',
  'booking',
  'dashboard',
  'notifications'
];

export const ROLE_PERMISSIONS: Record<UserRole, NavigationTab[]> = {
  admin: ALL_TABS,
  'service-manager': ALL_TABS,
  'service-advisor': ALL_TABS,
  'service-technician': ALL_TABS,
  customer: ALL_TABS
};

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  admin: 'Administrator',
  'service-manager': 'Service Manager',
  'service-advisor': 'Service Advisor',
  'service-technician': 'Service Technician',
  customer: 'Customer'
};

export const isTabAllowedForRole = (_role: UserRole, tab: NavigationTab): boolean => {
  return ALL_TABS.includes(tab);
};
