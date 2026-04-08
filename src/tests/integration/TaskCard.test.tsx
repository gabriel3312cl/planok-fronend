import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskCard } from '../../components/TaskCard';
import { renderWithProviders } from '../test-utils';
import { mockTask, mockTaskWithSubtasks, mockTaskUrgent } from '../mock-data';

describe('TaskCard', () => {
  const defaultProps = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it('debe renderizar el título y la descripción de la tarea', () => {
    renderWithProviders(<TaskCard task={mockTask} {...defaultProps} />);
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
  });

  it('debe mostrar el chip de categoría correcto', () => {
    renderWithProviders(<TaskCard task={mockTask} {...defaultProps} />);
    expect(screen.getByText('Trabajo')).toBeInTheDocument();
  });

  it('debe mostrar el chip de estado correcto', () => {
    renderWithProviders(<TaskCard task={mockTask} {...defaultProps} />);
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('debe mostrar el chip "Urgente" para tareas urgentes', () => {
    renderWithProviders(<TaskCard task={mockTaskUrgent} {...defaultProps} />);
    expect(screen.getByText('Urgente')).toBeInTheDocument();
    expect(screen.getByText('En progreso')).toBeInTheDocument();
  });

  it('debe llamar onEdit al hacer click en el botón de editar', async () => {
    const onEdit = vi.fn();
    renderWithProviders(<TaskCard task={mockTask} onEdit={onEdit} onDelete={vi.fn()} />);

    const editButton = screen.getByLabelText('Editar');
    await userEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledWith(mockTask.id);
  });

  it('debe llamar onDelete al hacer click en el botón de eliminar', async () => {
    const onDelete = vi.fn();
    renderWithProviders(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={onDelete} />);

    const deleteButton = screen.getByLabelText('Eliminar');
    await userEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('debe mostrar el contador de subtareas si existen', () => {
    renderWithProviders(<TaskCard task={mockTaskWithSubtasks} {...defaultProps} />);
    expect(screen.getByText('1/2 subtareas')).toBeInTheDocument();
  });

  it('debe expandir las subtareas al hacer click en "Ver subtareas"', async () => {
    renderWithProviders(<TaskCard task={mockTaskWithSubtasks} {...defaultProps} />);

    expect(screen.queryByText('Subtarea 1')).not.toBeVisible();

    await userEvent.click(screen.getByText('Ver subtareas'));
    expect(screen.getByText('Subtarea 1')).toBeVisible();
    expect(screen.getByText('Subtarea 2')).toBeVisible();
  });

  it('no debe mostrar sección de subtareas si la tarea no tiene', () => {
    renderWithProviders(<TaskCard task={mockTask} {...defaultProps} />);
    expect(screen.queryByText('Ver subtareas')).not.toBeInTheDocument();
  });
});
