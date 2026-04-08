import { describe, it, expect } from 'vitest';
import { aiService } from '../../services/ai.service';

describe('aiService (con MSW)', () => {
  describe('suggestSubtasks', () => {
    it('debe retornar subtareas para una descripción sobre presentación', async () => {
      const subtasks = await aiService.suggestSubtasks(
        'Preparar presentación trimestral con métricas',
      );
      expect(Array.isArray(subtasks)).toBe(true);
      expect(subtasks.length).toBeGreaterThan(0);
      expect(subtasks.some((s) => s.toLowerCase().includes('presentación'))).toBe(true);
    });

    it('debe retornar subtareas genéricas para descripción sin palabras clave', async () => {
      const subtasks = await aiService.suggestSubtasks('Hacer algo nuevo');
      expect(Array.isArray(subtasks)).toBe(true);
      expect(subtasks.length).toBeGreaterThan(0);
    });

    it('debe retornar subtareas para descripción sobre estudio', async () => {
      const subtasks = await aiService.suggestSubtasks(
        'Estudiar para el examen de certificación AWS',
      );
      expect(subtasks.some((s) => s.toLowerCase().includes('estudiar') || s.toLowerCase().includes('examen'))).toBe(true);
    });

    it('debe retornar subtareas para descripción sobre compras', async () => {
      const subtasks = await aiService.suggestSubtasks(
        'Comprar víveres en el supermercado',
      );
      expect(subtasks.some((s) => s.toLowerCase().includes('comprar') || s.toLowerCase().includes('lista'))).toBe(true);
    });
  });

  describe('classifyTask', () => {
    it('debe clasificar como "urgent" una tarea con fecha límite', async () => {
      const priority = await aiService.classifyTask(
        'Entrega final',
        'Fecha límite mañana, enviar al cliente',
      );
      expect(priority).toBe('urgent');
    });

    it('debe clasificar como "high" una tarea de oficina o trabajo importante', async () => {
      const priority = await aiService.classifyTask(
        'Reunión con equipo',
        'Preparar informe crítico para el cliente del proyecto',
      );
      expect(priority).toBe('high');
    });

    it('debe clasificar como "medium" una tarea educativa por defecto', async () => {
      const priority = await aiService.classifyTask(
        'Preparar certificación',
        'Estudiar para el curso de AWS',
      );
      expect(priority).toBe('medium');
    });

    it('debe clasificar como "low" una tarea doméstica', async () => {
      const priority = await aiService.classifyTask(
        'Compras semanales',
        'Comprar frutas y verduras para la casa',
      );
      expect(priority).toBe('low');
    });

    it('debe clasificar como "medium" si no hay palabras clave reconocibles', async () => {
      const priority = await aiService.classifyTask(
        'Algo random',
        'Nada en especial que clasificar',
      );
      expect(priority).toBe('medium');
    });
  });
});
