import type { Task, CreateTaskDto, SubTask } from '../types/task.types';

export const mockSubTasks: SubTask[] = [
  { id: 'st-1', title: 'Subtarea 1', completed: true },
  { id: 'st-2', title: 'Subtarea 2', completed: false },
];

export const mockTask: Task = {
  id: 'test-1',
  title: 'Tarea de prueba',
  description: 'Descripción de la tarea de prueba para testing',
  category: 'trabajo',
  status: 'pendiente',
  subTasks: [],
  createdAt: '2026-04-01T10:00:00Z',
  updatedAt: '2026-04-01T10:00:00Z',
};

export const mockTaskWithSubtasks: Task = {
  ...mockTask,
  id: 'test-2',
  title: 'Tarea con subtareas',
  description: 'Preparar presentación trimestral con gráficos',
  subTasks: mockSubTasks,
};

export const mockTaskUrgent: Task = {
  ...mockTask,
  id: 'test-3',
  title: 'Entrega urgente',
  description: 'Fecha límite mañana, entregar informe al cliente',
  category: 'urgente',
  status: 'en_progreso',
};

export const mockTaskCompleted: Task = {
  ...mockTask,
  id: 'test-4',
  title: 'Tarea completada',
  description: 'Esta tarea ya fue finalizada',
  category: 'personal',
  status: 'completada',
};

export const mockTasks: Task[] = [
  mockTask,
  mockTaskWithSubtasks,
  mockTaskUrgent,
  mockTaskCompleted,
];

export const mockCreateTaskDto: CreateTaskDto = {
  title: 'Nueva tarea',
  description: 'Descripción de nueva tarea para crear',
  category: 'estudio',
  status: 'pendiente',
};

export const mockEmptyTasks: Task[] = [];
