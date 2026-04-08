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
    it('debe clasificar como "urgente" una tarea con fecha límite', async () => {
      const category = await aiService.classifyTask(
        'Entrega final',
        'Fecha límite mañana, enviar al cliente',
      );
      expect(category).toBe('urgente');
    });

    it('debe clasificar como "trabajo" una tarea de oficina', async () => {
      const category = await aiService.classifyTask(
        'Reunión con equipo',
        'Preparar informe para el cliente del proyecto',
      );
      expect(category).toBe('trabajo');
    });

    it('debe clasificar como "estudio" una tarea educativa', async () => {
      const category = await aiService.classifyTask(
        'Preparar certificación',
        'Estudiar para el curso de AWS',
      );
      expect(category).toBe('estudio');
    });

    it('debe clasificar como "personal" una tarea doméstica', async () => {
      const category = await aiService.classifyTask(
        'Compras semanales',
        'Comprar frutas y verduras para la casa',
      );
      expect(category).toBe('personal');
    });

    it('debe clasificar como "salud" una tarea médica', async () => {
      const category = await aiService.classifyTask(
        'Cita médica',
        'Ir al doctor para control anual',
      );
      expect(category).toBe('salud');
    });

    it('debe clasificar como "finanzas" una tarea económica', async () => {
      const category = await aiService.classifyTask(
        'Pago mensual',
        'Pagar la factura de servicios y revisar presupuesto',
      );
      expect(category).toBe('finanzas');
    });

    it('debe clasificar como "otro" si no hay palabras clave reconocibles', async () => {
      const category = await aiService.classifyTask(
        'Algo random',
        'Nada en especial que clasificar',
      );
      expect(category).toBe('otro');
    });
  });
});
