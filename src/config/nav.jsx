import { IconLayoutDashboard, IconTag } from '@aviary-ui/ui';

// App-wide navigation items passed to AppLayout.
// Add/remove routes here; sidebar updates everywhere automatically.
export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Transactions', Icon: IconLayoutDashboard },
  { path: '/categories', label: 'Categories', Icon: IconTag },
];
