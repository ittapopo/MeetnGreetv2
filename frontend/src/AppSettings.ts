export const server =
  process.env.REACT_APP_ENV === 'production'
    ? 'https://meetngreet-backend.azurewebsites.net'
    : process.env.REACT_APP_ENV === 'staging'
    ? 'https://meetngreetstaging.azurewebsites.net'
    : 'https://localhost:44357';

export const webAPIUrl = `${server}/api`;

export const authSettings = {
    domain: 'dev-kuohdml7.us.auth0.com',
    client_id: '6q9NwtZzKM0jdr1Y5UO32Sf47etIoa41',
    redirect_uri: window.location.origin + '/signin-callback',
    scope: 'openid profile MandGAPI email',
    audience: 'https://meetngreet',
  };