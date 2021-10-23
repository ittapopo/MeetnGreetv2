export const server = 'https://localhost:44357';

export const webAPIUrl = `${server}/api`;

export const authSettings = {
    domain: 'https://dev-kuohdml7.us.auth0.com',
    client_id: '617160e63bd522021b9e271c',
    redirect_uri: window.location.origin + '/signin-callback',
    scope: 'openid profile MeetnGreetAPI email',
    audience: 'https://meetngreet',
  };