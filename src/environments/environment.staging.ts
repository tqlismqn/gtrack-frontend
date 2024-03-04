import { Environment } from './environment.type';

export const environment: Environment = {
  production: true,
  auth0: {
    domain: 'login.g-track.eu',
    clientId: 'wbhoXTThDdpAdqNV1WlGHwEJdvKdoMcB',
    audience: 'https://dev-sv3qrahltc0ebh7y.us.auth0.com/api/v2/',
  },
  apiUrl: 'https://api-dev.g-track.eu',
};
