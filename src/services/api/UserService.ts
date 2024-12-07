import api from './api';

export const UserService = {
  getUserProfile: async (userId: string | number | undefined) => {
    if (!userId) throw new Error('User ID is required');
    const response = await api.get(`/api/v1/users/${userId}/profile`);
    return response;
  },

  updateUserProfile: async (userId: string | number, data: any) => {
    const response = await api.put(`/api/v1/users/${userId}/profile`, data);
    return response;
  },

  getUserStats: async (userId: string | number) => {
    const response = await api.get(`/api/v1/users/${userId}/stats`);
    return response;
  },

  followUser: async (userId: string | number) => {
    const response = await api.post(`/api/v1/users/${userId}/follow`);
    return response;
  },

  unfollowUser: async (userId: string | number) => {
    const response = await api.delete(`/api/v1/users/${userId}/follow`);
    return response;
  },

  getUserFollowers: async (userId: string | number) => {
    const response = await api.get(`/api/v1/users/${userId}/followers`);
    return response;
  },

  getUserFollowing: async (userId: string | number) => {
    const response = await api.get(`/api/v1/users/${userId}/following`);
    return response;
  },

  getUserNotes: async (userId: string | number) => {
    const response = await api.get(`/api/v1/users/${userId}/notes`);
    return response;
  },

  getUserArticles: async (userId: string | number) => {
    const response = await api.get(`/api/v1/users/${userId}/articles`);
    return response;
  },

  getUserExams: async (userId: string | number) => {
    const response = await api.get(`/api/v1/users/${userId}/exams`);
    return response;
  }
};
