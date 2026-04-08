import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskFormDialog } from '../../components/TaskFormDialog';
import { renderWithProviders } from '../test-utils';
import { mockTask } from '../mock-data';

describe('TaskFormDialog', () => {
  const defaultProps = {
    open: true,
    task: null,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    isSubmitting: false,
  };

  describe('modo crear', () => {
    it('debe mostrar título "Nueva tarea"', () => {
      renderWithProviders(<TaskFormDialog {...defaultProps} />);
      expect(screen.getByText('Nueva tarea')).toBeInTheDocument();
    });

    it('debe mostrar campos vacíos', () => {
      renderWithProviders(<TaskFormDialog {...defaultProps} />);
      const titleInput = screen.getByLabelText('Título');
      expect(titleInput).toHaveValue('');
    });

    it('debe mostrar error si se envía sin título', async () => {
      renderWithProviders(<TaskFormDialog {...defaultProps} />);
      await userEvent.click(screen.getByRole('button', { name: /crear/i }));
      expect(screen.getByText('El título es obligatorio')).toBeInTheDocument();
    });



    it('debe llamar onSubmit con datos correctos', async () => {
      const onSubmit = vi.fn();
      renderWithProviders(<TaskFormDialog {...defaultProps} onSubmit={onSubmit} />);

      await userEvent.type(screen.getByLabelText('Título'), 'Nueva tarea test');
      await userEvent.type(screen.getByLabelText('Descripción'), 'Descripción test');
      await userEvent.click(screen.getByRole('button', { name: /crear/i }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Nueva tarea test',
          description: 'Descripción test',
        }),
      );
    });

    it('debe llamar onClose al hacer click en Cancelar', async () => {
      const onClose = vi.fn();
      renderWithProviders(<TaskFormDialog {...defaultProps} onClose={onClose} />);
      await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe('modo editar', () => {
    it('debe mostrar título "Editar tarea"', () => {
      renderWithProviders(<TaskFormDialog {...defaultProps} task={mockTask} />);
      expect(screen.getByText('Editar tarea')).toBeInTheDocument();
    });

    it('debe pre-poblar los campos con los datos de la tarea', () => {
      renderWithProviders(<TaskFormDialog {...defaultProps} task={mockTask} />);
      expect(screen.getByLabelText('Título')).toHaveValue(mockTask.title);
      expect(screen.getByLabelText('Descripción')).toHaveValue(mockTask.description);
    });

    it('debe mostrar botón "Actualizar" en lugar de "Crear"', () => {
      renderWithProviders(<TaskFormDialog {...defaultProps} task={mockTask} />);
      expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
    });
  });

  describe('sección IA', () => {
    it('debe mostrar la sección de Asistente IA', () => {
      renderWithProviders(<TaskFormDialog {...defaultProps} />);
      expect(screen.getByText('Asistente IA')).toBeInTheDocument();
    });

    it('debe tener botón "Sugerir subtareas" deshabilitado sin descripción', () => {
      renderWithProviders(<TaskFormDialog {...defaultProps} />);
      const button = screen.getByRole('button', { name: /sugerir subtareas/i });
      expect(button).toBeDisabled();
    });

    it('debe habilitar "Sugerir subtareas" al escribir descripción', async () => {
      renderWithProviders(<TaskFormDialog {...defaultProps} />);
      await userEvent.type(screen.getByLabelText('Descripción'), 'Preparar presentación');
      const button = screen.getByRole('button', { name: /sugerir subtareas/i });
      expect(button).toBeEnabled();
    });

    it('debe generar subtareas al hacer click en "Sugerir subtareas"', async () => {
      renderWithProviders(<TaskFormDialog {...defaultProps} />);
      await userEvent.type(screen.getByLabelText('Descripción'), 'Preparar presentación trimestral');

      await userEvent.click(screen.getByRole('button', { name: /sugerir subtareas/i }));

      await waitFor(() => {
        const descInput = screen.getByLabelText('Descripción') as HTMLTextAreaElement;
        expect(descInput.value).toContain('Subtareas sugeridas');
      }, { timeout: 3000 });
    });

    it('debe clasificar la tarea al hacer click en "Auto-clasificar"', async () => {
      renderWithProviders(<TaskFormDialog {...defaultProps} />);
      await userEvent.type(screen.getByLabelText('Título'), 'Reunión de trabajo');
      await userEvent.type(screen.getByLabelText('Descripción'), 'Reunión con el cliente del proyecto');

      await userEvent.click(screen.getByRole('button', { name: /auto-asignar prioridad/i }));

      await waitFor(() => {
        // Verifica que el select de categoría cambió a la respectiva prioridad
        const prioritySelect = screen.getByLabelText('Prioridad');
        expect(prioritySelect).toHaveTextContent('Alta');
      }, { timeout: 3000 });
    });
  });

  describe('estado de carga', () => {
    it('debe mostrar "Guardando..." cuando isSubmitting es true', () => {
      renderWithProviders(<TaskFormDialog {...defaultProps} isSubmitting={true} />);
      expect(screen.getByRole('button', { name: /guardando/i })).toBeDisabled();
    });
  });
});
