export type Environment = {
  production: boolean;
  auth0: {
    domain: string;
    clientId: string;
    audience: string;
  };
  apiUrl: string;
};
