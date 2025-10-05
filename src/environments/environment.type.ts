export type Environment = {
  production: boolean;
  authBypass: boolean;
  menuBypass: boolean;
  auth0: {
    domain: string;
    clientId: string;
    audience: string;
  };
  apiUrl: string;
};
