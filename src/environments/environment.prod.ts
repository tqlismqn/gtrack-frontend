import { Environment } from './environment.type';

const apiBaseUrl = 'https://api.g-track.eu';

export const environment: Environment = {
  production: true,
  demoMode: true,
  apiBaseUrl,
  apiUrl: apiBaseUrl,
};
