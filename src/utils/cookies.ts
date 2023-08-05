import Cookies from 'js-cookie';

type TokenName = 'access_token' | 'refresh_token' | 'id_token';

/**
 * Save token to Cookies
 *
 * @param name Token name
 * @param value Token value
 * @param expiresIn Token expires in (seconds)
 */
export const saveToken = (name: TokenName, value: string, expiresIn?: number): string | undefined => {
  return Cookies.set(name, value, {
    expires: expiresIn ? new Date(new Date().getTime() + expiresIn * 1000) : undefined,
  });
};

/**
 * Get token from Cookies
 *
 * @param name Token name
 */
export const getToken = (name: TokenName): string | undefined => {
  return Cookies.get(name);
};

/**
 * Remove all cookies
 */
export const clearCookies = (): void => {
  Object.keys(Cookies.get()).forEach(function (cookieName) {
    // Here you pass the same attributes that were used when the cookie was created
    // and are required when removing the cookie
    const neededAttributes = {};

    Cookies.remove(cookieName, neededAttributes);
  });
};
