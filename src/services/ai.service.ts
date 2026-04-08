import { httpClient } from './http.client';
import type { TaskCategory } from '../types/task.types';

interface SuggestSubtasksResponse {
  subtasks: string[];
}

interface ClassifyResponse {
  category: TaskCategory;
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

  async classifyTask(title: string, description: string): Promise<TaskCategory> {
    const { data } = await httpClient.post<ClassifyResponse>('/ai/classify', {
      title,
      description,
    });
    return data.category;
  }
}

export const aiService = new AIService();
