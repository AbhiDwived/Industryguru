// API utility functions with error handling and retry logic

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const apiRequest = async (url, options = {}, retries = 3, delayMs = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      // Handle rate limiting
      if (response.status === 429) {
        console.warn(`Rate limited. Retrying in ${delayMs}ms... (attempt ${i + 1}/${retries})`);
        if (i < retries - 1) {
          await delay(delayMs * (i + 1)); // Exponential backoff
          continue;
        }
        throw new Error('Too many requests. Please try again later.');
      }
      
      // Handle other HTTP errors
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Invalid JSON response from server');
      }
      
    } catch (error) {
      console.error(`API request failed (attempt ${i + 1}/${retries}):`, error);
      
      if (i === retries - 1) {
        throw error;
      }
      
      // Wait before retrying
      await delay(delayMs * (i + 1));
    }
  }
};

export const createApiService = (baseUrl) => ({
  get: (endpoint, options = {}) => apiRequest(`${baseUrl}${endpoint}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      ...options.headers
    },
    ...options
  }),
  
  post: (endpoint, data, options = {}) => apiRequest(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: localStorage.getItem('token'),
      ...options.headers
    },
    body: JSON.stringify(data),
    ...options
  }),
  
  put: (endpoint, data, options = {}) => apiRequest(`${baseUrl}${endpoint}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      authorization: localStorage.getItem('token'),
      ...options.headers
    },
    body: JSON.stringify(data),
    ...options
  }),
  
  delete: (endpoint, options = {}) => apiRequest(`${baseUrl}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      authorization: localStorage.getItem('token'),
      ...options.headers
    },
    ...options
  })
});