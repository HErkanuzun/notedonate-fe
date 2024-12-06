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
  filters?: {
    university?: string;
    department?: string;
    year?: number;
    semester?: string;
  };
}

export const getAllExams = async ({ page = 1, perPage = 12, filters }: GetExamsParams = {}): Promise<ExamsResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    if (filters) {
      if (filters.university) params.append('university', filters.university);
      if (filters.department) params.append('department', filters.department);
      if (filters.year) params.append('year', filters.year.toString());
      if (filters.semester) params.append('semester', filters.semester);
    }

    const response = await api.get(`/public/exams?${params.toString()}`);
    return {
      status: 'success',
      data: Array.isArray(response.data.data) ? response.data.data : []
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