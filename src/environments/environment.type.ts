export type Environment = {
  production: boolean;
  demoMode: boolean;
  demoUseApi: boolean;
  demoApiBase: string;
  apiBaseUrl: string;
  apiUrl: string;
  auth0?: {
    domain: string;
    clientId: string;
    audience: string;
  };
};
