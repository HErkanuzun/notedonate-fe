import api from './api';
import { Note } from '../../types';
import { isAxiosError } from 'axios';

interface NotesResponse {
  status: string;
  data: {
    data: Note[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

interface GetNotesParams {
  page?: number;
  perPage?: number;
  filters?: {
    university?: string;
    department?: string;
    search?: string;
  };
}

export const getAllNotes = async ({ page = 1, perPage = 12, filters }: GetNotesParams = {}): Promise<NotesResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    if (filters) {
      if (filters.university) params.append('university', filters.university);
      if (filters.department) params.append('department', filters.department);
      if (filters.search) params.append('search', filters.search);
    }

    const response = await api.get(`/api/v1/public/notes?${params.toString()}`);
    return {
      status: 'success',
      data: response.data
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error('Error fetching notes:', error.response);
      throw new Error(`Error: ${error.response.data.message}`);
    } else {
      console.error("An unknown error occurred");
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const getNote = async (id: number): Promise<{ status: string; data: Note }> => {
  try {
    const response = await api.get(`/api/v1/public/notes/${id}`);
    return {
      status: 'success',
      data: response.data.data
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error('Error fetching note:', error.response);
      throw new Error(`Error: ${error.response.data.message}`);
    } else {
      console.error("An unknown error occurred");
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const createNote = async (noteData: FormData) => {
  try {
    const response = await api.post('/notes', noteData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error('Error creating note:', error.response);
      throw new Error(`Error: ${error.response.data.message}`);
    } else {
      console.error("An unknown error occurred");
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const updateNote = async (id: number, noteData: FormData) => {
  try {
    const response = await api.put(`/notes/${id}`, noteData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error('Error updating note:', error.response);
      throw new Error(`Error: ${error.response.data.message}`);
    } else {
      console.error("An unknown error occurred");
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const deleteNote = async (id: number) => {
  try {
    await api.delete(`/notes/${id}`);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error('Error deleting note:', error.response);
      throw new Error(`Error: ${error.response.data.message}`);
    } else {
      console.error("An unknown error occurred");
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const filterNotes = async (filters: Record<string, any>) => {
  try {
    const response = await api.get('/notes/filter', { params: filters });
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error('Error filtering notes:', error.response);
      throw new Error(`Error: ${error.response.data.message}`);
    } else {
      console.error("An unknown error occurred");
      throw new Error('An unexpected error occurred.');
    }
  }
};