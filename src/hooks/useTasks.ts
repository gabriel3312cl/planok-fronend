import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/task.service';
import type { CreateTaskDto, UpdateTaskDto } from '../types/task.types';

const TASKS_KEY = ['tasks'] as const;

/**
 * Custom hook que encapsula toda la lógica de React Query para tareas.
 * Single Responsibility: solo gestiona el estado del servidor para tareas.
 */
export function useTasks() {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: TASKS_KEY,
    queryFn: () => taskService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateTaskDto) => taskService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: UpdateTaskDto }) =>
      taskService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => taskService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  });

  const tasks = tasksQuery.data ?? [];
  const isEmpty = !tasksQuery.isLoading && tasks.length === 0;

  return {
    tasks,
    isEmpty,
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    createTask: createMutation.mutateAsync,
    updateTask: updateMutation.mutateAsync,
    deleteTask: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
