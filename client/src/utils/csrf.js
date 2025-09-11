// CSRF Protection utility
export function generateCSRFToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getCSRFToken() {
  let token = sessionStorage.getItem('csrf_token');
  if (!token) {
    token = generateCSRFToken();
    sessionStorage.setItem('csrf_token', token);
  }
  return token;
}

export function addCSRFHeaders(headers = {}) {
  return {
    ...headers,
    'X-CSRF-Token': getCSRFToken()
  };
}