import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { CategoryChip } from '../../components/CategoryChip';
import { renderWithProviders } from '../test-utils';
import type { TaskCategory } from '../../types/task.types';

describe('CategoryChip', () => {
  const categories: { value: TaskCategory; label: string }[] = [
    { value: 'trabajo', label: 'Trabajo' },
    { value: 'personal', label: 'Personal' },
    { value: 'urgente', label: 'Urgente' },
    { value: 'estudio', label: 'Estudio' },
    { value: 'salud', label: 'Salud' },
    { value: 'finanzas', label: 'Finanzas' },
    { value: 'otro', label: 'Otro' },
  ];

  categories.forEach(({ value, label }) => {
    it(`debe renderizar el chip "${label}" para la categoría "${value}"`, () => {
      renderWithProviders(<CategoryChip category={value} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
