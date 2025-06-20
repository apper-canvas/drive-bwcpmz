import FloorView from '@/components/pages/FloorView';
import Reservations from '@/components/pages/Reservations';
import Orders from '@/components/pages/Orders';
import Dashboard from '@/components/pages/Dashboard';
import Settings from '@/components/pages/Settings';

export const routes = {
  floorView: {
    id: 'floorView',
    label: 'Floor View',
    path: '/',
    icon: 'Grid3X3',
    component: FloorView
  },
  reservations: {
    id: 'reservations',
    label: 'Reservations',
    path: '/reservations',
    icon: 'Calendar',
    component: Reservations
  },
  orders: {
    id: 'orders',
    label: 'Orders',
    path: '/orders',
    icon: 'ClipboardList',
    component: Orders
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'BarChart3',
    component: Dashboard
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);
export default routes;