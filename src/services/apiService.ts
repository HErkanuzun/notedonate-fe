import axios from 'axios';

// Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Laravel API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Email verification function
export const verifyEmail = (id: string, hash: string) => {
  return api.get(`/email/verify/${id}/${hash}`);
};

// Diğer API fonksiyonlarını buraya ekleyin
