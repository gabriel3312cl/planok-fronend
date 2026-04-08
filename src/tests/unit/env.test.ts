import { describe, it, expect } from 'vitest';
import { env } from '../../config/env';

describe('env config', () => {
  it('debe cargar apiBaseUrl desde las variables de entorno', () => {
    expect(env.apiBaseUrl).toBeDefined();
    expect(typeof env.apiBaseUrl).toBe('string');
    expect(env.apiBaseUrl.length).toBeGreaterThan(0);
  });

  it('debe cargar appTitle desde las variables de entorno', () => {
    expect(env.appTitle).toBeDefined();
    expect(typeof env.appTitle).toBe('string');
  });

  it('debe parsear aiEnabled como booleano', () => {
    expect(typeof env.aiEnabled).toBe('boolean');
  });

  it('debe parsear tasksPerPage como número', () => {
    expect(typeof env.tasksPerPage).toBe('number');
    expect(env.tasksPerPage).toBeGreaterThan(0);
  });
});
