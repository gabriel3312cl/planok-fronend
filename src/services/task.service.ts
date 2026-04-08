import { httpClient } from './http.client';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types/task.types';
import type { TaskRepository } from './task.repository';

/**
 * Implementación concreta del repositorio de tareas.
 * Single Responsibility: solo se encarga de la comunicación HTTP para tareas.
 */
class TaskService implements TaskRepository {
  async getAll(): Promise<Task[]> {
    const { data } = await httpClient.get<Task[]>('/tasks');
    return data;
  }

  async getById(id: string): Promise<Task> {
    const { data } = await httpClient.get<Task>(`/tasks/${id}`);
    return data;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const { data } = await httpClient.post<Task>('/tasks', dto);
    return data;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const { data } = await httpClient.put<Task>(`/tasks/${id}`, dto);
    return data;
  }

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/tasks/${id}`);
  }
}

export const taskService: TaskRepository = new TaskService();
