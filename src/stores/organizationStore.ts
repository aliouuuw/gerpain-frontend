import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../services/api';
import type { Organization } from '../services/api';

interface OrganizationState {
  organizations: Organization[];
  selectedOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadOrganizations: () => Promise<void>;
  setSelectedOrganization: (org: Organization | null) => void;
  clearError: () => void;
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set, get) => ({
      organizations: [],
      selectedOrganization: null,
      isLoading: false,
      error: null,

      loadOrganizations: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.getOrganizations();

          if (response.success && response.data) {
            const organizations = response.data.organizations;
            set({
              organizations,
              isLoading: false,
              error: null,
            });

            // If no organization is selected and we have organizations, select the first one
            const state = get();
            if (!state.selectedOrganization && organizations.length > 0) {
              state.setSelectedOrganization(organizations[0]);
            }
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

      setSelectedOrganization: (org: Organization | null) => {
        set({ selectedOrganization: org });
        // Update the API client with the selected organization ID
        apiClient.setOrganizationId(org?.id || null);
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'organization-storage',
      partialize: (state) => ({
        selectedOrganization: state.selectedOrganization,
      }),
    }
  )
);

