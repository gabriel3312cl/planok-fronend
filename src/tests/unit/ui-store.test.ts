import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../../store/ui.store';

describe('useUIStore', () => {
  beforeEach(() => {
    // Reset store entre tests
    useUIStore.setState({
      isFormOpen: false,
      editingTaskId: null,
      searchQuery: '',
    });
  });

  it('debe tener estado inicial correcto', () => {
    const state = useUIStore.getState();
    expect(state.isFormOpen).toBe(false);
    expect(state.editingTaskId).toBeNull();
    expect(state.searchQuery).toBe('');
  });

  it('openForm() debe abrir el formulario sin taskId (modo crear)', () => {
    useUIStore.getState().openForm();
    const state = useUIStore.getState();
    expect(state.isFormOpen).toBe(true);
    expect(state.editingTaskId).toBeNull();
  });

  it('openForm(id) debe abrir el formulario en modo edición con el id correcto', () => {
    useUIStore.getState().openForm('task-123');
    const state = useUIStore.getState();
    expect(state.isFormOpen).toBe(true);
    expect(state.editingTaskId).toBe('task-123');
  });

  it('closeForm() debe cerrar el formulario y limpiar editingTaskId', () => {
    useUIStore.getState().openForm('task-123');
    useUIStore.getState().closeForm();
    const state = useUIStore.getState();
    expect(state.isFormOpen).toBe(false);
    expect(state.editingTaskId).toBeNull();
  });

  it('setSearchQuery() debe actualizar la búsqueda', () => {
    useUIStore.getState().setSearchQuery('presentación');
    expect(useUIStore.getState().searchQuery).toBe('presentación');
  });

  it('setSearchQuery("") debe limpiar la búsqueda', () => {
    useUIStore.getState().setSearchQuery('algo');
    useUIStore.getState().setSearchQuery('');
    expect(useUIStore.getState().searchQuery).toBe('');
  });
});
