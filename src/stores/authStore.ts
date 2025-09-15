import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../services/api';
import type { User } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  signin: (email: string, password: string) => Promise<boolean>;
  signout: () => Promise<void>;
  loadProfile: () => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;
  getUserProfile: () => Promise<User | null>;

  // Helper functions
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  checkSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signup: async (email: string, password: string, name?: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.signup(email, password, name);

          if (response.success && response.data) {
            const { user } = response.data;

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return true;
          } else {
            set({
              isLoading: false,
              error: response.error?.message || 'Signup failed',
            });
            return false;
          }
        } catch (error) {
          set({
            isLoading: false,
            error: 'Network error occurred',
          });
          return false;
        }
      },

      signin: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.signin(email, password);

          if (response.success && response.data) {
            const { user } = response.data;

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return true;
          } else {
            set({
              isLoading: false,
              error: response.error?.message || 'Signin failed',
            });
            return false;
          }
        } catch (error) {
          set({
            isLoading: false,
            error: 'Network error occurred',
          });
          return false;
        }
      },

      signout: async () => {
        try {
          await apiClient.signout();
        } catch (error) {
          // Ignore logout errors
        }

        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      loadProfile: async () => {
        // Prevent multiple simultaneous profile loads
        const state = get();
        if (state.isLoading) {
          return; // Already loading, skip
        }

        set({ isLoading: true });

        try {
          const response = await apiClient.getProfile();

          if (response.success && response.data) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Profile load failed, user might be logged out
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),

      initialize: async () => {
        // Only load profile if we think we're authenticated but don't have user data
        // This reduces unnecessary API calls on app startup
        const state = get();
        if (state.isAuthenticated && !state.user) {
          await state.loadProfile();
        }
      },

      // Lazy profile loading - only load when data is actually needed
      getUserProfile: async () => {
        const state = get();
        if (state.user) {
          return state.user; // Return cached user data
        }

        // Load profile if not cached
        await state.loadProfile();
        return get().user;
      },

      hasRole: (role: string) => {
        const user = get().user;
        return user?.roles.includes(role) || false;
      },

      hasPermission: (permission: string) => {
        const user = get().user;
        return user?.permissions.includes(permission) || false;
      },

      checkSession: async () => {
        // Quick session check without full profile load
        const state = get();
        if (!state.isAuthenticated || !state.user) {
          return false;
        }

        try {
          // Make a lightweight request to check session validity
          const response = await fetch(`${apiClient.getBaseURL()}/api/v1/auth/profile`, {
            method: 'HEAD', // HEAD request is lighter than GET
            credentials: 'include',
          });

          if (response.ok) {
            return true;
          } else if (response.status === 401) {
            // Session expired, clear auth state
            get().signout();
            return false;
          }
        } catch (error) {
          console.warn('Session check failed:', error);
          // If we can't check, assume session is still valid
          return true;
        }

        return false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
