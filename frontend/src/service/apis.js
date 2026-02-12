// Base URL for API requests - adjust according to your backend
const BASE_URL ="http://localhost:4002/api/v1";

// Auth Endpoints
export const endpoints = {
  SIGNUP_API: `${BASE_URL}/auth/signup`,
  LOGIN_API: `${BASE_URL}/auth/login`,
  LOGOUT_API: `${BASE_URL}/auth/logout`,
}
