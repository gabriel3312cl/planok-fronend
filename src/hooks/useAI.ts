import { useMutation } from '@tanstack/react-query';
import { aiService } from '../services/ai.service';
import type { TaskPriority } from '../types/task.types';

/**
 * Custom hook para las funcionalidades de IA.
 * Separa la lógica de IA de los componentes (SRP).
 */
export function useAI() {
  const suggestMutation = useMutation({
    mutationFn: (description: string) => aiService.suggestSubtasks(description),
  });

  const classifyMutation = useMutation({
    mutationFn: ({ title, description }: { title: string; description: string }) =>
      aiService.classifyTask(title, description),
  });

  return {
    suggestSubtasks: suggestMutation.mutateAsync,
    isSuggesting: suggestMutation.isPending,
    suggestedSubtasks: suggestMutation.data ?? [],

    classifyTask: classifyMutation.mutateAsync,
    isClassifying: classifyMutation.isPending,
    classifiedPriority: classifyMutation.data as TaskPriority | undefined,
  };
}
