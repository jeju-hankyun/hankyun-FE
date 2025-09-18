export interface StatusCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  colorClass: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  status?: 'success' | 'warning' | 'error';
  statusText?: string;
  badgeText?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  time: string;
  category: string;
}

export interface Office {
  id: number;
  name: string;
  description: string;
  status: 'occupied' | 'available';
  capacity: string;
  wifi: string;
  price: string;
  checkedIn: number;
}

export interface SidebarItem {
  id: string;
  icon: string;
  label: string;
}

export interface GlobalState {
  progress: number;
  checkedInUsers: number;
  dDay: number;
  activeTab: string;
  notifications: number;
}