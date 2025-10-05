import { Environment } from './environment.type';

export const environment: Environment = {
  production: true,
  authBypass: true,
  auth0: {
    domain: 'login.g-track.eu',
    clientId: 'x7qSOyrqJIHx4oytlzXg21WMlCESuPRd',
    audience: 'https://dev-sv3qrahltc0ebh7y.us.auth0.com/api/v2/',
  },
  apiUrl: 'https://api.g-track.eu',
};
