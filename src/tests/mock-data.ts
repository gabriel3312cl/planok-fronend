import type { Task, CreateTaskDto } from '../types/task.types';

export const mockTask: Task = {
  id: 'test-1',
  title: 'Tarea de prueba',
  description: 'Descripción de la tarea de prueba para testing',
  priority: 'medium',
  status: 'pending',
  created_at: '2026-04-01T10:00:00Z',
  updated_at: '2026-04-01T10:00:00Z',
};

export const mockTaskUrgent: Task = {
  ...mockTask,
  id: 'test-3',
  title: 'Entrega urgente',
  description: 'Fecha límite mañana, entregar informe al cliente',
  priority: 'urgent',
  status: 'pending',
};

export const mockTaskCompleted: Task = {
  ...mockTask,
  id: 'test-4',
  title: 'Tarea completada',
  description: 'Esta tarea ya fue finalizada',
  priority: 'low',
  status: 'completed',
};

export const mockTasks: Task[] = [
  mockTask,
  mockTaskUrgent,
  mockTaskCompleted,
];

export const mockCreateTaskDto: CreateTaskDto = {
  title: 'Nueva tarea',
  description: 'Descripción de nueva tarea para crear',
  priority: 'high',
  status: 'pending',
};

export const mockEmptyTasks: Task[] = [];
