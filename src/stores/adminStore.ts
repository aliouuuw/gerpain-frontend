import { create } from 'zustand';
import { apiClient } from '../services/api';
import type {
  User,
  Organization,
  Invitation,
  AdminStats,
  CreateUserRequest,
  UpdateUserRequest,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  SendInvitationRequest,
} from '../services/api';
import { useToastStore } from './toastStore';

interface AdminState {
  // Data
  users: User[];
  organizations: Organization[];
  invitations: Invitation[];
  stats: AdminStats | null;

  // Loading states
  isLoading: boolean;
  isCreatingUser: boolean;
  isUpdatingUser: boolean;
  isDeletingUser: boolean;
  isCreatingOrg: boolean;
  isUpdatingOrg: boolean;
  isDeletingOrg: boolean;
  isSendingInvitation: boolean;

  // Errors
  error: string | null;

  // Actions
  // Users
  loadUsers: () => Promise<void>;
  createUser: (userData: CreateUserRequest) => Promise<boolean>;
  updateUser: (userId: string, userData: UpdateUserRequest) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  assignRole: (userId: string, roleId: string) => Promise<boolean>;
  removeRole: (userId: string, roleId: string) => Promise<boolean>;

  // Organizations
  loadOrganizations: () => Promise<void>;
  createOrganization: (orgData: CreateOrganizationRequest) => Promise<boolean>;
  updateOrganization: (orgId: string, orgData: UpdateOrganizationRequest) => Promise<boolean>;
  deleteOrganization: (orgId: string) => Promise<boolean>;

  // Invitations
  loadInvitations: () => Promise<void>;
  sendInvitation: (invitationData: SendInvitationRequest) => Promise<boolean>;
  cancelInvitation: (invitationId: string) => Promise<boolean>;

  // Stats
  loadStats: () => Promise<void>;

  // Utils
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial state
  users: [],
  organizations: [],
  invitations: [],
  stats: null,

  isLoading: false,
  isCreatingUser: false,
  isUpdatingUser: false,
  isDeletingUser: false,
  isCreatingOrg: false,
  isUpdatingOrg: false,
  isDeletingOrg: false,
  isSendingInvitation: false,

  error: null,

  // Users actions
  loadUsers: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.getUsers();

