export type TaskCategory = 'personal' | 'trabajo' | 'urgente' | 'estudio' | 'salud' | 'finanzas' | 'otro';

export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  subTasks: SubTask[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  category?: TaskCategory;
  status?: TaskStatus;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  category?: TaskCategory;
  status?: TaskStatus;
  subTasks?: SubTask[];
}
