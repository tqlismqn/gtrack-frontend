import { Environment } from './environment.type';

export const environment: Environment = {
  production: false,
  auth0: {
    domain: 'dev-sv3qrahltc0ebh7y.us.auth0.com',
    clientId: 'mc4F28SeMxGmtsRwoKbYWw9QkvBa7DDA',
    audience: 'https://dev-sv3qrahltc0ebh7y.us.auth0.com/api/v2/',
  },
  apiUrl: 'http://localhost:8000',
};
