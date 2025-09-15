// Authentication utility functions for session-based auth
export const checkAuth = () => {
  // Since we're using session cookies, we can't directly check auth status
  // This will be handled by the auth store's initialize method
  return { isAuthenticated: false } // Default to false, will be updated by store
}

// No need to manually clear auth data since cookies are handled by browser
export const clearAuth = () => {
  // Session cookies are automatically cleared when logout is called
}

// Helper function to check if user has specific role
export const hasRole = (user: any, role: string): boolean => {
  return user?.roles?.includes(role) || false;
}

// Helper function to check if user has specific permission
export const hasPermission = (user: any, permission: string): boolean => {
  return user?.permissions?.includes(permission) || false;
}

// Helper function to check if user has any of the specified roles
export const hasAnyRole = (user: any, roles: string[]): boolean => {
  return roles.some(role => hasRole(user, role));
}

// Helper function to check if user has all specified roles
export const hasAllRoles = (user: any, roles: string[]): boolean => {
  return roles.every(role => hasRole(user, role));
}
