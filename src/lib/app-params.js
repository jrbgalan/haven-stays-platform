const isNode = typeof window === 'undefined';

const isClearAccessTokenRequested = () =>
  !isNode && new URLSearchParams(window.location.search).get("clear_access_token") === 'true';

const clearStoredAccessToken = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('haven_access_token');
    window.localStorage.removeItem('token');
  }
};

const getAppParams = () => {
  if (isClearAccessTokenRequested()) {
    clearStoredAccessToken();
  }
  return {
    appId: 'haven',
    token: typeof window !== 'undefined' ? window.localStorage.getItem('haven_access_token') : null,
  };
};

export const appParams = {
  ...getAppParams()
};
