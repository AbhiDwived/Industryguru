import { apiLink } from './utils';

// Generic API call function with error handling
export const callAPI = async (endpoint, options = {}) => {
    try {
        const token = localStorage.getItem('token');
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': token || ''
        };

        const response = await fetch(`${apiLink}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            },
            credentials: 'include' // Important for CORS
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}; 