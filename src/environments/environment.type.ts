export type Environment = {
  production: boolean;
  demoMode: boolean;
  apiBaseUrl: string;
  apiUrl: string;
  auth0?: {
    domain: string;
    clientId: string;
    audience: string;
  };
};
