import { create } from 'zustand';

interface UIState {
  isFormOpen: boolean;
  editingTaskId: string | number | null;
  searchQuery: string;
  openForm: (taskId?: string | number) => void;
  closeForm: () => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isFormOpen: false,
  editingTaskId: null,
  searchQuery: '',

  openForm: (taskId) =>
    set({ isFormOpen: true, editingTaskId: taskId ?? null }),

  closeForm: () =>
    set({ isFormOpen: false, editingTaskId: null }),

  setSearchQuery: (query) =>
    set({ searchQuery: query }),
}));
