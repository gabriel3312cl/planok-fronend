import axios from 'axios';
import { env } from '../config/env';

/**
 * Single Responsibility: cliente HTTP configurado centralmente.
 * Open/Closed: extensible via interceptors sin modificar este módulo.
 */
export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});
