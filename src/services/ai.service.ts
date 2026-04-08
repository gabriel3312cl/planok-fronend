import { httpClient } from './http.client';
import type { TaskPriority } from '../types/task.types';

interface SuggestSubtasksResponse {
  subtasks: string[];
}

interface ClassifyResponse {
  priority: TaskPriority;
}

/**
 * Single Responsibility: comunicación HTTP exclusiva para endpoints de IA.
 */
class AIService {
  async suggestSubtasks(description: string): Promise<string[]> {
    const { data } = await httpClient.post<SuggestSubtasksResponse>(
      '/ai/suggest-subtasks',
      { description },
    );
    return data.subtasks;
  }

  async classifyTask(title: string, description: string): Promise<TaskPriority> {
    const { data } = await httpClient.post<ClassifyResponse>('/ai/classify', {
      title,
      description,
    });
    return (data as any).category || (data as any).priority || 'medium';
  }
}

export const aiService = new AIService();
