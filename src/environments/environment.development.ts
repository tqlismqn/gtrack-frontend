import { Environment } from './environment.type';

const apiBaseUrl = 'http://localhost:8000';
const demoApiBase = 'https://<YOUR-LARAVEL-CLOUD-DOMAIN>/api';

export const environment: Environment = {
  production: false,
  demoMode: true,
  demoUseApi: true,
  demoApiBase,
  apiBaseUrl,
  apiUrl: apiBaseUrl,
};
