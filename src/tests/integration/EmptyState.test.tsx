import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../../components/EmptyState';
import { renderWithProviders } from '../test-utils';

describe('EmptyState', () => {
  it('debe mostrar mensaje de que no hay tareas', () => {
    renderWithProviders(<EmptyState onCreateTask={vi.fn()} />);
    expect(screen.getByText('No hay tareas todavía')).toBeInTheDocument();
  });

  it('debe mostrar la descripción invitando a crear una tarea', () => {
    renderWithProviders(<EmptyState onCreateTask={vi.fn()} />);
    expect(screen.getByText(/Comienza creando tu primera tarea/)).toBeInTheDocument();
  });

  it('debe mostrar botón "Crear primera tarea"', () => {
    renderWithProviders(<EmptyState onCreateTask={vi.fn()} />);
    expect(screen.getByRole('button', { name: /crear primera tarea/i })).toBeInTheDocument();
  });

  it('debe llamar onCreateTask al hacer click en el botón', async () => {
    const onCreateTask = vi.fn();
    renderWithProviders(<EmptyState onCreateTask={onCreateTask} />);

    await userEvent.click(screen.getByRole('button', { name: /crear primera tarea/i }));
    expect(onCreateTask).toHaveBeenCalledOnce();
  });
});
