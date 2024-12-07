import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Public endpoints that don't require authentication
const publicEndpoints = [
  '/api/v1/public/articles',
  '/api/v1/public/notes',
  '/api/v1/public/exams',
  '/api/v1/public/events'
];

// Request interceptor - Add Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  // Check if the endpoint requires authentication
  const isPublicEndpoint = publicEndpoints.some(endpoint => 
    config.url?.includes(endpoint)
  );

  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor - Handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Unauthorized - Clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 422:
          // Validation error
          console.error('Validation failed:', error.response.data.errors);
          break;
        case 500:
          // Server error
          console.error('Server error occurred');
          break;
        default:
          console.error('An error occurred:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);
