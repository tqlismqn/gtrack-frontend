import { Environment } from './environment.type';

type DemoEnvironmentExtras = {
  demoUseApi: boolean;
  demoApiBase: string;
};

const apiBaseUrl = 'https://api.g-track.eu';

const demoConfig: DemoEnvironmentExtras = {
  demoUseApi: false,
  demoApiBase: '/api',
};

export const environment: Environment & DemoEnvironmentExtras = {
  production: true,
  demoMode: true,
  apiBaseUrl,
  apiUrl: apiBaseUrl,
  ...demoConfig,
};
