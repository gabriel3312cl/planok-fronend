import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useAI } from '../../hooks/useAI';
import { useTaskFilters } from '../../hooks/useTaskFilters';
import { useUIStore } from '../../store/ui.store';
import { mockTasks } from '../mock-data';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useTasks hook', () => {
  it('debe cargar tareas desde la API mock', async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tasks.length).toBeGreaterThan(0);
    expect(result.current.isEmpty).toBe(false);
  });

  it('debe crear una tarea nueva', async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialCount = result.current.tasks.length;

    await act(async () => {
      await result.current.createTask({
        title: 'Tarea desde hook test',
        description: 'Creada en prueba unitaria',
      });
    });

    await waitFor(() => {
      expect(result.current.tasks.length).toBe(initialCount + 1);
    });
  });

  it('debe eliminar una tarea', async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialCount = result.current.tasks.length;
    const taskToDelete = result.current.tasks[0];

    await act(async () => {
      await result.current.deleteTask(taskToDelete.id);
    });

    await waitFor(() => {
      expect(result.current.tasks.length).toBe(initialCount - 1);
    });
  });
});

describe('useAI hook', () => {
  it('debe sugerir subtareas', async () => {
    const { result } = renderHook(() => useAI(), {
      wrapper: createWrapper(),
    });

    let subtasks: string[] = [];
    await act(async () => {
      subtasks = await result.current.suggestSubtasks('Preparar presentación con slides');
    });

    expect(subtasks.length).toBeGreaterThan(0);
  });

  it('debe clasificar una tarea', async () => {
    const { result } = renderHook(() => useAI(), {
      wrapper: createWrapper(),
    });

    let priority: string = '';
    await act(async () => {
      priority = await result.current.classifyTask({
        title: 'Reunión semanal',
        description: 'Reunión con el equipo de trabajo en la oficina',
      });
    });

    expect(priority).toBe('high');
  });
});

describe('useTaskFilters hook', () => {
  beforeEach(() => {
    useUIStore.setState({ searchQuery: '' });
  });

  it('debe retornar todas las tareas si no hay búsqueda', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks));
    expect(result.current.filteredTasks).toHaveLength(mockTasks.length);
  });

  it('debe filtrar tareas por título', () => {
    useUIStore.setState({ searchQuery: 'urgente' });
    const { result } = renderHook(() => useTaskFilters(mockTasks));
    expect(result.current.filteredTasks.length).toBeGreaterThan(0);
    result.current.filteredTasks.forEach((t) => {
      const match =
        t.title.toLowerCase().includes('urgente') ||
        t.description.toLowerCase().includes('urgente') ||
        t.priority.toLowerCase().includes('urgente');
      expect(match).toBe(true);
    });
  });

  it('debe filtrar tareas por prioridad', () => {
    useUIStore.setState({ searchQuery: 'medium' });
    const { result } = renderHook(() => useTaskFilters(mockTasks));
    expect(result.current.filteredTasks.length).toBeGreaterThan(0);
  });

  it('debe retornar array vacío si la búsqueda no coincide', () => {
    useUIStore.setState({ searchQuery: 'zzzznoexiste' });
    const { result } = renderHook(() => useTaskFilters(mockTasks));
    expect(result.current.filteredTasks).toHaveLength(0);
  });

  it('debe ignorar espacios en blanco en la búsqueda', () => {
    useUIStore.setState({ searchQuery: '   ' });
    const { result } = renderHook(() => useTaskFilters(mockTasks));
    expect(result.current.filteredTasks).toHaveLength(mockTasks.length);
  });
});
