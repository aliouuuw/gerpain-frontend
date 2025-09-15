// API Client for backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        // Don't override Accept header to let browser handle it
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session auth
      // Add cache control for better performance
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
}

export const apiClient = new ApiClient(API_BASE_URL);
