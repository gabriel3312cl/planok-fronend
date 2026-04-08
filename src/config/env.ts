/**
 * Single Responsibility: Este módulo se encarga exclusivamente de validar
 * y exponer las variables de entorno de forma tipada.
 */

interface EnvConfig {
  apiBaseUrl: string;
  appTitle: string;
  aiEnabled: boolean;
  tasksPerPage: number;
}

function getEnvVar(key: string): string {
  const value = import.meta.env[key];
  if (value === undefined || value === '') {
    throw new Error(`Variable de entorno "${key}" no está definida. Revisa tu archivo .env`);
  }
  return value;
}

export const env: EnvConfig = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL'),
  appTitle: getEnvVar('VITE_APP_TITLE'),
  aiEnabled: getEnvVar('VITE_AI_ENABLED') === 'true',
  tasksPerPage: Number(getEnvVar('VITE_TASKS_PER_PAGE')),
};
