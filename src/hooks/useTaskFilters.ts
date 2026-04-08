import { useMemo } from 'react';
import type { Task } from '../types/task.types';
import { useUIStore } from '../store/ui.store';

/**
 * Custom hook para filtrar tareas por búsqueda.
 */
export function useTaskFilters(tasks: Task[]) {
  const searchQuery = useUIStore((s) => s.searchQuery);

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.priority.toLowerCase().includes(q),
    );
  }, [tasks, searchQuery]);

  return { filteredTasks, searchQuery };
}
