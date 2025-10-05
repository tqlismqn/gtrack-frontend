export type MenuItem = { path: string; label: string; icon?: string; order?: number };
export type MenuGroup = { title: string; items: MenuItem[]; order?: number };

export const MENU: MenuGroup[] = [
  {
    title: 'Рабочее место',
    order: 10,
    items: [
      { path: '/dashboard', label: 'Дашборд', icon: 'dashboard', order: 10 },
    ],
  },
  {
    title: 'Операции',
    order: 20,
    items: [
      { path: '/orders', label: 'Заявки', icon: 'assignment', order: 10 },
      { path: '/invoices', label: 'Счета', icon: 'request_quote', order: 20 },
      { path: '/customers', label: 'Клиенты', icon: 'badge', order: 30 },
    ],
  },
  {
    title: 'Доступы',
    order: 30,
    items: [
      {
        path: '/permissions',
        label: 'Права и роли',
        icon: 'admin_panel_settings',
        order: 10,
      },
    ],
  },
  {
    title: 'Администрирование',
    order: 40,
    items: [
      { path: '/settings', label: 'Настройки', icon: 'tune', order: 10 },
      {
        path: '/admin/users',
        label: 'Админ — Пользователи',
        icon: 'group',
        order: 20,
      },
      {
        path: '/admin/roles',
        label: 'Админ — Роли',
        icon: 'workspace_premium',
        order: 30,
      },
      {
        path: '/super_admin/companies',
        label: 'Суперадмин — Компании',
        icon: 'domain',
        order: 40,
      },
      {
        path: '/super_admin/users',
        label: 'Суперадмин — Пользователи',
        icon: 'supervisor_account',
        order: 50,
      },
      {
        path: '/bank_collections',
        label: 'Суперадмин — Банковские поручения',
        icon: 'account_balance',
        order: 60,
      },
    ],
  },
];
