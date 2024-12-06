import api from './api';
import { Exam } from '../../types';
import { isAxiosError } from 'axios';

interface ExamsResponse {
  status: string;
  data: Exam[];
}

interface GetExamsParams {
  page?: number;
  perPage?: number;
}

export const getAllExams = async ({ page = 1, perPage = 12 }: GetExamsParams = {}): Promise<ExamsResponse> => {
  try {
    const response = await api.get(`/public/exams?page=${page}&per_page=${perPage}`);
    return {
      status: 'success',
      data: response.data.data
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error('Error fetching exams:', error.response);
      throw new Error(`Error: ${error.response.data.message}`);
    } else {
      console.error("An unknown error occurred");
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const getExam = async (id: number) => {
  const response = await api.get(`/public/exams/${id}`);
  return response.data;
};

export const createExam = async (examData: FormData) => {
  const response = await api.post('/exams', examData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateExam = async (id: number, examData: FormData) => {
  const response = await api.put(`/exams/${id}`, examData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteExam = async (id: number) => {
  const response = await api.delete(`/exams/${id}`);
  return response.data;
};