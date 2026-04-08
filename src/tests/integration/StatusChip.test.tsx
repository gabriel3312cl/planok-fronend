import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { StatusChip } from '../../components/StatusChip';
import { renderWithProviders } from '../test-utils';
import type { TaskStatus } from '../../types/task.types';

describe('StatusChip', () => {
  const statuses: { value: TaskStatus; label: string }[] = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'completed', label: 'Completada' },
  ];

  statuses.forEach(({ value, label }) => {
    it(`debe renderizar "${label}" para el estado "${value}"`, () => {
      renderWithProviders(<StatusChip status={value} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
