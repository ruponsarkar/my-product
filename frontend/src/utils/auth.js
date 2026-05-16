export const AUTH_TOKEN_KEY = "token";
export const AUTH_REFRESH_TOKEN_KEY = "refreshToken";
export const AUTH_USER_KEY = "user";
export const AUTH_TENANT_KEY = "tenant";
export const AUTH_ACCESS_KEY = "access";

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const getStoredUser = () => {
  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (_error) {
    clearAuthData();
    return null;
  }
};

const getStoredJson = (key) => {
  const rawValue = localStorage.getItem(key);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch (_error) {
    localStorage.removeItem(key);
    return null;
  }
};

export const getStoredTenant = () => getStoredJson(AUTH_TENANT_KEY);
export const getStoredAccess = () => getStoredJson(AUTH_ACCESS_KEY);

export const hasFeatureAccess = (feature) => {
  const access = getStoredAccess();
  const features = Array.isArray(access?.features) ? access.features : [];
  return features.includes("*") || features.includes(feature);
};

export const persistAuthData = ({ token, refreshToken, user, tenant, access }) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  if (refreshToken) {
    localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken);
  }

  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }

  if (tenant) {
    localStorage.setItem(AUTH_TENANT_KEY, JSON.stringify(tenant));
  }

  if (access) {
    localStorage.setItem(AUTH_ACCESS_KEY, JSON.stringify(access));
  }
};

export const clearAuthData = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_TENANT_KEY);
  localStorage.removeItem(AUTH_ACCESS_KEY);
};

export const isAuthenticated = () => Boolean(getAuthToken());
