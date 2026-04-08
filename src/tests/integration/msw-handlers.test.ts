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
        http.get(`${env.apiBaseUrl}/tasks`, () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );

      await expect(taskService.getAll()).rejects.toThrow();
    });

    it('debe manejar error 500 en create', async () => {
      server.use(
        http.post(`${env.apiBaseUrl}/tasks`, () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );

      await expect(
        taskService.create({ title: 'Test', description: 'Test' }),
      ).rejects.toThrow();
    });

    it('debe manejar respuesta vacía en getAll', async () => {
      server.use(
        http.get(`${env.apiBaseUrl}/tasks`, () => {
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
        category: 'trabajo',
      });
      expect(created.id).toBeDefined();
      expect(created.title).toBe('CRUD Test');

      // READ
      const fetched = await taskService.getById(created.id);
      expect(fetched.id).toBe(created.id);

      // UPDATE
      const updated = await taskService.update(created.id, {
        title: 'CRUD Test Actualizado',
        status: 'completada',
      });
      expect(updated.title).toBe('CRUD Test Actualizado');
      expect(updated.status).toBe('completada');

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

    it('classifyTask debe responder con una categoría válida', async () => {
      const validCategories = ['personal', 'trabajo', 'urgente', 'estudio', 'salud', 'finanzas', 'otro'];
      const result = await aiService.classifyTask('Test', 'Ir al gym a hacer ejercicio');
      expect(validCategories).toContain(result);
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
        expect(['personal', 'trabajo', 'urgente', 'estudio', 'salud', 'finanzas', 'otro']).toContain(task.category);
        expect(['pendiente', 'en_progreso', 'completada']).toContain(task.status);
        expect(Array.isArray(task.subTasks)).toBe(true);
        expect(task.createdAt).toBeTruthy();
        expect(task.updatedAt).toBeTruthy();
      });
    });

    it('las subtareas deben tener estructura correcta', async () => {
      const tasks = await taskService.getAll();
      const withSubtasks = tasks.filter((t) => t.subTasks.length > 0);

      withSubtasks.forEach((task) => {
        task.subTasks.forEach((st) => {
          expect(st.id).toBeTruthy();
          expect(st.title).toBeTruthy();
          expect(typeof st.completed).toBe('boolean');
        });
      });
    });

    it('create debe asignar valores por defecto correctos', async () => {
      const created = await taskService.create({
        title: 'Solo título y desc',
        description: 'Sin categoría ni estado',
      });

      expect(created.category).toBe('otro');
      expect(created.status).toBe('pendiente');
      expect(created.subTasks).toEqual([]);
      expect(new Date(created.createdAt).getTime()).not.toBeNaN();
    });
  });
});
