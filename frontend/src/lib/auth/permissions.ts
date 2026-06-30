import { UserRole, hasRoleOrHigher } from './roles';

export type PermissionAction =
  | 'feedback:read'
  | 'feedback:write'
  | 'feedback:delete'
  | 'memory:read'
  | 'memory:write'
  | 'recommendations:resolve'
  | 'admin:access'
  | 'settings:write';

const PERMISSION_ROLES: Record<PermissionAction, UserRole> = {
  'feedback:read': 'user',
  'feedback:write': 'manager',
  'feedback:delete': 'admin',
  'memory:read': 'user',
  'memory:write': 'manager',
  'recommendations:resolve': 'manager',
  'admin:access': 'admin',
  'settings:write': 'admin',
};

export function canPerformAction(role: UserRole, action: PermissionAction): boolean {
  const requiredRole = PERMISSION_ROLES[action];
  if (!requiredRole) return false;
  return hasRoleOrHigher(role, requiredRole);
}
