import { Environment } from './environment.type';

const apiBaseUrl = 'http://localhost:8000';

export const environment: Environment = {
  production: false,
  demoMode: true,
  apiBaseUrl,
  apiUrl: apiBaseUrl,
};
