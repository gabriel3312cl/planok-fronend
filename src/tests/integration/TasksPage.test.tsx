import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TasksPage } from '../../pages/TasksPage';
import { renderWithProviders } from '../test-utils';
import { useUIStore } from '../../store/ui.store';

describe('TasksPage - integración completa', () => {
  beforeEach(() => {
    useUIStore.setState({
      isFormOpen: false,
      editingTaskId: null,
      searchQuery: '',
    });
  });

  it('debe mostrar el título de la aplicación', async () => {
    renderWithProviders(<TasksPage />);
    await waitFor(() => {
      expect(screen.getByText(/Planok/i)).toBeInTheDocument();
    });
  });

  it('debe cargar y mostrar las tareas del mock', async () => {
    renderWithProviders(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText('Tarea de prueba')).toBeInTheDocument();
    }, { timeout: 5000 });

    expect(screen.getByText('Entrega urgente')).toBeInTheDocument();
  });

  it('debe mostrar barra de búsqueda y botón "Nueva tarea"', async () => {
    renderWithProviders(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Buscar tareas...')).toBeInTheDocument();
    }, { timeout: 5000 });

    expect(screen.getByRole('button', { name: /nueva tarea/i })).toBeInTheDocument();
  });

  it('debe abrir el dialog al hacer click en "Nueva tarea"', async () => {
    renderWithProviders(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /nueva tarea/i })).toBeInTheDocument();
    }, { timeout: 5000 });

    await userEvent.click(screen.getByRole('button', { name: /nueva tarea/i }));
    expect(screen.getByRole('heading', { name: /nueva tarea/i })).toBeInTheDocument();
  });

  it('debe crear una tarea nueva a través del formulario', async () => {
    renderWithProviders(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /nueva tarea/i })).toBeInTheDocument();
    }, { timeout: 5000 });

    await userEvent.click(screen.getByRole('button', { name: /nueva tarea/i }));

    await userEvent.type(screen.getByLabelText('Título'), 'Tarea creada en test E2E');
    await userEvent.type(screen.getByLabelText('Descripción'), 'Descripción de test end to end');

    await userEvent.click(screen.getByRole('button', { name: /crear/i }));

    await waitFor(() => {
      expect(screen.getByText('Tarea creada correctamente')).toBeInTheDocument();
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByText('Tarea creada en test E2E')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('debe filtrar tareas al escribir en la barra de búsqueda', async () => {
    renderWithProviders(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText('Tarea de prueba')).toBeInTheDocument();
    }, { timeout: 5000 });

    const searchInput = screen.getByPlaceholderText('Buscar tareas...');
    await userEvent.type(searchInput, 'urgente');

    await waitFor(() => {
      expect(screen.getByText('Entrega urgente')).toBeInTheDocument();
      expect(screen.queryByText('Tarea de prueba')).not.toBeInTheDocument();
    });
  });

  it('debe abrir dialog de confirmación al eliminar una tarea', async () => {
    renderWithProviders(<TasksPage />);

    await waitFor(() => {
      expect(screen.getAllByLabelText('Eliminar').length).toBeGreaterThan(0);
    }, { timeout: 5000 });

    const deleteButtons = screen.getAllByLabelText('Eliminar');
    await userEvent.click(deleteButtons[0]);

    expect(screen.getByText('Eliminar tarea')).toBeInTheDocument();
    expect(screen.getByText(/Esta acción no se puede deshacer/)).toBeInTheDocument();
  });

  it('debe eliminar una tarea tras confirmar', async () => {
    renderWithProviders(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText('Tarea de prueba')).toBeInTheDocument();
    }, { timeout: 5000 });

    const deleteButtons = screen.getAllByLabelText('Eliminar');
    await userEvent.click(deleteButtons[0]);

    await userEvent.click(screen.getByRole('button', { name: /^eliminar$/i }));

    await waitFor(() => {
      expect(screen.getByText('Tarea eliminada correctamente')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('debe abrir dialog de edición al hacer click en editar', async () => {
    renderWithProviders(<TasksPage />);

    await waitFor(() => {
      expect(screen.getAllByLabelText('Editar').length).toBeGreaterThan(0);
    }, { timeout: 5000 });

    const editButtons = screen.getAllByLabelText('Editar');
    await userEvent.click(editButtons[0]);

    expect(screen.getByText('Editar tarea')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
  });
});
