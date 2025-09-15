import { create } from 'zustand';
import type { Toast } from '../components/Toast';

interface ToastStore {
  toasts: Array<Toast>;

  // Actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Convenience methods
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  success: (title, message, duration = 5000) => {
    get().addToast({ type: 'success', title, message, duration });
  },

  error: (title, message, duration = 7000) => {
    get().addToast({ type: 'error', title, message, duration });
  },

  warning: (title, message, duration = 6000) => {
    get().addToast({ type: 'warning', title, message, duration });
  },

  info: (title, message, duration = 5000) => {
    get().addToast({ type: 'info', title, message, duration });
  },
}));

