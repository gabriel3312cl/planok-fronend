import { http, HttpResponse } from 'msw';
import { env } from '../config/env';
import { mockTasks } from '../tests/mock-data';

let tasks = [...mockTasks];

export const handlers = [
  http.get(`${env.apiBaseUrl}/tasks/`, () => {
    return HttpResponse.json(tasks);
  }),

  http.get(`${env.apiBaseUrl}/tasks/:id/`, ({ params }) => {
    const { id } = params;
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(task);
  }),

  http.post(`${env.apiBaseUrl}/tasks/`, async ({ request }) => {
    const dto = (await request.json()) as any;
    const newTask = {
      ...dto,
      id: `task-${Date.now()}`,
      status: dto.status || 'pending',
      priority: dto.priority || 'medium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    tasks.push(newTask);
    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.put(`${env.apiBaseUrl}/tasks/:id/`, async ({ params, request }) => {
    const { id } = params;
    const dto = (await request.json()) as any;
    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    tasks[taskIndex] = { ...tasks[taskIndex], ...dto, updated_at: new Date().toISOString() };
    return HttpResponse.json(tasks[taskIndex]);
  }),

  http.delete(`${env.apiBaseUrl}/tasks/:id/`, ({ params }) => {
    const { id } = params;
    tasks = tasks.filter((t) => t.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${env.apiBaseUrl}/ai/suggest-subtasks`, async ({ request }) => {
    const { description } = (await request.json()) as any;
    const desc = description?.toLowerCase() || '';
    if (desc.includes('presentación')) return HttpResponse.json({ subtasks: ['Crear slides de presentación', 'Revisar notas'] });
    if (desc.includes('estudiar') || desc.includes('aws') || desc.includes('examen')) return HttpResponse.json({ subtasks: ['Hacer plan de estudio para examen', 'Practicar tests'] });
    if (desc.includes('comprar')) return HttpResponse.json({ subtasks: ['Hacer lista de items a comprar', 'Ir a la tienda'] });
    return HttpResponse.json({
      subtasks: ['Paso 1', 'Paso 2', 'Paso 3'],
    });
  }),

  http.post(`${env.apiBaseUrl}/ai/classify`, async ({ request }) => {
    const { description, title } = (await request.json()) as any;
    const text = ((title || '') + ' ' + (description || '')).toLowerCase();
    let priority = 'medium';
    if (text.includes('urgente') || text.includes('mañana') || text.includes('fecha límite')) priority = 'urgent';
    else if (text.includes('trabajo') || text.includes('crítico') || text.includes('proyecto')) priority = 'high';
    else if (text.includes('comprar') || text.includes('casa') || text.includes('doméstica')) priority = 'low';
    
    return HttpResponse.json({
      priority,
    });
  }),
];
