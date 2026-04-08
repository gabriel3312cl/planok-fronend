import type { Task } from '../types/task.types';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Preparar presentación trimestral',
    description: 'Crear slides con métricas de ventas Q1, incluir gráficos comparativos y proyecciones para Q2',
    category: 'trabajo',
    status: 'en_progreso',
    subTasks: [
      { id: 'st-1', title: 'Recopilar datos de ventas', completed: true },
      { id: 'st-2', title: 'Diseñar gráficos comparativos', completed: false },
    ],
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-05T14:30:00Z',
  },
  {
    id: '2',
    title: 'Comprar víveres para la semana',
    description: 'Ir al supermercado y comprar frutas, verduras, proteínas y productos de limpieza',
    category: 'personal',
    status: 'pendiente',
    subTasks: [],
    createdAt: '2026-04-06T08:00:00Z',
    updatedAt: '2026-04-06T08:00:00Z',
  },
  {
    id: '3',
    title: 'Entregar informe de impuestos',
    description: 'Fecha límite el viernes. Revisar deducciones, adjuntar comprobantes y enviar al contador',
    category: 'urgente',
    status: 'pendiente',
    subTasks: [],
    createdAt: '2026-04-02T09:00:00Z',
    updatedAt: '2026-04-02T09:00:00Z',
  },
  {
    id: '4',
    title: 'Estudiar para certificación AWS',
    description: 'Repasar módulos de EC2, S3 y Lambda. Hacer simulacro de examen en la plataforma oficial',
    category: 'estudio',
    status: 'en_progreso',
    subTasks: [
      { id: 'st-3', title: 'Módulo EC2', completed: true },
      { id: 'st-4', title: 'Módulo S3', completed: false },
      { id: 'st-5', title: 'Módulo Lambda', completed: false },
    ],
    createdAt: '2026-03-28T12:00:00Z',
    updatedAt: '2026-04-04T16:00:00Z',
  },
];
