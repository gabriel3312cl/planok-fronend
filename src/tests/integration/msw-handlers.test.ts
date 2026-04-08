import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../msw-server';
import { taskService } from '../../services/task.service';
import { aiService } from '../../services/ai.service';
import { env } from '../../config/env';

describe('MSW Handlers - pruebas con datos mock', () => {
  describe('manejo de errores', () => {
    it('debe manejar error 500 del servidor en getAll', async () => {
      server.use(
        http.get(`${env.apiBaseUrl}/tasks/`, () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );

      await expect(taskService.getAll()).rejects.toThrow();
    });

    it('debe manejar error 500 en create', async () => {
      server.use(
        http.post(`${env.apiBaseUrl}/tasks/`, () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );

      await expect(
        taskService.create({ title: 'Test', description: 'Test' }),
      ).rejects.toThrow();
    });

    it('debe manejar respuesta vacía en getAll', async () => {
      server.use(
        http.get(`${env.apiBaseUrl}/tasks/`, () => {
          return HttpResponse.json([]);
        }),
      );

      const tasks = await taskService.getAll();
      expect(tasks).toEqual([]);
    });
  });

  describe('flujo CRUD completo con mocks', () => {
    it('debe crear, leer, actualizar y eliminar una tarea', async () => {
      // CREATE
      const created = await taskService.create({
        title: 'CRUD Test',
        description: 'Test completo de CRUD',
        priority: 'high',
      });
      expect(created.id).toBeDefined();
      expect(created.title).toBe('CRUD Test');

      // READ
      const fetched = await taskService.getById(created.id);
      expect(fetched.id).toBe(created.id);

      // UPDATE
      const updated = await taskService.update(created.id, {
        title: 'CRUD Test Actualizado',
        status: 'completed',
      });
      expect(updated.title).toBe('CRUD Test Actualizado');
      expect(updated.status).toBe('completed');

      // DELETE
      await expect(taskService.remove(created.id)).resolves.toBeUndefined();
    });
  });

  describe('endpoints de IA con datos mock', () => {
    it('suggestSubtasks debe responder con un array de strings', async () => {
      const result = await aiService.suggestSubtasks('Organizar reunión con el equipo');
      expect(Array.isArray(result)).toBe(true);
      result.forEach((item) => {
        expect(typeof item).toBe('string');
        expect(item.length).toBeGreaterThan(0);
      });
    });

    it('classifyTask debe responder con una prioridad válida', async () => {
      const validPriorities = ['low', 'medium', 'high', 'urgent'];
      const result = await aiService.classifyTask('Test', 'Ir al gym a hacer ejercicio');
      expect(validPriorities).toContain(result);
    });

    it('debe manejar override de handlers para IA', async () => {
      server.use(
        http.post(`${env.apiBaseUrl}/ai/suggest-subtasks`, () => {
          return HttpResponse.json({
            subtasks: ['Paso custom 1', 'Paso custom 2'],
          });
        }),
      );

      const result = await aiService.suggestSubtasks('cualquier cosa');
      expect(result).toEqual(['Paso custom 1', 'Paso custom 2']);
    });

    it('debe manejar error de IA gracefully', async () => {
      server.use(
        http.post(`${env.apiBaseUrl}/ai/classify`, () => {
          return new HttpResponse(null, { status: 503 });
        }),
      );

      await expect(
        aiService.classifyTask('Test', 'desc'),
      ).rejects.toThrow();
    });
  });

  describe('validación de estructura de datos mock', () => {
    it('las tareas mock deben tener todos los campos requeridos', async () => {
      const tasks = await taskService.getAll();

      tasks.forEach((task) => {
        expect(task.id).toBeTruthy();
        expect(task.title).toBeTruthy();
        expect(task.description).toBeTruthy();
        expect(['low', 'medium', 'high', 'urgent']).toContain(task.priority);
        expect(['pending', 'completed']).toContain(task.status);
        expect(task.created_at).toBeTruthy();
        expect(task.updated_at).toBeTruthy();
      });
    });

    it('create debe asignar valores por defecto correctos', async () => {
      const created = await taskService.create({
        title: 'Solo título y desc',
        description: 'Sin categoría ni estado',
      });

      expect(created.priority).toBe('medium');
      expect(created.status).toBe('pending');
      expect(new Date(created.created_at).getTime()).not.toBeNaN();
    });
  });
});
