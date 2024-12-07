import { api } from './api';
import { Article } from '../../types';
import { isAxiosError } from 'axios';

interface ArticlesResponse {
  status: string;
  data: {
    data: Article[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

interface GetArticlesParams {
  page?: number;
  perPage?: number;
  filters?: {
    category?: string;
    search?: string;
  };
}

export const getAllArticles = async ({ page = 1, perPage = 12, filters }: GetArticlesParams = {}): Promise<ArticlesResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
    }

    const response = await api.get(`/api/v1/public/articles?${params.toString()}`);
    return {
      status: 'success',
      data: response.data
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error('Error fetching articles:', error.response);
      throw new Error(`Error: ${error.response.data.message}`);
    } else {
      console.error("An unknown error occurred");
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const getArticle = async (id: number): Promise<{ status: string; data: Article }> => {
  try {
    const response = await api.get(`/api/v1/public/articles/${id}`);
    return {
      status: 'success',
      data: response.data.data
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error('Error fetching article:', error.response);
      throw new Error(`Error: ${error.response.data.message}`);
    } else {
      console.error("An unknown error occurred");
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const createArticle = async (articleData: FormData) => {
  const response = await api.post('/articles', articleData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateArticle = async (id: number, articleData: FormData) => {
  const response = await api.put(`/articles/${id}`, articleData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteArticle = async (id: number) => {
  await api.delete(`/articles/${id}`);
};

export const filterArticles = async (filters: Record<string, any>) => {
  const queryString = new URLSearchParams(filters).toString();
  const response = await api.get(`/public/articles?${queryString}`);
  return response.data;
};
