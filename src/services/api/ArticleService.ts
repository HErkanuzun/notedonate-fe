import api from './api';
import { Article } from '../../types';
import { isAxiosError } from 'axios';

interface ArticlesResponse {
  status: string;
  data: Article[];
}

interface GetArticlesParams {
  page?: number;
  perPage?: number;
}

export const getAllArticles = async ({ page = 1, perPage = 12 }: GetArticlesParams = {}): Promise<ArticlesResponse> => {
  try {
    const response = await api.get(`/public/articles?page=${page}&per_page=${perPage}`);
    return {
      status: 'success',
      data: response.data.data
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

export const getArticle = async (id: number) => {
  const response = await api.get(`/public/articles/${id}`);
  return response.data;
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
