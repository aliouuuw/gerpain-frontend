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

  // Helper functions
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
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
        try {
          const response = await apiClient.getProfile();

          if (response.success && response.data) {
            set({
              user: response.data.user,
              isAuthenticated: true,
            });
          } else {
            // Profile load failed, user might be logged out
            set({
              user: null,
              isAuthenticated: false,
            });
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      clearError: () => set({ error: null }),

      initialize: async () => {
        // Try to load user profile to check if session is valid
        await get().loadProfile();
      },

      hasRole: (role: string) => {
        const user = get().user;
        return user?.roles.includes(role) || false;
      },

      hasPermission: (permission: string) => {
        const user = get().user;
        return user?.permissions.includes(permission) || false;
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
