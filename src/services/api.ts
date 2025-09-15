// API Client for backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Global auth redirect callback
let authRedirectCallback: (() => void) | null = null;

export const setAuthRedirectCallback = (callback: () => void) => {
  authRedirectCallback = callback;
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// User types matching backend schema
export interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  roles: Array<string>;
  permissions: Array<string>;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string; // Only returned on creation
  createdAt: string;
}

// Admin types
export interface Organization {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  memberCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  organizationId: string;
  organizationName?: string;
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalOrganizations: number;
  activeInvitations: number;
  totalApiKeys: number;
}

export interface CreateUserRequest {
  email: string;
  name?: string;
  password: string;
  roles?: Array<string>;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  roles?: Array<string>;
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
}

export interface UpdateOrganizationRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface SendInvitationRequest {
  email: string;
  role?: string;
}

class ApiClient {
  private baseURL: string;
  private organizationId: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Set organization context for admin requests
  setOrganizationId(orgId: string | null) {
    this.organizationId = orgId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      // Don't override Accept header to let browser handle it
      ...options.headers as Record<string, string>,
    };

    // Add organization header for admin endpoints
    if (this.organizationId && endpoint.startsWith('/api/v1/admin')) {
      headers['X-Organization-ID'] = this.organizationId;
    }

    const config: RequestInit = {
      headers,
      credentials: 'include', // Include cookies for session auth
      // Add cache control for better performance
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 unauthorized - redirect to login
      if (response.status === 401) {
        if (authRedirectCallback) {
          authRedirectCallback();
        }
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Session expired. Please log in again.',
          },
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.error?.code || 'UNKNOWN_ERROR',
            message: data.error?.message || 'An error occurred',
            details: data.error?.details,
          },
        };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network request failed. Please check your connection.',
        },
      };
    }
  }

  // Authentication endpoints
  async signup(email: string, password: string, name?: string) {
    return this.request<{
      user: User;
      sessionId: string;
    }>('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async signin(email: string, password: string) {
    return this.request<{
      user: User;
      sessionId: string;
    }>('/api/v1/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signout() {
    return this.request('/api/v1/auth/signout', {
      method: 'POST',
    });
  }

  async getProfile() {
    return this.request<{ user: User }>('/api/v1/auth/profile');
  }

  async updateProfile(updates: { name?: string; email?: string }) {
    return this.request<{ user: User }>('/api/v1/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/api/v1/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Email verification endpoints
  async verifyEmail(token: string) {
    return this.request('/api/v1/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerificationEmail(email: string) {
    return this.request('/api/v1/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Password reset endpoints
  async requestPasswordReset(email: string) {
    return this.request('/api/v1/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // API key management
  async createApiKey(name: string) {
    return this.request<{
      id: string;
      name: string;
      key: string;
      createdAt: string;
    }>('/api/v1/auth/api-keys', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async revokeApiKey(keyId: string) {
    return this.request('/api/v1/auth/api-keys', {
      method: 'DELETE',
      body: JSON.stringify({ keyId }),
    });
  }

  // Health check
  async health() {
    return this.request('/health');
  }

  // API key authentication (for programmatic access)
  async requestWithApiKey<T>(
    endpoint: string,
    apiKey: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.error?.code || 'UNKNOWN_ERROR',
            message: data.error?.message || 'An error occurred',
            details: data.error?.details,
          },
        };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network request failed. Please check your connection.',
        },
      };
    }
  }

  // Getter for baseURL to expose it for auth store
  public getBaseURL(): string {
    return this.baseURL;
  }

  // Admin endpoints

  // Users management
  async getUsers() {
    return this.request<{ users: Array<User>; total: number }>('/api/v1/admin/users');
  }

  async getUser(userId: string) {
    return this.request<{ user: User }>(`/api/v1/admin/users/${userId}`);
  }

  async createUser(userData: CreateUserRequest) {
    return this.request<{ user: User }>('/api/v1/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: string, userData: UpdateUserRequest) {
    return this.request<{ user: User }>(`/api/v1/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string) {
    return this.request(`/api/v1/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // User roles management
  async assignRole(userId: string, roleId: string) {
    return this.request(`/api/v1/admin/users/${userId}/roles`, {
      method: 'POST',
      body: JSON.stringify({ roleId }),
    });
  }

  async removeRole(userId: string, roleId: string) {
    return this.request(`/api/v1/admin/users/${userId}/roles/${roleId}`, {
      method: 'DELETE',
    });
  }

  // Organizations management
  async getOrganizations() {
    return this.request<{ organizations: Array<Organization>; total: number }>('/api/v1/admin/organizations');
  }

  async getOrganization(orgId: string) {
    return this.request<{ organization: Organization }>(`/api/v1/admin/organizations/${orgId}`);
  }

  async createOrganization(orgData: CreateOrganizationRequest) {
    return this.request<{ organization: Organization }>('/api/v1/admin/organizations', {
      method: 'POST',
      body: JSON.stringify(orgData),
    });
  }

  async updateOrganization(orgId: string, orgData: UpdateOrganizationRequest) {
    return this.request<{ organization: Organization }>(`/api/v1/admin/organizations/${orgId}`, {
      method: 'PUT',
      body: JSON.stringify(orgData),
    });
  }

  async deleteOrganization(orgId: string) {
    return this.request(`/api/v1/admin/organizations/${orgId}`, {
      method: 'DELETE',
    });
  }

  // Organization invitations
  async sendInvitation(invitationData: SendInvitationRequest) {
    return this.request<{ invitation: Invitation }>('/api/v1/admin/organizations/invitations', {
      method: 'POST',
      body: JSON.stringify(invitationData),
    });
  }

  async getInvitations() {
    return this.request<{ invitations: Array<Invitation>; total: number }>('/api/v1/admin/organizations/invitations');
  }

  async cancelInvitation(invitationId: string) {
    return this.request(`/api/v1/admin/organizations/invitations/${invitationId}`, {
      method: 'DELETE',
    });
  }

  // Organization members
  async removeMember(orgId: string, userId: string) {
    return this.request(`/api/v1/admin/organizations/${orgId}/members/${userId}`, {
      method: 'DELETE',
    });
  }

  // Admin stats
  async getAdminStats() {
    return this.request<AdminStats>('/api/v1/admin/stats');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
