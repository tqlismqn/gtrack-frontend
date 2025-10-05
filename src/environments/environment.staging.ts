import { Environment } from './environment.type';

const apiBaseUrl = 'https://api-dev.g-track.eu';
const demoApiBase = 'https://<YOUR-LARAVEL-CLOUD-DOMAIN>/api';

export const environment: Environment = {
  production: true,
  demoMode: true,
  demoUseApi: true,
  demoApiBase,
  apiBaseUrl,
  apiUrl: apiBaseUrl,
};
