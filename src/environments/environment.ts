import { Environment } from './environment.type';

type DemoEnvironmentExtras = {
  demoUseApi: boolean;
  demoApiBase: string;
};

const apiBaseUrl = 'http://localhost:8000';

const demoConfig: DemoEnvironmentExtras = {
  demoUseApi: false,
  demoApiBase: '/api',
};

export const environment: Environment & DemoEnvironmentExtras = {
  production: false,
  demoMode: true,
  apiBaseUrl,
  apiUrl: apiBaseUrl,
  ...demoConfig,
};
