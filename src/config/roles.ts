export const PERMISSIONS = {
  CREATE_USER: 'CREATE_USER',
  CREATE_CLIENT: 'CREATE_CLIENT',
};

export type RoleType = {
  id: string;
  label: string;
  permissions?: Array<keyof typeof PERMISSIONS>;
};

export const DEFINED_ROLES: Readonly<Record<string, RoleType>> = Object.freeze({
  SUPER_ADMIN: {
    id: 'SUPER_ADMIN',
    label: 'SPT Super Admin',
    permissions: ['CREATE_USER', 'CREATE_CLIENT'],
  },
  ADMIN: {
    id: 'ADMIN',
    label: 'SPT Admin',
  },
  USER: {
    id: 'USER',
    label: 'Driver',
  },
  AGENCIES: {
    id: 'AGENCIES',
    label: 'Agencies',
  },
  CUSTOM_ROLES: {
    id: 'CUSTOM_ROLES',
    label: 'Custom Roles',
  },
});

export const ROLE = Object.freeze({
  0: DEFINED_ROLES.SUPER_ADMIN,
  1: DEFINED_ROLES.ADMIN,
  2: DEFINED_ROLES.USER,
  3: DEFINED_ROLES.AGENCIES,
});

export function getRole(role: keyof typeof ROLE | keyof typeof DEFINED_ROLES) {
  if (typeof role === 'number') {
    return ROLE[role];
  }
  if (typeof role === 'string') {
    return DEFINED_ROLES[role];
  }
}

export const DEFINED_ROLES_LIST = Object.freeze(Object.keys(DEFINED_ROLES)) as unknown as keyof typeof DEFINED_ROLES;
