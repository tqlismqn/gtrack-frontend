export type Environment = {
  production: boolean;
  authBypass: boolean;
  auth0: {
    domain: string;
    clientId: string;
    audience: string;
  };
  apiUrl: string;
};
