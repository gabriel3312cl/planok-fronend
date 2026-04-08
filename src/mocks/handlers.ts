import { http, HttpResponse, delay } from 'msw';
import { v4 as uuidv4 } from 'uuid';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types/task.types';
import { mockTasks } from './data';
import { env } from '../config/env';

let tasks: Task[] = [...mockTasks];

const baseUrl = env.apiBaseUrl;

export const handlers = [
  // GET /api/tasks
  http.get(`${baseUrl}/tasks`, async () => {
    await delay(300);
    return HttpResponse.json(tasks);
  }),

  // GET /api/tasks/:id
  http.get(`${baseUrl}/tasks/:id`, async ({ params }) => {
    await delay(200);
    const task = tasks.find((t) => t.id === params.id);
    if (!task) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(task);
  }),

  // POST /api/tasks
  http.post(`${baseUrl}/tasks`, async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as CreateTaskDto;
    const now = new Date().toISOString();
    const newTask: Task = {
      id: uuidv4(),
      title: body.title,
      description: body.description,
      category: body.category ?? 'otro',
      status: body.status ?? 'pendiente',
      subTasks: [],
      createdAt: now,
      updatedAt: now,
    };
    tasks = [newTask, ...tasks];
    return HttpResponse.json(newTask, { status: 201 });
  }),

  // PUT /api/tasks/:id
  http.put(`${baseUrl}/tasks/:id`, async ({ params, request }) => {
    await delay(300);
    const body = (await request.json()) as UpdateTaskDto;
    const index = tasks.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    tasks[index] = {
      ...tasks[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(tasks[index]);
  }),

  // DELETE /api/tasks/:id
  http.delete(`${baseUrl}/tasks/:id`, async ({ params }) => {
    await delay(200);
    const index = tasks.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    tasks = tasks.filter((t) => t.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),

  // POST /api/ai/suggest-subtasks
  http.post(`${baseUrl}/ai/suggest-subtasks`, async ({ request }) => {
    await delay(1000);
    const { description } = (await request.json()) as { description: string };
    const subtasks = generateSubtasks(description);
    return HttpResponse.json({ subtasks });
  }),

  // POST /api/ai/classify
  http.post(`${baseUrl}/ai/classify`, async ({ request }) => {
    await delay(800);
    const { title, description } = (await request.json()) as {
      title: string;
      description: string;
    };
    const category = classifyTask(title, description);
    return HttpResponse.json({ category });
  }),
];

/**
 * Mock de IA: genera subtareas basándose en palabras clave de la descripción.
 */
function generateSubtasks(description: string): string[] {
  const lower = description.toLowerCase();
  const subtasks: string[] = [];

  if (lower.includes('presentación') || lower.includes('slides')) {
    subtasks.push('Definir estructura de la presentación');
    subtasks.push('Recopilar datos e información relevante');
    subtasks.push('Diseñar slides con contenido visual');
    subtasks.push('Revisar y practicar la presentación');
  } else if (lower.includes('informe') || lower.includes('reporte')) {
    subtasks.push('Recopilar fuentes de información');
    subtasks.push('Redactar borrador del informe');
    subtasks.push('Revisar formato y ortografía');
    subtasks.push('Enviar para aprobación');
  } else if (lower.includes('estudiar') || lower.includes('examen') || lower.includes('certificación')) {
    subtasks.push('Identificar temas principales a estudiar');
    subtasks.push('Crear resumen de cada tema');
    subtasks.push('Hacer ejercicios prácticos');
    subtasks.push('Realizar simulacro de examen');
  } else if (lower.includes('comprar') || lower.includes('supermercado')) {
    subtasks.push('Hacer lista de productos necesarios');
    subtasks.push('Comparar precios entre tiendas');
    subtasks.push('Ir a la tienda y comprar');
    subtasks.push('Organizar las compras en casa');
  } else if (lower.includes('reunión') || lower.includes('meeting')) {
    subtasks.push('Preparar agenda de la reunión');
    subtasks.push('Enviar invitaciones a los participantes');
    subtasks.push('Preparar materiales de apoyo');
    subtasks.push('Documentar acuerdos y próximos pasos');
  } else {
    subtasks.push('Investigar y planificar el enfoque');
    subtasks.push('Ejecutar las acciones principales');
    subtasks.push('Revisar resultados obtenidos');
    subtasks.push('Documentar y cerrar la tarea');
  }

  return subtasks;
}

/**
 * Mock de IA: clasifica la tarea según palabras clave en título y descripción.
 */
function classifyTask(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes('urgente') ||
    text.includes('fecha límite') ||
    text.includes('deadline') ||
    text.includes('asap') ||
    text.includes('inmediato')
  ) {
    return 'urgente';
  }
  if (
    text.includes('trabajo') ||
    text.includes('oficina') ||
    text.includes('cliente') ||
    text.includes('proyecto') ||
    text.includes('presentación') ||
    text.includes('informe') ||
    text.includes('reunión')
  ) {
    return 'trabajo';
  }
  if (
    text.includes('estudiar') ||
    text.includes('curso') ||
    text.includes('certificación') ||
    text.includes('examen') ||
    text.includes('aprender')
  ) {
    return 'estudio';
  }
  if (
    text.includes('doctor') ||
    text.includes('ejercicio') ||
    text.includes('gym') ||
    text.includes('salud') ||
    text.includes('médico')
  ) {
    return 'salud';
  }
  if (
    text.includes('pagar') ||
    text.includes('factura') ||
    text.includes('impuesto') ||
    text.includes('banco') ||
    text.includes('presupuesto')
  ) {
    return 'finanzas';
  }
  if (
    text.includes('comprar') ||
    text.includes('casa') ||
    text.includes('familia') ||
    text.includes('personal') ||
    text.includes('supermercado')
  ) {
    return 'personal';
  }

  return 'otro';
}
