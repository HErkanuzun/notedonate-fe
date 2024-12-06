import axios from 'axios';

// Axios instance for health check
const healthApi = axios.create({
  baseURL: 'http://localhost:8000/api', // Laravel API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check function
export const checkHealth = async () => {
  try {
    const response = await healthApi.get('/v1/health');
    if (response.status === 200 && response.data.status === 'OK') {
      return { online: true, status: response.data.status };
    }
    return { online: false, status: 'Unexpected response' };
  } catch (error) {
    console.error('Health check error:', error);
    return { online: false, status: 'Error' };
  }
};
