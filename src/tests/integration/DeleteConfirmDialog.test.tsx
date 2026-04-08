import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteConfirmDialog } from '../../components/DeleteConfirmDialog';
import { renderWithProviders } from '../test-utils';

describe('DeleteConfirmDialog', () => {
  const defaultProps = {
    open: true,
    taskTitle: 'Mi tarea importante',
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    isDeleting: false,
  };

  it('debe mostrar el título de la tarea en el mensaje de confirmación', () => {
    renderWithProviders(<DeleteConfirmDialog {...defaultProps} />);
    expect(screen.getByText(/Mi tarea importante/)).toBeInTheDocument();
  });

  it('debe mostrar el título "Eliminar tarea"', () => {
    renderWithProviders(<DeleteConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Eliminar tarea')).toBeInTheDocument();
  });

  it('debe llamar onClose al hacer click en Cancelar', async () => {
    const onClose = vi.fn();
    renderWithProviders(<DeleteConfirmDialog {...defaultProps} onClose={onClose} />);

    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('debe llamar onConfirm al hacer click en Eliminar', async () => {
    const onConfirm = vi.fn();
    renderWithProviders(<DeleteConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

    await userEvent.click(screen.getByRole('button', { name: /eliminar/i }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('debe deshabilitar botones cuando isDeleting es true', () => {
    renderWithProviders(<DeleteConfirmDialog {...defaultProps} isDeleting={true} />);
    expect(screen.getByRole('button', { name: /eliminando/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeDisabled();
  });

  it('no debe renderizar nada cuando open es false', () => {
    renderWithProviders(<DeleteConfirmDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Eliminar tarea')).not.toBeInTheDocument();
  });
});
