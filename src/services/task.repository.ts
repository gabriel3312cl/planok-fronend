import type { Task, CreateTaskDto, UpdateTaskDto } from '../types/task.types';

/**
 * Interface Segregation: define solo las operaciones necesarias para tareas.
 * Dependency Inversion: los hooks dependen de esta abstracción, no de axios directamente.
 */
export interface TaskRepository {
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task>;
  create(data: CreateTaskDto): Promise<Task>;
  update(id: string, data: UpdateTaskDto): Promise<Task>;
  remove(id: string): Promise<void>;
}
