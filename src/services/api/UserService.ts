import api from './api';

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    avatar_url: string | null;
    bio: string | null;
    phone: string | null;
    phone_verified: boolean;
    followers_count: number;
    following_count: number;
    total_views: number;
    total_likes: number;
    total_downloads: number;
}

export class UserService {
    static async getUserProfile(): Promise<UserProfile> {
        const response = await api.get('/user/profile');
        return response.data;
    }

    static async updateProfile(data: FormData): Promise<{ message: string; user: UserProfile }> {
        const response = await api.post('/user/profile', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    static async verifyPhone(code: string): Promise<{ message: string }> {
        const response = await api.post('/user/verify-phone', { code });
        return response.data;
    }

    static async resendPhoneVerification(): Promise<{ message: string }> {
        const response = await api.post('/user/resend-phone-verification');
        return response.data;
    }

    static async getUserStats(userId: string | number): Promise<any> {
        const response = await api.get(`/api/v1/users/${userId}/stats`);
        return response;
    }

    static async followUser(userId: string | number): Promise<any> {
        const response = await api.post(`/api/v1/users/${userId}/follow`);
        return response;
    }

    static async unfollowUser(userId: string | number): Promise<any> {
        const response = await api.delete(`/api/v1/users/${userId}/follow`);
        return response;
    }

    static async getUserFollowers(userId: string | number): Promise<any> {
        const response = await api.get(`/api/v1/users/${userId}/followers`);
        return response;
    }

    static async getUserFollowing(userId: string | number): Promise<any> {
        const response = await api.get(`/api/v1/users/${userId}/following`);
        return response;
    }

    static async getUserNotes(userId: string | number): Promise<any> {
        const response = await api.get(`/api/v1/users/${userId}/notes`);
        return response;
    }

    static async getUserArticles(userId: string | number): Promise<any> {
        const response = await api.get(`/api/v1/users/${userId}/articles`);
        return response;
    }

    static async getUserExams(userId: string | number): Promise<any> {
        const response = await api.get(`/api/v1/users/${userId}/exams`);
        return response;
    }
}