      if (response.success && response.data) {
        set({
          users: response.data.users,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isLoading: false,
          error: response.error?.message || 'Failed to load users',
        });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: 'Network error occurred',
      });
    }
  },

  createUser: async (userData: CreateUserRequest) => {
    set({ isCreatingUser: true, error: null });

    try {
      const response = await apiClient.createUser(userData);

      if (response.success && response.data) {
        const newUser = response.data.user;
        set((state) => ({
          users: [...state.users, newUser],
          isCreatingUser: false,
          error: null,
        }));
        useToastStore.getState().success('User created successfully', `User ${newUser.email} has been created.`);
        return true;
      } else {
        const errorMessage = response.error?.message || 'Failed to create user';
        set({
          isCreatingUser: false,
          error: errorMessage,
        });
        useToastStore.getState().error('Failed to create user', errorMessage);
        return false;
      }
    } catch (error) {
      const errorMessage = 'Network error occurred';
      set({
        isCreatingUser: false,
        error: errorMessage,
      });
      useToastStore.getState().error('Network error', errorMessage);
      return false;
    }
  },

  updateUser: async (userId: string, userData: UpdateUserRequest) => {
    set({ isUpdatingUser: true, error: null });

    try {
      const response = await apiClient.updateUser(userId, userData);

      if (response.success && response.data) {
        const updatedUser = response.data.user;
        set((state) => ({
          users: state.users.map(user =>
            user.id === userId ? updatedUser : user
          ),
          isUpdatingUser: false,
          error: null,
        }));
        return true;
      } else {
        set({
          isUpdatingUser: false,
          error: response.error?.message || 'Failed to update user',
        });
        return false;
      }
    } catch (error) {
      set({
        isUpdatingUser: false,
        error: 'Network error occurred',
      });
      return false;
    }
  },

  deleteUser: async (userId: string) => {
    set({ isDeletingUser: true, error: null });

    try {
      const response = await apiClient.deleteUser(userId);

      if (response.success) {
        set((state) => ({
          users: state.users.filter(user => user.id !== userId),
          isDeletingUser: false,
          error: null,
        }));
        useToastStore.getState().success('User deleted successfully');
        return true;
      } else {
        const errorMessage = response.error?.message || 'Failed to delete user';
        set({
          isDeletingUser: false,
          error: errorMessage,
        });
        useToastStore.getState().error('Failed to delete user', errorMessage);
        return false;
      }
    } catch (error) {
      const errorMessage = 'Network error occurred';
      set({
        isDeletingUser: false,
        error: errorMessage,
      });
      useToastStore.getState().error('Network error', errorMessage);
      return false;
    }
  },

  assignRole: async (userId: string, roleId: string) => {
    try {
      const response = await apiClient.assignRole(userId, roleId);

      if (response.success) {
        // Refresh users to get updated roles
        await get().loadUsers();
        return true;
      } else {
        set({ error: response.error?.message || 'Failed to assign role' });
        return false;
      }
    } catch (error) {
      set({ error: 'Network error occurred' });
      return false;
    }
  },

  removeRole: async (userId: string, roleId: string) => {
    try {
      const response = await apiClient.removeRole(userId, roleId);

      if (response.success) {
        // Refresh users to get updated roles
        await get().loadUsers();
        return true;
      } else {
        set({ error: response.error?.message || 'Failed to remove role' });
        return false;
      }
    } catch (error) {
      set({ error: 'Network error occurred' });
      return false;
    }
  },

  // Organizations actions
  loadOrganizations: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.getOrganizations();

      if (response.success && response.data) {
        set({
          organizations: response.data.organizations,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isLoading: false,
          error: response.error?.message || 'Failed to load organizations',
        });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: 'Network error occurred',
      });
    }
  },

  createOrganization: async (orgData: CreateOrganizationRequest) => {
    set({ isCreatingOrg: true, error: null });

    try {
      const response = await apiClient.createOrganization(orgData);

      if (response.success && response.data) {
        const newOrg = response.data.organization;
        set((state) => ({
          organizations: [...state.organizations, newOrg],
          isCreatingOrg: false,
          error: null,
        }));
        return true;
      } else {
        set({
          isCreatingOrg: false,
          error: response.error?.message || 'Failed to create organization',
        });
        return false;
      }
    } catch (error) {
      set({
        isCreatingOrg: false,
        error: 'Network error occurred',
      });
      return false;
    }
  },

  updateOrganization: async (orgId: string, orgData: UpdateOrganizationRequest) => {
    set({ isUpdatingOrg: true, error: null });

    try {
      const response = await apiClient.updateOrganization(orgId, orgData);

      if (response.success && response.data) {
        const updatedOrg = response.data.organization;
        set((state) => ({
          organizations: state.organizations.map(org =>
            org.id === orgId ? updatedOrg : org
          ),
          isUpdatingOrg: false,
          error: null,
        }));
        return true;
      } else {
        set({
          isUpdatingOrg: false,
          error: response.error?.message || 'Failed to update organization',
        });
        return false;
      }
    } catch (error) {
      set({
        isUpdatingOrg: false,
        error: 'Network error occurred',
      });
      return false;
    }
  },

  deleteOrganization: async (orgId: string) => {
    set({ isDeletingOrg: true, error: null });

    try {
      const response = await apiClient.deleteOrganization(orgId);

      if (response.success) {
        set((state) => ({
          organizations: state.organizations.filter(org => org.id !== orgId),
          isDeletingOrg: false,
          error: null,
        }));
        return true;
      } else {
        set({
          isDeletingOrg: false,
          error: response.error?.message || 'Failed to delete organization',
        });
        return false;
      }
    } catch (error) {
      set({
        isDeletingOrg: false,
        error: 'Network error occurred',
      });
      return false;
    }
  },

  // Invitations actions
  loadInvitations: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.getInvitations();

      if (response.success && response.data) {
        set({
          invitations: response.data.invitations,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isLoading: false,
          error: response.error?.message || 'Failed to load invitations',
        });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: 'Network error occurred',
      });
    }
  },

  sendInvitation: async (invitationData: SendInvitationRequest) => {
    set({ isSendingInvitation: true, error: null });

    try {
      const response = await apiClient.sendInvitation(invitationData);

      if (response.success && response.data) {
        const newInvitation = response.data.invitation;
        set((state) => ({
          invitations: [...state.invitations, newInvitation],
          isSendingInvitation: false,
          error: null,
        }));
        return true;
      } else {
        set({
          isSendingInvitation: false,
          error: response.error?.message || 'Failed to send invitation',
        });
        return false;
      }
    } catch (error) {
      set({
        isSendingInvitation: false,
        error: 'Network error occurred',
      });
      return false;
    }
  },

  cancelInvitation: async (invitationId: string) => {
    try {
      const response = await apiClient.cancelInvitation(invitationId);

      if (response.success) {
        set((state) => ({
          invitations: state.invitations.filter(inv => inv.id !== invitationId),
          error: null,
        }));
        return true;
      } else {
        set({ error: response.error?.message || 'Failed to cancel invitation' });
        return false;
      }
    } catch (error) {
      set({ error: 'Network error occurred' });
      return false;
    }
  },

  // Stats
  loadStats: async () => {
    try {
      const response = await apiClient.getAdminStats();

      if (response.success && response.data) {
        set({ stats: response.data });
      } else {
        // Don't set error for stats, just silently fail
        set({ stats: null });
      }
    } catch (error) {
      set({ stats: null });
    }
  },

  // Utils
  clearError: () => set({ error: null }),
}));
