export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: number | string;
  title: string;
  description: string;
  status: TaskStatus;
  status_display?: string;
  priority: TaskPriority;
  priority_display?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}
