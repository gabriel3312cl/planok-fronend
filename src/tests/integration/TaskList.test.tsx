import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { TaskList } from '../../components/TaskList';
import { renderWithProviders } from '../test-utils';
import { mockTasks } from '../mock-data';

describe('TaskList', () => {
  const defaultProps = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it('debe renderizar skeleton cuando isLoading es true', () => {
    const { container } = renderWithProviders(
      <TaskList tasks={[]} isLoading={true} {...defaultProps} />,
    );
    // MUI Skeleton genera elementos con clase MuiSkeleton-root
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('debe renderizar todas las tareas cuando no está cargando', () => {
    renderWithProviders(
      <TaskList tasks={mockTasks} isLoading={false} {...defaultProps} />,
    );

    mockTasks.forEach((task) => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });
  });

  it('debe no renderizar nada especial si el array está vacío y no carga', () => {
    const { container } = renderWithProviders(
      <TaskList tasks={[]} isLoading={false} {...defaultProps} />,
    );
    // Grid vacío, sin cards
    const cards = container.querySelectorAll('.MuiCard-root');
    expect(cards).toHaveLength(0);
  });

  it('debe renderizar el número correcto de cards', () => {
    const { container } = renderWithProviders(
      <TaskList tasks={mockTasks} isLoading={false} {...defaultProps} />,
    );
    const cards = container.querySelectorAll('.MuiCard-root');
    expect(cards).toHaveLength(mockTasks.length);
  });
});
