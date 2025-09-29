// Token storage keys - tokens can be stored in localStorage or sessionStorage
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const REMEMBER_ME_KEY = "auth_remember_me";

export const getToken = (): string | null => {
  // Check both localStorage and sessionStorage
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const setToken = (
  accessToken: string,
  rememberMe: boolean = true
): void => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, accessToken);
  // Store remember me preference
  localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());
};

export const getRefreshToken = (): string | null => {
  // Check both localStorage and sessionStorage
  return (
    localStorage.getItem(REFRESH_TOKEN_KEY) ||
    sessionStorage.getItem(REFRESH_TOKEN_KEY)
  );
};

export const setRefreshToken = (
  refreshToken: string,
  rememberMe: boolean = true
): void => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const removeTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const hasToken = (): boolean => {
  return !!getToken();
};

export const isRemembered = (): boolean => {
  return localStorage.getItem(REMEMBER_ME_KEY) === "true";
};
