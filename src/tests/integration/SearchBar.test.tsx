import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../../components/SearchBar';
import { renderWithProviders } from '../test-utils';
import { useUIStore } from '../../store/ui.store';

describe('SearchBar', () => {
  beforeEach(() => {
    useUIStore.setState({ searchQuery: '' });
  });

  it('debe renderizar el input de búsqueda', () => {
    renderWithProviders(<SearchBar />);
    expect(screen.getByPlaceholderText('Buscar tareas...')).toBeInTheDocument();
  });

  it('debe actualizar el store al escribir en el input', async () => {
    renderWithProviders(<SearchBar />);
    const input = screen.getByPlaceholderText('Buscar tareas...');

    await userEvent.type(input, 'urgente');
    expect(useUIStore.getState().searchQuery).toBe('urgente');
  });

  it('debe reflejar el valor actual del store', () => {
    useUIStore.setState({ searchQuery: 'trabajo' });
    renderWithProviders(<SearchBar />);
    const input = screen.getByPlaceholderText('Buscar tareas...') as HTMLInputElement;
    expect(input.value).toBe('trabajo');
  });

  it('debe limpiar la búsqueda al borrar el texto', async () => {
    renderWithProviders(<SearchBar />);
    const input = screen.getByPlaceholderText('Buscar tareas...');

    await userEvent.type(input, 'test');
    expect(useUIStore.getState().searchQuery).toBe('test');

    await userEvent.clear(input);
    expect(useUIStore.getState().searchQuery).toBe('');
  });
});
