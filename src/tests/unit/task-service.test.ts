import { describe, it, expect } from 'vitest';
import { taskService } from '../../services/task.service';
import type { CreateTaskDto } from '../../types/task.types';

describe('taskService (con MSW)', () => {
  it('getAll() debe retornar un array de tareas', async () => {
    const tasks = await taskService.getAll();
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
  });

  it('getAll() debe retornar tareas con la estructura correcta', async () => {
    const tasks = await taskService.getAll();
    const task = tasks[0];
    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('title');
    expect(task).toHaveProperty('description');
    expect(task).toHaveProperty('priority');
    expect(task).toHaveProperty('status');
    expect(task).toHaveProperty('created_at');
    expect(task).toHaveProperty('updated_at');
  });

  it('create() debe crear una tarea y retornarla con id generado', async () => {
    const dto: CreateTaskDto = {
      title: 'Test nueva tarea',
      description: 'Descripción de test',
      priority: 'high',
    };
    const created = await taskService.create(dto);
    expect(created.id).toBeDefined();
    expect(created.title).toBe(dto.title);
    expect(created.description).toBe(dto.description);
    expect(created.priority).toBe('high');
    expect(created.status).toBe('pending');
  });

  it('getById() debe retornar una tarea existente', async () => {
    const tasks = await taskService.getAll();
    const firstTask = tasks[0];
    const task = await taskService.getById(firstTask.id);
    expect(task.id).toBe(firstTask.id);
    expect(task.title).toBe(firstTask.title);
  });

  it('update() debe actualizar los campos indicados', async () => {
    const tasks = await taskService.getAll();
    const target = tasks[0];
    const updated = await taskService.update(target.id, {
      title: 'Título actualizado por test',
      status: 'completed',
    });
    expect(updated.id).toBe(target.id);
    expect(updated.title).toBe('Título actualizado por test');
    expect(updated.status).toBe('completed');
  });

  it('remove() debe eliminar una tarea sin error', async () => {
    const tasks = await taskService.getAll();
    const target = tasks[tasks.length - 1];
    await expect(taskService.remove(target.id)).resolves.toBeUndefined();
  });

  it('getById() debe fallar con 404 para un id inexistente', async () => {
    await expect(taskService.getById('no-existe-xyz')).rejects.toThrow();
  });
});
