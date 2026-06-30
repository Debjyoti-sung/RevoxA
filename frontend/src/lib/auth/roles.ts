export type UserRole = 'user' | 'manager' | 'admin' | 'owner';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 1,
  manager: 2,
  admin: 3,
  owner: 4,
};

export function hasRoleOrHigher(currentRole: UserRole, requiredRole: UserRole): boolean {
  const currentLevel = ROLE_HIERARCHY[currentRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return currentLevel >= requiredLevel;
}
